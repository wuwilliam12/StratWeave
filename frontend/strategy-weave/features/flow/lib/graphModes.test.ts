import { describe, expect, it } from "vitest";
import type { Edge, Node } from "reactflow";

import { projectGraphForMode, isDerivedActionProjectionEdgeId } from "./graphModes";
import type { FlowEdgeData, FlowNodeData } from "@/lib/graphConvert";
import { CUSTOM_FLOW_EDGE_TYPE } from "@/features/flow/components/edges/edgeTypes";
import { CUSTOM_FLOW_NODE_TYPE } from "@/features/flow/components/nodes/nodeTypes";

function n(
  id: string,
  nodeType: string,
  label: string,
): Node<FlowNodeData> {
  return {
    id,
    type: CUSTOM_FLOW_NODE_TYPE,
    position: { x: 0, y: 0 },
    data: { label, nodeType },
  };
}

function e(id: string, source: string, target: string, label: string): Edge<FlowEdgeData> {
  return {
    id,
    type: CUSTOM_FLOW_EDGE_TYPE,
    source,
    target,
    data: { label },
  };
}

describe("graphModes", () => {
  it("detects derived projection edge ids", () => {
    expect(isDerivedActionProjectionEdgeId("derived-a-b")).toBe(true);
    expect(isDerivedActionProjectionEdgeId("e1-2")).toBe(false);
  });

  it("merges parallel paths between two actions into one edge label", () => {
    const nodes: Node[] = [
      n("a1", "action", "Jab"),
      n("s1", "state", "Outside"),
      n("s2", "state", "Inside"),
      n("a2", "action", "Cross"),
    ];
    const edges: Edge[] = [
      e("e1", "a1", "s1", "feint"),
      e("e2", "s1", "a2", "straight"),
      e("e3", "a1", "s2", "slip"),
      e("e4", "s2", "a2", "hook"),
    ];

    const { edges: out } = projectGraphForMode(nodes, edges, "action");
    const derived = out.filter((edge) => (edge.data as FlowEdgeData).derived);
    expect(derived).toHaveLength(1);
    expect(derived[0].source).toBe("a1");
    expect(derived[0].target).toBe("a2");
    expect((derived[0].data as FlowEdgeData).label).toContain("│");
    expect((derived[0].data as FlowEdgeData).label).toMatch(/feint → straight/);
    expect((derived[0].data as FlowEdgeData).label).toMatch(/slip → hook/);
  });
});
