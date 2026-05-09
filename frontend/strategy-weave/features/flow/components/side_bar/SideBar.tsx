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
  warnings?: string[];
}

function SideBarSection({
  title,
  defaultOpen = true,
  children,
}: SideBarSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="min-h-0 border-b border-border">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between px-3 py-3 text-left text-sm font-semibold text-foreground transition hover:bg-surface-strong"
        aria-expanded={open}
      >
        <span>{title}</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted">
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
    <label className="flex min-w-0 flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-muted">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        disabled={disabled}
        className="min-w-0 rounded-xl border border-border bg-surface px-3 py-2 text-sm font-medium normal-case tracking-normal text-foreground outline-none transition hover:bg-surface-strong focus:border-accent disabled:cursor-not-allowed disabled:opacity-50"
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
  warnings = [],
}: SideBarProps) {
  return (
    <aside className="scrollbar-none flex h-full min-h-0 w-64 shrink-0 flex-col overflow-y-auto overflow-x-hidden border-r border-border bg-surface">
      <div className="border-b border-border px-3 py-3">
        <div className="text-sm font-semibold text-foreground">
          {title}
        </div>
        <div className="mt-1 text-xs text-muted">
          {subtitle}
        </div>
      </div>

      <div className="grid gap-2 border-b border-border p-3">
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

        <SideBarSection title={`Warnings (${warnings.length})`} defaultOpen={warnings.length > 0}>
          <ul className="space-y-2 p-3 text-xs text-muted">
            {warnings.length === 0 ? (
              <li className="rounded-xl border border-border bg-surface-strong px-2 py-1.5">
                No structural warnings.
              </li>
            ) : (
              warnings.slice(0, 8).map((warning) => (
                <li
                  key={warning}
                  className="rounded-xl border border-border bg-surface-strong px-2 py-1.5"
                >
                  {warning}
                </li>
              ))
            )}
          </ul>
        </SideBarSection>
      </div>
    </aside>
  );
}
