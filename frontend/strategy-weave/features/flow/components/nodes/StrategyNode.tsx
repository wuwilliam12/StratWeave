"use client";

import React, { useState } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import type { FlowNodeData } from "@/lib/graphConvert";
import { getFlowNodeTypeOption } from "./nodeTypes";

export default function StrategyNode({
  id,
  data,
  selected,
}: NodeProps<FlowNodeData>) {
  const [expanded, setExpanded] = useState(false);
  const typeOption = getFlowNodeTypeOption(data.nodeType);
  const details = data.details?.trim();
  const linkedAction = data.action_id?.trim();
  const linkedAthlete = data.athlete_id?.trim();
  const hasContext = Boolean(details || linkedAction || linkedAthlete || data.sport);

  return (
    <div
      className={[
        "min-w-[240px] max-w-[280px] rounded-2xl border bg-white/95 p-3 text-slate-900 shadow-lg backdrop-blur",
        typeOption.tone.border,
        typeOption.tone.glow,
        selected ? "ring-2 ring-[var(--color-accent)]" : "ring-1 ring-black/5",
      ].join(" ")}
    >
      <Handle type="target" position={Position.Left} className="!h-3 !w-3 !border-2 !border-white !bg-slate-500" />
      <Handle type="target" position={Position.Top} className="!h-3 !w-3 !border-2 !border-white !bg-slate-500" />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div
            className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${typeOption.tone.chip}`}
          >
            {typeOption.label}
          </div>
          <div className="mt-2 break-words text-sm font-semibold leading-5">
            {data.label?.trim() || "Untitled node"}
          </div>
        </div>

        <button
          type="button"
          className="nodrag nopan rounded-full border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          onClick={() => data.onEdit?.(id)}
        >
          Edit
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-200/80 pt-2">
        <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
          {data.sport ? `${data.sport} linked` : "Node details"}
        </div>
        <button
          type="button"
          className="nodrag nopan rounded-full px-2 py-1 text-[11px] font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Hide" : "Show"}
        </button>
      </div>

      {expanded ? (
        <div className="nodrag nopan mt-2 space-y-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
          <div className="font-medium text-slate-900">Details</div>
          <div className="whitespace-pre-wrap leading-5 text-slate-600">
            {details || "Add notes, conditions, or response logic from the edit panel."}
          </div>
          {hasContext ? (
            <div className="space-y-1 border-t border-slate-200 pt-2 text-[11px] text-slate-500">
              {data.sport ? <div>Sport: {data.sport}</div> : null}
              {linkedAction ? <div>Action ID: {linkedAction}</div> : null}
              {linkedAthlete ? <div>Boxer ID: {linkedAthlete}</div> : null}
            </div>
          ) : null}
        </div>
      ) : null}

      <Handle type="source" position={Position.Right} className="!h-3 !w-3 !border-2 !border-white !bg-slate-500" />
      <Handle type="source" position={Position.Bottom} className="!h-3 !w-3 !border-2 !border-white !bg-slate-500" />
    </div>
  );
}
