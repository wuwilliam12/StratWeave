export const SPORT_IDS = ["boxing", "mma", "wrestling", "judo-bjj", "kickboxing"] as const;

export type SportId = (typeof SPORT_IDS)[number];

export type SportDefinition = {
  id: SportId;
  label: string;
  /** Default kicker line under the StratWeave wordmark when pages do not pass `subtitle`. */
  navSubtitle: string;
};

export const SPORTS: readonly SportDefinition[] = [
  {
    id: "boxing",
    label: "Boxing",
    navSubtitle: "Strategy graphs for fighters, coaches, and systems thinkers.",
  },
  {
    id: "mma",
    label: "MMA",
    navSubtitle: "Gameplans for the cage: striking entries, grappling chains, and transitions.",
  },
  {
    id: "wrestling",
    label: "Wrestling",
    navSubtitle: "Mat maps for periods, setups, and hand-fighting sequences.",
  },
  {
    id: "judo-bjj",
    label: "Judo / BJJ",
    navSubtitle: "Grips, throws, and ground exchanges as connected systems.",
  },
  {
    id: "kickboxing",
    label: "Kickboxing / Muay Thai",
    navSubtitle: "Rhythm, range, and counters—mapped the way you train them.",
  },
] as const;

export const SPORT_STORAGE_KEY = "stratweave-sport";

export function parseSportId(raw: string | null | undefined): SportId {
  if (raw && (SPORT_IDS as readonly string[]).includes(raw)) {
    return raw as SportId;
  }
  return "boxing";
}

export function sportDefinition(id: SportId): SportDefinition {
  const found = SPORTS.find((s) => s.id === id);
  if (!found) {
    return SPORTS[0];
  }
  return found;
}
