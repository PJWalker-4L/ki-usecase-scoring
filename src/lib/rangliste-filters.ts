import { isPrioritaetAusgeschlossen } from "@/lib/prioritaet";
import type { RisikoId } from "@/types/brief";
import type { CaseStatus, SavedCase } from "@/types/case";

export type PriorisierungFilterId =
  | "high"
  | "mid"
  | "accent"
  | "neutral"
  | "ausgeschlossen";

export type ScoreFilterId = "high" | "mid" | "low" | "none";

export type RisikoFilterId = RisikoId | "unset";

export type RanglisteFilterState = {
  priorisierung: PriorisierungFilterId[];
  status: CaseStatus[];
  score: ScoreFilterId[];
  risiko: RisikoFilterId[];
};

export const EMPTY_RANGLISTE_FILTERS: RanglisteFilterState = {
  priorisierung: [],
  status: [],
  score: [],
  risiko: [],
};

export const PRIORISIERUNG_FILTER_OPTIONS = [
  { id: "high" as const, label: "Quick Win" },
  { id: "mid" as const, label: "Strategischer Fall" },
  { id: "accent" as const, label: "Nebenbei" },
  { id: "neutral" as const, label: "Zurückstellen" },
  { id: "ausgeschlossen" as const, label: "Ausgeschlossen (Risiko)" },
];

export const STATUS_FILTER_OPTIONS = [
  { id: "unerledigt" as const, label: "Unerledigt" },
  { id: "erledigt" as const, label: "Erledigt" },
];

export const SCORE_FILTER_OPTIONS = [
  { id: "high" as const, label: "70–100" },
  { id: "mid" as const, label: "40–69" },
  { id: "low" as const, label: "0–39" },
  { id: "none" as const, label: "Ohne Score" },
];

export const RISIKO_FILTER_OPTIONS = [
  { id: "gering" as const, label: "Gering" },
  { id: "ueberschaubar" as const, label: "Überschaubar" },
  { id: "hoch" as const, label: "Hoch" },
  { id: "inakzeptabel" as const, label: "Inakzeptabel" },
  { id: "unset" as const, label: "Nicht gesetzt" },
];

export function getPriorisierungFilterId(item: SavedCase): PriorisierungFilterId {
  if (isPrioritaetAusgeschlossen(item.brief.risiko)) return "ausgeschlossen";
  const key = item.result.einordnung?.colorClass;
  if (key === "high" || key === "mid" || key === "accent" || key === "neutral") {
    return key;
  }
  return "neutral";
}

export function getScoreFilterId(score: number | null): ScoreFilterId {
  if (score == null) return "none";
  if (score >= 70) return "high";
  if (score >= 40) return "mid";
  return "low";
}

export function getRisikoFilterId(risiko: "" | RisikoId): RisikoFilterId {
  return risiko || "unset";
}

export function hasActiveRanglisteFilters(filters: RanglisteFilterState): boolean {
  return (
    filters.priorisierung.length > 0 ||
    filters.status.length > 0 ||
    filters.score.length > 0 ||
    filters.risiko.length > 0
  );
}

export function applyRanglisteFilters(
  cases: SavedCase[],
  filters: RanglisteFilterState
): SavedCase[] {
  return cases.filter((item) => {
    if (
      filters.priorisierung.length > 0 &&
      !filters.priorisierung.includes(getPriorisierungFilterId(item))
    ) {
      return false;
    }

    if (filters.status.length > 0 && !filters.status.includes(item.status)) {
      return false;
    }

    if (
      filters.score.length > 0 &&
      !filters.score.includes(getScoreFilterId(item.result.gesamtScore))
    ) {
      return false;
    }

    if (
      filters.risiko.length > 0 &&
      !filters.risiko.includes(getRisikoFilterId(item.brief.risiko))
    ) {
      return false;
    }

    return true;
  });
}
