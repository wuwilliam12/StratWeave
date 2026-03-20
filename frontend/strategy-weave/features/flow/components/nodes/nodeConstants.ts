export const CUSTOM_FLOW_NODE_TYPE = "strategyNode";

export type FlowNodeTone = {
  chip: string;
  border: string;
  glow: string;
};

export type FlowNodeTypeOption = {
  value: string;
  label: string;
  tone: FlowNodeTone;
};

export const FLOW_NODE_TYPE_OPTIONS: FlowNodeTypeOption[] = [
  {
    value: "strategy",
    label: "Strategy",
    tone: {
      chip: "bg-amber-100 text-amber-900",
      border: "border-amber-300",
      glow: "shadow-[0_0_0_1px_rgba(251,191,36,0.22)]",
    },
  },
  {
    value: "scenario",
    label: "Scenario",
    tone: {
      chip: "bg-sky-100 text-sky-900",
      border: "border-sky-300",
      glow: "shadow-[0_0_0_1px_rgba(56,189,248,0.22)]",
    },
  },
  {
    value: "sequence",
    label: "Sequence / Flow",
    tone: {
      chip: "bg-violet-100 text-violet-900",
      border: "border-violet-300",
      glow: "shadow-[0_0_0_1px_rgba(167,139,250,0.22)]",
    },
  },
  {
    value: "state",
    label: "State Node",
    tone: {
      chip: "bg-emerald-100 text-emerald-900",
      border: "border-emerald-300",
      glow: "shadow-[0_0_0_1px_rgba(16,185,129,0.22)]",
    },
  },
  {
    value: "action",
    label: "Action",
    tone: {
      chip: "bg-rose-100 text-rose-900",
      border: "border-rose-300",
      glow: "shadow-[0_0_0_1px_rgba(244,63,94,0.2)]",
    },
  },
  {
    value: "decision",
    label: "Decision",
    tone: {
      chip: "bg-orange-100 text-orange-900",
      border: "border-orange-300",
      glow: "shadow-[0_0_0_1px_rgba(249,115,22,0.22)]",
    },
  },
  {
    value: "counter",
    label: "Counter",
    tone: {
      chip: "bg-red-100 text-red-900",
      border: "border-red-300",
      glow: "shadow-[0_0_0_1px_rgba(239,68,68,0.18)]",
    },
  },
  {
    value: "approach",
    label: "Approach",
    tone: {
      chip: "bg-lime-100 text-lime-900",
      border: "border-lime-300",
      glow: "shadow-[0_0_0_1px_rgba(132,204,22,0.2)]",
    },
  },
  {
    value: "note",
    label: "Note",
    tone: {
      chip: "bg-stone-200 text-stone-900",
      border: "border-stone-300",
      glow: "shadow-[0_0_0_1px_rgba(120,113,108,0.16)]",
    },
  },
  {
    value: "node",
    label: "Generic Node",
    tone: {
      chip: "bg-slate-200 text-slate-900",
      border: "border-slate-300",
      glow: "shadow-[0_0_0_1px_rgba(100,116,139,0.18)]",
    },
  },
];
