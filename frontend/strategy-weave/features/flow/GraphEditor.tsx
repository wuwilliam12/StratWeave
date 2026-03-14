"use client";

import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  type Node,
  type Edge,
} from "reactflow";

import "reactflow/dist/style.css";

import { fetchGraph, saveGraph } from "@/lib/api";
import {
  toFlowNodes,
  toFlowEdges,
  toApiNodes,
  toApiEdges,
} from "@/lib/graphConvert";

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

export default function GraphEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(defaultEdges);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      })
      .catch((err) => {
        if (!cancelled) {
          // Keep default nodes/edges on error
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

  // Add edge between nodes
  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  // Save graph to backend
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
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to save graph");
      })
      .finally(() => setSaving(false));
  }, [nodes, edges, setNodes, setEdges]);

  // Show loading indicator
  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center text-gray-500">
        Loading graph…
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded bg-gray-800 px-3 py-1.5 text-sm text-white hover:bg-gray-700 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save graph"}
        </button>
        {error && (
          <span className="text-sm text-red-600" role="alert">
            {error}
          </span>
        )}
      </div>
      <div className="h-[80vh] w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}
