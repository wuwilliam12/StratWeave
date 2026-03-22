"use client";

import React from "react";
import type { Node } from "reactflow";
import type { FlowNodeData } from "@/lib/graphConvert";
import { getNodeHierarchyLabel, getNodeParentId } from "@/lib/graphHierarchy";
import { FLOW_NODE_TYPE_OPTIONS } from "../nodes/nodeTypes";

type FlowNodePatch = Partial<
  Pick<
    FlowNodeData,
    "label" | "details" | "nodeType" | "athlete_id" | "athleteRole" | "parentId"
  >
>;

export interface NodeInspectorProps {
  node: Node<FlowNodeData> | null;
  nodes?: Node<FlowNodeData>[];
  onClose?: () => void;
  onChange?: (nodeId: string, patch: FlowNodePatch) => void;
}

export type NodeEditorPanelProps = NodeInspectorProps;

export default function NodeInspector({
  node,
  nodes = [],
  onClose,
  onChange,
}: NodeInspectorProps) {
  if (!node) return null;

  const data = (node.data ?? {}) as FlowNodeData;
  const wouldCreateCycle = (candidateId: string) => {
    let currentParentId: string | null = candidateId;
    const visited = new Set<string>();

    while (currentParentId) {
      if (currentParentId === node.id) {
        return true;
      }
      if (visited.has(currentParentId)) {
        return true;
      }

      visited.add(currentParentId);
      const parentNode = nodes.find((candidate) => candidate.id === currentParentId);
      currentParentId = parentNode ? getNodeParentId(parentNode) : null;
    }

    return false;
  };
  const parentOptions = nodes.filter(
    (candidate) => candidate.id !== node.id && !wouldCreateCycle(candidate.id),
  );

  return (
    <aside className="absolute right-4 top-4 z-30 w-[320px] rounded-3xl border border-black/10 bg-[color:var(--color-surface-strong)] p-4 shadow-2xl backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-muted)]">
            Node editor
          </div>
          <div className="mt-1 text-lg font-semibold text-[color:var(--color-foreground)]">
            {data.label?.trim() || "Untitled node"}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-black/10 px-2.5 py-1 text-xs font-medium text-[color:var(--color-muted)] transition hover:border-black/20 hover:text-[color:var(--color-foreground)]"
        >
          Close
        </button>
      </div>

      <div className="mt-4 space-y-4">
        <label className="block text-sm font-medium text-[color:var(--color-foreground)]">
          Title
          <input
            type="text"
            value={data.label ?? ""}
            onChange={(event) =>
              onChange?.(node.id, { label: event.target.value })
            }
            className="mt-1 w-full rounded-2xl border border-black/10 bg-white/80 px-3 py-2 text-sm outline-none transition focus:border-[color:var(--color-accent)]"
          />
        </label>

        <label className="block text-sm font-medium text-[color:var(--color-foreground)]">
          Type
          <select
            value={data.nodeType ?? "node"}
            onChange={(event) =>
              onChange?.(node.id, { nodeType: event.target.value })
            }
            className="mt-1 w-full rounded-2xl border border-black/10 bg-white/80 px-3 py-2 text-sm outline-none transition focus:border-[color:var(--color-accent)]"
          >
            {FLOW_NODE_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-[color:var(--color-foreground)]">
          Parent
          <select
            value={data.parentId ?? ""}
            onChange={(event) =>
              onChange?.(node.id, { parentId: event.target.value || null })
            }
            className="mt-1 w-full rounded-2xl border border-black/10 bg-white/80 px-3 py-2 text-sm outline-none transition focus:border-[color:var(--color-accent)]"
          >
            <option value="">No parent (root)</option>
            {parentOptions.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {getNodeHierarchyLabel(candidate)}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-[color:var(--color-foreground)]">
          Details
          <textarea
            value={data.details ?? ""}
            onChange={(event) =>
              onChange?.(node.id, { details: event.target.value })
            }
            rows={6}
            className="mt-1 w-full resize-none rounded-2xl border border-black/10 bg-white/80 px-3 py-2 text-sm outline-none transition focus:border-[color:var(--color-accent)]"
            placeholder="Describe the state, trigger, outcome, or tactical note."
          />
        </label>

        <label className="block text-sm font-medium text-[color:var(--color-foreground)]">
          Athlete role
          <select
            value={data.athleteRole ?? "neutral"}
            onChange={(event) =>
              onChange?.(node.id, {
                athleteRole: event.target.value as FlowNodeData["athleteRole"],
              })
            }
            className="mt-1 w-full rounded-2xl border border-black/10 bg-white/80 px-3 py-2 text-sm outline-none transition focus:border-[color:var(--color-accent)]"
          >
            <option value="user">User athlete</option>
            <option value="opponent">Opponent athlete</option>
            <option value="neutral">Neutral / shared</option>
          </select>
        </label>

        <label className="block text-sm font-medium text-[color:var(--color-foreground)]">
          Athlete ID
          <input
            type="text"
            value={data.athlete_id ?? ""}
            onChange={(event) =>
              onChange?.(node.id, {
                athlete_id: event.target.value.trim() || null,
              })
            }
            className="mt-1 w-full rounded-2xl border border-black/10 bg-white/80 px-3 py-2 text-sm outline-none transition focus:border-[color:var(--color-accent)]"
            placeholder="Link this node to an athlete"
          />
        </label>

        <div className="rounded-2xl border border-black/10 bg-white/55 p-3 text-xs text-[color:var(--color-muted)]">
          <div>Node ID: {node.id}</div>
          <div>Parent ID: {data.parentId ?? "none"}</div>
          <div>Action ID: {data.action_id ?? "none"}</div>
          <div>Athlete ID: {data.athlete_id ?? "none"}</div>
          <div>Athlete role: {data.athleteRole ?? "neutral"}</div>
        </div>
      </div>
    </aside>
  );
}
