/**
 * Graph API client for interacting with user-owned graphs
 * Includes type definitions and helper functions for fetch
 */

export interface Node {
  id?: string;
  strategy_id?: string | null;
  graph_id?: string;
  parent_id?: string | null;
  label: string;
  sport?: string | null;
  action_id?: string | null;
  athlete_id?: string | null;
  position_x: number;
  position_y: number;
  node_type: string;
}

export interface Edge {
  id?: string;
  source: string;
  target: string;
  graph_id?: string;
  label?: string;
  probability?: number;
  stamina_cost?: number;
}

export interface GraphSummary {
  id: string;
  name: string;
  description?: string | null;
  owner_id: number;
  is_public: boolean;
}

export interface GraphResponse extends GraphSummary {
  nodes: Node[];
  edges: Edge[];
}

export interface GraphCreate {
  name: string;
  description?: string | null;
  is_public: boolean;
  nodes?: Node[];
  edges?: Edge[];
}

/**
 * Get authorization header with stored token
 */
function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` }),
  };
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

/**
 * List graphs owned by the current user
 */
export async function listGraphs(
  includePublic: boolean = false
): Promise<GraphSummary[]> {
  const params = new URLSearchParams();
  if (includePublic) params.append("include_public", "true");

  const response = await fetch(`${API_BASE}/graph/?${params}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to list graphs: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Create a new graph
 */
export async function createGraph(payload: GraphCreate): Promise<GraphResponse> {
  const response = await fetch(`${API_BASE}/graph/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create graph: ${error.detail || response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch a specific graph with all its nodes and edges
 */
export async function getGraph(
  graphId: string,
  enrich: boolean = false
): Promise<GraphResponse> {
  const params = new URLSearchParams();
  if (enrich) params.append("enrich", "true");

  const response = await fetch(
    `${API_BASE}/graph/${graphId}?${params}`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Graph not found");
    }
    if (response.status === 403) {
      throw new Error("Not authorized to access this graph");
    }
    throw new Error(`Failed to fetch graph: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Update a graph (replace nodes and edges)
 */
export async function updateGraph(
  graphId: string,
  payload: GraphCreate
): Promise<GraphResponse> {
  const response = await fetch(`${API_BASE}/graph/${graphId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to update graph: ${error.detail || response.statusText}`);
  }

  return response.json();
}

/**
 * Delete a graph
 */
export async function deleteGraph(graphId: string): Promise<{ ok: boolean }> {
  const response = await fetch(`${API_BASE}/graph/${graphId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to delete graph: ${error.detail || response.statusText}`);
  }

  return response.json();
}

/**
 * Get all nodes in a graph
 */
export async function getGraphNodes(graphId: string): Promise<Node[]> {
  const params = new URLSearchParams({ graph_id: graphId });

  const response = await fetch(`${API_BASE}/graph/nodes/?${params}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch nodes: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Add a node to a graph
 */
export async function createNode(node: Node): Promise<Node> {
  const response = await fetch(`${API_BASE}/graph/nodes/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(node),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create node: ${error.detail || response.statusText}`);
  }

  return response.json();
}

/**
 * Get all edges in a graph
 */
export async function getGraphEdges(graphId: string): Promise<Edge[]> {
  const params = new URLSearchParams({ graph_id: graphId });

  const response = await fetch(`${API_BASE}/graph/edges/?${params}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch edges: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Add an edge to a graph
 */
export async function createEdge(edge: Edge): Promise<Edge> {
  const response = await fetch(`${API_BASE}/graph/edges/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(edge),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create edge: ${error.detail || response.statusText}`);
  }

  return response.json();
}

/**
 * Clear all nodes in a graph
 */
export async function clearGraphNodes(graphId: string): Promise<{ ok: boolean }> {
  const params = new URLSearchParams({ graph_id: graphId });

  const response = await fetch(`${API_BASE}/graph/nodes/?${params}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to clear nodes: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Clear all edges in a graph
 */
export async function clearGraphEdges(graphId: string): Promise<{ ok: boolean }> {
  const params = new URLSearchParams({ graph_id: graphId });

  const response = await fetch(`${API_BASE}/graph/edges/?${params}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to clear edges: ${response.statusText}`);
  }

  return response.json();
}
