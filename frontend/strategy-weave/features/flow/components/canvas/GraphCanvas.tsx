"use client";

import React, { useEffect, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  type Connection,
  type Edge,
  type EdgeTypes,
  type EdgeChange,
  type Node,
  type NodeChange,
  type NodeTypes,
} from "reactflow";

import "reactflow/dist/style.css";

import type { FlowEdgeData, FlowNodeData } from "@/lib/graphConvert";
import CanvasContextMenu from "../context_menu/CanvasContextMenu";
import NodeContextMenu from "../context_menu/NodeContextMenu";
import EdgeInspector from "../inspector/EdgeInspector";
import NodeInspector from "../inspector/NodeInspector";

function CanvasHelpers({
  addNodeAtScreenRef,
  onAddNodeAtPosition,
}: {
  addNodeAtScreenRef: React.MutableRefObject<
    ((clientX: number, clientY: number) => void) | null
  >;
  onAddNodeAtPosition: (position: { x: number; y: number }) => void;
}) {
  const { screenToFlowPosition } = useReactFlow();

  useEffect(() => {
    addNodeAtScreenRef.current = (clientX: number, clientY: number) => {
      const flowPosition = screenToFlowPosition({ x: clientX, y: clientY });
      onAddNodeAtPosition(flowPosition);
    };

    return () => {
      addNodeAtScreenRef.current = null;
    };
  }, [screenToFlowPosition, addNodeAtScreenRef, onAddNodeAtPosition]);

  return null;
}

export interface GraphCanvasProps {
  title?: string;
  subtitle?: string;
  nodes: Node[];
  allNodes?: Node[];
  edges: Edge[];
  edgeTypes?: EdgeTypes;
  nodeTypes: NodeTypes;
  editingEdge: Edge<FlowEdgeData> | null;
  editingNode: Node<FlowNodeData> | null;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  onAddNodeAtPosition: (position?: { x: number; y: number }) => void;
  onEditEdge: (edgeId: string) => void;
  onEditNode: (nodeId: string) => void;
  onDuplicateNode: (node: Node) => void;
  onDeleteNode: (node: Node) => void;
  onCloseInspector: () => void;
  onCloseEdgeInspector: () => void;
  onChangeEdge: (edgeId: string, patch: Partial<FlowEdgeData>) => void;
  onChangeNode: (
    nodeId: string,
    patch: Partial<
      Pick<
        FlowNodeData,
        "label" | "details" | "nodeType" | "athlete_id" | "athleteRole" | "parentId"
      >
    >,
  ) => void;
}

export default function GraphCanvas({
  title = "Canvas",
  subtitle = "Right-click to add nodes, connect branches, and inspect graph details.",
  nodes,
  allNodes,
  edges,
  edgeTypes,
  nodeTypes,
  editingEdge,
  editingNode,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onAddNodeAtPosition,
  onEditEdge,
  onEditNode,
  onDuplicateNode,
  onDeleteNode,
  onCloseInspector,
  onCloseEdgeInspector,
  onChangeEdge,
  onChangeNode,
}: GraphCanvasProps) {
  const [canvasMenu, setCanvasMenu] = useState<{ x: number; y: number } | null>(null);
  const [nodeMenu, setNodeMenu] = useState<{ node: Node; x: number; y: number } | null>(null);
  const screenToFlowAddRef = useRef<((clientX: number, clientY: number) => void) | null>(
    null,
  );

  useEffect(() => {
    if (!canvasMenu && !nodeMenu) return;

    const handleClose = () => {
      setCanvasMenu(null);
      setNodeMenu(null);
    };

    window.addEventListener("click", handleClose);
    return () => window.removeEventListener("click", handleClose);
  }, [canvasMenu, nodeMenu]);

  const handleCanvasAddNode = (position: { x: number; y: number }) => {
    if (screenToFlowAddRef.current) {
      screenToFlowAddRef.current(position.x, position.y);
    } else {
      onAddNodeAtPosition();
    }
    setCanvasMenu(null);
  };

  return (
    <main className="relative flex flex-1 flex-col overflow-hidden bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <div>
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</div>
        </div>
        <div className="rounded-full border border-gray-200 bg-white/70 px-3 py-1 text-xs text-gray-500 dark:border-gray-700 dark:bg-slate-900/70 dark:text-gray-400">
          {nodes.length} nodes
        </div>
      </div>

      <div className="relative flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          edgeTypes={edgeTypes}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onPaneContextMenu={(event) => {
            event.preventDefault();
            setCanvasMenu({ x: event.clientX, y: event.clientY });
            setNodeMenu(null);
          }}
          onNodeContextMenu={(event, node) => {
            event.preventDefault();
            setNodeMenu({ node, x: event.clientX, y: event.clientY });
            setCanvasMenu(null);
          }}
          onEdgeClick={(_, edge) => onEditEdge(edge.id)}
          fitView
        >
          <CanvasHelpers
            addNodeAtScreenRef={screenToFlowAddRef}
            onAddNodeAtPosition={onAddNodeAtPosition}
          />
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>

        {canvasMenu && (
          <div
            className="fixed z-50"
            style={{ left: canvasMenu.x, top: canvasMenu.y }}
            onClick={(event) => event.stopPropagation()}
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
            onClick={(event) => event.stopPropagation()}
          >
            <NodeContextMenu
              node={nodeMenu.node}
              onEdit={(node) => onEditNode(node.id)}
              onDuplicate={onDuplicateNode}
              onDelete={onDeleteNode}
              onClose={() => setNodeMenu(null)}
            />
          </div>
        )}

        <NodeInspector
          node={editingNode}
          nodes={allNodes ?? nodes}
          onClose={onCloseInspector}
          onChange={onChangeNode}
        />

        <EdgeInspector
          edge={editingEdge}
          onClose={onCloseEdgeInspector}
          onChange={onChangeEdge}
        />
      </div>
    </main>
  );
}
