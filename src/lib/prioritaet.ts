import type { RisikoId } from "@/types/brief";

export function isPrioritaetAusgeschlossen(risiko: "" | RisikoId): boolean {
  return risiko === "inakzeptabel";
}

export function formatPrioritaetHinweis(
  gesamtScore: number | null,
  risiko: "" | RisikoId
): string | null {
  if (!isPrioritaetAusgeschlossen(risiko) || gesamtScore == null) return null;
  return `Berechneter Nutzen: ${gesamtScore} — Priorisierung: ausgeschlossen wegen Risiko`;
}
