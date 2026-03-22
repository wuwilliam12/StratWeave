import React, { useState } from "react";
import type { Edge, Node } from "reactflow";

import Explorer from "./Explorer";
import Palette, { type NodePaletteItem, type PaletteProps } from "./Palette";

type SideBarDropdown = {
  label: string;
  value: string;
  options?: string[];
  onChange?: (value: string) => void;
  disabled?: boolean;
};

type SideBarSectionProps = {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
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

function SideBarSection({
  title,
  defaultOpen = true,
  children,
}: SideBarSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="min-h-0 border-b border-gray-200 dark:border-gray-700">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between px-3 py-3 text-left text-sm font-semibold text-gray-900 transition hover:bg-gray-100/80 dark:text-gray-100 dark:hover:bg-slate-800/60"
        aria-expanded={open}
      >
        <span>{title}</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
          {open ? "Hide" : "Show"}
        </span>
      </button>

      {open && <div className="min-h-0">{children}</div>}
    </section>
  );
}

function DropdownField({
  label,
  value,
  options = [value],
  onChange,
  disabled = false,
}: SideBarDropdown) {
  return (
    <label className="flex min-w-0 flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        disabled={disabled}
        className="min-w-0 rounded-xl border border-gray-200 bg-white/80 px-3 py-2 text-sm font-medium normal-case tracking-normal text-gray-700 outline-none transition hover:border-gray-300 focus:border-gray-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900/70 dark:text-gray-200 dark:hover:bg-slate-800"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
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
    { label: "Scope", value: "Current graph", options: ["Current graph"], disabled: true },
    { label: "Sort", value: "Hierarchy", options: ["Hierarchy"], disabled: true },
  ],
}: SideBarProps) {
  return (
    <aside className="scrollbar-none flex h-full min-h-0 w-64 shrink-0 flex-col overflow-y-auto overflow-x-hidden border-r border-gray-200 bg-gray-50/95 dark:border-gray-700 dark:bg-gray-900/95">
      <div className="border-b border-gray-200 px-3 py-3 dark:border-gray-700">
        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </div>
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {subtitle}
        </div>
      </div>

      <div className="grid gap-2 border-b border-gray-200 p-3 dark:border-gray-700">
        {dropdowns.map((dropdown) => (
          <DropdownField key={dropdown.label} {...dropdown} />
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <SideBarSection title="Node Palette">
          <div className="scrollbar-none overflow-y-auto">
            <Palette
              title={null}
              items={paletteItems}
              onSelect={onSelectPaletteItem}
              includeBoxingActions={includeBoxingActions}
            />
          </div>
        </SideBarSection>

        <div className="min-h-0 flex-1">
          <SideBarSection title="Explorer">
            <div className="min-h-0">
              <Explorer
                title={null}
                nodes={nodes}
                edges={edges}
                selectedNodeIds={selectedNodeIds}
                onSelectNode={onSelectNode}
                search={search}
                onSearchChange={onSearchChange}
              />
            </div>
          </SideBarSection>
        </div>
      </div>
    </aside>
  );
}
