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

/** Aktueller Ablauf und Ziel müssen gesetzt sein — Lösungsansatz ist optional. */
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
    activeClass: "surface-accent border-[color-mix(in_srgb,var(--color-accent)_35%,transparent)]",
    inactiveClass:
      "border-[color-mix(in_srgb,var(--color-accent)_25%,transparent)] text-primary hover:border-[color-mix(in_srgb,var(--color-accent)_45%,transparent)]",
  },
  {
    id: "inakzeptabel" as RisikoId,
    label: "Inakzeptabel",
    activeClass: "score-surface-low border-[color-mix(in_srgb,var(--score-low-text)_35%,transparent)]",
    inactiveClass:
      "border-[color-mix(in_srgb,var(--score-low-text)_25%,transparent)] text-[var(--score-low-text)] hover:border-[color-mix(in_srgb,var(--score-low-text)_45%,transparent)]",
  },
] as const;

export const RISIKO_BADGE: Record<RisikoId, string> = {
  gering: "score-surface-high border-[color-mix(in_srgb,var(--score-high-text)_20%,transparent)]",
  ueberschaubar:
    "score-surface-mid border-[color-mix(in_srgb,var(--score-mid-text)_20%,transparent)]",
  hoch: "surface-accent border-[color-mix(in_srgb,var(--color-accent)_20%,transparent)]",
  inakzeptabel:
    "score-surface-low border-[color-mix(in_srgb,var(--score-low-text)_20%,transparent)]",
};
