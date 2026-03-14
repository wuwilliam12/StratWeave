/**
 * API client for StratWeave backend (graph nodes/edges).
 */

import type { GraphPayload } from "@/types/graph";

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api")
    : "";

/* Generic API fetch call wrapper */
async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

/* Graph API calls */
export async function fetchGraph(): Promise<GraphPayload> {
  return fetchApi<GraphPayload>("/graph/");
}

export async function saveGraph(payload: GraphPayload): Promise<GraphPayload> {
  return fetchApi<GraphPayload>("/graph/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
