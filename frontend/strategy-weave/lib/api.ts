/**
 * API client for StratWeave backend (graph nodes/edges, sport models).
 */

import type { GraphPayload } from "@/types/graph";
import type { BlueprintStyle } from "@/types/blueprint";

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
export interface FetchGraphOptions {
  enrich?: boolean;
}

export async function fetchGraph(
  options?: FetchGraphOptions
): Promise<GraphPayload> {
  const params = new URLSearchParams();
  if (options?.enrich) params.set("enrich", "true");
  const qs = params.toString();
  const path = qs ? `/graph/?${qs}` : "/graph/";
  return fetchApi<GraphPayload>(path);
}

export async function saveGraph(payload: GraphPayload): Promise<GraphPayload> {
  return fetchApi<GraphPayload>("/graph/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/* Blueprint style API calls */
export async function fetchBlueprintStyles(): Promise<BlueprintStyle[]> {
  return fetchApi<BlueprintStyle[]>("/blueprints/styles/");
}

export async function fetchBlueprintStyle(
  styleSlug: string,
): Promise<BlueprintStyle> {
  return fetchApi<BlueprintStyle>(`/blueprints/styles/${styleSlug}`);
}

/* Boxing API calls */
export interface Boxer {
  id?: string | null;
  speed?: number;
  power?: number;
  reach?: number;
  height?: number;
  reaction_time?: number;
  style?: string | null;
}

export interface BoxerAction {
  id?: string | null;
  name: string;
  lead_hand?: string | null;
  rear_hand?: string | null;
  footwork?: string | null;
  head_movement?: string | null;
  stamina_cost?: number;
  base_time?: number;
}

export async function fetchBoxers(): Promise<Boxer[]> {
  return fetchApi<Boxer[]>("/boxing/boxers/");
}

export async function fetchActions(): Promise<BoxerAction[]> {
  return fetchApi<BoxerAction[]>("/boxing/actions/");
}
