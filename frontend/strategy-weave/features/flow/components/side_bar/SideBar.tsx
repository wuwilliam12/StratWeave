import React from "react";
import type { Edge, Node } from "reactflow";

import Explorer from "./Explorer";
import Palette, { type NodePaletteItem, type PaletteProps } from "./Palette";

type SideBarDropdown = {
  label: string;
  value: string;
  onClick?: () => void;
  disabled?: boolean;
};

export interface SideBarProps {
  title?: string;
  subtitle?: string;
  nodes: Node[];
  edges?: Edge[];
  selectedNodeIds?: Set<string>;
  search?: string;
  onSearchChange?: (value: string) => void;
  onSelectNode?: (nodeId: string) => void;
  onSelectPaletteItem?: (item: NodePaletteItem) => void;
  paletteItems?: PaletteProps["items"];
  includeBoxingActions?: boolean;
  dropdowns?: SideBarDropdown[];
}

function DropdownButton({
  label,
  value,
  onClick,
  disabled = false,
}: SideBarDropdown) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex min-w-0 items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white/80 px-3 py-2 text-left text-xs text-gray-600 transition hover:border-gray-300 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900/70 dark:text-gray-300 dark:hover:bg-slate-800"
    >
      <span className="truncate font-semibold">{label}</span>
      <span className="truncate text-gray-400 dark:text-gray-500">{value}</span>
    </button>
  );
}

export default function SideBar({
  title = "Canvas library",
  subtitle = "Browse node types, inspect hierarchy, and jump through the graph.",
  nodes,
  edges = [],
  selectedNodeIds,
  search,
  onSearchChange,
  onSelectNode,
  onSelectPaletteItem,
  paletteItems,
  includeBoxingActions = true,
  dropdowns = [
    { label: "Scope", value: "Current graph", disabled: true },
    { label: "Sort", value: "Hierarchy", disabled: true },
  ],
}: SideBarProps) {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-gray-200 bg-gray-50/95 dark:border-gray-700 dark:bg-gray-900/95">
      <div className="border-b border-gray-200 px-3 py-3 dark:border-gray-700">
        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </div>
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {subtitle}
        </div>
      </div>

      {/* Dropdown menus */}
      <div className="grid gap-2 border-b border-gray-200 p-3 dark:border-gray-700">
        {dropdowns.map((dropdown) => (
          <DropdownButton key={dropdown.label} {...dropdown} />
        ))}
      </div>

      {/* Node Palette */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <Palette
          items={paletteItems}
          onSelect={onSelectPaletteItem}
          includeBoxingActions={includeBoxingActions}
        />
      </div>

      {/* Explorer */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <Explorer
          nodes={nodes}
          edges={edges}
          selectedNodeIds={selectedNodeIds}
          onSelectNode={onSelectNode}
          search={search}
          onSearchChange={onSearchChange}
        />
      </div>
    </aside>
  );
}
