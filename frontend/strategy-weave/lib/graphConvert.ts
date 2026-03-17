/**
 * Convert between API graph payload and React Flow nodes/edges.
 */

import type { Node, Edge } from "reactflow";
import type { GraphNode, GraphEdge } from "@/types/graph";

/**
 * Shape of `node.data` used in the editor.
 * - `label` is the main text shown on the node (name/short description)
 * - `details` is for a future dropdown / expandable details panel
 */
export interface FlowNodeData {
  label: string;
  details?: string;
}

/* Convert API nodes to React Flow nodes */
export function toFlowNodes(apiNodes: GraphNode[]): Node[] {
  return apiNodes.map((n) => ({
    id: n.id ?? `node-${Math.random().toString(36).slice(2, 9)}`,
    position: { x: n.position_x, y: n.position_y },
    // For now the backend only knows about a single `label` field.
    // The UI treats this as the main name/description text for the node.
    data: { label: n.label } as FlowNodeData,
  }));
}

/* Convert API edges to React Flow edges */
export function toFlowEdges(apiEdges: GraphEdge[]): Edge[] {
  return apiEdges.map((e) => ({
    id: e.id ?? `e-${e.source}-${e.target}`,
    source: e.source,
    target: e.target,
    /**
     * Edge labels:
     * - Right now we use a simple string label in `data.label`.
     * - When implementing “mini nodes” as edge labels (intermediate
     *   nodes that sit on top of edges), keep this string for quick
     *   display and use a dedicated node type (e.g. `edge-label`) to
     *   represent the mini node in React Flow.
     */
    data: { label: e.label ?? "" },
  }));
}

/* Convert React Flow nodes to API nodes */
export function toApiNodes(flowNodes: Node[]): GraphNode[] {
  return flowNodes.map((n) => {
    const data = (n.data ?? {}) as Partial<FlowNodeData>;

    return {
      id: n.id,
      // Persist the main visible text; details stay frontend‑only for now.
      label: data.label ?? "",
      position_x: n.position?.x ?? 0,
      position_y: n.position?.y ?? 0,
      // TODO: once you introduce different node “kinds” (e.g. strategy vs
      // detail vs edge‑label mini node), set `node_type` from data here.
      node_type: "strategy",
    };
  });
}

/* Convert React Flow edges to API edges */
export function toApiEdges(flowEdges: Edge[]): GraphEdge[] {
  return flowEdges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    // Keep a simple string label on the edge itself for now.
    // Mini node / rich label support will be layered on top of this.
    label: (e.data?.label as string) ?? "",
  }));
}
