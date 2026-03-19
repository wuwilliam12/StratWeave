"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Connection,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
} from "reactflow";

import "reactflow/dist/style.css";

import { fetchGraph, saveGraph } from "@/lib/api";
import {
  toFlowNodes,
  toFlowEdges,
  toApiNodes,
  toApiEdges,
} from "@/lib/graphConvert";
import {
  Toolbar,
  Palette,
  Explorer,
  CanvasContextMenu,
  NodeContextMenu,
} from "./components";
import type { NodePaletteItem } from "./components";

const defaultNodes: Node[] = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "Aggressive jab" } },
  { id: "2", position: { x: 280, y: 0 }, data: { label: "Defensive clinching" } },
  { id: "3", position: { x: 140, y: 120 }, data: { label: "Counter-punch" } },
];

const defaultEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", data: { label: "counters" } },
  { id: "e2-3", source: "2", target: "3", data: { label: "leads to" } },
  { id: "e3-1", source: "3", target: "1", data: { label: "counters" } },
];

/** Generates a unique node id. */
function nextNodeId(): string {
  return `node-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Inside ReactFlow: provides addNodeAtScreenPosition to parent via ref
 * so canvas context menu can add a node at the click position (flow coords).
 */
function FlowHelpers({
  setNodes,
  addNodeAtScreenRef,
  markDirty,
}: {
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  addNodeAtScreenRef: React.MutableRefObject<((clientX: number, clientY: number) => void) | null>;
  markDirty: () => void;
}) {
  const { screenToFlowPosition } = useReactFlow();

  useEffect(() => {
    addNodeAtScreenRef.current = (clientX: number, clientY: number) => {
      const flowPos = screenToFlowPosition({ x: clientX, y: clientY });
      setNodes((nds) => [
        ...nds,
        {
          id: nextNodeId(),
          position: flowPos,
          data: { label: "New node" },
        },
      ]);
      markDirty();
    };
    return () => {
      addNodeAtScreenRef.current = null;
    };
  }, [screenToFlowPosition, setNodes, addNodeAtScreenRef, markDirty]);

  return null;
}

export default function GraphEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(defaultEdges);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [explorerSearch, setExplorerSearch] = useState("");

  // Context menus: screen position and optional node for node menu
  const [canvasMenu, setCanvasMenu] = useState<{ x: number; y: number } | null>(null);
  const [nodeMenu, setNodeMenu] = useState<{ node: Node; x: number; y: number } | null>(null);

  const addNodeAtScreenRef = useRef<((clientX: number, clientY: number) => void) | null>(null);

  const markDirty = useCallback(() => setDirty(true), []);

  const onNodesChangeWithDirty = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);
      const hasDataChange = changes.some((c) => c.type !== "select");
      if (hasDataChange) markDirty();
    },
    [onNodesChange, markDirty],
  );
  const onEdgesChangeWithDirty = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChange(changes);
      const hasDataChange = changes.some((c) => c.type !== "select");
      if (hasDataChange) markDirty();
    },
    [onEdgesChange, markDirty],
  );

  // Load graph from backend
  useEffect(() => {
    let cancelled = false;
    fetchGraph()
      .then((payload) => {
        if (cancelled) return;
        if (payload.nodes.length > 0 || payload.edges.length > 0) {
          setNodes(toFlowNodes(payload.nodes));
          setEdges(toFlowEdges(payload.edges));
        }
        setDirty(false);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load graph");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [setNodes, setEdges]);

  // Close context menus on click outside
  useEffect(() => {
    if (!canvasMenu && !nodeMenu) return;
    const handleClose = () => {
      setCanvasMenu(null);
      setNodeMenu(null);
    };
    window.addEventListener("click", handleClose);
    return () => window.removeEventListener("click", handleClose);
  }, [canvasMenu, nodeMenu]);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
      markDirty();
    },
    [setEdges, markDirty],
  );

  const handleSave = useCallback(() => {
    setSaving(true);
    setError(null);
    saveGraph({
      nodes: toApiNodes(nodes),
      edges: toApiEdges(edges),
    })
      .then((payload) => {
        setNodes(toFlowNodes(payload.nodes));
        setEdges(toFlowEdges(payload.edges));
        setDirty(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to save graph");
      })
      .finally(() => setSaving(false));
  }, [nodes, edges, setNodes, setEdges]);

  const handleAddNode = useCallback(
    (position?: { x: number; y: number }) => {
      if (position != null && addNodeAtScreenRef.current) {
        addNodeAtScreenRef.current(position.x, position.y);
        markDirty();
        return;
      }
      setNodes((nds) => [
        ...nds,
        {
          id: nextNodeId(),
          position: { x: 150 + nds.length * 30, y: 150 },
          data: { label: "New node" },
        },
      ]);
      markDirty();
    },
    [setNodes, markDirty],
  );

  const handleAddNodeFromPalette = useCallback(
    (item: NodePaletteItem) => {
      setNodes((nds) => [
        ...nds,
        {
          id: nextNodeId(),
          position: { x: 150 + nds.length * 30, y: 150 },
          data: {
            label: item.label,
            nodeType: item.nodeType,
            sport: item.sport ?? null,
            action_id: item.action_id ?? null,
            boxer_id: item.boxer_id ?? null,
          },
        },
      ]);
      markDirty();
    },
    [setNodes, markDirty],
  );

  const handleDeleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter((n) => !n.selected));
    setEdges((eds) => eds.filter((e) => !e.selected));
    markDirty();
  }, [setNodes, setEdges, markDirty]);

  const handleDuplicateNode = useCallback(
    (node: Node) => {
      const id = nextNodeId();
      setNodes((nds) => [
        ...nds,
        {
          ...node,
          id,
          position: {
            x: (node.position?.x ?? 0) + 20,
            y: (node.position?.y ?? 0) + 20,
          },
          selected: false,
        },
      ]);
      markDirty();
    },
    [setNodes, markDirty],
  );

  const handleDeleteNode = useCallback(
    (node: Node) => {
      setNodes((nds) => nds.filter((n) => n.id !== node.id));
      setEdges((eds) =>
        eds.filter((e) => e.source !== node.id && e.target !== node.id),
      );
      markDirty();
    },
    [setNodes, setEdges, markDirty],
  );

  const handleCanvasAddNode = useCallback(
    (position: { x: number; y: number }) => {
      if (addNodeAtScreenRef.current) {
        addNodeAtScreenRef.current(position.x, position.y);
      } else {
        handleAddNode();
      }
      setCanvasMenu(null);
    },
    [handleAddNode],
  );

  const handleSelectNodeInExplorer = useCallback(
    (nodeId: string) => {
      setNodes((nds) =>
        nds.map((n) => ({ ...n, selected: n.id === nodeId })),
      );
    },
    [setNodes],
  );

  const selectedNodeIds = new Set(
    nodes.filter((n) => n.selected).map((n) => n.id),
  );

  const toolbarStatus = error ?? (dirty ? "Unsaved" : "Saved");

  {/* Show loading indicator */}
  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center text-gray-500">
        Loading graph…
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      {/* ToolBar */}
      <Toolbar
        onAddNode={() => handleAddNode()}
        onDeleteSelected={handleDeleteSelected}
        onSave={handleSave}
        saveLabel="Save graph"
        saving={saving}
        status={
          <span className={error ? "text-red-600" : ""} role={error ? "alert" : undefined}>
            {toolbarStatus}
          </span>
        }
      />

      {/* Main body section */}
      <div className="flex flex-1 min-h-0">
        {/* Left column - Palette/Explorer*/}
        <aside className="flex w-56 shrink-0 flex-col border-r border-gray-200 dark:border-gray-700">
          <Palette onSelect={handleAddNodeFromPalette} />
          {/* This wrapper gives Explorer a bounded height so its own scrollbar can engage. */}
          <div className="flex-1 overflow-hidden">
            <Explorer
              nodes={nodes}
              edges={edges}
              selectedNodeIds={selectedNodeIds}
              onSelectNode={handleSelectNodeInExplorer}
              search={explorerSearch}
              onSearchChange={setExplorerSearch}
            />
          </div>
        </aside>

        {/* Right column - Flow/Graph area */}
        <main className="relative flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChangeWithDirty}
            onEdgesChange={onEdgesChangeWithDirty}
            onConnect={onConnect}
            onPaneContextMenu={(e) => {
              e.preventDefault();
              setCanvasMenu({ x: e.clientX, y: e.clientY });
              setNodeMenu(null);
            }}
            onNodeContextMenu={(e, node) => {
              e.preventDefault();
              setNodeMenu({ node, x: e.clientX, y: e.clientY });
              setCanvasMenu(null);
            }}
            fitView
          >
            <FlowHelpers setNodes={setNodes} addNodeAtScreenRef={addNodeAtScreenRef} markDirty={markDirty} />
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>

          {canvasMenu && (
            <div
              className="fixed z-50"
              style={{ left: canvasMenu.x, top: canvasMenu.y }}
              onClick={(e) => e.stopPropagation()}
            >
              <CanvasContextMenu
                x={canvasMenu.x}
                y={canvasMenu.y}
                onAddNode={handleCanvasAddNode}
                onClose={() => setCanvasMenu(null)}
              />
            </div>
          )}

          {nodeMenu && (
            <div
              className="fixed z-50"
              style={{ left: nodeMenu.x, top: nodeMenu.y }}
              onClick={(e) => e.stopPropagation()}
            >
              <NodeContextMenu
                node={nodeMenu.node}
                x={nodeMenu.x}
                y={nodeMenu.y}
                onDuplicate={handleDuplicateNode}
                onDelete={handleDeleteNode}
                onClose={() => setNodeMenu(null)}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
