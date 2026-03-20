"use client";

import React from "react";

/**
 * Context menu shown on right-click on the canvas (empty area).
 * Actions: add node at click position, etc.
 */
export interface CanvasContextMenuProps {
  x: number;
  y: number;
  onAddNode?: (position: { x: number; y: number }) => void;
  onClose?: () => void;
}

export default function CanvasContextMenu({
  x,
  y,
  onAddNode,
  onClose,
}: CanvasContextMenuProps) {
  const handleAddNode = () => {
    onAddNode?.({ x, y });
    onClose?.();
  };

  return (
    <div
      className="min-w-[160px] rounded border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
      role="menu"
    >
      {/* Add node */}
      <button
        type="button"
        onClick={handleAddNode}
        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
        role="menuitem"
      >
        Add node
      </button>
      {/* Future: Add edge (from here?), Delete selection, etc. */}

      {/* Add edge */}

      {/* Delete selection */}

      {/* Bookmark */}


    </div>
  );
}
