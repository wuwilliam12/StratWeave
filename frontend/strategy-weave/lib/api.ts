/**
 * API client for StratWeave backend (graph nodes/edges, sport models).
 * 
 * Generic bag/training system that works with any sport.
 * Sport-specific implementations include boxing.
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

/* Generic/Common types - Sport agnostic */

/**
 * Generic training item used across all sports.
 * Can represent techniques, plays, strategies, etc.
 */
export interface TrainingItem {
  id?: string | null;
  name: string;
  description?: string | null;
  item_type?: string | null; // e.g., "technique", "play", "strategy"
  entity_id?: string | null; // Sport-specific ID (action_id, play_id, etc.)
  bag_id?: string;
  group?: string | null;
  source?: string | null;
  reference_url?: string | null;
  mastery?: string | null;
  learned_at?: string | null;
  last_practiced?: string | null;
  tags?: string[];
  notes?: Record<string, unknown>;
}

/**
 * Training bag metadata (sport agnostic)
 */
export interface TrainingBag {
  id: string | null;
  name: string;
  description?: string;
  owner_id: string;
  is_public: boolean;
  sport?: string;
  created_at?: string;
  updated_at?: string;
  items?: TrainingItem[];
}

/* Generic bag operations that work with any sport */

/**
 * Create a generic sport-agnostic bag API base path.
 * Usage: `const basePath = createBagPath("boxing")` → "/boxing/bag"
 */
function createBagPath(sport: string): string {
  return `/${sport}/bag`;
}

/**
 * Fetch all public bags for a sport.
 */
export async function fetchPublicBagsBySport(sport: string): Promise<TrainingBag[]> {
  return fetchApi<TrainingBag[]>(`${createBagPath(sport)}/bags/`);
}

/**
 * Fetch a specific bag.
 */
export async function fetchBagBySport(sport: string, bagId: string): Promise<TrainingBag> {
  return fetchApi<TrainingBag>(`${createBagPath(sport)}/bags/${bagId}`);
}

/**
 * Create a new bag.
 */
export async function createBagBySport(sport: string, bag: TrainingBag): Promise<TrainingBag> {
  return fetchApi<TrainingBag>(`${createBagPath(sport)}/bags/`, {
    method: "POST",
    body: JSON.stringify(bag),
  });
}

/**
 * Update a bag.
 */
export async function updateBagBySport(sport: string, bagId: string, updates: Partial<TrainingBag>): Promise<TrainingBag> {
  return fetchApi<TrainingBag>(`${createBagPath(sport)}/bags/${bagId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

/**
 * Delete a bag.
 */
export async function deleteBagBySport(sport: string, bagId: string): Promise<void> {
  await fetchApi(`${createBagPath(sport)}/bags/${bagId}`, {
    method: "DELETE",
  });
}

/**
 * Fetch items in a bag.
 */
export async function fetchBagItemsByBagSport(sport: string, bagId: string): Promise<TrainingItem[]> {
  return fetchApi<TrainingItem[]>(`${createBagPath(sport)}/bags/${bagId}/items/`);
}

/**
 * Add an item to a bag.
 */
export async function createBagItemInBagBySport(sport: string, bagId: string, item: TrainingItem): Promise<TrainingItem> {
  return fetchApi<TrainingItem>(`${createBagPath(sport)}/bags/${bagId}/items/`, {
    method: "POST",
    body: JSON.stringify(item),
  });
}

/**
 * Update an item in a bag.
 */
export async function updateBagItemBySport(sport: string, bagId: string, itemId: string, updates: Partial<TrainingItem>): Promise<TrainingItem> {
  return fetchApi<TrainingItem>(`${createBagPath(sport)}/bags/${bagId}/items/${itemId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

/**
 * Delete an item from a bag.
 */
export async function deleteBagItemBySport(sport: string, bagId: string, itemId: string): Promise<void> {
  await fetchApi(`${createBagPath(sport)}/bags/${bagId}/items/${itemId}`, {
    method: "DELETE",
  });
}

/* Boxing API calls */
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

export interface BoxingBagItem extends TrainingItem {
  action_id?: string | null; // Boxing-specific alias for entity_id
}

export async function fetchBoxers(): Promise<Boxer[]> {
  return fetchApi<Boxer[]>("/boxing/boxers/");
}

export async function fetchActions(): Promise<BoxerAction[]> {
  return fetchApi<BoxerAction[]>("/boxing/actions/");
}

export async function fetchBagItems(): Promise<BoxingBagItem[]> {
  return fetchApi<BoxingBagItem[]>("/boxing/bag/");
}

export async function createBagItem(item: BoxingBagItem): Promise<BoxingBagItem> {
  return fetchApi<BoxingBagItem>("/boxing/bag/", {
    method: "POST",
    body: JSON.stringify(item),
  });
}

export interface Bag {
  id: string | null;
  name: string;
  description?: string;
  owner_id: string;
  is_public: boolean;
  created_at?: string;
}

export async function fetchPublicBags(): Promise<Bag[]> {
  return fetchApi<Bag[]>("/boxing/bag/bags/");
}

export async function fetchBag(bagId: string): Promise<Bag> {
  return fetchApi<Bag>(`/boxing/bag/bags/${bagId}`);
}

export async function createBag(bag: Bag): Promise<Bag> {
  return fetchApi<Bag>("/boxing/bag/bags/", {
    method: "POST",
    body: JSON.stringify(bag),
  });
}

export async function fetchBagItemsByBag(bagId: string): Promise<BoxingBagItem[]> {
  return fetchApi<BoxingBagItem[]>(`/boxing/bag/bags/${bagId}/items/`);
}

export async function createBagItemInBag(bagId: string, item: BoxingBagItem): Promise<BoxingBagItem> {
  return fetchApi<BoxingBagItem>(`/boxing/bag/bags/${bagId}/items/`, {
    method: "POST",
    body: JSON.stringify(item),
  });
}
