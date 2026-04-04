"use client";

import React, { useEffect, useState } from "react";
import { fetchActions, fetchBagItems, type BoxerAction, type BoxingBagItem } from "@/lib/api";
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
  const [bagItems, setBagItems] = useState<BoxingBagItem[]>([]);

  useEffect(() => {
    if (!includeBoxingActions) return;
    fetchActions()
      .then(setBoxingActions)
      .catch(() => setBoxingActions([]));

    fetchBagItems()
      .then(setBagItems)
      .catch(() => setBagItems([]));
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

  const bagItemsForPalette: NodePaletteItem[] = bagItems.map((bag) => ({
    id: bag.id ?? `bag-${bag.name}`,
    label: `${bag.name}${bag.mastery ? ` [${bag.mastery}]` : ""}`,
    nodeType: "bag",
    sport: "boxing",
    action_id: bag.action_id ?? null,
    athlete_id: null,
    athleteRole: "neutral",
  }));

  const bagGroups = bagItems.reduce<Record<string, BoxingBagItem[]>>((acc, item) => {
    const group = item.group?.trim() || "Ungrouped";
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});

  const allItems = [...items, ...actionItems, ...bagItemsForPalette];

  return (
    <div className="flex flex-col gap-1 bg-transparent p-2">
      {title ? (
        <h3 className="px-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {title}
        </h3>
      ) : null}
      {Object.keys(bagGroups).length > 0 ? (
        <section className="border-b border-gray-200 pb-2 dark:border-gray-700">
          <h4 className="px-1 text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
            Bag / Training Tools
          </h4>
          {Object.entries(bagGroups).map(([group, items]) => (
            <div key={group} className="mt-1">
              <p className="px-1 text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">{group}</p>
              <ul className="scrollbar-none flex flex-col gap-0.5" role="listbox">
                {items.map((bag) => (
                  <li key={bag.id ?? bag.name}>
                    <button
                      type="button"
                      onClick={() =>
                        onSelect?.({
                          id: bag.id ?? `bag-${bag.name}`,
                          label: `${bag.name}${bag.mastery ? ` [${bag.mastery}]` : ""}`,
                          nodeType: "bag",
                          sport: "boxing",
                          action_id: bag.action_id ?? null,
                          athlete_id: null,
                          athleteRole: "neutral",
                        })
                      }
                      className="w-full rounded-xl px-2 py-1.5 text-left text-sm hover:bg-gray-200 dark:hover:bg-gray-800"
                      role="option"
                      aria-selected="false"
                    >
                      {bag.name} {bag.mastery ? `• ${bag.mastery}` : ""}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
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
