import type { Edge, Node } from "reactflow";

import type { FlowNodeData } from "@/lib/graphConvert";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

function authHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export interface GraphSuggestResponse {
  summary: string;
  suggestions: string[];
  coverage_score: number;
}

/** Strip editor-only callbacks before sending to StatWeaver. */
export function nodesEdgesForAiSnapshot(nodes: Node[], edges: Edge[]) {
  const slimNodes = nodes.map((n) => {
    const d = (n.data ?? {}) as FlowNodeData;
    return {
      id: n.id,
      position: n.position,
      data: {
        label: d.label,
        nodeType: d.nodeType,
      },
    };
  });
  const slimEdges = edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    data: {
      label: (e.data as { label?: string } | undefined)?.label,
    },
  }));
  return { nodes: slimNodes, edges: slimEdges };
}

export async function fetchGraphSuggestions(payload: {
  sport: string;
  mode: "state" | "action";
  nodes: ReturnType<typeof nodesEdgesForAiSnapshot>["nodes"];
  edges: ReturnType<typeof nodesEdgesForAiSnapshot>["edges"];
}): Promise<GraphSuggestResponse> {
  const res = await fetch(`${API_BASE}/ai/graph-suggest`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json() as Promise<GraphSuggestResponse>;
}
