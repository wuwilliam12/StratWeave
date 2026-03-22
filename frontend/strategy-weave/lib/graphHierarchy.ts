import type { Node } from "reactflow";

export type GraphHierarchyLevelKey =
  | "strategy"
  | "scenario"
  | "sequence"
  | "node";

export const GRAPH_HIERARCHY_LEVELS: Array<{
  key: GraphHierarchyLevelKey;
  label: string;
  helper: string;
}> = [
  {
    key: "strategy",
    label: "Strategy",
    helper: "Top-level gameplan or strategic concept.",
  },
  {
    key: "scenario",
    label: "Scenario",
    helper: "Context or subsection where the strategy branches.",
  },
  {
    key: "sequence",
    label: "Sequence / Flow",
    helper: "Ordered exchange or response chain inside a scenario.",
  },
  {
    key: "node",
    label: "Node",
    helper: "Atomic unit the graph can manipulate directly.",
  },
];

type FlowNodeShape = {
  label?: string;
  nodeType?: string | null;
  node_type?: string | null;
  parentId?: string | null;
  parent_id?: string | null;
};

export function normalizeGraphHierarchyType(
  rawType?: string | null,
): GraphHierarchyLevelKey {
  switch (rawType?.toLowerCase()) {
    case "strategy":
      return "strategy";
    case "scenario":
      return "scenario";
    case "sequence":
    case "flow":
      return "sequence";
    case "node":
      return "node";
    default:
      return "node";
  }
}

export function getNodeHierarchyType(node: Node): GraphHierarchyLevelKey {
  const data = (node.data ?? {}) as FlowNodeShape;
  return normalizeGraphHierarchyType(data.nodeType ?? data.node_type);
}

export function getNodeHierarchyLabel(node: Node): string {
  const data = (node.data ?? {}) as FlowNodeShape;
  return data.label?.trim() || node.id;
}

export function getNodeParentId(node: Node): string | null {
  const data = (node.data ?? {}) as FlowNodeShape;
  return data.parentId ?? data.parent_id ?? null;
}
