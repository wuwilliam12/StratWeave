"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import {
  createTrainingSession,
  deleteTrainingSession,
  listTrainingSessions,
  type TrainingSession,
} from "@/lib/headgearApi";
import { useSport } from "@/contexts/SportContext";

export default function HeadgearPage() {
  const { sportId } = useSport();
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [focus, setFocus] = useState("");
  const [sessionDate, setSessionDate] = useState(
    () => new Date().toISOString().slice(0, 10),
  );

  const load = useCallback(async () => {
    await Promise.resolve();
    setLoading(true);
    setError(null);
    try {
      const rows = await listTrainingSessions();
      setSessions(rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load sessions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!focus.trim()) {
      setError("Focus / notes are required");
      return;
    }
    setError(null);
    try {
      await createTrainingSession({
        session_date: sessionDate,
        focus: focus.trim(),
        sport: sportId,
      });
      setFocus("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    }
  };

  const onDelete = async (id: string) => {
    try {
      await deleteTrainingSession(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  return (
    <div className="min-h-dvh bg-background p-6 sm:p-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <Navbar subtitle="Session focus and gym reminders (Headgear)." />
        <header className="rounded-xl border border-border bg-surface p-4">
          <h1 className="text-2xl font-semibold">Headgear</h1>
          <p className="mt-1 text-sm text-muted">
            Log today&apos;s tactical focus before you train. Link graphs from the editor in a
            future iteration.
          </p>
        </header>

        <section className="rounded-xl border border-border bg-surface p-4">
          <h2 className="text-lg font-semibold">Log session</h2>
          <form onSubmit={onSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
            <label>
              <span className="text-sm font-medium">Date</span>
              <input
                type="date"
                value={sessionDate}
                onChange={(ev) => setSessionDate(ev.target.value)}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2"
              />
            </label>
            <div className="hidden sm:block" />
            <label className="sm:col-span-2">
              <span className="text-sm font-medium">Focus & reminders</span>
              <textarea
                value={focus}
                onChange={(ev) => setFocus(ev.target.value)}
                rows={4}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                placeholder="e.g., Jab rhythm on exits; spar with pressure scenario in mind."
                required
              />
            </label>
            <button
              type="submit"
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white"
            >
              Save session note
            </button>
          </form>
          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        </section>

        <section className="rounded-xl border border-border bg-surface p-4">
          <h2 className="text-lg font-semibold">Recent sessions</h2>
          {loading ? (
            <p className="mt-2 text-sm text-muted">Loading…</p>
          ) : sessions.length === 0 ? (
            <p className="mt-2 text-sm text-muted">No sessions logged yet.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {sessions.map((s) => (
                <li
                  key={s.id}
                  className="rounded-lg border border-border p-3 text-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-muted">
                        {s.session_date}
                      </div>
                      <p className="mt-1 whitespace-pre-wrap text-foreground">{s.focus}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDelete(s.id)}
                      className="shrink-0 text-xs text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-xs text-muted">
            <Link href="/home" className="text-accent hover:underline">
              Back to home
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
