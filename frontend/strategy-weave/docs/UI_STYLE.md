# StratWeave UI style guide

Direction and constraints for **shipping** StratWeave: a serious tool for coaches and fighters to model gameplans, counters, and flows—not a disposable prototype skin.

**Implementation source of truth (today):** `app/globals.css` and Tailwind `@theme inline`. When visuals intentionally diverge from this document, update the doc in the same change so intent and code stay aligned.

---

## Product context

- **Primary job:** long-session work on strategy graphs (dense nodes, edges, metadata) plus lighter marketing and onboarding pages.
- **Sport positioning:** boxing-first today; the product should **read as fight-sport software**, not a generic diagramming toy, while staying respectful and serious (no caricature mascots or gimmick UI).
- **Users:** athletes and coaches who need clarity under fatigue; occasional collaborators who must orient in seconds.
- **Implication:** the **editor and library views** should feel like professional work software (calm neutrals, obvious hierarchy, minimal ornament). **Marketing** can stay slightly warmer and more expressive without borrowing the canvas’s visual noise.

---

## Sport-forward styling

Sport is the **identity layer**: language, imagery, and a few repeatable visual treatments. It must not fight the **focus layer** (editor calm, hierarchy, accessibility).

### Where sport reads loudest

- **Marketing, onboarding, empty states, and wins** — hero photography or illustration of real training contexts (gym tape, corner work, chalkboard tactics), headlines with fight-sport vocabulary, and short proof lines (e.g. “boxing-first,” camp workflow, opponent prep).
- **Sport chrome, not canvas noise** — badges, section labels, and module titles (“Camp,” “Opponent,” “Last session”) can use **compact uppercase / wide tracking** (same family as today’s kickers) so the app feels like a **corner notebook + performance tool**, not a slide deck.
- **Accent color** — treat `--accent` / `--accent-strong` as **competitive energy**: primary CTAs, live state, “you’re recording / sparring” indicators. Keep large backgrounds neutral; **punches of accent** carry the sport tone without painting the whole UI orange.

### Editor and graph (restraint + clarity)

