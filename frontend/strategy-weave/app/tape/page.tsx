"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import {
  createTapeEntry,
  deleteTapeEntry,
  listTapeEntries,
  type TapeEntry,
} from "@/lib/tapeApi";
import { useSport } from "@/contexts/SportContext";

export default function TapePage() {
  const { sportId } = useSport();
  const [entries, setEntries] = useState<TapeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await listTapeEntries();
      setEntries(rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load tape");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      setError("Title and URL are required");
      return;
    }
    setError(null);
    try {
      await createTapeEntry({
        title: title.trim(),
        url: url.trim(),
        sport: sportId,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        notes: notes.trim() || null,
      });
      setTitle("");
      setUrl("");
      setTags("");
      setNotes("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    }
  };

  const onDelete = async (id: string) => {
    try {
      await deleteTapeEntry(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  return (
    <div className="min-h-dvh bg-background p-6 sm:p-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <Navbar subtitle="Film study links and notes (Tape)." />
        <header className="rounded-xl border border-border bg-surface p-4">
          <h1 className="text-2xl font-semibold">Tape</h1>
          <p className="mt-1 text-sm text-muted">
            Save fight footage, breakdowns, and tutorials. Tag entries for quick filtering later.
          </p>
        </header>

        <section className="rounded-xl border border-border bg-surface p-4">
          <h2 className="text-lg font-semibold">Add entry</h2>
          <form onSubmit={onSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="text-sm font-medium">Title</span>
              <input
                value={title}
                onChange={(ev) => setTitle(ev.target.value)}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                required
              />
            </label>
            <label className="sm:col-span-2">
              <span className="text-sm font-medium">URL</span>
              <input
                value={url}
                onChange={(ev) => setUrl(ev.target.value)}
                type="url"
                className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                required
              />
            </label>
            <label className="sm:col-span-2">
              <span className="text-sm font-medium">Tags (comma-separated)</span>
              <input
                value={tags}
                onChange={(ev) => setTags(ev.target.value)}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                placeholder="ring-cutting, southpaw, film"
              />
            </label>
            <label className="sm:col-span-2">
              <span className="text-sm font-medium">Notes</span>
              <textarea
                value={notes}
                onChange={(ev) => setNotes(ev.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2"
              />
            </label>
            <button
              type="submit"
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white"
            >
              Save to tape
            </button>
          </form>
          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        </section>

        <section className="rounded-xl border border-border bg-surface p-4">
          <h2 className="text-lg font-semibold">Your library</h2>
          {loading ? (
            <p className="mt-2 text-sm text-muted">Loading…</p>
          ) : entries.length === 0 ? (
            <p className="mt-2 text-sm text-muted">No entries yet.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {entries.map((ent) => (
                <li
                  key={ent.id}
                  className="rounded-lg border border-border p-3 text-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold">{ent.title}</div>
                      <a
                        href={ent.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block text-accent hover:underline"
                      >
                        Open link
                      </a>
                      {ent.tags?.length ? (
                        <p className="mt-1 text-xs text-muted">
                          {ent.tags.join(" · ")}
                        </p>
                      ) : null}
                      {ent.notes ? (
                        <p className="mt-1 text-xs text-muted">{ent.notes}</p>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => onDelete(ent.id)}
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
