"use client";

import React from "react";
import type { Node } from "reactflow";

/**
 * Context menu shown on right-click on a node.
 * Actions: duplicate, delete, edit, add edge from this node, etc.
 */
export interface NodeContextMenuProps {
  node: Node;
  onEdit?: (node: Node) => void;
  onDuplicate?: (node: Node) => void;
  onDelete?: (node: Node) => void;
  onClose?: () => void;
}

export default function NodeContextMenu({
  node,
  onEdit,
  onDuplicate,
  onDelete,
  onClose,
}: NodeContextMenuProps) {
  const handleEdit = () => {
    onEdit?.(node);
    onClose?.();
  };

  const handleDuplicate = () => {
    onDuplicate?.(node);
    onClose?.();
  };

  const handleDelete = () => {
    onDelete?.(node);
    onClose?.();
  };

  return (
    <div
      className="min-w-[160px] rounded border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
      role="menu"
    >
      <button
        type="button"
        onClick={handleEdit}
        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
        role="menuitem"
      >
        Edit node
      </button>
      <button
        type="button"
        onClick={handleDuplicate}
        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
        role="menuitem"
      >
        Duplicate node
      </button>
      <button
        type="button"
        onClick={handleDelete}
        className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
        role="menuitem"
      >
        Delete node
      </button>
    </div>
  );
}
