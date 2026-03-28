"use client";

import { FormEvent, useEffect, useState } from "react";
import { createBagItem, fetchBagItems, type BoxingBagItem } from "@/lib/api";

type SortOption = "name" | "mastery" | "group" | "learned_at";

const MASTERY_ORDER = { novice: 0, intermediate: 1, advanced: 2 };

export default function BagManager() {
  const [bagItems, setBagItems] = useState<BoxingBagItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [draft, setDraft] = useState<Partial<BoxingBagItem>>({
    name: "",
    description: "",
    group: "",
    source: "",
    reference_url: "",
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
        reference_url: draft.reference_url?.trim() || undefined,
        mastery: draft.mastery || "novice",
        learned_at: draft.learned_at || new Date().toISOString().slice(0, 10),
      } as BoxingBagItem);
      setDraft({
        name: "",
        description: "",
        group: "",
        source: "",
        reference_url: "",
        mastery: "novice",
        learned_at: new Date().toISOString().slice(0, 10),
      });
      await loadBag();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create bag item");
    }
  };

  // Filter items based on search query
  const filteredItems = bagItems.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.name?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.group?.toLowerCase().includes(query) ||
      item.source?.toLowerCase().includes(query)
    );
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return (a.name || "").localeCompare(b.name || "");
      case "mastery": {
        const masteryA = MASTERY_ORDER[a.mastery as keyof typeof MASTERY_ORDER] ?? 0;
        const masteryB = MASTERY_ORDER[b.mastery as keyof typeof MASTERY_ORDER] ?? 0;
        return masteryA - masteryB;
      }
      case "group":
        return (a.group || "Ungrouped").localeCompare(b.group || "Ungrouped");
      case "learned_at":
        return new Date(b.learned_at || 0).getTime() - new Date(a.learned_at || 0).getTime();
      default:
        return 0;
    }
  });

  // Group sorted items
  const groups = sortedItems.reduce<Record<string, BoxingBagItem[]>>((acc, item) => {
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
            <span className="text-sm font-medium">Reference URL</span>
            <input
              value={draft.reference_url || ""}
              onChange={(e) => setDraft((prev) => ({ ...prev, reference_url: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <p className="text-xs text-muted">Optional tutorial or reference link for this move.</p>
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Bag inventory</h2>
            {loading && <span className="text-sm text-muted">Loading...</span>}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Search</span>
              <input
                type="text"
                placeholder="Filter by name, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-slate-800"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Sort by</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-slate-800"
              >
                <option value="name">Name</option>
                <option value="mastery">Mastery Level</option>
                <option value="group">Group</option>
                <option value="learned_at">Recently Learned</option>
              </select>
            </label>
          </div>
        </div>

        {!loading && bagItems.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No items in your bag yet. Add with the form above.</p>
        ) : !loading && filteredItems.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No items match your search. Try different keywords.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {!loading && (
              <p className="text-xs text-muted">
                Showing {filteredItems.length} of {bagItems.length} item{bagItems.length !== 1 ? "s" : ""}
              </p>
            )}
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
                      {item.reference_url ? (
                        <p className="mt-1 text-xs">
                          Reference: <a
                            href={item.reference_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            {item.reference_url}
                          </a>
                        </p>
                      ) : null}
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
