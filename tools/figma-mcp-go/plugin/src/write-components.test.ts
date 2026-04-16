import { describe, it, expect, beforeEach } from "bun:test";
import { handleWriteComponentRequest } from "./write-components";

// ── Figma global mock ─────────────────────────────────────────────────────────

let mockNodes: Record<string, any>;
let commitUndoCalled: boolean;
let navigatedTo: any;

const makeRequest = (type: string, nodeIds?: string[], params?: any) => ({
  type,
  requestId: "req-test-1",
  nodeIds: nodeIds ?? [],
  params: params ?? {},
});

beforeEach(() => {
  commitUndoCalled = false;
  navigatedTo = null;
  mockNodes = {};
  (globalThis as any).figma = {
    get currentPage() { return { id: "0:1", name: "Page 1" }; },
    setCurrentPageAsync: async (page: any) => { navigatedTo = page; },
    getNodeByIdAsync: async (id: string) => mockNodes[id] ?? null,
    group: (nodes: any[], parent: any) => {
      const group = { id: "grp:1", name: "Group 1", type: "GROUP", children: [...nodes] };
      (parent as any).children = (parent as any).children ?? [];
      (parent as any).children.push(group);
      return group;
    },
    root: {
      children: [
        { id: "0:1", name: "Page 1", type: "PAGE" },
        { id: "0:2", name: "Page 2", type: "PAGE" },
      ],
    },
    commitUndo: () => { commitUndoCalled = true; },
  };
});

// ── navigate_to_page ──────────────────────────────────────────────────────────

describe("navigate_to_page", () => {
  it("navigates by pageId", async () => {
    mockNodes["0:2"] = { id: "0:2", name: "Page 2", type: "PAGE" };
    const res = await handleWriteComponentRequest(makeRequest("navigate_to_page", [], { pageId: "0:2" }));
    expect(navigatedTo?.id).toBe("0:2");
    expect(res?.data.id).toBe("0:2");
    expect(res?.data.name).toBe("Page 2");
  });

  it("navigates by pageName", async () => {
    const res = await handleWriteComponentRequest(makeRequest("navigate_to_page", [], { pageName: "Page 2" }));
    expect(navigatedTo?.name).toBe("Page 2");
    expect(res?.data.name).toBe("Page 2");
  });

  it("throws when pageId node not found", async () => {
    await expect(
      handleWriteComponentRequest(makeRequest("navigate_to_page", [], { pageId: "9:9" }))
    ).rejects.toThrow("Page not found: 9:9");
  });

  it("throws when pageId node is not a PAGE", async () => {
    mockNodes["1:1"] = { id: "1:1", name: "Frame", type: "FRAME" };
    await expect(
      handleWriteComponentRequest(makeRequest("navigate_to_page", [], { pageId: "1:1" }))
    ).rejects.toThrow("is not a PAGE");
  });

  it("throws when pageName not found", async () => {
    await expect(
      handleWriteComponentRequest(makeRequest("navigate_to_page", [], { pageName: "Nonexistent" }))
    ).rejects.toThrow("Page not found");
  });

  it("throws when neither pageId nor pageName provided", async () => {
    await expect(
      handleWriteComponentRequest(makeRequest("navigate_to_page", [], {}))
    ).rejects.toThrow("pageId or pageName is required");
  });
});

// ── group_nodes ───────────────────────────────────────────────────────────────

describe("group_nodes", () => {
  it("groups nodes and returns the GROUP", async () => {
    const parent = { id: "0:1", children: [] as any[], appendChild: () => {} };
    mockNodes["1:1"] = { id: "1:1", type: "RECTANGLE", parent };
    mockNodes["2:2"] = { id: "2:2", type: "RECTANGLE", parent };
    const res = await handleWriteComponentRequest(makeRequest("group_nodes", ["1:1", "2:2"]));
    expect(res?.data.type).toBe("GROUP");
    expect(commitUndoCalled).toBe(true);
  });

  it("applies custom name to the group", async () => {
    const parent = { id: "0:1", children: [] as any[], appendChild: () => {} };
    mockNodes["1:1"] = { id: "1:1", type: "FRAME", parent };
    mockNodes["2:2"] = { id: "2:2", type: "FRAME", parent };
    const res = await handleWriteComponentRequest(
      makeRequest("group_nodes", ["1:1", "2:2"], { name: "My Group" })
    );
    expect(res?.data.name).toBe("My Group");
  });

  it("throws for empty nodeIds", async () => {
    await expect(handleWriteComponentRequest(makeRequest("group_nodes", []))).rejects.toThrow("nodeIds is required");
  });

  it("throws when no valid nodes found", async () => {
    await expect(
      handleWriteComponentRequest(makeRequest("group_nodes", ["9:9", "8:8"]))
    ).rejects.toThrow("No valid scene nodes found");
  });
});

// ── ungroup_nodes ─────────────────────────────────────────────────────────────

