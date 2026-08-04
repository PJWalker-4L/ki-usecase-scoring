export type RisikoId = "gering" | "ueberschaubar" | "hoch" | "inakzeptabel";

export type FallBrief = {
  problem: string;
  loesung: string;
  ziel: string;
  risiko: "" | RisikoId;
};

const BRIEF_RISIKO_VALUES: readonly FallBrief["risiko"][] = [
  "",
  "gering",
  "ueberschaubar",
  "hoch",
  "inakzeptabel",
];

export function isBriefRisiko(value: unknown): value is FallBrief["risiko"] {
  return (
    typeof value === "string" &&
    (BRIEF_RISIKO_VALUES as readonly string[]).includes(value)
  );
}

export const EMPTY_BRIEF: FallBrief = {
  problem: "",
  loesung: "",
  ziel: "",
  risiko: "",
};

/** Aktueller Ablauf und Ziel müssen gesetzt sein. */
export function isBriefCoreComplete(brief: FallBrief): boolean {
  return (
    brief.problem.trim().length > 0 && brief.ziel.trim().length > 0
  );
}

export const RISIKO_OPTIONS = [
  {
    id: "gering" as RisikoId,
    label: "Gering",
    activeClass: "score-surface-high border-[color-mix(in_srgb,var(--score-high-text)_35%,transparent)]",
    inactiveClass:
      "border-[color-mix(in_srgb,var(--score-high-text)_25%,transparent)] text-[var(--score-high-text)] hover:border-[color-mix(in_srgb,var(--score-high-text)_45%,transparent)]",
  },
  {
    id: "ueberschaubar" as RisikoId,
    label: "Überschaubar",
    activeClass: "score-surface-mid border-[color-mix(in_srgb,var(--score-mid-text)_35%,transparent)]",
    inactiveClass:
      "border-[color-mix(in_srgb,var(--score-mid-text)_25%,transparent)] text-[var(--score-mid-text)] hover:border-[color-mix(in_srgb,var(--score-mid-text)_45%,transparent)]",
  },
  {
    id: "hoch" as RisikoId,
    label: "Hoch",
    activeClass:
      "score-surface-accent border-[color-mix(in_srgb,var(--score-accent-text)_35%,transparent)]",
    inactiveClass:
      "border-[color-mix(in_srgb,var(--score-accent-text)_25%,transparent)] text-[var(--score-accent-text)] hover:border-[color-mix(in_srgb,var(--score-accent-text)_45%,transparent)]",
  },
  {
    id: "inakzeptabel" as RisikoId,
    label: "Nicht automatisieren",
    activeClass: "score-surface-low border-[color-mix(in_srgb,var(--score-low-text)_35%,transparent)]",
    inactiveClass:
      "border-[color-mix(in_srgb,var(--score-low-text)_25%,transparent)] text-[var(--score-low-text)] hover:border-[color-mix(in_srgb,var(--score-low-text)_45%,transparent)]",
  },
] as const;

/** Chip-Auswahl im Risiko-Schritt — betriebliche Labels, keine KI-VO-Klammern. */
export function getRisikoChipOptions() {
  return RISIKO_OPTIONS.map(({ id, label, activeClass, inactiveClass }) => ({
    id,
    label,
    activeClass,
    inactiveClass,
  }));
}

/** Aufklapp-Hinweis am Risiko-Schritt (Kontrollbedarf, keine Score-Reihenfolge). */
export const RISIKO_WARUM_HINWEIS = {
  toggle: "Warum fragt Klarsicht das?",
  text: "Die Stufe verändert nicht die Reihenfolge deiner Aufgaben, sondern zeigt, wie viel Kontrolle eine Automatisierung braucht — von „einfach laufen lassen“ bis „jeder Fall wird geprüft“. Im Zweifel die vorsichtigere Stufe.",
} as const;

/**
 * Kurzer, nicht wegklickbarer Haftungshinweis am Risiko-Schritt.
 * Keine Rechtsberatung / keine KI-VO-Einstufung — analog Inkrement J, hier verkürzt.
 */
export const RISIKO_COMPLIANCE_HINWEIS =
  "Ohne Gewähr — keine Rechtsberatung. Diese Einschätzung ist keine rechtsverbindliche Einstufung nach der EU-KI-Verordnung und ersetzt keine rechtliche Prüfung.";

export const RISIKO_BADGE: Record<RisikoId, string> = {
  gering: "score-surface-high border-[color-mix(in_srgb,var(--score-high-text)_20%,transparent)]",
  ueberschaubar:
    "score-surface-mid border-[color-mix(in_srgb,var(--score-mid-text)_20%,transparent)]",
  hoch: "score-surface-accent border-[color-mix(in_srgb,var(--score-accent-text)_20%,transparent)]",
  inakzeptabel:
    "score-surface-low border-[color-mix(in_srgb,var(--score-low-text)_20%,transparent)]",
};
