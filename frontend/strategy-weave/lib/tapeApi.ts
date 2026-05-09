const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

function authHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export interface TapeEntry {
  id: string;
  owner_id: number;
  title: string;
  url: string;
  sport?: string | null;
  tags: string[];
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export async function listTapeEntries(): Promise<TapeEntry[]> {
  const res = await fetch(`${API_BASE}/tape/`, { headers: authHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createTapeEntry(payload: {
  title: string;
  url: string;
  sport?: string | null;
  tags?: string[];
  notes?: string | null;
}): Promise<TapeEntry> {
  const res = await fetch(`${API_BASE}/tape/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteTapeEntry(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/tape/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
}
