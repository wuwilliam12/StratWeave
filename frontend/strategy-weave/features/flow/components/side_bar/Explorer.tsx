"use client";

import React from "react";
import type { Edge, Node } from "reactflow";
import {
  getNodeHierarchyLabel,
  getNodeHierarchyType,
  getNodeParentId,
} from "@/lib/graphHierarchy";

/**
 * Explorer: list/tree of nodes (and optionally edges) in the graph.
 * Use for overview, jump-to-node (focus/pan), and bulk actions.
 */
export interface ExplorerProps {
  title?: string | null;
  nodes: Node[];
  edges?: Edge[];
  selectedNodeIds?: Set<string>;
  onSelectNode?: (nodeId: string) => void;
  search?: string;
  onSearchChange?: (value: string) => void;
}

export default function Explorer({
  title = "Explorer",
  nodes,
  edges = [],
  selectedNodeIds = new Set(),
  onSelectNode,
  search = "",
  onSearchChange,
}: ExplorerProps) {
  const query = search.trim().toLowerCase();
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const childrenByParentId = new Map<string | null, Node[]>();

  for (const node of nodes) {
    const parentId = getNodeParentId(node);
    const bucket = childrenByParentId.get(parentId) ?? [];
    bucket.push(node);
    childrenByParentId.set(parentId, bucket);
  }

  const visibleNodeIds = new Set<string>();
  for (const node of nodes) {
    const label = getNodeHierarchyLabel(node).toLowerCase();
    if (query !== "" && !label.includes(query)) continue;

    visibleNodeIds.add(node.id);

    let currentParentId = getNodeParentId(node);
    while (currentParentId) {
      visibleNodeIds.add(currentParentId);
      const parentNode = nodesById.get(currentParentId);
      if (!parentNode) break;
      currentParentId = getNodeParentId(parentNode);
    }
  }

  const rootNodes = nodes.filter((node) => {
    const parentId = getNodeParentId(node);
    return !parentId || !nodesById.has(parentId);
  });

  const renderTree = (node: Node, depth = 0): React.ReactNode => {
    if (query !== "" && !visibleNodeIds.has(node.id)) return null;

    const children = (childrenByParentId.get(node.id) ?? [])
      .filter((child) => child.id !== node.id)
      .sort((left, right) =>
        getNodeHierarchyLabel(left).localeCompare(getNodeHierarchyLabel(right)),
      );
    const isSelected = selectedNodeIds.has(node.id);

    return (
      <li key={node.id} className={depth === 0 ? "" : "mt-1"}>
        <button
          type="button"
          onClick={() => onSelectNode?.(node.id)}
          className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm hover:bg-gray-200 dark:hover:bg-gray-600 ${
            isSelected ? "bg-gray-200 dark:bg-gray-600" : ""
          }`}
          style={{ paddingLeft: `${depth * 14 + 8}px` }}
        >
          <span className="truncate">{getNodeHierarchyLabel(node) || "(unnamed)"}</span>
          <span className="ml-2 shrink-0 text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {getNodeHierarchyType(node)}
          </span>
        </button>

        {children.length > 0 && (
          <ul className="border-l border-gray-200 pl-1 dark:border-gray-700">
            {children.map((child) => renderTree(child, depth + 1))}
          </ul>
        )}
      </li>
    );
  };

  const hasVisibleNodes =
    query === ""
      ? rootNodes.length > 0
      : rootNodes.some((node) => visibleNodeIds.has(node.id));

  return (
    <div className="flex h-full min-h-0 flex-col bg-transparent">
      <div className="border-b border-gray-200 p-2 dark:border-gray-700">
        {title ? (
          <h2 className="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
            {title}
          </h2>
        ) : null}
        {onSearchChange != null && (
          <input
            type="search"
            placeholder="Search nodes..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            aria-label="Search nodes"
          />
        )}
      </div>
      <ul className="scrollbar-none min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-2" role="list">
        {!hasVisibleNodes ? (
          <li className="py-2 text-center text-sm text-gray-500">
            {nodes.length === 0 ? "No nodes" : "No matches"}
          </li>
        ) : (
          rootNodes
            .sort((left, right) =>
              getNodeHierarchyLabel(left).localeCompare(getNodeHierarchyLabel(right)),
            )
            .map((node) => renderTree(node))
        )}
      </ul>
      {edges.length > 0 && (
        <div className="border-t border-gray-200 px-2 py-1 text-xs text-gray-500 dark:border-gray-700">
          {nodes.length} nodes - {edges.length} edges
        </div>
      )}
    </div>
  );
}
