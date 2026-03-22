"use client";

import React from "react";

/**
 * Top toolbar: primary actions (add node, delete selected, save).
 * Optional status slot on the right for save state / errors.
 */
export interface ToolbarProps {
  onAddNode?: () => void;
  onDeleteSelected?: () => void;
  onSave?: () => void;
  saveLabel?: string;
  saving?: boolean;
  disabled?: boolean;
  /** Optional status message or indicator (e.g. "Saved" / "Unsaved") */
  status?: React.ReactNode;
}

export default function Toolbar({
  onAddNode,
  onDeleteSelected,
  onSave,
  saveLabel = "Save",
  saving = false,
  disabled = false,
  status,
}: ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-gray-200 bg-white/80 px-2 py-2 dark:border-gray-700 dark:bg-slate-900/80">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onAddNode}
          disabled={disabled}
          className="rounded px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Add node
        </button>
        <button
          type="button"
          onClick={onDeleteSelected}
          disabled={disabled}
          className="rounded px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Delete selected
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={disabled || saving}
          className="rounded bg-gray-800 px-2 py-1.5 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300"
        >
          {saving ? "Saving..." : saveLabel}
        </button>
      </div>
      {status != null && (
        <div className="text-sm text-gray-500 dark:text-gray-400">{status}</div>
      )}
    </div>
  );
}
