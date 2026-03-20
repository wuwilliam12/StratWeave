"use client";

import React, { useState } from "react";
import type { NodeProps } from "reactflow";
import type { FlowNodeData } from "@/lib/graphConvert";
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

  return (
    <div
      className={[
        "min-w-[240px] max-w-[280px] rounded-2xl border bg-white/95 p-3 text-slate-900 shadow-lg backdrop-blur",
        typeOption.tone.border,
        typeOption.tone.glow,
        selected ? "ring-2 ring-[var(--color-accent)]" : "ring-1 ring-black/5",
      ].join(" ")}
    >
      <NodeHandles />
      <NodeHeader
        label={data.label}
        typeOption={typeOption}
        onEdit={() => data.onEdit?.(id)}
      />
      <NodeDetails
        expanded={expanded}
        onToggle={() => setExpanded((value) => !value)}
        data={data}
      />
    </div>
  );
}
