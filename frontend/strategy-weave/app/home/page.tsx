import Navbar from "@/components/Navbar";
import BlueprintStyleLibrary from "@/features/blueprints/components/BlueprintStyleLibrary";
import GraphHierarchySkeleton from "@/features/flow/components/nodes/GraphHierarchySkeleton";

const quickActions = [
  "Create a new strategy graph",
  "Review counters from the last session",
  "Open a saved boxing gameplan",
];

const overviewCards = [
  {
    title: "Recent Weaves",
    description: "Saved graphs, active drafts, and camp-specific systems.",
    stat: "12 graphs",
  },
  {
    title: "Counter Library",
    description: "Structured move-to-response chains ready for reuse.",
    stat: "84 links",
  },
  {
    title: "Training Focus",
    description: "Priority concepts to drill this week.",
    stat: "3 active goals",
  },
];

const upcomingSections = [
  "Pinned plans for next opponents",
  "Suggested graph branches from sparring notes",
  "Shared team comments and version history",
];

export default function HomePage() {
  return (
    <main className="min-h-dvh px-6 py-8 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <Navbar
          subtitle="Minimal shell for the product homepage and dashboard navigation."
          secondaryAction={{ href: "/", label: "Back to splash" }}
          primaryAction={{ href: "/graph_editor", label: "Open graph editor" }}
        />

        {/* Intro block stays separate from the nav so the page can evolve into a dashboard. */}
        <header className="mt-6 rounded-[2rem] border border-border bg-surface px-6 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.08)] backdrop-blur">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
              Homepage skeleton
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-5xl">
              Your strategy workspace, organized for the next session.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg">
              This page is set up like a product dashboard: overview cards,
              quick actions, and reserved areas for saved gameplans, practice
              priorities, and collaboration features.
            </p>
          </div>
        </header>

        {/* Main dashboard scaffold: overview on the left, actions/supporting modules on the right. */}
        <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-3">
              {overviewCards.map((card) => (
                <article
                  key={card.title}
                  className="rounded-[1.75rem] border border-border bg-surface px-5 py-5 shadow-[0_18px_50px_rgba(0,0,0,0.06)] backdrop-blur"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-muted">
                    {card.title}
                  </p>
                  <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
                    {card.stat}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    {card.description}
                  </p>
                </article>
              ))}
            </div>

            <GraphHierarchySkeleton />
            <BlueprintStyleLibrary />
          </div>

          {/* Right rail is reserved for fast actions and lighter supporting content. */}
          <aside className="grid gap-6">
            <section className="rounded-[2rem] border border-border bg-[#1f1b18] px-6 py-6 text-[#fff4ea] shadow-[0_24px_70px_rgba(0,0,0,0.12)]">
              <p className="text-xs uppercase tracking-[0.26em] text-[#ddbfa7]">
                Quick actions
              </p>
              <div className="mt-5 grid gap-3">
                {quickActions.map((action) => (
                  <button
                    key={action}
                    type="button"
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left text-sm font-medium transition hover:bg-white/10"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-border bg-surface px-6 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur">
              <p className="text-xs uppercase tracking-[0.26em] text-muted">
                Reserved sections
              </p>
              <div className="mt-4 grid gap-3">
                {upcomingSections.map((section) => (
                  <article
                    key={section}
                    className="rounded-2xl border border-border bg-background/60 px-4 py-4"
                  >
                    <p className="text-sm font-medium">{section}</p>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
