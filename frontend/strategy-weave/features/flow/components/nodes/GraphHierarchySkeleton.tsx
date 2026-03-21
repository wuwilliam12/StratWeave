import { GRAPH_HIERARCHY_LEVELS } from "@/lib/graphHierarchy";

/**
 * Bare structure draft for a future multilevel graph hierarchy.
 * Current intent:
 * Strategy -> Scenario -> Sequence/Flow -> Node
 */
export default function GraphHierarchySkeleton() {
  const [strategyLevel, scenarioLevel, sequenceLevel, nodeLevel] =
    GRAPH_HIERARCHY_LEVELS;
  const flowConnections = [
    {
      title: "Entry node -> Decision node",
      helper: "A flow connection can own follow-up sub nodes.",
      subNodes: ["Option A", "Option B"],
    },
    {
      title: "Decision node -> Outcome node",
      helper: "Each branch can expose a smaller chain beneath it.",
      subNodes: ["Counter", "Recovery"],
    },
  ];

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
        <div className="text-sm font-semibold">{strategyLevel.label}</div>
        <div className="mt-1 text-sm text-muted">{strategyLevel.helper}</div>

        {/* Scenario group: each strategy can branch into multiple contexts. */}
        <div className="mt-4 space-y-4 border-l border-border pl-4">
          <div className="rounded-2xl border border-border bg-surface p-4">
            <div className="text-sm font-medium">{scenarioLevel.label}</div>
            <div className="mt-1 text-sm text-muted">{scenarioLevel.helper}</div>

            {/* Sequence/Flow group: ordered options inside a scenario. */}
            <div className="mt-4 space-y-3 border-l border-border pl-4">
              <div className="rounded-2xl border border-border bg-background/60 p-4">
                <div className="text-sm font-medium">{sequenceLevel.label}</div>
                <div className="mt-1 text-sm text-muted">{sequenceLevel.helper}</div>

                {/* Flow-level connections can branch into their own sub nodes. */}
                <div className="mt-4 space-y-3 border-l border-border pl-4">
                  {flowConnections.map((connection) => (
                    <div
                      key={connection.title}
                      className="rounded-xl border border-border bg-surface p-4"
                    >
                      <div className="text-sm font-medium">{connection.title}</div>
                      <div className="mt-1 text-sm text-muted">
                        {connection.helper}
                      </div>

                      {/* Atomic nodes: smallest units the graph editor can manipulate directly. */}
                      <div className="mt-3 grid gap-2 border-l border-border pl-4">
                        {connection.subNodes.map((subNode) => (
                          <div
                            key={subNode}
                            className="rounded-xl border border-dashed border-border bg-background/80 px-3 py-3 text-sm"
                          >
                            {nodeLevel.label}: {subNode}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
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
