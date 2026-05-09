import React from "react";

import Toolbar, { type ToolbarProps } from "./Toolbar";

type ControlBarAction = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  tone?: "default" | "muted";
};

export interface ControlBarProps extends ToolbarProps {
  title?: string;
  subtitle?: string;
  onHomeReturn?: () => void;
  homeLabel?: string;
  fileActions?: ControlBarAction[];
  aiActions?: ControlBarAction[];
  accountActions?: ControlBarAction[];
  /** e.g. sport theme picker — rendered before AI / Account groups */
  trailingSlot?: React.ReactNode;
}

function ActionButton({
  label,
  onClick,
  disabled = false,
  tone = "default",
}: ControlBarAction) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "rounded-full border px-3 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        tone === "muted"
          ? "border-dashed border-border text-muted"
          : "border-border text-foreground hover:bg-surface-strong",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function ActionGroup({
  label,
  actions,
}: {
  label: string;
  actions: ControlBarAction[];
}) {
  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] text-muted xl:inline">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-2">
        {actions.map((action) => (
          <ActionButton key={action.label} {...action} />
        ))}
      </div>
    </div>
  );
}

export default function ControlBar({
  title = "Flow editor",
  subtitle = "Shape the graph, save revisions, and manage the working canvas.",
  onHomeReturn,
  homeLabel = "Back",
  fileActions = [],
  aiActions = [{ label: "AI tools soon", disabled: true, tone: "muted" }],
  accountActions = [{ label: "Account soon", disabled: true, tone: "muted" }],
  trailingSlot,
  ...toolbarProps
}: ControlBarProps) {
  return (
    <div className="border-b border-border bg-surface px-3 py-3 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Home return */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onHomeReturn}
            disabled={onHomeReturn == null}
            className="rounded-full border border-border px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-surface-strong disabled:cursor-not-allowed disabled:opacity-50"
          >
            {homeLabel}
          </button>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-foreground">
              {title}
            </div>
            <div className="truncate text-xs text-muted">
              {subtitle}
            </div>
          </div>
        </div>

        {/* Graph/File Commands */}
        <ActionGroup label="Graph" actions={fileActions} />

        {/* Toolbar */}
        <div className="min-w-[280px] flex-1">
          <Toolbar {...toolbarProps} />
        </div>

        {trailingSlot ? (
          <div className="flex shrink-0 items-center border-l border-border pl-3">
            {trailingSlot}
          </div>
        ) : null}

        {/* Future AI Stuff */}
        <ActionGroup label="AI" actions={aiActions} />

        {/* Future Account Controls*/}
        <ActionGroup label="Account" actions={accountActions} />
      </div>
    </div>
  );
}