describe("ungroup_nodes", () => {
  it("ungroups a GROUP node and returns child IDs", async () => {
    const child1 = { id: "3:1", type: "RECTANGLE" };
    const child2 = { id: "3:2", type: "RECTANGLE" };
    let removed = false;
    const parent = {
      id: "0:1",
      children: [] as any[],
      insertChild(_idx: number, child: any) { this.children.push(child); },
    };
    const group = {
      id: "grp:1", type: "GROUP",
      children: [child1, child2],
      parent,
      remove() { removed = true; },
    };
    parent.children = [group];
    mockNodes["grp:1"] = group;

    const res = await handleWriteComponentRequest(makeRequest("ungroup_nodes", ["grp:1"]));
    expect(res?.data.results[0].childIds).toEqual(["3:1", "3:2"]);
    expect(removed).toBe(true);
    expect(commitUndoCalled).toBe(true);
  });

  it("reports error for missing node", async () => {
    const res = await handleWriteComponentRequest(makeRequest("ungroup_nodes", ["9:9"]));
    expect(res?.data.results[0].error).toBe("Node not found");
  });

  it("reports error when node is not a GROUP", async () => {
    mockNodes["1:1"] = { id: "1:1", type: "FRAME" };
    const res = await handleWriteComponentRequest(makeRequest("ungroup_nodes", ["1:1"]));
    expect(res?.data.results[0].error).toBe("Node is not a GROUP");
  });

  it("throws for empty nodeIds", async () => {
    await expect(
      handleWriteComponentRequest(makeRequest("ungroup_nodes", []))
    ).rejects.toThrow("nodeIds is required");
  });

  it("returns null for unrecognised type", async () => {
    const res = await handleWriteComponentRequest(makeRequest("unknown_op"));
    expect(res).toBeNull();
  });
});

// ── create_component_instance ─────────────────────────────────────────────────

describe("create_component_instance", () => {
  it("inserts instance at placeholder index and removes placeholder", async () => {
    const placeholder = { id: "9:9", type: "FRAME", x: 10, y: 20, width: 160, height: 48, parent: null as any };
    const children: any[] = [placeholder];
    placeholder.remove = () => {
      const i = children.indexOf(placeholder);
      if (i >= 0) children.splice(i, 1);
    };
    placeholder.parent = {
      id: "8:8",
      type: "FRAME",
      children,
      insertChild(idx: number, child: any) {
        children.splice(idx, 0, child);
      },
      appendChild(child: any) {
        children.push(child);
      },
    };
    const main = {
      id: "7:7",
      type: "COMPONENT",
      name: "Button / Primary",
      createInstance() {
        return {
          id: "inst:1",
          type: "INSTANCE",
          name: "Button / Primary",
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          resize(w: number, h: number) {
            this.width = w;
            this.height = h;
          },
          remove: () => {},
        };
      },
    };
    mockNodes["7:7"] = main;
    mockNodes["8:8"] = placeholder.parent;
    mockNodes["9:9"] = placeholder;

    const res = await handleWriteComponentRequest(
      makeRequest("create_component_instance", [], {
        componentId: "7:7",
        parentId: "8:8",
        replaceNodeId: "9:9",
      })
    );
    expect(res?.data.id).toBe("inst:1");
    expect(res?.data.type).toBe("INSTANCE");
    expect(children.length).toBe(1);
    expect(children[0].id).toBe("inst:1");
    expect(children[0].width).toBe(160);
    expect(children[0].height).toBe(48);
    expect(commitUndoCalled).toBe(true);
  });

  it("appends instance when no replaceNodeId", async () => {
    const children: any[] = [];
    const parent = {
      id: "8:8",
      type: "FRAME",
      children,
      insertChild(idx: number, child: any) {
        children.splice(idx, 0, child);
      },
      appendChild(child: any) {
        children.push(child);
      },
    };
    const main = {
      id: "7:7",
      type: "COMPONENT",
      name: "Tag",
      createInstance() {
        return { id: "inst:2", type: "INSTANCE", name: "Tag", x: 0, y: 0, resize() {} };
      },
    };
    mockNodes["7:7"] = main;
    mockNodes["8:8"] = parent;

    const res = await handleWriteComponentRequest(
      makeRequest("create_component_instance", [], {
        componentId: "7:7",
        parentId: "8:8",
        x: 5,
        y: 12,
      })
    );
    expect(res?.data.id).toBe("inst:2");
    expect(children[0].x).toBe(5);
    expect(children[0].y).toBe(12);
  });

  it("throws when replace node is not child of parent", async () => {
    const parentA = { id: "8:8", type: "FRAME", children: [] as any[], insertChild() {}, appendChild() {} };
    const parentB = { id: "8:9", type: "FRAME", children: [] as any[], insertChild() {}, appendChild() {} };
    const orphan = { id: "9:9", type: "FRAME", parent: parentB };
    (parentB.children as any[]).push(orphan);
    mockNodes["7:7"] = {
      id: "7:7",
      type: "COMPONENT",
      createInstance() {
        return { id: "inst:3", type: "INSTANCE", x: 0, y: 0, resize() {} };
      },
    };
    mockNodes["8:8"] = parentA;
    mockNodes["8:9"] = parentB;
    mockNodes["9:9"] = orphan;

    await expect(
      handleWriteComponentRequest(
        makeRequest("create_component_instance", [], {
          componentId: "7:7",
          parentId: "8:8",
          replaceNodeId: "9:9",
        })
      )
    ).rejects.toThrow("direct child of parentId");
  });
});
