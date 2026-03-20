"use client";

import React from "react";
import { Handle, Position } from "reactflow";

const handleClassName = "!h-3 !w-3 !border-2 !border-white !bg-slate-500";

export default function NodeHandles() {
  return (
    <>
      <Handle type="target" position={Position.Left} className={handleClassName} />
      <Handle type="target" position={Position.Top} className={handleClassName} />
      <Handle type="source" position={Position.Right} className={handleClassName} />
      <Handle type="source" position={Position.Bottom} className={handleClassName} />
    </>
  );
}
