import Link from "next/link";

type NavItem = {
  href: string;
  label: string;
};

type NavbarProps = {
  subtitle?: string;
  primaryAction?: NavItem;
  secondaryAction?: NavItem;
};

const navItems: NavItem[] = [
  { href: "/", label: "Splash" },
  { href: "/home", label: "Home" },
  { href: "/graph_editor", label: "Editor" },
];

export default function Navbar({
  subtitle = "Strategy graphs for fighters, coaches, and systems thinkers.",
  primaryAction = { href: "/graph_editor", label: "Open editor" },
  secondaryAction = { href: "/home", label: "View home" },
}: NavbarProps) {
  return (
    // Shared top-level nav shell for marketing and app-facing pages.
    <header className="rounded-[1.75rem] border border-border bg-surface px-5 py-4 shadow-[0_18px_60px_rgba(0,0,0,0.08)] backdrop-blur">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <Link href="/" className="inline-block">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted">
              StratWeave
            </p>
          </Link>
          <p className="mt-2 max-w-xl text-sm text-muted">{subtitle}</p>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          {/* Core route links stay visible even before auth/app state exists. */}
          <nav
            aria-label="Primary"
            className="flex flex-wrap items-center gap-2 text-sm font-medium"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-border px-4 py-2 transition hover:bg-surface-strong"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Action slots let each page swap in its own primary CTA pair. */}
          <div className="flex flex-wrap gap-2">
            <Link
              href={secondaryAction.href}
              className="rounded-full border border-border bg-surface-strong px-4 py-2 text-sm font-medium transition hover:bg-white/60"
            >
              {secondaryAction.label}
            </Link>
            <Link
              href={primaryAction.href}
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-strong"
            >
              {primaryAction.label}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
