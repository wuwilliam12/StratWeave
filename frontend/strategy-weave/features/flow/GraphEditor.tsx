"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
} from "reactflow";

import { fetchGraph, saveGraph } from "@/lib/api";
import {
  toFlowNodes,
  toFlowEdges,
  toApiNodes,
  toApiEdges,
} from "@/lib/graphConvert";
import {
  ControlBar,
  SideBar,
  GraphCanvas,
  ActionEdgeCard,
  StrategyNode,
  CUSTOM_FLOW_EDGE_TYPE,
  CUSTOM_FLOW_NODE_TYPE,
} from "./components";
import type { NodePaletteItem } from "./components";
import type { FlowEdgeData, FlowNodeData } from "@/lib/graphConvert";

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
  {
    id: "e1-2",
    type: CUSTOM_FLOW_EDGE_TYPE,
    source: "1",
    target: "2",
    data: { label: "Cut off escape", staminaCost: 1 } as FlowEdgeData,
  },
  {
    id: "e2-3",
    type: CUSTOM_FLOW_EDGE_TYPE,
    source: "2",
    target: "3",
    data: { label: "Slip into counter", probability: 0.62 } as FlowEdgeData,
  },
  {
    id: "e3-1",
    type: CUSTOM_FLOW_EDGE_TYPE,
    source: "3",
    target: "1",
    data: { label: "Reset pressure" } as FlowEdgeData,
  },
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

export default function GraphEditor() {
  const router = useRouter();
  const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(defaultEdges);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [explorerSearch, setExplorerSearch] = useState("");
  const [editingEdgeId, setEditingEdgeId] = useState<string | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

  const markDirty = useCallback(() => setDirty(true), []);
  const handleOpenNodeEditor = useCallback((nodeId: string) => {
    setEditingEdgeId(null);
    setEditingNodeId(nodeId);
  }, []);
  const handleOpenEdgeEditor = useCallback((edgeId: string) => {
    setEditingNodeId(null);
    setEditingEdgeId(edgeId);
  }, []);
  const nodeTypes = useMemo(() => ({ [CUSTOM_FLOW_NODE_TYPE]: StrategyNode }), []);
  const edgeTypes = useMemo(() => ({ [CUSTOM_FLOW_EDGE_TYPE]: ActionEdgeCard }), []);

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

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: CUSTOM_FLOW_EDGE_TYPE,
            data: { label: "New action" } as FlowEdgeData,
          },
          eds,
        ),
      );
      setEditingNodeId(null);
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
      setNodes((nds) => [
        ...nds,
        {
          id: nextNodeId(),
          type: CUSTOM_FLOW_NODE_TYPE,
          position: position ?? { x: 150 + nds.length * 30, y: 150 },
          data: { label: "New node", nodeType: "node", details: "", onEdit: handleOpenNodeEditor },
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
            athlete_id: item.athlete_id ?? null,
            athleteRole: item.athleteRole ?? "neutral",
            onEdit: handleOpenNodeEditor,
          },
        },
      ]);
      markDirty();
    },
    [setNodes, markDirty, handleOpenNodeEditor],
  );

  const handleDeleteSelected = useCallback(() => {
    const selectedEdgeIds = new Set(
      edges.filter((edge) => edge.selected).map((edge) => edge.id),
    );

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
    setEditingEdgeId((current) =>
      current && selectedEdgeIds.has(current) ? null : current,
    );
    markDirty();
  }, [setNodes, setEdges, markDirty, edges]);

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
      const linkedEdgeIds = new Set(
        edges
          .filter((edge) => edge.source === node.id || edge.target === node.id)
          .map((edge) => edge.id),
      );

      setNodes((nds) => nds.filter((n) => n.id !== node.id));
      setEdges((eds) =>
        eds.filter((e) => e.source !== node.id && e.target !== node.id),
      );
      setEditingEdgeId((current) => {
        return current && linkedEdgeIds.has(current) ? null : current;
      });
      setEditingNodeId((current) => (current === node.id ? null : current));
      markDirty();
    },
    [setNodes, setEdges, markDirty, edges],
  );

  const handleUpdateEdge = useCallback(
    (edgeId: string, patch: Partial<FlowEdgeData>) => {
      setEdges((existingEdges) =>
        existingEdges.map((edge) =>
          edge.id === edgeId
            ? {
                ...edge,
                data: {
                  ...(edge.data as FlowEdgeData | undefined),
                  ...patch,
                },
              }
            : edge,
        ),
      );
      markDirty();
    },
    [setEdges, markDirty],
  );

  const handleUpdateNode = useCallback(
    (
      nodeId: string,
      patch: Partial<
        Pick<
          FlowNodeData,
          "label" | "details" | "nodeType" | "athlete_id" | "athleteRole"
        >
      >,
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
  const editingEdge =
    edges.find((edge) => edge.id === editingEdgeId) ?? null;
  const editingNode =
    nodes.find((node) => node.id === editingNodeId) ?? null;

  const controlBarStatus = error ?? (dirty ? "Unsaved" : "Saved");

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
      <ControlBar
        title="Strategy graph editor"
        subtitle={`${nodes.length} nodes and ${edges.length} edges in the current working graph.`}
        homeLabel="Back home"
        onHomeReturn={() => router.push("/home")}
        fileActions={[
          { label: "Import soon", disabled: true, tone: "muted" },
          { label: "Export soon", disabled: true, tone: "muted" },
        ]}
        onAddNode={() => handleAddNode()}
        onDeleteSelected={handleDeleteSelected}
        onSave={handleSave}
        saveLabel="Save graph"
        saving={saving}
        status={
          <span className={error ? "text-red-600" : ""} role={error ? "alert" : undefined}>
            {controlBarStatus}
          </span>
        }
      />

      {/* Main body section */}
      <div className="flex flex-1 min-h-0">
        {/* Left column - Palette/Explorer*/}
        <SideBar
          nodes={nodes}
          edges={edges}
          selectedNodeIds={selectedNodeIds}
          onSelectNode={handleSelectNodeInExplorer}
          search={explorerSearch}
          onSearchChange={setExplorerSearch}
          onSelectPaletteItem={handleAddNodeFromPalette}
        />

        <GraphCanvas
          nodes={nodes}
          edges={edges}
          edgeTypes={edgeTypes}
          nodeTypes={nodeTypes}
          editingEdge={editingEdge}
          editingNode={editingNode}
          onNodesChange={onNodesChangeWithDirty}
          onEdgesChange={onEdgesChangeWithDirty}
          onConnect={onConnect}
          onAddNodeAtPosition={handleAddNode}
          onEditEdge={handleOpenEdgeEditor}
          onEditNode={handleOpenNodeEditor}
          onDuplicateNode={handleDuplicateNode}
          onDeleteNode={handleDeleteNode}
          onCloseInspector={() => setEditingNodeId(null)}
          onCloseEdgeInspector={() => setEditingEdgeId(null)}
          onChangeEdge={handleUpdateEdge}
          onChangeNode={handleUpdateNode}
        />
      </div>
    </div>
  );
}
