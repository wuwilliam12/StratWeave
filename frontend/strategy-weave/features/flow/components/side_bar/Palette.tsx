"use client";

import React, { useEffect, useState } from "react";
import { fetchActions, type BoxerAction } from "@/lib/api";
import { FLOW_NODE_TYPE_OPTIONS } from "../nodes/nodeTypes";

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
  athlete_id?: string | null;
  athleteRole?: "user" | "opponent" | "neutral" | null;
};

const DEFAULT_ITEMS: NodePaletteItem[] = FLOW_NODE_TYPE_OPTIONS.map((option) => ({
  id: option.value,
  label: option.label,
  nodeType: option.value,
}));

export interface PaletteProps {
  title?: string | null;
  items?: NodePaletteItem[];
  onSelect?: (item: NodePaletteItem) => void;
  onDragStart?: (item: NodePaletteItem) => void;
  includeBoxingActions?: boolean;
}

export default function Palette({
  title = "Add node",
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

  const actionItems: NodePaletteItem[] = boxingActions.map((action) => ({
    id: action.id ?? `action-${action.name}`,
    label: action.name,
    nodeType: "action",
    sport: "boxing",
    action_id: action.id ?? null,
    athlete_id: null,
    athleteRole: "neutral",
  }));

  const allItems = [...items, ...actionItems];

  return (
    <div className="flex flex-col gap-1 bg-transparent p-2">
      {title ? (
        <h3 className="px-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {title}
        </h3>
      ) : null}
      <ul className="scrollbar-none flex flex-col gap-0.5 overflow-y-auto" role="listbox">
        {allItems.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSelect?.(item)}
              className="w-full rounded-xl px-2 py-1.5 text-left text-sm hover:bg-gray-200 dark:hover:bg-gray-800"
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
