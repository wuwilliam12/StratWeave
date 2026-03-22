"use client";

import React from "react";

import type { GraphHierarchySizing } from "@/lib/graphHierarchy";
import type { FlowNodeTypeOption } from "./nodeConstants";

export interface NodeHeaderProps {
  label?: string | null;
  athleteRole?: "user" | "opponent" | "neutral" | null;
  typeOption: FlowNodeTypeOption;
  sizing: GraphHierarchySizing;
  onEdit?: () => void;
}

export default function NodeHeader({
  label,
  athleteRole,
  typeOption,
  sizing,
  onEdit,
}: NodeHeaderProps) {
  const roleBadge =
    athleteRole === "user"
      ? {
          label: "User",
          className: "bg-sky-100 text-sky-700 border border-sky-200",
        }
      : athleteRole === "opponent"
        ? {
            label: "Opponent",
            className: "bg-rose-100 text-rose-700 border border-rose-200",
          }
        : null;

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <div
            className={`inline-flex rounded-full font-semibold uppercase tracking-[0.16em] ${sizing.chipSize} ${typeOption.tone.chip}`}
          >
            {typeOption.label}
          </div>
          {roleBadge ? (
            <div
              className={`inline-flex rounded-full font-semibold uppercase tracking-[0.16em] ${sizing.chipSize} ${roleBadge.className}`}
            >
              {roleBadge.label}
            </div>
          ) : null}
        </div>
        <div className={`mt-2 break-words font-semibold ${sizing.titleSize} ${sizing.titleLeading}`}>
          {label?.trim() || "Untitled node"}
        </div>
      </div>

      <button
        type="button"
        className="nodrag nopan rounded-full border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        onClick={onEdit}
      >
        Edit
      </button>
    </div>
  );
}
