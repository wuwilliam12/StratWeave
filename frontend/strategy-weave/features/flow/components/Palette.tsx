"use client";

import React from "react";

/**
 * Node palette: list of node types (or "Add node") to add to the canvas.
 * Can be drag-source for drag-and-drop or click-to-add.
 */
export type NodePaletteItem = {
  id: string;
  label: string;
  nodeType?: string;
};

const DEFAULT_ITEMS: NodePaletteItem[] = [
  { id: "strategy", label: "Strategy", nodeType: "strategy" },
  { id: "counter", label: "Counter", nodeType: "counter" },
  { id: "approach", label: "Approach", nodeType: "approach" },
];

export interface PaletteProps {
  items?: NodePaletteItem[];
  onSelect?: (item: NodePaletteItem) => void;
  /** Drag start for DnD add (item + position set on drop) */
  onDragStart?: (item: NodePaletteItem) => void;
}

export default function Palette({
  items = DEFAULT_ITEMS,
  onSelect,
}: PaletteProps) {
  return (
    <div className="flex flex-col gap-1 border-r border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="px-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Add node
      </h3>
      <ul className="flex flex-col gap-0.5" role="listbox">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSelect?.(item)}
              className="w-full rounded px-2 py-1.5 text-left text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
              role="option"
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