- **Nodes and edges carry the sport *semantics*** — strategy, counter, approach, sequence, etc. already encode the domain; color choices should stay legible and consistent ([Strategy graph node colors](#strategy-graph-node-colors)).
- **Selection and “live” feedback** — slightly sharper motion or a **thin accent ring** on the active node or panel is enough “arena” signal; avoid animated textures behind the graph.
- **Telemetry strip (pattern)** — for timelines, round counters, or session meta, a **dense horizontal strip** (mono-friendly numbers, small caps labels) reads as **corner / scorecard** without new colors: `bg-surface-strong`, `border-border`, `text-muted` with **accent only for the active value** or timer.

### Language and motion

- **Microcopy** — prefer sport-accurate terms where they shorten understanding (“Counter,” “Approach,” “Scenario,” “Sequence”) over generic SaaS jargon (“Item,” “Block”).
- **Motion** — short, decisive transitions (snap-in panels, quick fade) suggest **explosiveness under control**; no bouncy elastic easing on core controls; respect `prefers-reduced-motion`.

### Don’t

- Literal clichés as default UI (boxing-glove favicons on every button, blood splatter, “fight night” neon frames).
- Low-contrast “grit” overlays on text-heavy screens.
- Anything that makes **tactical reading** harder for tired eyes after training.

---

## Per-sport visual themes (optional layer)

StratWeave can support **different sports without different products**: one shared **base theme** (backgrounds, surfaces, borders, typography, graph node semantics) plus an optional **sport skin** that shifts identity where it is safe—mainly **accent**, **marketing imagery**, **empty states**, and **terminology**—not a full second design system.

### What stays shared (all sports)

- **Layout, density, and editor chrome** — same components and spacing rules.
- **Graph node type colors** ([Strategy graph node colors](#strategy-graph-node-colors)) — keep **one global semantic palette** so graphs, exports, and collaboration read the same regardless of sport picker. If sport-specific node skins are ever added, treat them as an **optional preview mode**, not the default.
- **Focus, contrast, and motion rules** — every sport theme must pass the same accessibility bar in light and dark.

### What may vary by sport

| Layer | Allowed to change | Example mechanism (implementation when ready) |
| --- | --- | --- |
| **Accent** | `--accent`, `--accent-strong` (and optional future `--sport-secondary` for badges only) | Scoped CSS variables, e.g. `[data-sport="mma"]` on `html` or a layout root, with overrides in `globals.css` or a small `themes/sports/*.css` |
| **Marketing & empty states** | Photography, illustration, headline examples | Content keyed by sport slug |
| **Microcopy & telemetry** | Labels driven by domain (round vs period, cage vs ring, stance labels) | i18n or sport config, not new colors per label |
| **Templates & presets** | Default graph snippets, starter nodes | Product data, not CSS forks |

### Reference table

Directional only—not locked hex values. Use this to **align taste** with practitioners: warm vs cool, restrained energy. Tweak colors in implementation with real contrast checks—not literal “national flag” palettes.

| Sport / discipline | Accent character | Marketing / identity | Shell & telemetry voice |
| --- | --- | --- | --- |
| **Boxing** (default) | Warm terracotta / ring canvas energy — matches current tokens | Gym tape, corner, heavy bag context; “opponent,” “camp,” “gameplan” | **Rounds**, seconds between rounds, corner time |
| **MMA** | Slightly deeper or cooler red–orange (still high legibility on white/dark) | Cage + open mat, gloves and grappling mix; avoid blood/revenge tropes | **Round** (five-minute framing where relevant), **cage** vs mat in location labels |
| **Wrestling (folkstyle / freestyle)** | Cooler or steel–blue accent (disciplined, mat-first) | Mat, singlet, dual meet energy; scholastic respectfulness | **Period**, team score, weight class; clock-forward UI |
| **Judo / BJJ** | Deep indigo or restrained green (dōjō / tatami association without neon) | Tatami, grip fighting, respect ritual in imagery | **Mat time**, **scoreboard** / advantage language per ruleset |
| **Kickboxing / Muay Thai** | Amber–gold accent variant (distinct from boxing default if both ship) | Striking + rhythm; respect cultural context in art direction | **Round**, leg check, clinch framing in copy where useful |

**Adding a new sport:** add a row here first (accent intent + voice + imagery guardrails), then define **only** the accent overrides and content keys; do not fork button sizes, nav patterns, or graph physics.

### Guardrails

- **No sport gets a “cartoon skin”** — no different corner radii or font families per sport; identity is color + content + wording.
- **User override** — if the app knows preferred sport (profile or graph metadata), theme follows it; **editor remains readable** when sport is “unknown” (fall back to boxing or neutral default).
- **Stereotypes** — avoid lazy visuals (e.g. violent metaphors, clichéd national imagery). Ground references in **how coaches actually work** (film, pads, room tone).

---

## Comparable products (what to learn from them)

These are real references StratWeave should loosely track—not copies, but shared patterns for the same *kind* of problem (diagrams, lists, collaboration, daily use).

| Product | Role | What StratWeave should borrow |
| --- | --- | --- |
| [Linear](https://linear.app) | Issue tracking / dense app UI | **Variable visual weight:** the active task surface reads loudest; navigation and chrome recede. **Softer structure:** borders and separators clarify layout without shouting ([2024 UI refresh write-up](https://linear.app/now/how-we-redesigned-the-linear-ui)). **Theming discipline:** a small set of base + accent + contrast ideas scales to light/dark without one-off hex in components ([part Ⅱ](https://linear.app/now/how-we-redesigned-the-linear-ui)). |
| [Miro](https://miro.com/whiteboard/) | Infinite canvas, workshops | **Canvas vs chrome:** the board is neutral; tools live in predictable edges and panels, not scattered decoration. **Templates and empty states** teach the model quickly. **Zoomable space** implies readable node labels at multiple scales. |
| [FigJam](https://www.figma.com/figjam/) | Lightweight collaborative canvas | **Low tool overload** for first success; progressive depth for power users. **Playful but controlled** accents—energy without breaking focus on the graph. |

**Cross-cutting habits from these products**

1. **Hierarchy beats symmetry** — not every column or toolbar band needs equal contrast; primary work always wins.
2. **Structure is felt, not seen** — reduce border count and edge contrast as layouts mature; use spacing and type rhythm first.
3. **Density with rest** — show metadata where it matters (selection, inspector, hover); avoid billboard-sized chrome in the editor.
4. **Motion is informative** — short transitions for state changes; avoid decorative parallax or busy background motion behind reading tasks.
5. **Keyboard-friendly surfaces** — command palette / shortcuts can grow over time; controls should remain reachable and focusable from the keyboard ([Linear’s “keyboard-first, mouse-friendly” posture](https://linear.app/now/behind-the-latest-design-refresh) is the right aspiration).

---

## Visual north star (final product)

### Application shell (graphs, lists, settings)

- **Neutral foundation** — warm gray or near-neutral backgrounds; accent used for *actions* and *meaning* (selection, primary button, critical node types), not for large ambient fills.
- **Editor canvas** — prefer a **quiet field** (subtle dot grid or solid) so node colors and edges remain the main color story. Decorative page gradients belong on marketing routes, not behind the graph.
- **Typography** — a single clear scale (body, label, title); avoid mixing many tracking styles in one toolbar. **Mono** reserved for IDs, slugs, technical snippets—not body copy.
- **Components** — predictable heights for rows and controls; align to a small spacing grid (e.g. 4px base) even when Tailwind uses arbitrary values during migration.

### Marketing and splash

- May use **softer geometry, paper-like surfaces, and brand accent** more freely, still anchored to the same token system so the handoff from marketing → app does not feel like a different product.
- Lean into **sport-forward styling** here: real training context in imagery, punchy headlines, and accent-forward CTAs; see [Sport-forward styling](#sport-forward-styling).

### Graph semantics

- Node type colors stay **discriminable at a glance** and **accessible against** both canvas and selection states. The canonical mapping lives in `features/flow/components/nodes/nodeConstants.ts` (`FLOW_NODE_TYPE_OPTIONS`); any redesign keeps that list as the single source of truth.
- **Per-sport themes** may change accent in chrome but should **not** fork node type colors by default; see [Per-sport visual themes](#per-sport-visual-themes-optional-layer).

---

## Design tokens (implementation)

Defined on `:root` in `app/globals.css`, mirrored in `@theme inline` for Tailwind. Prefer **semantic utilities** (`bg-surface`, `text-muted`) over raw palette classes in app chrome so theme edits stay centralized.

| Token (CSS var) | Tailwind examples | Role |
| --- | --- | --- |
| `--background` | `bg-background` | App page base |
| `--foreground` | `text-foreground` | Primary text |
| `--surface` | `bg-surface` | Panels, cards, translucent bars |
| `--surface-strong` | `bg-surface-strong` | Elevated surfaces, hover |
| `--border` | `border-border` | Dividers and outlines |
| `--muted` | `text-muted` | Secondary text, meta |
| `--accent` | `bg-accent` | Primary actions, key highlights, **sport-energy** moments (CTAs, live state) |
| `--accent-strong` | `bg-accent-strong`, `hover:bg-accent-strong` | Emphasis / hover; **corner / urgency** without extra palette |
| `--grid` | (body background in current build) | **Aspirational:** lovely for marketing; **editor** should eventually use a subtler canvas treatment |

### Fonts

| Role | Variable | Tailwind |
| --- | --- | --- |
| UI | `--font-ui` | `font-sans` |
| Code | `--font-code` | `font-mono` |

Stacks today: **UI** — Avenir Next, Segoe UI, sans-serif. **Code** — IBM Plex Mono, system mono fallbacks. For shipping, validate webfont licensing and fallbacks if branding tightens.

### Dark mode

`prefers-color-scheme: dark` swaps the same variables. **Do not** hand-paint parallel light/dark styles in feature code unless a token is missing—extend `globals.css` instead.

---

## Interaction patterns (target)

### Actions

- **Primary:** filled accent, high contrast label (`text-white` on accent), clear hover (`accent-strong`).
- **Secondary:** bordered or soft surface; hover lifts slightly (background or border only—no layout shift).

### Panels and navigation

- Prefer **one** elevation language (shadow *or* border + surface), not stacked effects everywhere.
- Side nav and list chrome should read **dimmer than the document being edited** (per Linear’s sidebar receding guidance).

### Layout

- Comfortable page gutters on marketing; **editor** maximizes usable canvas with collapsible or compact inspectors.
- Headings: strong hierarchy, `text-balance` where it helps multi-line titles; avoid oversized hero type inside authenticated tools.

### Utilities

- `scrollbar-none` in `globals.css` — use only where overflow is intentional and keyboard scroll still works.

---

## Strategy graph node colors

Central list: `features/flow/components/nodes/nodeConstants.ts`.

| Node kind | Palette (chip / border) |
| --- | --- |
| Strategy | amber |
| Scenario | sky |
| Sequence / Flow | violet |
| State | emerald |
| Action | rose |
| Decision | orange |
| Counter | red |
| Approach | lime |
| Note | stone |
| Generic | slate |

New types **must** register here so the editor, legend, and exports stay consistent.

---

## Toasts and feedback

`react-hot-toast` in root layout. Copy should be **short and reversible** (undo where applicable). If toast styling diverges from defaults, document severity → color mapping here.

---

## Accessibility and quality bar

- **Contrast:** muted text on surfaces must meet WCAG intent for body-adjacent sizes; graph nodes need checked contrast for labels on chip fills.
- **Focus:** visible focus rings on every interactive control; no `outline-none` without a deliberate replacement.
- **Motion:** respect `prefers-reduced-motion` for nonessential animation.

---

## Contributing

1. **New global colors or fonts:** `:root` + `@theme inline` in `globals.css`, then this table.
2. **New sport theme:** update the [per-sport reference table](#reference-table), add paired light/dark accent overrides with contrast proof, and avoid new one-off utilities in feature JSX—extend the theme layer.
3. **Arbitrary values in JSX:** acceptable for migration; prefer tokens or shared constants for anything repeated twice.
4. **Doc vs product drift:** if the UI intentionally moves toward the north star (e.g. quieter editor canvas), update **Comparable products** or **Visual north star** only when the team agrees the direction changed.

---

## Further reading (external)

- [How we redesigned the Linear UI (part Ⅱ)](https://linear.app/now/how-we-redesigned-the-linear-ui) — hierarchy, density, LCH theming.
- [A calmer interface for a product in motion](https://linear.app/now/behind-the-latest-design-refresh) — receding chrome, icon discipline, consistency.
- [Miro — online whiteboard](https://miro.com/whiteboard/) — canvas-led collaboration expectations.
- [FigJam](https://www.figma.com/figjam/) — approachable canvas onboarding and simplicity.
