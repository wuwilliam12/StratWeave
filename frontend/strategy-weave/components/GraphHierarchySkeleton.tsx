/**
 * Bare structure draft for a future multilevel graph hierarchy.
 * Current intent:
 * Strategy -> Scenario -> Sequence/Flow -> Node
 */
export default function GraphHierarchySkeleton() {
  return (
    <div className="rounded-[2rem] border border-border bg-surface px-6 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
            Hierarchy Draft
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
            Strategy hierarchy shell
          </h2>
        </div>
        <span className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted">
          Bare bones
        </span>
      </div>

      {/* Root container: one strategy owns the full tree beneath it. */}
      <div className="mt-6 rounded-[1.5rem] border border-border bg-background/60 p-5">
        <div className="text-sm font-semibold">Strategy</div>
        <div className="mt-1 text-sm text-muted">
          Top-level gameplan or strategic concept.
        </div>

        {/* Scenario group: each strategy can branch into multiple contexts. */}
        <div className="mt-4 space-y-4 border-l border-border pl-4">
          <div className="rounded-2xl border border-border bg-surface p-4">
            <div className="text-sm font-medium">Scenario</div>
            <div className="mt-1 text-sm text-muted">
              Example: opponent pressure, southpaw matchup, rope exchange.
            </div>

            {/* Sequence/Flow group: ordered options inside a scenario. */}
            <div className="mt-4 space-y-3 border-l border-border pl-4">
              <div className="rounded-2xl border border-border bg-background/60 p-4">
                <div className="text-sm font-medium">Sequence / Flow</div>
                <div className="mt-1 text-sm text-muted">
                  Example: entry, reaction, counter, exit.
                </div>

                {/* Atomic nodes: smallest units the graph editor can manipulate directly. */}
                <div className="mt-4 grid gap-2 border-l border-border pl-4">
                  <div className="rounded-xl border border-dashed border-border bg-surface px-3 py-3 text-sm">
                    Node
                  </div>
                  <div className="rounded-xl border border-dashed border-border bg-surface px-3 py-3 text-sm">
                    Node
                  </div>
                  <div className="rounded-xl border border-dashed border-border bg-surface px-3 py-3 text-sm">
                    Node
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-border bg-background/40 p-4 text-sm text-muted">
            Additional scenarios would repeat here under the same strategy.
          </div>
        </div>
      </div>
    </div>
  );
}
