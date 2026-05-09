const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

function authHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export interface TrainingSession {
  id: string;
  owner_id: number;
  session_date: string;
  focus: string;
  sport?: string | null;
  graph_id?: string | null;
  created_at?: string | null;
}

export async function listTrainingSessions(): Promise<TrainingSession[]> {
  const res = await fetch(`${API_BASE}/headgear/sessions`, { headers: authHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createTrainingSession(payload: {
  session_date: string;
  focus: string;
  sport?: string | null;
  graph_id?: string | null;
}): Promise<TrainingSession> {
  const res = await fetch(`${API_BASE}/headgear/sessions`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteTrainingSession(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/headgear/sessions/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
}
