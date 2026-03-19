"use client";

import React from "react";
import type { Node, Edge } from "reactflow";
import {
  getNodeHierarchyLabel,
  getNodeHierarchyType,
  GRAPH_HIERARCHY_LEVELS,
} from "@/lib/graphHierarchy";

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

  const hierarchyBuckets = GRAPH_HIERARCHY_LEVELS.map((level) => ({
    ...level,
    nodes: filteredNodes.filter((node) => getNodeHierarchyType(node) === level.key),
  }));

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
      {/* Keep the hierarchy list independently scrollable inside the left rail. */}
      <ul className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-2" role="list">
        {filteredNodes.length === 0 ? (
          <li className="py-2 text-center text-sm text-gray-500">
            {nodes.length === 0 ? "No nodes" : "No matches"}
          </li>
        ) : (
          hierarchyBuckets.map((bucket, index) => (
            <li key={bucket.key} className={index === 0 ? "" : "mt-3"}>
              <div className="rounded border border-gray-200 bg-white/70 px-2 py-2 dark:border-gray-700 dark:bg-gray-900/40">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {bucket.label}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {bucket.helper}
                </p>

                <ul className="mt-2 space-y-1 border-l border-gray-200 pl-2 dark:border-gray-700">
                  {bucket.nodes.length === 0 ? (
                    <li className="py-1 text-xs text-gray-400 dark:text-gray-500">
                      No {bucket.label.toLowerCase()} entries yet.
                    </li>
                  ) : (
                    bucket.nodes.map((node) => {
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
                            {getNodeHierarchyLabel(node) || "(unnamed)"}
                          </button>
                        </li>
                      );
                    })
                  )}
                </ul>
              </div>
            </li>
          ))
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
