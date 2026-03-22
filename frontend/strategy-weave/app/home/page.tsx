import Link from "next/link";

import Navbar from "@/components/Navbar";
import BlueprintStyleLibrary from "@/features/blueprints/components/BlueprintStyleLibrary";
import GraphHierarchySkeleton from "@/features/flow/components/nodes/GraphHierarchySkeleton";

const launchPads = [
  {
    title: "New style blueprint",
    description:
      "Start a reusable style shell for a boxer archetype, then grow it into scenarios and sequences.",
    href: "/graph_editor?mode=style-blueprint",
    cta: "Build style",
    badge: "Blueprint",
  },
  {
    title: "Opponent gameplan",
    description:
      "Sketch a prep graph for one opponent with opening reads, counters, and round-to-round adjustments.",
    href: "/graph_editor?mode=opponent-gameplan",
    cta: "Plan opponent",
    badge: "Fight camp",
  },
  {
    title: "Blank strategy graph",
    description:
      "Open a fresh canvas when you want to map ideas fast without choosing a preset first.",
    href: "/graph_editor?mode=blank",
    cta: "Open blank canvas",
    badge: "Scratchpad",
  },
];

const workspaceStats = [
  { label: "Saved graphs", value: "12", detail: "Style trees, sparring notes, and active gameplans." },
  { label: "Opponent files", value: "4", detail: "Prep packs ready for the next camp cycle." },
  { label: "Draft branches", value: "27", detail: "Unfinished ideas waiting to be tightened into systems." },
];

const recentFiles = [
  {
    title: "Pressure Southpaw Camp",
    type: "Opponent file",
    updated: "Updated 2h ago",
    href: "/graph_editor?file=pressure-southpaw-camp",
  },
  {
    title: "Outside Jab Style Shell",
    type: "Style blueprint",
    updated: "Updated yesterday",
    href: "/graph_editor?file=outside-jab-style-shell",
  },
  {
    title: "Body Jab Counter Tree",
    type: "Graph draft",
    updated: "Updated 3 days ago",
    href: "/graph_editor?file=body-jab-counter-tree",
  },
];

