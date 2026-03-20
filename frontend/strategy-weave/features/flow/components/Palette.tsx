"use client";

import React, { useEffect, useState } from "react";
import { fetchActions, type BoxerAction } from "@/lib/api";
import { FLOW_NODE_TYPE_OPTIONS } from "../nodeTypes";

/**
 * Node palette: list of node types (or "Add node") to add to the canvas.
 * Can include sport entities (boxing actions) to link nodes to models.
 */
export type NodePaletteItem = {
  id: string;
  label: string;
  nodeType?: string;
  sport?: string;
  action_id?: string | null;
  boxer_id?: string | null;
};

const DEFAULT_ITEMS: NodePaletteItem[] = FLOW_NODE_TYPE_OPTIONS.map((option) => ({
  id: option.value,
  label: option.label,
  nodeType: option.value,
}));

export interface PaletteProps {
  items?: NodePaletteItem[];
  onSelect?: (item: NodePaletteItem) => void;
  /** Drag start for DnD add (item + position set on drop) */
  onDragStart?: (item: NodePaletteItem) => void;
  /** Include boxing actions from API (default: true) */
  includeBoxingActions?: boolean;
}

export default function Palette({
  items = DEFAULT_ITEMS,
  onSelect,
  includeBoxingActions = true,
}: PaletteProps) {
  const [boxingActions, setBoxingActions] = useState<BoxerAction[]>([]);

  useEffect(() => {
    if (!includeBoxingActions) return;
    fetchActions()
      .then(setBoxingActions)
      .catch(() => setBoxingActions([]));
  }, [includeBoxingActions]);

  const actionItems: NodePaletteItem[] = boxingActions.map((a) => ({
    id: a.id ?? `action-${a.name}`,
    label: a.name,
    nodeType: "action",
    sport: "boxing",
    action_id: a.id ?? null,
    boxer_id: null,
  }));

  const allItems = [...items, ...actionItems];

  return (
    <div className="flex flex-col gap-1 border-r border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="px-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Add node
      </h3>
      <ul className="flex flex-col gap-0.5" role="listbox">
        {allItems.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSelect?.(item)}
              className="w-full rounded px-2 py-1.5 text-left text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
              role="option"
              aria-selected="false"
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
