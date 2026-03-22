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
          ? "border-dashed border-gray-300 text-gray-400 dark:border-gray-700 dark:text-gray-500"
          : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800",
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
      <span className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400 xl:inline">
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
  ...toolbarProps
}: ControlBarProps) {
  return (
    <div className="border-b border-gray-200 bg-gray-50/95 px-3 py-3 backdrop-blur dark:border-gray-700 dark:bg-gray-900/95">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Home return */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onHomeReturn}
            disabled={onHomeReturn == null}
            className="rounded-full border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {homeLabel}
          </button>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </div>
            <div className="truncate text-xs text-gray-500 dark:text-gray-400">
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

        {/* Future AI Stuff */}
        <ActionGroup label="AI" actions={aiActions} />

        {/* Future Account Controls*/}
        <ActionGroup label="Account" actions={accountActions} />
      </div>
    </div>
  );
}
