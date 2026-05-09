"use client";

import React from "react";

import type { GraphSuggestResponse } from "@/lib/graphAiApi";

export interface StatWeaverPanelProps {
  open: boolean;
  loading: boolean;
  error: string | null;
  result: GraphSuggestResponse | null;
  onClose: () => void;
  onRefresh: () => void;
}

export default function StatWeaverPanel({
  open,
  loading,
  error,
  result,
  onClose,
  onRefresh,
}: StatWeaverPanelProps) {
  if (!open) return null;

  return (
    <aside className="absolute bottom-4 left-4 right-4 z-40 max-h-[min(420px,50vh)] overflow-y-auto rounded-2xl border border-border bg-surface-strong/95 p-4 shadow-2xl backdrop-blur sm:left-auto sm:right-4 sm:w-[400px]">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            StatWeaver
          </div>
          <p className="mt-1 text-sm text-foreground">
            Heuristic tactical pass — same signals as graph coverage warnings, plus mode context.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-surface disabled:opacity-50"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted hover:bg-surface"
          >
            Close
          </button>
        </div>
      </div>

      {loading ? (
        <p className="mt-4 text-sm text-muted">Analyzing graph…</p>
      ) : null}
      {error ? (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      {result ? (
        <div className="mt-4 space-y-3 text-sm">
          <p className="text-foreground">{result.summary}</p>
          <p className="text-xs text-muted">
            Coverage score (heuristic): {(result.coverage_score * 100).toFixed(0)}%
          </p>
          {result.suggestions.length === 0 ? (
            <p className="text-muted">No suggestions — graph looks structurally balanced.</p>
          ) : (
            <ul className="list-inside list-disc space-y-1 text-muted">
              {result.suggestions.map((s, i) => (
                <li key={`${i}-${s.slice(0, 48)}`}>{s}</li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </aside>
  );
}
