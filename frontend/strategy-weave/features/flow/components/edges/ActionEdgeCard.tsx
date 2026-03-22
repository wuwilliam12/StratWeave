"use client";

import React from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "reactflow";

import type { FlowEdgeData } from "@/lib/graphConvert";

export default function ActionEdgeCard({
  id,
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
  selected,
  data,
  markerEnd,
  style,
}: EdgeProps<FlowEdgeData>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const label = data?.label?.trim() || "Action";

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: selected ? "#0f172a" : "#64748b",
          strokeWidth: selected ? 2.5 : 2,
          ...style,
        }}
      />
      <EdgeLabelRenderer>
        <div
          className="pointer-events-none absolute"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
        >
          <div
            className={[
              "rounded-2xl border bg-white/95 px-3 py-2 text-center shadow-lg backdrop-blur dark:bg-slate-950/95",
              selected
                ? "border-slate-900 ring-2 ring-slate-300 dark:border-slate-100 dark:ring-slate-700"
                : "border-slate-200 dark:border-slate-700",
            ].join(" ")}
          >
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Action
            </div>
            <div className="mt-1 text-xs font-medium text-slate-700 dark:text-slate-200">
              {label}
            </div>
            {data?.probability != null || data?.staminaCost != null ? (
              <div className="mt-1 text-[11px] text-slate-400">
                {data?.probability != null ? `${Math.round(data.probability * 100)}%` : null}
                {data?.probability != null && data?.staminaCost != null ? " · " : null}
                {data?.staminaCost != null ? `Cost ${data.staminaCost}` : null}
              </div>
            ) : null}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
