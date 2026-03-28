import Link from "next/link";
import { fetchPublicBags, type Bag } from "@/lib/api";

export default async function BagsPage() {
  const bags = await fetchPublicBags();

  return (
    <main className="min-h-dvh p-6 sm:p-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="rounded-xl border border-border bg-surface p-4">
          <h1 className="text-2xl font-semibold">Training Bags</h1>
          <p className="mt-1 text-sm text-muted">
            Explore public training bags created by the community, including film studies and specialized collections.
          </p>
        </header>

        <section className="rounded-xl border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Public Bags</h2>
            <Link
              href="/bag"
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-strong"
            >
              My Personal Bag
            </Link>
          </div>

          {bags.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No public bags available yet.</p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {bags.map((bag) => (
                <Link
                  key={bag.id}
                  href={`/bags/${bag.id}`}
                  className="block rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-slate-900 dark:hover:bg-slate-800"
                >
                  <h3 className="font-semibold">{bag.name}</h3>
                  {bag.description && (
                    <p className="mt-1 text-sm text-muted">{bag.description}</p>
                  )}
                  <p className="mt-2 text-xs text-muted">
                    Created {bag.created_at ? new Date(bag.created_at).toLocaleDateString() : "Unknown"}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}