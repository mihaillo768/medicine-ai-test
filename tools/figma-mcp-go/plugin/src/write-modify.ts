import { getBounds } from "./serializers";
import { makeSolidPaint, getParentNode, applyAutoLayout } from "./write-helpers";

/** Load every font used in the text so Figma can measure lines (see TextNode.hasMissingFont / resize docs). */
const loadAllFontsForText = async (t: TextNode) => {
  const len = t.characters.length;
  if (len === 0) {
    const fontName = typeof t.fontName === "symbol"
      ? { family: "Inter", style: "Regular" }
      : (t.fontName as FontName);
    await figma.loadFontAsync(fontName);
    return;
  }
  const fonts = t.getRangeAllFontNames(0, len);
  const seen = new Set<string>();
  for (const f of fonts) {
    const key = `${f.family}\0${f.style}`;
    if (seen.has(key)) continue;
    seen.add(key);
    await figma.loadFontAsync(f);
  }
};

/**
 * Single fontSize or max sampled size when mixed — needed for wrap heuristics
 * (otherwise `mixed` falls back to 16px and long titles never trigger fallback).
 */
const getPrimaryFontSizeForMetrics = (t: TextNode): number => {
  if (typeof t.fontSize === "number") return t.fontSize;
  const len = t.characters.length;
  if (len === 0) return 16;
  let maxNum = 16;
  const visit = (i: number) => {
    const end = Math.min(i + 1, len);
    if (i >= end) return;
    const s = t.getRangeFontSize(i, end);
    if (typeof s === "number" && s > maxNum) maxNum = s;
  };
  visit(0);
  visit(len - 1);
  const step = Math.max(1, Math.floor(len / 24));
  for (let i = 0; i < len; i += step) visit(i);
  return maxNum;
};

const getTextLineHeightPx = (t: TextNode): number => {
  const fontSize = getPrimaryFontSizeForMetrics(t);
  const lh = t.lineHeight;
  if (typeof lh === "object" && lh !== null && "unit" in lh) {
    if (lh.unit === "PIXELS") return lh.value;
    if (lh.unit === "PERCENT") return fontSize * (lh.value / 100);
  }
  return Math.round(fontSize * 1.5);
};

/** When HEIGHT reflow fails (metrics/font quirks), fixed NONE + height from rough line count. */
const estimateWrappedHeightPx = (t: TextNode, widthPx: number): number => {
  const len = t.characters.length;
  const fontSize = getPrimaryFontSizeForMetrics(t);
  const linePx = getTextLineHeightPx(t);
  // ~0.55–0.62 em average for Inter-like UI Cyrillic/Latin mix at body sizes
  const charsPerLine = Math.max(6, Math.floor(widthPx / (fontSize * 0.58)));
  const lines = Math.max(1, Math.ceil(len / charsPerLine));
  return Math.ceil(lines * linePx * 1.06);
};

