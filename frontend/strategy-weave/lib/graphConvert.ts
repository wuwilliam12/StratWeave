/**
 * Convert between API graph payload and React Flow nodes/edges.
 */

import type { Node, Edge } from "reactflow";
import type { GraphNode, GraphEdge } from "@/types/graph";

/* Convert API nodes to React Flow nodes */
export function toFlowNodes(apiNodes: GraphNode[]): Node[] {
  return apiNodes.map((n) => ({
    id: n.id ?? `node-${Math.random().toString(36).slice(2, 9)}`,
    position: { x: n.position_x, y: n.position_y },
    data: { label: n.label },
  }));
}

/* Convert API edges to React Flow edges */
export function toFlowEdges(apiEdges: GraphEdge[]): Edge[] {
  return apiEdges.map((e) => ({
    id: e.id ?? `e-${e.source}-${e.target}`,
    source: e.source,
    target: e.target,
    data: { label: e.label ?? "" },
  }));
}

/* Convert React Flow nodes to API nodes */
export function toApiNodes(flowNodes: Node[]): GraphNode[] {
  return flowNodes.map((n) => ({
    id: n.id,
    label: (n.data?.label as string) ?? "",
    position_x: n.position?.x ?? 0,
    position_y: n.position?.y ?? 0,
    node_type: "strategy",
  }));
}

/* Convert React Flow edges to API edges */
export function toApiEdges(flowEdges: Edge[]): GraphEdge[] {
  return flowEdges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: (e.data?.label as string) ?? "",
  }));
}
