"use client";

import React from "react";
import type { Edge } from "reactflow";

import type { FlowEdgeData } from "@/lib/graphConvert";

type FlowEdgePatch = Partial<FlowEdgeData>;

export interface EdgeInspectorProps {
  edge: Edge<FlowEdgeData> | null;
  onClose?: () => void;
  onChange?: (edgeId: string, patch: FlowEdgePatch) => void;
}

export default function EdgeInspector({
  edge,
  onClose,
  onChange,
}: EdgeInspectorProps) {
  if (!edge) return null;

  const data = (edge.data ?? {}) as FlowEdgeData;

  return (
    <aside className="absolute right-4 top-4 z-30 w-[320px] rounded-3xl border border-black/10 bg-[color:var(--color-surface-strong)] p-4 shadow-2xl backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-muted)]">
            Edge editor
          </div>
          <div className="mt-1 text-lg font-semibold text-[color:var(--color-foreground)]">
            {data.label?.trim() || "Untitled action"}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-black/10 px-2.5 py-1 text-xs font-medium text-[color:var(--color-muted)] transition hover:border-black/20 hover:text-[color:var(--color-foreground)]"
        >
          Close
        </button>
      </div>

      <div className="mt-4 space-y-4">
        <label className="block text-sm font-medium text-[color:var(--color-foreground)]">
          Action label
          <input
            type="text"
            value={data.label ?? ""}
            onChange={(event) => onChange?.(edge.id, { label: event.target.value })}
            className="mt-1 w-full rounded-2xl border border-black/10 bg-white/80 px-3 py-2 text-sm outline-none transition focus:border-[color:var(--color-accent)]"
          />
        </label>

        <label className="block text-sm font-medium text-[color:var(--color-foreground)]">
          Probability
          <input
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={data.probability ?? ""}
            onChange={(event) =>
              onChange?.(edge.id, {
                probability:
                  event.target.value === "" ? null : Number(event.target.value),
              })
            }
            className="mt-1 w-full rounded-2xl border border-black/10 bg-white/80 px-3 py-2 text-sm outline-none transition focus:border-[color:var(--color-accent)]"
            placeholder="0.00 to 1.00"
          />
        </label>

        <label className="block text-sm font-medium text-[color:var(--color-foreground)]">
          Stamina cost
          <input
            type="number"
            min="0"
            step="1"
            value={data.staminaCost ?? ""}
            onChange={(event) =>
              onChange?.(edge.id, {
                staminaCost:
                  event.target.value === "" ? null : Number(event.target.value),
              })
            }
            className="mt-1 w-full rounded-2xl border border-black/10 bg-white/80 px-3 py-2 text-sm outline-none transition focus:border-[color:var(--color-accent)]"
            placeholder="Optional cost"
          />
        </label>

        <div className="rounded-2xl border border-black/10 bg-white/55 p-3 text-xs text-[color:var(--color-muted)]">
          <div>Edge ID: {edge.id}</div>
          <div>Source: {edge.source}</div>
          <div>Target: {edge.target}</div>
        </div>
      </div>
    </aside>
  );
}
