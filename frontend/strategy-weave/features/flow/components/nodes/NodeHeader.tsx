"use client";

import React from "react";

import type { FlowNodeTypeOption } from "./nodeConstants";

export interface NodeHeaderProps {
  label?: string | null;
  typeOption: FlowNodeTypeOption;
  onEdit?: () => void;
}

export default function NodeHeader({
  label,
  typeOption,
  onEdit,
}: NodeHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div
          className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${typeOption.tone.chip}`}
        >
          {typeOption.label}
        </div>
        <div className="mt-2 break-words text-sm font-semibold leading-5">
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
