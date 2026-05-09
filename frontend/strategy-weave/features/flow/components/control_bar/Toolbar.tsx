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
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border bg-surface px-2 py-2">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onAddNode}
          disabled={disabled}
          className="rounded px-2 py-1.5 text-sm font-medium text-foreground transition hover:bg-surface-strong disabled:opacity-50"
        >
          Add node
        </button>
        <button
          type="button"
          onClick={onDeleteSelected}
          disabled={disabled}
          className="rounded px-2 py-1.5 text-sm font-medium text-foreground transition hover:bg-surface-strong disabled:opacity-50"
        >
          Delete selected
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={disabled || saving}
          className="rounded bg-accent px-2 py-1.5 text-sm font-medium text-white transition hover:bg-accent-strong disabled:opacity-50"
        >
          {saving ? "Saving..." : saveLabel}
        </button>
      </div>
      {status != null && (
        <div className="text-sm text-muted">{status}</div>
      )}
    </div>
  );
}