const prepLanes = [
  {
    title: "Build for an opponent",
    notes: "Gameplan around entries, preferred exits, danger reactions, and round-winning patterns.",
  },
  {
    title: "Expand a style system",
    notes: "Turn a fighting style into reusable scenarios your future gameplans can inherit from.",
  },
  {
    title: "Review your own files",
    notes: "Re-open saved graphs, tighten branches, and keep rough ideas from getting lost.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-dvh px-6 py-8 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <Navbar
          subtitle="Editor hub for building style blueprints, opponent gameplans, and saved graph systems."
          secondaryAction={{ href: "/", label: "Back to splash" }}
          primaryAction={{ href: "/graph_editor", label: "Open graph editor" }}
        />

        <header className="mt-6 overflow-hidden rounded-[2.2rem] border border-border bg-[linear-gradient(135deg,rgba(255,248,238,0.92),rgba(255,241,228,0.82))] px-6 py-6 shadow-[0_28px_80px_rgba(0,0,0,0.08)] backdrop-blur sm:px-8 sm:py-8">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-muted">
                Editor home
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-balance sm:text-5xl lg:text-6xl">
                Build styles, prep opponents, and keep every fight idea in one workspace.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
                Use this homepage like a control room. Start a new style blueprint, map a
                gameplan for a specific opponent, or jump back into graphs you have already made.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/graph_editor?mode=style-blueprint"
                  className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong"
                >
                  New style blueprint
                </Link>
                <Link
                  href="/graph_editor?mode=opponent-gameplan"
                  className="rounded-full border border-border bg-surface px-5 py-3 text-sm font-semibold transition hover:bg-surface-strong"
                >
                  New opponent gameplan
                </Link>
              </div>
            </div>

            <section className="rounded-[1.8rem] border border-black/10 bg-[#221b16] p-5 text-[#fff6ee] shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ddbfa7]">
                Workspace pulse
              </p>
              <div className="mt-4 grid gap-3">
                {workspaceStats.map((stat) => (
                  <article
                    key={stat.label}
                    className="rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-4"
                  >
                    <div className="flex items-end justify-between gap-3">
                      <p className="text-sm text-[#f5d8c4]">{stat.label}</p>
                      <p className="text-3xl font-semibold tracking-[-0.05em]">{stat.value}</p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#e9d4c5]">{stat.detail}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </header>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-6">
            <section className="rounded-[2rem] border border-border bg-surface px-6 py-6 shadow-[0_22px_60px_rgba(0,0,0,0.06)] backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div className="max-w-2xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
                    Start building
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                    Pick the kind of work you want to open
                  </h2>
                </div>
                <span className="rounded-full border border-border px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-muted">
                  Editor shortcuts
                </span>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                {launchPads.map((item) => (
                  <article
                    key={item.title}
                    className="group rounded-[1.6rem] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.58),rgba(255,247,238,0.9))] p-5 transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full border border-border bg-surface px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-muted">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold tracking-[-0.03em]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-muted">{item.description}</p>
                    <Link
                      href={item.href}
                      className="mt-6 inline-flex rounded-full bg-[#201914] px-4 py-2 text-sm font-semibold text-[#fff1e6] transition group-hover:bg-accent"
                    >
                      {item.cta}
                    </Link>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-border bg-surface px-6 py-6 shadow-[0_22px_60px_rgba(0,0,0,0.06)] backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
                    Your files
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                    Jump back into saved graphs and drafts
                  </h2>
                </div>
                <Link
                  href="/graph_editor"
                  className="rounded-full border border-border bg-background/70 px-4 py-2 text-sm font-medium transition hover:bg-surface-strong"
                >
                  View all in editor
                </Link>
              </div>

              <div className="mt-5 grid gap-4">
                {recentFiles.map((file) => (
                  <Link
                    key={file.title}
                    href={file.href}
                    className="rounded-[1.4rem] border border-border bg-background/60 px-5 py-5 transition hover:border-black/15 hover:bg-background/80"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-lg font-semibold tracking-[-0.03em]">{file.title}</p>
                        <p className="mt-1 text-sm text-muted">{file.type}</p>
                      </div>
                      <span className="rounded-full border border-border px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-muted">
                        {file.updated}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <GraphHierarchySkeleton />
            <BlueprintStyleLibrary />
          </div>

          <aside className="grid gap-6">
            <section className="rounded-[2rem] border border-border bg-[linear-gradient(180deg,rgba(31,27,24,0.98),rgba(53,40,31,0.95))] px-6 py-6 text-[#fff4ea] shadow-[0_26px_70px_rgba(0,0,0,0.14)]">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ddbfa7]">
                Prep lanes
              </p>
              <div className="mt-4 grid gap-3">
                {prepLanes.map((lane) => (
                  <article
                    key={lane.title}
                    className="rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-4"
                  >
                    <p className="text-base font-semibold">{lane.title}</p>
                    <p className="mt-2 text-sm leading-6 text-[#edd9cb]">{lane.notes}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-border bg-surface px-6 py-6 shadow-[0_22px_60px_rgba(0,0,0,0.06)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
                Suggested next moves
              </p>
              <div className="mt-4 grid gap-3">
                <Link
                  href="/graph_editor?mode=opponent-gameplan&focus=entries"
                  className="rounded-[1.2rem] border border-border bg-background/60 px-4 py-4 text-sm font-medium transition hover:bg-background/80"
                >
                  Build an opponent opening-reads tree
                </Link>
                <Link
                  href="/graph_editor?mode=style-blueprint&focus=scenarios"
                  className="rounded-[1.2rem] border border-border bg-background/60 px-4 py-4 text-sm font-medium transition hover:bg-background/80"
                >
                  Expand a style blueprint into basic scenarios
                </Link>
                <Link
                  href="/graph_editor?mode=blank&focus=review"
                  className="rounded-[1.2rem] border border-border bg-background/60 px-4 py-4 text-sm font-medium transition hover:bg-background/80"
                >
                  Open a blank review board for sparring notes
                </Link>
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
