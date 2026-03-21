/**
 * Convert between API graph payload and React Flow nodes/edges.
 */

import type { Node, Edge } from "reactflow";
import type { GraphNode, GraphEdge } from "@/types/graph";
import { CUSTOM_FLOW_EDGE_TYPE } from "@/features/flow/components/edges/edgeTypes";

/**
 * Shape of `node.data` used in the editor.
 * - `label` is the main text shown on the node (name/short description)
 * - `details` is for a future dropdown / expandable details panel
 * - `action_id` / `boxer_id` link to sport entities (boxing actions, boxers)
 */
export interface FlowNodeData {
  label: string;
  details?: string;
  nodeType?: string | null;
  strategy_id?: string | null;
  sport?: string | null;
  action_id?: string | null;
  athlete_id?: string | null;
  athleteRole?: "user" | "opponent" | "neutral" | null;
  onEdit?: (nodeId: string) => void;
}

export interface FlowEdgeData {
  label?: string;
  probability?: number | null;
  staminaCost?: number | null;
}

/* Convert API nodes to React Flow nodes */
export function toFlowNodes(apiNodes: GraphNode[]): Node[] {
  return apiNodes.map((n) => ({
    id: n.id ?? `node-${Math.random().toString(36).slice(2, 9)}`,
    position: { x: n.position_x, y: n.position_y },
    data: {
      label: n.label,
      nodeType: n.node_type ?? "node",
      strategy_id: n.strategy_id ?? null,
      sport: n.sport ?? null,
      action_id: n.action_id ?? null,
      athlete_id: n.athlete_id ?? null,
      athleteRole:
        n.athlete_role === "user" ||
        n.athlete_role === "opponent" ||
        n.athlete_role === "neutral"
          ? n.athlete_role
          : null,
    } as FlowNodeData,
  }));
}

/* Convert API edges to React Flow edges */
export function toFlowEdges(apiEdges: GraphEdge[]): Edge[] {
  return apiEdges.map((e) => ({
    id: e.id ?? `e-${e.source}-${e.target}`,
    type: CUSTOM_FLOW_EDGE_TYPE,
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
    data: {
      label: e.label ?? "",
      probability: e.probability ?? null,
      staminaCost: e.stamina_cost ?? null,
    } as FlowEdgeData,
  }));
}

/* Convert React Flow nodes to API nodes */
export function toApiNodes(flowNodes: Node[]): GraphNode[] {
  return flowNodes.map((n) => {
    const data = (n.data ?? {}) as Partial<FlowNodeData>;

    return {
      id: n.id ?? null,
      // Persist the main visible text; details stay frontend‑only for now.
      label: data.label ?? "",
      position_x: n.position?.x ?? 0,
      position_y: n.position?.y ?? 0,
      // TODO: once you introduce different node “kinds” (e.g. strategy vs
      // detail vs edge‑label mini node), set `node_type` from data here.
      // Keep hierarchy type on the node so Explorer and future views stay aligned.
      node_type: data.nodeType ?? "node",
      strategy_id: data.strategy_id ?? null,
      sport: data.sport ?? null,
      action_id: data.action_id ?? null,
      athlete_id: data.athlete_id ?? null,
      athlete_role: data.athleteRole ?? null,
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
    label: ((e.data as FlowEdgeData | undefined)?.label as string) ?? "",
    probability: (e.data as FlowEdgeData | undefined)?.probability ?? undefined,
    stamina_cost: (e.data as FlowEdgeData | undefined)?.staminaCost ?? undefined,
  }));
}