export const handleWriteModifyRequest = async (request: any) => {
  switch (request.type) {
    case "set_text": {
      const p = request.params || {};
      const nodeId = request.nodeIds && request.nodeIds[0];
      if (!nodeId) throw new Error("nodeId is required");
      const node = await figma.getNodeByIdAsync(nodeId);
      if (!node) throw new Error(`Node not found: ${nodeId}`);
      if (node.type !== "TEXT") throw new Error(`Node ${nodeId} is not a TEXT node`);
      const fontName = typeof node.fontName === "symbol"
        ? { family: "Inter", style: "Regular" }
        : node.fontName;
      await figma.loadFontAsync(fontName);
      node.characters = p.text;
      figma.commitUndo();
      return {
        type: request.type,
        requestId: request.requestId,
        data: { id: node.id, name: node.name, characters: node.characters },
      };
    }

    case "set_fills": {
      const p = request.params || {};
      const nodeId = request.nodeIds && request.nodeIds[0];
      if (!nodeId) throw new Error("nodeId is required");
      const node = await figma.getNodeByIdAsync(nodeId);
      if (!node) throw new Error(`Node not found: ${nodeId}`);
      if (!("fills" in node)) throw new Error(`Node ${nodeId} does not support fills`);
      const newFill = makeSolidPaint(p.color, p.opacity != null ? p.opacity : undefined);
      (node as any).fills = p.mode === "append"
        ? [...((node as any).fills as Paint[]), newFill]
        : [newFill];
      figma.commitUndo();
      return {
        type: request.type,
        requestId: request.requestId,
        data: { id: node.id, name: node.name },
      };
    }

    case "set_strokes": {
      const p = request.params || {};
      const nodeId = request.nodeIds && request.nodeIds[0];
      if (!nodeId) throw new Error("nodeId is required");
      const node = await figma.getNodeByIdAsync(nodeId);
      if (!node) throw new Error(`Node not found: ${nodeId}`);
      if (!("strokes" in node)) throw new Error(`Node ${nodeId} does not support strokes`);
      const newStroke = makeSolidPaint(p.color);
      (node as any).strokes = p.mode === "append"
        ? [...((node as any).strokes as Paint[]), newStroke]
        : [newStroke];
      if (p.strokeWeight != null) (node as any).strokeWeight = p.strokeWeight;
      figma.commitUndo();
      return {
        type: request.type,
        requestId: request.requestId,
        data: { id: node.id, name: node.name },
      };
    }

    case "move_nodes": {
      const p = request.params || {};
      const nodeIds = request.nodeIds || [];
      if (nodeIds.length === 0) throw new Error("nodeIds is required");
      const results: any[] = [];
      for (const nid of nodeIds) {
        const n = await figma.getNodeByIdAsync(nid) as any;
        if (!n) { results.push({ nodeId: nid, error: "Node not found" }); continue; }
        if (!("x" in n)) { results.push({ nodeId: nid, error: "Node does not support position" }); continue; }
        if (p.x != null) n.x = p.x;
        if (p.y != null) n.y = p.y;
        results.push({ nodeId: nid, x: n.x, y: n.y });
      }
      figma.commitUndo();
      return { type: request.type, requestId: request.requestId, data: { results } };
    }

    case "resize_nodes": {
      const p = request.params || {};
      const nodeIds = request.nodeIds || [];
      if (nodeIds.length === 0) throw new Error("nodeIds is required");
      const results: any[] = [];
      for (const nid of nodeIds) {
        const n = await figma.getNodeByIdAsync(nid) as any;
        if (!n) { results.push({ nodeId: nid, error: "Node not found" }); continue; }
        if (!("resize" in n)) { results.push({ nodeId: nid, error: "Node does not support resize" }); continue; }

        if (n.type === "TEXT") {
          const t = n as TextNode;

          if (p.textFixedBox === true) {
            if (p.width == null || p.height == null) {
              throw new Error("textFixedBox requires width and height for TEXT nodes");
            }
            await loadAllFontsForText(t);
            t.textTruncation = "DISABLED";
            t.maxLines = null;
            t.textAutoResize = "NONE";
            t.resize(Number(p.width), Number(p.height));
            results.push({
              nodeId: nid,
              width: t.width,
              height: t.height,
              textAutoResize: t.textAutoResize,
              textFixedBox: true,
            });
            continue;
          }

          if (p.textWrap === true) {
            if (p.width == null) throw new Error("textWrap requires width for TEXT nodes");
            await loadAllFontsForText(t);
            // Ensure multi-line layout: ENDING + maxLines can pin to one line; NONE + fixed box clips.
            t.textTruncation = "DISABLED";
            t.maxLines = null;
            t.textAutoResize = "HEIGHT";
            const w = Number(p.width);
            const heightBeforeProvisional = t.height;
            // Large provisional height so Figma reflows wrapped lines; final height shrinks to content.
            t.resize(w, Math.max(t.height, 4096));
            // Nudge layout after resize (helps when style-linked or cached metrics were stale).
            const body = t.characters;
            t.characters = body;

            const fontSize = getPrimaryFontSizeForMetrics(t);
            const linePx = getTextLineHeightPx(t);
            const roughCharsOneLine = Math.floor(w / (fontSize * 0.65));
            const heightAfterNudge = t.height;
            // Reflow failed: still ~one line tall before and after nudge → use estimated wrapped height.
            const suspiciousOneLine =
              t.characters.length > roughCharsOneLine
              && heightBeforeProvisional <= linePx * 1.4
              && heightAfterNudge <= linePx * 1.4;
            let usedFallback = false;
            if (suspiciousOneLine) {
              const est = estimateWrappedHeightPx(t, w);
              t.textTruncation = "DISABLED";
              t.maxLines = null;
              t.textAutoResize = "NONE";
              t.resize(w, est);
              usedFallback = true;
            }

            results.push({
              nodeId: nid,
              width: t.width,
              height: t.height,
              textAutoResize: t.textAutoResize,
              hasMissingFont: t.hasMissingFont,
              textWrapFallbackNone: usedFallback,
            });
            continue;
          }

          const fontName = typeof t.fontName === "symbol"
            ? { family: "Inter", style: "Regular" }
            : (t.fontName as FontName);
          await figma.loadFontAsync(fontName);

          if (p.textSizingReset === true) {
            t.textAutoResize = "WIDTH_AND_HEIGHT";
          }
        }

        const w = p.width != null ? p.width : n.width;
        const h = p.height != null ? p.height : n.height;
        n.resize(w, h);
        results.push({ nodeId: nid, width: n.width, height: n.height });
      }
      figma.commitUndo();
      return { type: request.type, requestId: request.requestId, data: { results } };
    }

    case "rename_node": {
      const p = request.params || {};
      const nodeId = request.nodeIds && request.nodeIds[0];
      if (!nodeId) throw new Error("nodeId is required");
      const node = await figma.getNodeByIdAsync(nodeId);
      if (!node) throw new Error(`Node not found: ${nodeId}`);
      node.name = p.name;
      return {
        type: request.type,
        requestId: request.requestId,
        data: { id: node.id, name: node.name },
      };
    }

    case "clone_node": {
      const p = request.params || {};
      const nodeId = request.nodeIds && request.nodeIds[0];
      if (!nodeId) throw new Error("nodeId is required");
      const node = await figma.getNodeByIdAsync(nodeId) as any;
      if (!node) throw new Error(`Node not found: ${nodeId}`);
      const clone = node.clone();
      if (p.x != null) clone.x = p.x;
      if (p.y != null) clone.y = p.y;
      if (p.parentId) {
        const parent = await getParentNode(p.parentId);
        (parent as any).appendChild(clone);
      }
      figma.commitUndo();
      return {
        type: request.type,
        requestId: request.requestId,
        data: { id: clone.id, name: clone.name, type: clone.type, bounds: getBounds(clone) },
      };
    }

    case "set_opacity": {
      const p = request.params || {};
      const nodeIds = request.nodeIds || [];
      if (nodeIds.length === 0) throw new Error("nodeIds is required");
      const results: any[] = [];
      for (const nid of nodeIds) {
        const n = await figma.getNodeByIdAsync(nid) as any;
        if (!n) { results.push({ nodeId: nid, error: "Node not found" }); continue; }
        if (!("opacity" in n)) { results.push({ nodeId: nid, error: "Node does not support opacity" }); continue; }
        n.opacity = p.opacity;
        results.push({ nodeId: nid, opacity: n.opacity });
      }
      figma.commitUndo();
      return { type: request.type, requestId: request.requestId, data: { results } };
    }

    case "set_corner_radius": {
      const p = request.params || {};
      const nodeIds = request.nodeIds || [];
      if (nodeIds.length === 0) throw new Error("nodeIds is required");
      const results: any[] = [];
      for (const nid of nodeIds) {
        const n = await figma.getNodeByIdAsync(nid) as any;
        if (!n) { results.push({ nodeId: nid, error: "Node not found" }); continue; }
        if (!("cornerRadius" in n)) { results.push({ nodeId: nid, error: "Node does not support corner radius" }); continue; }
        if (p.cornerRadius != null) n.cornerRadius = p.cornerRadius;
        if (p.topLeftRadius != null) n.topLeftRadius = p.topLeftRadius;
        if (p.topRightRadius != null) n.topRightRadius = p.topRightRadius;
        if (p.bottomLeftRadius != null) n.bottomLeftRadius = p.bottomLeftRadius;
        if (p.bottomRightRadius != null) n.bottomRightRadius = p.bottomRightRadius;
        results.push({ nodeId: nid, cornerRadius: n.cornerRadius });
      }
      figma.commitUndo();
      return { type: request.type, requestId: request.requestId, data: { results } };
    }

    case "set_auto_layout": {
      const p = request.params || {};
      const nodeId = request.nodeIds && request.nodeIds[0];
      if (!nodeId) throw new Error("nodeId is required");
      const node = await figma.getNodeByIdAsync(nodeId);
      if (!node) throw new Error(`Node not found: ${nodeId}`);
      if (node.type !== "FRAME" && node.type !== "COMPONENT" && node.type !== "INSTANCE") {
        throw new Error(`Node ${nodeId} is not a FRAME, COMPONENT, or INSTANCE`);
      }
      applyAutoLayout(node as FrameNode, p);
      figma.commitUndo();
      return {
        type: request.type,
        requestId: request.requestId,
        data: { id: node.id, name: node.name },
      };
    }

    case "set_visible": {
      const p = request.params || {};
      const nodeIds = request.nodeIds || [];
      if (nodeIds.length === 0) throw new Error("nodeIds is required");
      const results: any[] = [];
      for (const nid of nodeIds) {
        const n = await figma.getNodeByIdAsync(nid) as any;
        if (!n) { results.push({ nodeId: nid, error: "Node not found" }); continue; }
        if (!("visible" in n)) { results.push({ nodeId: nid, error: "Node does not support visibility" }); continue; }
        n.visible = p.visible;
        results.push({ nodeId: nid, visible: n.visible });
      }
      figma.commitUndo();
      return { type: request.type, requestId: request.requestId, data: { results } };
    }

    case "lock_nodes":
    case "unlock_nodes": {
      const nodeIds = request.nodeIds || [];
      if (nodeIds.length === 0) throw new Error("nodeIds is required");
      const locked = request.type === "lock_nodes";
      const results: any[] = [];
      for (const nid of nodeIds) {
        const n = await figma.getNodeByIdAsync(nid) as any;
        if (!n) { results.push({ nodeId: nid, error: "Node not found" }); continue; }
        if (!("locked" in n)) { results.push({ nodeId: nid, error: "Node does not support locking" }); continue; }
        n.locked = locked;
        results.push({ nodeId: nid, locked: n.locked });
      }
      figma.commitUndo();
      return { type: request.type, requestId: request.requestId, data: { results } };
    }

    case "rotate_nodes": {
      const p = request.params || {};
      const nodeIds = request.nodeIds || [];
      if (nodeIds.length === 0) throw new Error("nodeIds is required");
      const results: any[] = [];
      for (const nid of nodeIds) {
        const n = await figma.getNodeByIdAsync(nid) as any;
        if (!n) { results.push({ nodeId: nid, error: "Node not found" }); continue; }
        if (!("rotation" in n)) { results.push({ nodeId: nid, error: "Node does not support rotation" }); continue; }
        n.rotation = p.rotation;
        results.push({ nodeId: nid, rotation: n.rotation });
      }
      figma.commitUndo();
      return { type: request.type, requestId: request.requestId, data: { results } };
    }

    case "reorder_nodes": {
      const p = request.params || {};
      const nodeIds = request.nodeIds || [];
      if (nodeIds.length === 0) throw new Error("nodeIds is required");
      const validOrders = ["bringToFront", "sendToBack", "bringForward", "sendBackward"];
      if (!validOrders.includes(p.order)) {
        throw new Error(`order must be bringToFront, sendToBack, bringForward, or sendBackward`);
      }
      const results: any[] = [];
      for (const nid of nodeIds) {
        const n = await figma.getNodeByIdAsync(nid) as any;
        if (!n) { results.push({ nodeId: nid, error: "Node not found" }); continue; }
        const parent = n.parent as any;
        if (!parent || !("children" in parent)) { results.push({ nodeId: nid, error: "Node has no reorderable parent" }); continue; }
        const siblings = parent.children as any[];
        const currentIndex = siblings.indexOf(n);
        let newIndex: number;
        switch (p.order) {
          case "bringToFront":   newIndex = siblings.length - 1; break;
          case "sendToBack":     newIndex = 0; break;
          case "bringForward":   newIndex = Math.min(currentIndex + 1, siblings.length - 1); break;
          case "sendBackward":   newIndex = Math.max(currentIndex - 1, 0); break;
          default:               newIndex = currentIndex;
        }
        parent.insertChild(newIndex, n);
        results.push({ nodeId: nid, index: newIndex });
      }
      figma.commitUndo();
      return { type: request.type, requestId: request.requestId, data: { results } };
    }

    case "set_blend_mode": {
      const p = request.params || {};
      const nodeIds = request.nodeIds || [];
      if (nodeIds.length === 0) throw new Error("nodeIds is required");
      const results: any[] = [];
      for (const nid of nodeIds) {
        const n = await figma.getNodeByIdAsync(nid) as any;
        if (!n) { results.push({ nodeId: nid, error: "Node not found" }); continue; }
        if (!("blendMode" in n)) { results.push({ nodeId: nid, error: "Node does not support blend mode" }); continue; }
        n.blendMode = p.blendMode;
        results.push({ nodeId: nid, blendMode: n.blendMode });
      }
      figma.commitUndo();
      return { type: request.type, requestId: request.requestId, data: { results } };
    }

    case "set_constraints": {
      const p = request.params || {};
      const nodeIds = request.nodeIds || [];
      if (nodeIds.length === 0) throw new Error("nodeIds is required");
      const results: any[] = [];
      for (const nid of nodeIds) {
        const n = await figma.getNodeByIdAsync(nid) as any;
        if (!n) { results.push({ nodeId: nid, error: "Node not found" }); continue; }
        if (!("constraints" in n)) { results.push({ nodeId: nid, error: "Node does not support constraints" }); continue; }
        const updated: any = { ...n.constraints };
        if (p.horizontal) updated.horizontal = p.horizontal;
        if (p.vertical)   updated.vertical   = p.vertical;
        n.constraints = updated;
        results.push({ nodeId: nid, constraints: n.constraints });
      }
      figma.commitUndo();
      return { type: request.type, requestId: request.requestId, data: { results } };
    }

    case "reparent_nodes": {
      const p = request.params || {};
      const nodeIds = request.nodeIds || [];
      if (nodeIds.length === 0) throw new Error("nodeIds is required");
      if (!p.parentId) throw new Error("parentId is required");
      const newParent = await figma.getNodeByIdAsync(p.parentId) as any;
      if (!newParent) throw new Error(`Parent not found: ${p.parentId}`);
      if (!("appendChild" in newParent)) throw new Error(`Node ${p.parentId} cannot contain children`);
      const results: any[] = [];
      for (const nid of nodeIds) {
        const n = await figma.getNodeByIdAsync(nid) as any;
        if (!n) { results.push({ nodeId: nid, error: "Node not found" }); continue; }
        try {
          newParent.appendChild(n);
          results.push({ nodeId: nid, newParentId: p.parentId });
        } catch (e: any) {
          results.push({ nodeId: nid, error: e.message });
        }
      }
      figma.commitUndo();
      return { type: request.type, requestId: request.requestId, data: { results } };
    }

    case "batch_rename_nodes": {
      const p = request.params || {};
      const nodeIds = request.nodeIds || [];
      if (nodeIds.length === 0) throw new Error("nodeIds is required");
      const results: any[] = [];
      for (const nid of nodeIds) {
        const n = await figma.getNodeByIdAsync(nid) as any;
        if (!n) { results.push({ nodeId: nid, error: "Node not found" }); continue; }
        const oldName: string = n.name;
        let newName = oldName;
        if (p.find !== undefined && p.replace !== undefined) {
          if (p.useRegex) {
            try {
              const regex = new RegExp(p.find, p.regexFlags || "g");
              newName = newName.replace(regex, p.replace);
            } catch (e: any) {
              results.push({ nodeId: nid, error: `Invalid regex: ${e.message}` }); continue;
            }
          } else {
            newName = newName.split(p.find).join(p.replace);
          }
        }
        if (p.prefix) newName = p.prefix + newName;
        if (p.suffix) newName = newName + p.suffix;
        n.name = newName;
        results.push({ nodeId: nid, oldName, name: newName });
      }
      figma.commitUndo();
      return { type: request.type, requestId: request.requestId, data: { results } };
    }

    case "find_replace_text": {
      const p = request.params || {};
      if (!p.find) throw new Error("find is required");
      if (p.replace === undefined) throw new Error("replace is required");
      const rootNodeId = request.nodeIds && request.nodeIds[0];
      const root: any = rootNodeId
        ? await figma.getNodeByIdAsync(rootNodeId)
        : figma.currentPage;
      if (!root) throw new Error(`Root node not found: ${rootNodeId}`);
      const textNodes: any[] = [];
      const collect = (node: any) => {
        if (node.type === "TEXT") textNodes.push(node);
        if ("children" in node) (node.children as any[]).forEach(collect);
      };
      collect(root);
      const results: any[] = [];
      for (const tn of textNodes) {
        const originalText: string = tn.characters;
        let newText: string;
        if (p.useRegex) {
          try {
            const regex = new RegExp(p.find, p.regexFlags || "g");
            newText = originalText.replace(regex, p.replace);
          } catch (e: any) {
            results.push({ nodeId: tn.id, nodeName: tn.name, error: `Invalid regex: ${e.message}` });
            continue;
          }
        } else {
          newText = originalText.split(p.find).join(p.replace);
        }
        if (newText !== originalText) {
          const fontName = typeof tn.fontName === "symbol"
            ? { family: "Inter", style: "Regular" }
            : tn.fontName;
          await figma.loadFontAsync(fontName);
          tn.characters = newText;
          results.push({ nodeId: tn.id, nodeName: tn.name, oldText: originalText, newText });
        }
      }
      figma.commitUndo();
      const successCount = results.filter((r: any) => !r.error).length;
      return { type: request.type, requestId: request.requestId, data: { replaced: successCount, results } };
    }

    default:
      return null;
  }
};
