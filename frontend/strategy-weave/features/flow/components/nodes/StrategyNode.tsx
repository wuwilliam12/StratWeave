"use client";

import React, { useState } from "react";
import type { NodeProps } from "reactflow";
import type { FlowNodeData } from "@/lib/graphConvert";
import { getHierarchySizing, normalizeGraphHierarchyType } from "@/lib/graphHierarchy";
import { getFlowNodeTypeOption } from "./getFlowNodeTypeOption";
import NodeDetails from "./NodeDetails";
import NodeHandles from "./NodeHandles";
import NodeHeader from "./NodeHeader";

export default function StrategyNode({
  id,
  data,
  selected,
}: NodeProps<FlowNodeData>) {
  const [expanded, setExpanded] = useState(false);
  const typeOption = getFlowNodeTypeOption(data.nodeType);
  const hierarchyLevel = normalizeGraphHierarchyType(data.nodeType);
  const sizing = getHierarchySizing(hierarchyLevel);
  const perspectiveClassName =
    data.athleteRole === "user"
      ? "shadow-[0_0_0_1px_rgba(59,130,246,0.22)]"
      : data.athleteRole === "opponent"
        ? "shadow-[0_0_0_1px_rgba(244,63,94,0.22)]"
        : "";

  return (
    <div
      className={[
        "border bg-white/95 text-slate-900 shadow-lg backdrop-blur",
        sizing.cardWidth,
        sizing.cardPadding,
        sizing.cardRadius,
        typeOption.tone.border,
        typeOption.tone.glow,
        perspectiveClassName,
        selected ? "ring-2 ring-[var(--color-accent)]" : "ring-1 ring-black/5",
      ].join(" ")}
    >
      <NodeHandles />
      <NodeHeader
        label={data.label}
        athleteRole={data.athleteRole}
        typeOption={typeOption}
        sizing={sizing}
        onEdit={() => data.onEdit?.(id)}
      />
      <NodeDetails
        expanded={expanded}
        onToggle={() => setExpanded((value) => !value)}
        data={data}
        sizing={sizing}
      />
    </div>
  );
}
