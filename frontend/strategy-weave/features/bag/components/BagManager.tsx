"use client";

import { FormEvent, useEffect, useState } from "react";
import { createBagItem, fetchBagItems, type BoxingBagItem } from "@/lib/api";

export default function BagManager() {
  const [bagItems, setBagItems] = useState<BoxingBagItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<BoxingBagItem>>({
    name: "",
    description: "",
    group: "",
    source: "",
    mastery: "novice",
    learned_at: new Date().toISOString().slice(0, 10),
  });

  const loadBag = async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await fetchBagItems();
      setBagItems(items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load bag items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBag();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.name?.trim()) {
      setError("Name is required");
      return;
    }
    setError(null);
    try {
      await createBagItem({
        name: draft.name.trim(),
        description: draft.description?.trim() ?? "",
        group: draft.group?.trim() || "Ungrouped",
        source: draft.source?.trim() || "Manual",
        mastery: draft.mastery || "novice",
        learned_at: draft.learned_at || new Date().toISOString().slice(0, 10),
      } as BoxingBagItem);
      setDraft({
        name: "",
        description: "",
        group: "",
        source: "",
        mastery: "novice",
        learned_at: new Date().toISOString().slice(0, 10),
      });
      await loadBag();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create bag item");
    }
  };

  const groups = bagItems.reduce<Record<string, BoxingBagItem[]>>((acc, item) => {
    const key = item.group?.trim() || "Ungrouped";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      <header className="rounded-xl border border-border bg-surface p-4">
        <h1 className="text-2xl font-semibold">Training Bag</h1>
        <p className="mt-1 text-sm text-muted">Add weapons/tools to your kit, categorize by group, and track mastery.</p>
      </header>

      <section className="rounded-xl border border-border bg-surface p-4">
        <h2 className="text-lg font-semibold">Add to bag</h2>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm font-medium">Name *</span>
            <input
              value={draft.name || ""}
              onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium">Group</span>
            <input
              value={draft.group || ""}
              onChange={(e) => setDraft((prev) => ({ ...prev, group: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="e.g. Weekly Focus, Fight Camp"
            />
          </label>
          <label className="space-y-1 col-span-2">
            <span className="text-sm font-medium">Description</span>
            <textarea
              value={draft.description || ""}
              onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              rows={3}
              placeholder="Tactical notes, coach highlight, counter application."
            />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium">Source</span>
            <input
              value={draft.source || ""}
              onChange={(e) => setDraft((prev) => ({ ...prev, source: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Coach session, sparring, camp"
            />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium">Mastery</span>
            <select
              value={draft.mastery || "novice"}
              onChange={(e) => setDraft((prev) => ({ ...prev, mastery: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="novice">Novice</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium">Learned at</span>
            <input
              type="date"
              value={draft.learned_at || new Date().toISOString().slice(0, 10)}
              onChange={(e) => setDraft((prev) => ({ ...prev, learned_at: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </label>
          <div className="col-span-2 pt-2">
            <button type="submit" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-strong">
              Add tool to bag
            </button>
          </div>
        </form>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </section>

      <section className="rounded-xl border border-border bg-surface p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Bag inventory</h2>
          {loading && <span className="text-sm text-muted">Loading...</span>}
        </div>

        {!loading && bagItems.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No items in your bag yet. Add with the form above.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {Object.entries(groups).map(([group, items]) => (
              <div key={group} className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-slate-900">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">{group}</h3>
                <ul className="mt-2 space-y-2">
                  {items.map((item) => (
                    <li key={item.id || item.name} className="rounded-md border border-gray-200 px-3 py-2 text-sm dark:border-gray-700">
                      <div className="flex justify-between font-semibold">
                        <span>{item.name}</span>
                        <span className="text-xs text-gray-500">{item.mastery || "novice"}</span>
                      </div>
                      {item.description && <p className="text-xs text-muted">{item.description}</p>}
                      <p className="mt-1 text-xs text-muted">{item.source || "source unknown"} • {item.learned_at || "date unknown"}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
