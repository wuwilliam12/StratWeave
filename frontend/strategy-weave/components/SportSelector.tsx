"use client";

import { useSport } from "@/contexts/SportContext";
import { SPORTS, type SportId } from "@/lib/sports";

export default function SportSelector() {
  const { sportId, setSportId } = useSport();

  return (
    <label className="flex min-w-0 items-center gap-2 text-sm font-medium text-foreground">
      <span className="sr-only">Sport</span>
      <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
        Sport
      </span>
      <select
        aria-label="Sport theme"
        className="max-w-[11rem] cursor-pointer truncate rounded-full border border-border bg-surface-strong py-2 pl-3 pr-8 text-sm text-foreground shadow-sm transition hover:bg-surface focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
        value={sportId}
        onChange={(e) => setSportId(e.target.value as SportId)}
      >
        {SPORTS.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>
    </label>
  );
}
