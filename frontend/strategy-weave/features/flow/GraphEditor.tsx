"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  StrategyNode,
  NodeInspector,
  CUSTOM_FLOW_NODE_TYPE,
} from "./components";
import type { NodePaletteItem } from "./components";
import type { FlowNodeData } from "@/lib/graphConvert";

const defaultNodes: Node[] = [
  {
    id: "1",
    type: CUSTOM_FLOW_NODE_TYPE,
    position: { x: 0, y: 0 },
    data: { label: "Pressure strategy", nodeType: "strategy" },
  },
  {
    id: "2",
    type: CUSTOM_FLOW_NODE_TYPE,
    position: { x: 280, y: 0 },
    data: { label: "Rope exchange scenario", nodeType: "scenario" },
  },
  {
    id: "3",
    type: CUSTOM_FLOW_NODE_TYPE,
    position: { x: 140, y: 120 },
    data: { label: "Jab-slip-counter flow", nodeType: "sequence" },
  },
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

function attachNodeEditor(
  nodes: Node[],
  onEdit: (nodeId: string) => void,
): Node[] {
  return nodes.map((node) => ({
    ...node,
    type: CUSTOM_FLOW_NODE_TYPE,
    data: {
      ...(node.data as FlowNodeData | undefined),
      onEdit,
    },
  }));
}

function mergeFrontendNodeData(
  nextNodes: Node[],
  currentNodes: Node[],
): Node[] {
  const currentNodeData = new Map(
    currentNodes.map((node) => [node.id, (node.data ?? {}) as FlowNodeData]),
  );

  return nextNodes.map((node) => {
    const currentData = currentNodeData.get(node.id);

    if (!currentData) {
      return node;
    }

    return {
      ...node,
      data: {
        ...(node.data as FlowNodeData | undefined),
        details:
          currentData.details ??
          (node.data as FlowNodeData | undefined)?.details,
      },
    };
  });
}

/**
 * Inside ReactFlow: provides addNodeAtScreenPosition to parent via ref
 * so canvas context menu can add a node at the click position (flow coords).
 */
function FlowHelpers({
  setNodes,
  addNodeAtScreenRef,
  markDirty,
  onEdit,
}: {
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  addNodeAtScreenRef: React.MutableRefObject<((clientX: number, clientY: number) => void) | null>;
  markDirty: () => void;
  onEdit: (nodeId: string) => void;
}) {
  const { screenToFlowPosition } = useReactFlow();

  useEffect(() => {
    addNodeAtScreenRef.current = (clientX: number, clientY: number) => {
      const flowPos = screenToFlowPosition({ x: clientX, y: clientY });
      setNodes((nds) => [
        ...nds,
        {
          id: nextNodeId(),
          type: CUSTOM_FLOW_NODE_TYPE,
          position: flowPos,
          data: { label: "New node", nodeType: "node", details: "", onEdit },
        },
      ]);
      markDirty();
    };
    return () => {
      addNodeAtScreenRef.current = null;
    };
  }, [screenToFlowPosition, setNodes, addNodeAtScreenRef, markDirty, onEdit]);

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
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

  // Context menus: screen position and optional node for node menu
  const [canvasMenu, setCanvasMenu] = useState<{ x: number; y: number } | null>(null);
  const [nodeMenu, setNodeMenu] = useState<{ node: Node; x: number; y: number } | null>(null);

  const addNodeAtScreenRef = useRef<((clientX: number, clientY: number) => void) | null>(null);

  const markDirty = useCallback(() => setDirty(true), []);
  const handleOpenNodeEditor = useCallback((nodeId: string) => {
    setEditingNodeId(nodeId);
  }, []);
  const nodeTypes = useMemo(() => ({ [CUSTOM_FLOW_NODE_TYPE]: StrategyNode }), []);

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
          setNodes((currentNodes) =>
            attachNodeEditor(
              mergeFrontendNodeData(toFlowNodes(payload.nodes), currentNodes),
              handleOpenNodeEditor,
            ),
          );
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
  }, [setNodes, setEdges, handleOpenNodeEditor]);

  useEffect(() => {
    setNodes((existingNodes) => attachNodeEditor(existingNodes, handleOpenNodeEditor));
  }, [handleOpenNodeEditor, setNodes]);

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
        setNodes((currentNodes) =>
          attachNodeEditor(
            mergeFrontendNodeData(toFlowNodes(payload.nodes), currentNodes),
            handleOpenNodeEditor,
          ),
        );
        setEdges(toFlowEdges(payload.edges));
        setDirty(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to save graph");
      })
      .finally(() => setSaving(false));
  }, [nodes, edges, setNodes, setEdges, handleOpenNodeEditor]);

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
          type: CUSTOM_FLOW_NODE_TYPE,
          position: { x: 150 + nds.length * 30, y: 150 },
          data: { label: "New node", nodeType: "node", onEdit: handleOpenNodeEditor },
        },
      ]);
      markDirty();
    },
    [setNodes, markDirty, handleOpenNodeEditor],
  );

  const handleAddNodeFromPalette = useCallback(
    (item: NodePaletteItem) => {
      setNodes((nds) => [
        ...nds,
        {
          id: nextNodeId(),
          type: CUSTOM_FLOW_NODE_TYPE,
          position: { x: 150 + nds.length * 30, y: 150 },
          data: {
            label: item.label,
            nodeType: item.nodeType,
            details: "",
            sport: item.sport ?? null,
            action_id: item.action_id ?? null,
            boxer_id: item.boxer_id ?? null,
            onEdit: handleOpenNodeEditor,
          },
        },
      ]);
      markDirty();
    },
    [setNodes, markDirty, handleOpenNodeEditor],
  );

  const handleDeleteSelected = useCallback(() => {
    setNodes((nds) => {
      const deletedNodeIds = new Set(
        nds.filter((node) => node.selected).map((node) => node.id),
      );

      setEditingNodeId((current) =>
        current && deletedNodeIds.has(current) ? null : current,
      );

      return nds.filter((node) => !node.selected);
    });
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
      setEditingNodeId((current) => (current === node.id ? null : current));
      markDirty();
    },
    [setNodes, setEdges, markDirty],
  );

  const handleUpdateNode = useCallback(
    (
      nodeId: string,
      patch: Partial<Pick<FlowNodeData, "label" | "details" | "nodeType">>,
    ) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...(node.data as FlowNodeData),
                  ...patch,
                  onEdit: handleOpenNodeEditor,
                },
              }
            : node,
        ),
      );
      markDirty();
    },
    [setNodes, markDirty, handleOpenNodeEditor],
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
  const editingNode =
    nodes.find((node) => node.id === editingNodeId) ?? null;

  const toolbarStatus = error ?? (dirty ? "Unsaved" : "Saved");

  /* Show loading indicator */
  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center text-gray-500">
        Loading graph...
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      {/* Control bar - top row */}
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
            nodeTypes={nodeTypes}
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
            <FlowHelpers
              setNodes={setNodes}
              addNodeAtScreenRef={addNodeAtScreenRef}
              markDirty={markDirty}
              onEdit={handleOpenNodeEditor}
            />
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
                onEdit={(node) => handleOpenNodeEditor(node.id)}
                onDuplicate={handleDuplicateNode}
                onDelete={handleDeleteNode}
                onClose={() => setNodeMenu(null)}
              />
            </div>
          )}

          <NodeInspector
            node={editingNode}
            onClose={() => setEditingNodeId(null)}
            onChange={handleUpdateNode}
          />
        </main>
      </div>
    </div>
  );
}
