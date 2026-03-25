"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import BlueprintStyleLibrary from "@/features/blueprints/components/BlueprintStyleLibrary";
import GraphHierarchySkeleton from "@/features/flow/components/nodes/GraphHierarchySkeleton";
import { useGraph } from "@/contexts/GraphContext";

const launchPads = [
  {
    title: "Create a new graph",
    description:
      "Start fresh with a blank canvas. You can create style blueprints, opponent gameplans, or any strategy mapping.",
    href: "/graphs",
    cta: "Create new",
    badge: "Quick start",
  },
  {
    title: "View all graphs",
    description:
      "See all your saved graphs and continue editing. Access your library of strategies and planning documents.",
    href: "/graphs",
    cta: "View library",
    badge: "My graphs",
  },
];

export default function HomePage() {
  const { graphs, fetchGraphs, loading } = useGraph();
  const [recentGraphs, setRecentGraphs] = useState<typeof graphs>([]);

  useEffect(() => {
    fetchGraphs(false);
  }, [fetchGraphs]);

  useEffect(() => {
    setRecentGraphs(graphs.slice(0, 3));
  }, [graphs]);

  return (
    <main className="min-h-dvh px-6 py-8 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <Navbar
          subtitle="Editor hub for building strategy graphs and managing your fight plans."
          secondaryAction={{ href: "/", label: "Back to splash" }}
          primaryAction={{ href: "/graphs", label: "My graphs" }}
        />

        <header className="mt-6 overflow-hidden rounded-[2.2rem] border border-border bg-[linear-gradient(135deg,rgba(255,248,238,0.92),rgba(255,241,228,0.82))] px-6 py-6 shadow-[0_28px_80px_rgba(0,0,0,0.08)] backdrop-blur sm:px-8 sm:py-8">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-muted">
                Welcome back
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-balance sm:text-5xl lg:text-6xl">
                Build styles, prep opponents, and keep every fight idea in one workspace.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
                Create new strategy graphs, edit existing ones, or jump back into a recent project. Your graphs are saved and always accessible.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/graphs"
                  className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong"
                >
                  Create new graph
                </Link>
                <Link
                  href="/graphs"
                  className="rounded-full border border-border bg-surface px-5 py-3 text-sm font-semibold transition hover:bg-surface-strong"
                >
                  View all graphs
                </Link>
              </div>
            </div>

            <section className="rounded-[1.8rem] border border-black/10 bg-[#221b16] p-5 text-[#fff6ee] shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ddbfa7]">
                Your workspace
              </p>
              <div className="mt-4 grid gap-3">
                <article className="rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-4">
                  <div className="flex items-end justify-between gap-3">
                    <p className="text-sm text-[#f5d8c4]">Total graphs</p>
                    <p className="text-3xl font-semibold tracking-[-0.05em]">{graphs.length}</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#e9d4c5]">All your strategy graphs in one place.</p>
                </article>
                <article className="rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-4">
                  <div className="flex items-end justify-between gap-3">
                    <p className="text-sm text-[#f5d8c4]">Public graphs</p>
                    <p className="text-3xl font-semibold tracking-[-0.05em]">{graphs.filter(g => g.is_public).length}</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#e9d4c5]">Shared with the community.</p>
                </article>
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
                    Get started
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                    Manage your graphs
                  </h2>
                </div>
                <span className="rounded-full border border-border px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-muted">
                  Quick access
                </span>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
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
                    Recent
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                    Your recent graphs
                  </h2>
                </div>
                <Link
                  href="/graphs"
                  className="rounded-full border border-border bg-background/70 px-4 py-2 text-sm font-medium transition hover:bg-surface-strong"
                >
                  View all
                </Link>
              </div>

              {loading ? (
                <div className="mt-5 text-center text-gray-500">Loading...</div>
              ) : recentGraphs.length === 0 ? (
                <div className="mt-5 rounded-[1.4rem] border border-border bg-background/60 px-5 py-8 text-center">
                  <p className="text-sm text-muted">No graphs yet. Create your first one to get started!</p>
                  <Link
                    href="/graphs"
                    className="mt-4 inline-block rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-strong"
                  >
                    Create now
                  </Link>
                </div>
              ) : (
                <div className="mt-5 grid gap-4">
                  {recentGraphs.map((graph) => (
                    <Link
                      key={graph.id}
                      href={`/graph_editor/${graph.id}`}
                      className="rounded-[1.4rem] border border-border bg-background/60 px-5 py-5 transition hover:border-black/15 hover:bg-background/80"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-lg font-semibold tracking-[-0.03em]">{graph.name}</p>
                          {graph.description && (
                            <p className="mt-1 text-sm text-muted line-clamp-1">{graph.description}</p>
                          )}
                        </div>
                        {graph.is_public && (
                          <span className="rounded-full border border-border px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-muted">
                            Public
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <GraphHierarchySkeleton />
            <BlueprintStyleLibrary />
          </div>

          <aside className="grid gap-6">
            <section className="rounded-[2rem] border border-border bg-[linear-gradient(180deg,rgba(31,27,24,0.98),rgba(53,40,31,0.95))] px-6 py-6 text-[#fff4ea] shadow-[0_26px_70px_rgba(0,0,0,0.14)]">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ddbfa7]">
                Tips
              </p>
              <div className="mt-4 grid gap-3">
                <article className="rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-4">
                  <p className="text-base font-semibold">Create a new graph</p>
                  <p className="mt-2 text-sm leading-6 text-[#edd9cb]">Structure your strategy with nodes and edges. Build complex hierarchies.</p>
                </article>
                <article className="rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-4">
                  <p className="text-base font-semibold">Edit anytime</p>
                  <p className="mt-2 text-sm leading-6 text-[#edd9cb]">Your graphs are automatically saved. Edit continuously without losing work.</p>
                </article>
                <article className="rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-4">
                  <p className="text-base font-semibold">Share publicly</p>
                  <p className="mt-2 text-sm leading-6 text-[#edd9cb]">Make any graph public to share with your community and get feedback.</p>
                </article>
              </div>
            </section>

            <section className="rounded-[2rem] border border-border bg-surface px-6 py-6 shadow-[0_22px_60px_rgba(0,0,0,0.06)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
                Quick links
              </p>
              <div className="mt-4 grid gap-3">
                <Link
                  href="/graphs"
                  className="rounded-[1.2rem] border border-border bg-background/60 px-4 py-4 text-sm font-medium transition hover:bg-background/80"
                >
                  Create a new graph
                </Link>
                <Link
                  href="/graphs"
                  className="rounded-[1.2rem] border border-border bg-background/60 px-4 py-4 text-sm font-medium transition hover:bg-background/80"
                >
                  Browse all graphs
                </Link>
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
