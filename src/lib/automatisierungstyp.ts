export const AUTOMATISIERUNGSTYP_IDS = [
  "agent",
  "workflow",
  "assistenz",
  "sonstiges",
] as const;

export type AutomatisierungstypId = (typeof AUTOMATISIERUNGSTYP_IDS)[number];

/** Satzanfang für empfehlung.begruendung — typabhängig (UI + Parser). */
export const EMPFEHLUNG_ANSATZ_PREFIX: Record<AutomatisierungstypId, string> = {
  agent: "Der KI-Agent-Ansatz passt am besten, weil",
  workflow: "Der Workflow-Ansatz passt am besten, weil",
  assistenz: "Der Assistenz-Ansatz passt am besten, weil",
  sonstiges: "Dieser Automatisierungsansatz passt am besten, weil",
};

export const AUTOMATISIERUNGSTYP_LABELS: Record<
  AutomatisierungstypId,
  { label: string; hint: string }
> = {
  agent: {
    label: "KI-Agent",
    hint: "Arbeitet teilautonom — plant Schritte und führt mehrere Aktionen nacheinander aus.",
  },
  workflow: {
    label: "Workflow-Automatisierung",
    hint: "Fester, wiederholbarer Ablauf — z. B. mit n8n, Make oder Zapier.",
  },
  assistenz: {
    label: "Assistenz / Einzelaufgabe",
    hint: "Unterstützt bei einer klar abgegrenzten Aufgabe — Mensch bleibt in der Schleife.",
  },
  sonstiges: {
    label: "Andere Form",
    hint: "Z. B. eingebettete Funktion in einem bestehenden System oder Speziallösung.",
  },
};

/** Badge-Klassen pro Typ — Marken-Spektrum aus tokens.css (DESIGN.md). */
export const AUTOMATISIERUNGSTYP_BADGE: Record<AutomatisierungstypId, string> = {
  agent:
    "border border-[color-mix(in_srgb,var(--brand-magenta)_30%,transparent)] bg-[color-mix(in_srgb,var(--brand-magenta)_10%,var(--color-card))] text-[var(--brand-magenta)]",
  workflow:
    "border border-[color-mix(in_srgb,var(--color-brand)_30%,transparent)] bg-[var(--color-accent-subtle)] text-[var(--color-brand)]",
  assistenz:
    "score-surface-accent border border-[color-mix(in_srgb,var(--score-accent-text)_25%,transparent)]",
  sonstiges:
    "surface-neutral border border-border text-muted-foreground",
};

export function isAutomatisierungstypId(
  value: string
): value is AutomatisierungstypId {
  return (AUTOMATISIERUNGSTYP_IDS as readonly string[]).includes(value);
}

const TYP_ALIASES: Record<string, AutomatisierungstypId> = {
  agent: "agent",
  ki_agent: "agent",
  "ki-agent": "agent",
  autonomous: "agent",
  workflow: "workflow",
  automation: "workflow",
  n8n: "workflow",
  make: "workflow",
  zapier: "workflow",
  assistenz: "assistenz",
  assistance: "assistenz",
  einzelaufgabe: "assistenz",
  sonstiges: "sonstiges",
  other: "sonstiges",
  integration: "sonstiges",
};

export function normalizeAutomatisierungstyp(
  raw: unknown
): AutomatisierungstypId | null {
  if (typeof raw !== "string") return null;
  const key = raw.trim().toLowerCase();
  if (isAutomatisierungstypId(key)) return key;
  return TYP_ALIASES[key] ?? null;
}
