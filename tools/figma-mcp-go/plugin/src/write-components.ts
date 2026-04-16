export const handleWriteComponentRequest = async (request: any) => {
  switch (request.type) {
    case "swap_component": {
      const p = request.params || {};
      const nodeId = request.nodeIds && request.nodeIds[0];
      if (!nodeId) throw new Error("nodeId is required");
      if (!p.componentId) throw new Error("componentId is required");
      const node = await figma.getNodeByIdAsync(nodeId);
      if (!node) throw new Error(`Node not found: ${nodeId}`);
      if (node.type !== "INSTANCE") throw new Error(`Node ${nodeId} is not a component INSTANCE`);
      const component = await figma.getNodeByIdAsync(p.componentId);
      if (!component) throw new Error(`Component not found: ${p.componentId}`);
      if (component.type !== "COMPONENT") throw new Error(`Node ${p.componentId} is not a COMPONENT`);
      node.mainComponent = component;
      figma.commitUndo();
      return {
        type: request.type,
        requestId: request.requestId,
        data: { id: node.id, name: node.name, componentId: component.id, componentName: component.name },
      };
    }

    case "create_component_instance": {
      const p = request.params || {};
      if (!p.componentId) throw new Error("componentId is required");
      if (!p.parentId) throw new Error("parentId is required");
      const main = await figma.getNodeByIdAsync(p.componentId as string);
      if (!main) throw new Error(`Component not found: ${p.componentId}`);
      if (main.type !== "COMPONENT") throw new Error(`Node ${p.componentId} is not a COMPONENT`);
      const parent = await figma.getNodeByIdAsync(p.parentId as string);
      if (!parent) throw new Error(`Parent not found: ${p.parentId}`);
      if (!("insertChild" in parent) || !("children" in parent)) {
        throw new Error(`Node ${p.parentId} cannot contain child nodes`);
      }
      const parentNode = parent as ChildrenMixin & BaseNode & SceneNode;
      const instance = (main as ComponentNode).createInstance();

      const replaceId = p.replaceNodeId as string | undefined;
      if (replaceId) {
        const old = await figma.getNodeByIdAsync(replaceId);
        if (!old) throw new Error(`replaceNodeId not found: ${replaceId}`);
        if (!("parent" in old) || old.parent !== parentNode) {
          throw new Error(`replaceNodeId must be a direct child of parentId (got parent ${(old as any).parent?.id})`);
        }
        const sceneOld = old as SceneNode;
        const idx = parentNode.children.indexOf(sceneOld);
        if (idx < 0) throw new Error("replaceNodeId is not in parent's children list");
        parentNode.insertChild(idx, instance);

        const copySize = p.copySize !== false;
        if ("resize" in instance && "width" in sceneOld && "height" in sceneOld && copySize) {
          (instance as LayoutMixin).resize((sceneOld as LayoutMixin).width, (sceneOld as LayoutMixin).height);
        }
        sceneOld.remove();
      } else {
        parentNode.appendChild(instance);
        if (typeof p.x === "number") instance.x = p.x;
        if (typeof p.y === "number") instance.y = p.y;
      }

      figma.commitUndo();
      return {
        type: request.type,
        requestId: request.requestId,
        data: {
          id: instance.id,
          name: instance.name,
          type: instance.type,
          mainComponentId: main.id,
          mainComponentName: main.name,
        },
      };
    }

    case "detach_instance": {
      const nodeIds = request.nodeIds || [];
      if (nodeIds.length === 0) throw new Error("nodeIds is required");
      const results: any[] = [];
      for (const nid of nodeIds) {
        const n = await figma.getNodeByIdAsync(nid);
        if (!n) { results.push({ nodeId: nid, error: "Node not found" }); continue; }
        if (n.type !== "INSTANCE") { results.push({ nodeId: nid, error: "Node is not an INSTANCE" }); continue; }
        const frame = n.detachInstance();
        results.push({ nodeId: nid, newId: frame.id, name: frame.name });
      }
      figma.commitUndo();
      return {
        type: request.type,
        requestId: request.requestId,
        data: { results },
      };
    }

    case "delete_nodes": {
      const nodeIds = request.nodeIds || [];
      if (nodeIds.length === 0) throw new Error("nodeIds is required");
      const results: any[] = [];
      for (const nid of nodeIds) {
        const n = await figma.getNodeByIdAsync(nid);
        if (!n) { results.push({ nodeId: nid, error: "Node not found" }); continue; }
        n.remove();
        results.push({ nodeId: nid, deleted: true });
      }
      figma.commitUndo();
      return { type: request.type, requestId: request.requestId, data: { results } };
    }

    case "navigate_to_page": {
      const p = request.params || {};
      let page: PageNode | undefined;
      if (p.pageId) {
        const found = await figma.getNodeByIdAsync(p.pageId);
        if (!found) throw new Error(`Page not found: ${p.pageId}`);
        if (found.type !== "PAGE") throw new Error(`Node ${p.pageId} is not a PAGE`);
        page = found as PageNode;
      } else if (p.pageName) {
        page = figma.root.children.find(pg => pg.name === p.pageName) as PageNode | undefined;
        if (!page) throw new Error(`Page not found with name: ${p.pageName}`);
      } else {
        throw new Error("pageId or pageName is required");
      }
      await figma.setCurrentPageAsync(page);
      return {
        type: request.type,
        requestId: request.requestId,
        data: { id: page.id, name: page.name },
      };
    }

    case "group_nodes": {
      const p = request.params || {};
      const nodeIds = request.nodeIds || [];
      if (nodeIds.length === 0) throw new Error("nodeIds is required");
      const nodes = await Promise.all(nodeIds.map((id: string) => figma.getNodeByIdAsync(id)));
      const validNodes = nodes.filter((n): n is SceneNode => n !== null && n.type !== "DOCUMENT" && n.type !== "PAGE");
      if (validNodes.length === 0) throw new Error("No valid scene nodes found");
      const parent = validNodes[0].parent;
      if (!parent) throw new Error("Nodes must have a parent");
      const group = figma.group(validNodes, parent as any);
      if (p.name) group.name = p.name;
      figma.commitUndo();
      return {
        type: request.type,
        requestId: request.requestId,
        data: { id: group.id, name: group.name, type: group.type },
      };
    }

    case "ungroup_nodes": {
      const nodeIds = request.nodeIds || [];
      if (nodeIds.length === 0) throw new Error("nodeIds is required");
      const results: any[] = [];
      for (const nid of nodeIds) {
        const n = await figma.getNodeByIdAsync(nid);
        if (!n) { results.push({ nodeId: nid, error: "Node not found" }); continue; }
        if (n.type !== "GROUP") { results.push({ nodeId: nid, error: "Node is not a GROUP" }); continue; }
        const group = n as GroupNode;
        const parent = group.parent as any;
        const index = parent.children.indexOf(group);
        const childIds: string[] = [];
        for (const child of [...group.children]) {
          parent.insertChild(index, child as SceneNode);
          childIds.push(child.id);
        }
        group.remove();
        results.push({ nodeId: nid, childIds });
      }
      figma.commitUndo();
      return { type: request.type, requestId: request.requestId, data: { results } };
    }

    default:
      return null;
  }
};
