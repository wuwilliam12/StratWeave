"use client";

import React from "react";

import type { FlowNodeData } from "@/lib/graphConvert";

export interface NodeDetailsProps {
  expanded: boolean;
  onToggle: () => void;
  data: FlowNodeData;
}

export default function NodeDetails({
  expanded,
  onToggle,
  data,
}: NodeDetailsProps) {
  const details = data.details?.trim();
  const linkedAction = data.action_id?.trim();
  const linkedAthlete = data.athlete_id?.trim();
  const hasContext = Boolean(details || linkedAction || linkedAthlete || data.sport);

  return (
    <>
      <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-200/80 pt-2">
        <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
          {data.sport ? `${data.sport} linked` : "Node details"}
        </div>
        <button
          type="button"
          className="nodrag nopan rounded-full px-2 py-1 text-[11px] font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          onClick={onToggle}
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
    </>
  );
}
