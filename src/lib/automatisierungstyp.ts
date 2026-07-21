export const AUTOMATISIERUNGSTYP_IDS = [
  "agent",
  "workflow",
  "assistenz",
  "sonstiges",
] as const;

export type AutomatisierungstypId = (typeof AUTOMATISIERUNGSTYP_IDS)[number];

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
