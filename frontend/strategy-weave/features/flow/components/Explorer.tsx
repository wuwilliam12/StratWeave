"use client";

import React from "react";
import type { Node, Edge } from "reactflow";

/**
 * Explorer: list/tree of nodes (and optionally edges) in the graph.
 * Use for overview, jump-to-node (focus/pan), and bulk actions.
 */
export interface ExplorerProps {
  nodes: Node[];
  edges?: Edge[];
  selectedNodeIds?: Set<string>;
  onSelectNode?: (nodeId: string) => void;
  /** Optional search/filter (controlled by parent if provided) */
  search?: string;
  onSearchChange?: (value: string) => void;
}

export default function Explorer({
  nodes,
  edges = [],
  selectedNodeIds = new Set(),
  onSelectNode,
  search = "",
  onSearchChange,
}: ExplorerProps) {
  const filteredNodes =
    search.trim() === ""
      ? nodes
      : nodes.filter((n) => {
          const label = (n.data?.label as string) ?? "";
          return label.toLowerCase().includes(search.trim().toLowerCase());
        });

  return (
    <div className="flex h-full min-h-0 flex-col border-r border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-gray-200 p-2 dark:border-gray-700">
        <h2 className="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
          Explorer
        </h2>
        {onSearchChange != null && (
          <input
            type="search"
            placeholder="Search nodes…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            aria-label="Search nodes"
          />
        )}
      </div>
      {/* Keep the node list independently scrollable inside the left rail. */}
      <ul className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-2" role="list">
        {filteredNodes.length === 0 ? (
          <li className="py-2 text-center text-sm text-gray-500">
            {nodes.length === 0 ? "No nodes" : "No matches"}
          </li>
        ) : (
          filteredNodes.map((node) => {
            const label = (node.data?.label as string) ?? node.id;
            const isSelected = selectedNodeIds.has(node.id);
            return (
              <li key={node.id}>
                <button
                  type="button"
                  onClick={() => onSelectNode?.(node.id)}
                  className={`w-full rounded px-2 py-1.5 text-left text-sm hover:bg-gray-200 dark:hover:bg-gray-600 ${
                    isSelected ? "bg-gray-200 dark:bg-gray-600" : ""
                  }`}
                >
                  {label || "(unnamed)"}
                </button>
              </li>
            );
          })
        )}
      </ul>
      {/* Optional: show edge count or groups (Strategies / Counters / etc.) */}
      {edges.length > 0 && (
        <div className="border-t border-gray-200 px-2 py-1 text-xs text-gray-500 dark:border-gray-700">
          {nodes.length} nodes · {edges.length} edges
        </div>
      )}
    </div>
  );
}
