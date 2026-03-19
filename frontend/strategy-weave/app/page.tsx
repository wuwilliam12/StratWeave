import Link from "next/link";
import Navbar from "@/components/Navbar";

const featureHighlights = [
  "Map counters, setups, and decision trees in one place.",
  "Translate sparring notes into a reusable strategy system.",
  "Move from isolated techniques to connected gameplans.",
];

const proofPoints = [
  { label: "Primary sport", value: "Boxing-first" },
  { label: "Core interface", value: "Strategy graph" },
  { label: "Planned layer", value: "ML suggestions" },
];

export default function SplashPage() {
  return (
    <main className="min-h-dvh px-6 py-8 text-foreground sm:px-10 lg:px-16">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-7xl flex-col">
        <Navbar
          secondaryAction={{ href: "/home", label: "Open homepage" }}
          primaryAction={{ href: "/graph_editor", label: "Launch editor" }}
        />

        {/* Splash layout: left side sells the concept, right side hints at future modules. */}
        <section className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:py-16">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded-full border border-border bg-surface px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-muted">
              Splash page skeleton
            </p>

            <h1 className="max-w-4xl text-5xl font-semibold leading-tight tracking-[-0.04em] text-balance sm:text-6xl lg:text-7xl">
              Build a living map of how your gameplan actually works.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
              StratWeave turns isolated tactics into connected strategy. Sketch
              counters, identify branching options, and shape a system you can
              revisit between sessions.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/home"
                className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong"
              >
                See product home
              </Link>
              <Link
                href="/graph_editor"
                className="rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold transition hover:bg-surface-strong"
              >
                Jump into graph editor
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {proofPoints.map((point) => (
                <article
                  key={point.label}
                  className="rounded-3xl border border-border bg-surface px-5 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.06)] backdrop-blur"
                >
                  <p className="text-xs uppercase tracking-[0.25em] text-muted">
                    {point.label}
                  </p>
                  <p className="mt-2 text-lg font-semibold">{point.value}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="relative">
            {/* Content cards act as placeholders for richer marketing blocks later. */}
            <div className="rounded-[2rem] border border-border bg-surface p-6 shadow-[0_28px_80px_rgba(0,0,0,0.1)] backdrop-blur">
              <div className="grid gap-4">
                <div className="rounded-[1.5rem] border border-border bg-surface-strong p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
                    What this page can become
                  </p>
                  <div className="mt-4 grid gap-3">
                    {featureHighlights.map((item, index) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-border/80 bg-background/55 px-4 py-4"
                      >
                        <p className="text-xs uppercase tracking-[0.2em] text-muted">
                          0{index + 1}
                        </p>
                        <p className="mt-2 text-base font-medium leading-7">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <article className="rounded-[1.5rem] border border-border bg-[#1f1b18] px-5 py-5 text-[#fff4ea]">
                    <p className="text-xs uppercase tracking-[0.25em] text-[#ddbfa7]">
                      Suggested hero module
                    </p>
                    <p className="mt-3 text-2xl font-semibold">
                      Personalized training paths
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#f0d9c8]">
                      Spotlight a fighter profile, camp plan, or featured graph.
                    </p>
                  </article>

                  <article className="rounded-[1.5rem] border border-border bg-[#ebe1d1] px-5 py-5 text-[#2c241f]">
                    <p className="text-xs uppercase tracking-[0.25em] text-[#6e6256]">
                      Suggested CTA slot
                    </p>
                    <p className="mt-3 text-2xl font-semibold">
                      Start a new weave
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#5f5449]">
                      Reserve this block for sign-up, onboarding, or a guided
                      first graph flow.
                    </p>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
