"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  parseSportId,
  sportDefinition,
  SPORT_STORAGE_KEY,
  type SportDefinition,
  type SportId,
} from "@/lib/sports";

type SportContextValue = {
  sportId: SportId;
  sport: SportDefinition;
  setSportId: (id: SportId) => void;
};

const SportContext = createContext<SportContextValue | undefined>(undefined);

function applyDocumentSport(id: SportId) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.sport = id;
}

export function SportProvider({ children }: { children: ReactNode }) {
  const [sportId, setSportIdState] = useState<SportId>("boxing");

  useLayoutEffect(() => {
    try {
      const stored = parseSportId(localStorage.getItem(SPORT_STORAGE_KEY));
      setSportIdState(stored);
      applyDocumentSport(stored);
    } catch {
      applyDocumentSport("boxing");
    }
  }, []);

  const setSportId = useCallback((id: SportId) => {
    setSportIdState(id);
    try {
      localStorage.setItem(SPORT_STORAGE_KEY, id);
    } catch {
      /* ignore quota / private mode */
    }
    applyDocumentSport(id);
  }, []);

  const value = useMemo<SportContextValue>(
    () => ({
      sportId,
      sport: sportDefinition(sportId),
      setSportId,
    }),
    [sportId, setSportId],
  );

  return <SportContext.Provider value={value}>{children}</SportContext.Provider>;
}

export function useSport(): SportContextValue {
  const ctx = useContext(SportContext);
  if (!ctx) {
    throw new Error("useSport must be used within a SportProvider");
  }
  return ctx;
}
