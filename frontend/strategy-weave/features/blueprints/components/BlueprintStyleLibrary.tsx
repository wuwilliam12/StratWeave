"use client";

import { useEffect, useState } from "react";

import { fetchBlueprintStyles } from "@/lib/api";
import type { BlueprintStyle } from "@/types/blueprint";

export default function BlueprintStyleLibrary() {
  const [styles, setStyles] = useState<BlueprintStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchBlueprintStyles()
      .then((nextStyles) => {
        if (cancelled) return;
        setStyles(nextStyles);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setStyles([]);
        setError(err instanceof Error ? err.message : "Failed to load blueprint styles");
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="rounded-[2rem] border border-border bg-surface px-6 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
            Blueprint styles
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
            Starter style library
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            Scaffolded backend presets and frontend consumers now exist here, so new
            blueprint styles can grow from a shared contract instead of one-off UI.
          </p>
        </div>
        <span className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted">
          Ready to extend
        </span>
      </div>

      {loading ? (
        <div className="mt-5 rounded-2xl border border-dashed border-border bg-background/50 px-4 py-4 text-sm text-muted">
          Loading blueprint styles...
        </div>
      ) : error ? (
        <div
          className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700"
          role="alert"
        >
          {error}
        </div>
      ) : (
        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {styles.map((style) => (
            <article
              key={style.id}
              className="rounded-[1.5rem] border border-border bg-background/60 p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold tracking-[-0.03em]">
                    {style.name}
                  </p>
                  <p className="mt-1 text-sm text-muted">{style.summary}</p>
                </div>
                <span className="rounded-full border border-border px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-muted">
                  {style.slug}
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-muted">{style.description}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {style.recommended_node_types.map((nodeType) => (
                  <span
                    key={nodeType}
                    className="rounded-full border border-border bg-surface px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-muted"
                  >
                    {nodeType}
                  </span>
                ))}
              </div>

              <div className="mt-5 grid gap-2">
                {style.tokens.map((token) => (
                  <div
                    key={`${style.id}-${token.name}`}
                    className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface px-3 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{token.name}</p>
                      <p className="mt-1 text-xs text-muted">{token.usage}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="h-6 w-6 rounded-full border border-black/10"
                        style={{ backgroundColor: token.value }}
                        aria-hidden="true"
                      />
                      <code className="text-xs text-muted">{token.value}</code>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 border-t border-border pt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">
                  Build notes
                </p>
                <div className="mt-3 grid gap-2">
                  {style.notes.map((note) => (
                    <p
                      key={note}
                      className="rounded-xl border border-dashed border-border bg-surface px-3 py-3 text-sm text-muted"
                    >
                      {note}
                    </p>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
