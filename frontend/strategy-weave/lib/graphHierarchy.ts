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

export type GraphHierarchySizing = {
  cardWidth: string;
  cardPadding: string;
  cardRadius: string;
  titleSize: string;
  titleLeading: string;
  chipSize: string;
  sectionLabelSize: string;
  sectionSpacing: string;
  detailsPadding: string;
};

const GRAPH_HIERARCHY_SIZING: Record<GraphHierarchyLevelKey, GraphHierarchySizing> = {
  strategy: {
    cardWidth: "min-w-[320px] max-w-[380px]",
    cardPadding: "p-5",
    cardRadius: "rounded-[1.75rem]",
    titleSize: "text-lg",
    titleLeading: "leading-7",
    chipSize: "px-3 py-1.5 text-[11px]",
    sectionLabelSize: "text-xs",
    sectionSpacing: "mt-4 pt-3",
    detailsPadding: "p-4",
  },
  scenario: {
    cardWidth: "min-w-[280px] max-w-[332px]",
    cardPadding: "p-4",
    cardRadius: "rounded-[1.5rem]",
    titleSize: "text-base",
    titleLeading: "leading-6",
    chipSize: "px-2.5 py-1 text-[10px]",
    sectionLabelSize: "text-[11px]",
    sectionSpacing: "mt-3 pt-2.5",
    detailsPadding: "p-3.5",
  },
  sequence: {
    cardWidth: "min-w-[248px] max-w-[300px]",
    cardPadding: "p-3.5",
    cardRadius: "rounded-[1.25rem]",
    titleSize: "text-sm",
    titleLeading: "leading-6",
    chipSize: "px-2.5 py-1 text-[10px]",
    sectionLabelSize: "text-[11px]",
    sectionSpacing: "mt-3 pt-2",
    detailsPadding: "p-3",
  },
  node: {
    cardWidth: "min-w-[220px] max-w-[264px]",
    cardPadding: "p-3",
    cardRadius: "rounded-2xl",
    titleSize: "text-sm",
    titleLeading: "leading-5",
    chipSize: "px-2 py-1 text-[10px]",
    sectionLabelSize: "text-[10px]",
    sectionSpacing: "mt-2.5 pt-2",
    detailsPadding: "p-3",
  },
};

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

export function getHierarchySizing(
  level: GraphHierarchyLevelKey,
): GraphHierarchySizing {
  return GRAPH_HIERARCHY_SIZING[level];
}
