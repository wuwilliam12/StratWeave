/**
 * Types for strategy graph nodes/edges. Mirror backend API (api/models/graph).
 */

/* Graph node interface */
export interface GraphNode {
  id: string | null;
  label: string;
  position_x: number;
  position_y: number;
  node_type?: string;
  strategy_id?: string | null;
  action_id?: string | null;
  boxer_id?: string | null;
}

/* Graph edge interface */
export interface GraphEdge {
  id: string | null;
  source: string;
  target: string;
  label?: string;
  probability?: number;
  stamina_cost?: number;
}

/* Graph payload interface */
export interface GraphPayload {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
