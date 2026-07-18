export type Option = {
  id: string;
  label: string;
  hint?: string;
  points: number;
  perMonth?: number;
  minutes?: number;
  persons?: number;
};

export type Question = {
  id: string;
  title: string;
  subtitle: string;
  dimension: "wert" | "machbarkeit";
  options: Option[];
};

export type Answers = Record<string, string>;

export type Classification = {
  title: string;
  description: string;
  colorClass: string;
};

export type ScoreResult = {
  hoursPerMonth: number | null;
  wertScore: number | null;
  machbarkeitScore: number | null;
  gesamtScore: number | null;
  einordnung: Classification | null;
};

export const QUESTIONS: Question[] = [
  {
    id: "haeufigkeit",
    title: "Wie oft fällt diese Aufgabe an?",
    subtitle: "Denk an einen normalen Arbeitsmonat.",
    dimension: "wert",
    options: [
      { id: "mehrmals-taeglich", label: "Mehrmals täglich", points: 100, perMonth: 40 },
      { id: "taeglich", label: "Täglich", points: 85, perMonth: 20 },
      { id: "mehrmals-woche", label: "Mehrmals pro Woche", points: 65, perMonth: 12 },
      { id: "woechentlich", label: "Wöchentlich", points: 45, perMonth: 4 },
      { id: "monatlich", label: "Monatlich", points: 20, perMonth: 1 },
      { id: "seltener", label: "Seltener", points: 8, perMonth: 0.3 },
    ],
  },
  {
    id: "zeitaufwand",
    title: "Wie lange dauert es pro Mal?",
    subtitle: "Grobe Schätzung reicht — von Beginn bis Ergebnis.",
    dimension: "wert",
    options: [
      { id: "5", label: "Ca. 5 Minuten", points: 15, minutes: 5 },
      { id: "15", label: "Ca. 15 Minuten", points: 35, minutes: 15 },
      { id: "30", label: "Ca. 30 Minuten", points: 55, minutes: 30 },
      { id: "60", label: "Ca. 1 Stunde", points: 75, minutes: 60 },
      { id: "120", label: "Ca. 2 Stunden", points: 90, minutes: 120 },
      { id: "240", label: "Ein halber Tag oder mehr", points: 100, minutes: 240 },
    ],
  },
  {
    id: "personen",
    title: "Wie viele Personen machen das?",
    subtitle: "Alle, die diese Aufgabe regelmäßig erledigen.",
    dimension: "wert",
    options: [
      { id: "1", label: "Eine Person", points: 30, persons: 1 },
      { id: "2-3", label: "2–3 Personen", points: 55, persons: 2.5 },
      { id: "4-10", label: "4–10 Personen", points: 80, persons: 6 },
      { id: "10+", label: "Mehr als 10", points: 100, persons: 15 },
    ],
  },
  {
    id: "strategie",
    title: "Hängt etwas Wichtiges direkt daran?",
    subtitle: "Umsatz, Kundenzufriedenheit oder Termintreue.",
    dimension: "wert",
    options: [
      { id: "ja", label: "Ja, spürbar", hint: "Fehler oder Verzug fallen sofort auf", points: 100 },
      { id: "indirekt", label: "Indirekt", hint: "Wirkt mit, ist aber nicht allein entscheidend", points: 55 },
      { id: "nein", label: "Eher nicht", hint: "Reine interne Fleißarbeit", points: 20 },
    ],
  },
  {
    id: "daten",
    title: "Wie liegen die nötigen Daten vor?",
    subtitle: "Alles, was man zum Erledigen der Aufgabe braucht.",
    dimension: "machbarkeit",
    options: [
      { id: "digital-strukturiert", label: "Digital & strukturiert", hint: "z. B. sauber in einem System", points: 100 },
      { id: "digital-verstreut", label: "Digital, aber verstreut", hint: "mehrere Tools, Excel, E-Mails", points: 65 },
      { id: "teils-papier", label: "Teils auf Papier", hint: "Mischung aus digital und analog", points: 35 },
      { id: "papier-koepfe", label: "Nur Papier oder im Kopf", hint: "nicht digital erfasst", points: 10 },
    ],
  },
  {
    id: "standard",
    title: "Läuft die Aufgabe immer gleich ab?",
    subtitle: "Feste Regeln oder viel Einzelfall-Urteil?",
    dimension: "machbarkeit",
    options: [
      { id: "immer-gleich", label: "Immer gleich", hint: "klare, wiederkehrende Schritte", points: 100 },
      { id: "meist-gleich", label: "Meist gleich", hint: "mit gelegentlichen Ausnahmen", points: 60 },
      { id: "variabel", label: "Stark unterschiedlich", hint: "viel Erfahrung & Urteil nötig", points: 25 },
    ],
  },
];

function findOption(question: Question, optionId: string | undefined): Option | undefined {
  if (!optionId) return undefined;
  return question.options.find((o) => o.id === optionId);
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function computeScores(answers: Answers): ScoreResult {
  const haeufigkeit = findOption(QUESTIONS[0], answers["haeufigkeit"]);
  const zeitaufwand = findOption(QUESTIONS[1], answers["zeitaufwand"]);
  const personen = findOption(QUESTIONS[2], answers["personen"]);
  const strategie = findOption(QUESTIONS[3], answers["strategie"]);
  const daten = findOption(QUESTIONS[4], answers["daten"]);
  const standard = findOption(QUESTIONS[5], answers["standard"]);

  const allAnswered = QUESTIONS.every((q) => answers[q.id]);

  const hoursPerMonth =
    haeufigkeit?.perMonth != null && zeitaufwand?.minutes != null && personen?.persons != null
      ? (haeufigkeit.perMonth * zeitaufwand.minutes * personen.persons) / 60
      : null;

  const timeValue = hoursPerMonth != null ? clamp((hoursPerMonth / 40) * 100) : 0;

  const wertScore =
    allAnswered && strategie
      ? clamp(0.7 * timeValue + 0.3 * strategie.points)
      : null;

  const machbarkeitScore =
    daten && standard ? clamp(0.5 * daten.points + 0.5 * standard.points) : null;

  const gesamtScore =
    wertScore != null && machbarkeitScore != null
      ? clamp(0.6 * wertScore + 0.4 * machbarkeitScore)
      : null;

  const einordnung =
    wertScore != null && machbarkeitScore != null
      ? classify(wertScore, machbarkeitScore)
      : null;

  return { hoursPerMonth, wertScore, machbarkeitScore, gesamtScore, einordnung };
}

export function classify(wert: number, machbarkeit: number): Classification {
  const wertHoch = wert >= 50;
  const machbarHoch = machbarkeit >= 50;

  if (wertHoch && machbarHoch) {
    return {
      title: "Quick Win — als Erstes angehen",
      description: "Hoher Nutzen und gut machbar. Idealer Startpunkt.",
      colorClass: "high",
    };
  }
  if (wertHoch && !machbarHoch) {
    return {
      title: "Strategischer Fall — Potenzial mit Aufwand",
      description: "Der Nutzen ist da, aber Daten oder Ablauf müssen erst vorbereitet werden.",
      colorClass: "mid",
    };
  }
  if (!wertHoch && machbarHoch) {
    return {
      title: "Nebenbei-Verbesserung",
      description: "Leicht umsetzbar, aber begrenzter Hebel. Mitnehmen, wenn Kapazität frei ist.",
      colorClass: "accent",
    };
  }
  return {
    title: "Zurückstellen",
    description: "Aktuell weder großer Hebel noch leicht machbar. Später erneut prüfen.",
    colorClass: "neutral",
  };
}

const SCORE_STYLE = {
  high: {
    badge: "score-surface-high border border-[color-mix(in_srgb,var(--score-high-text)_20%,transparent)]",
    bar: "score-bar-high",
  },
  mid: {
    badge: "score-surface-mid border border-[color-mix(in_srgb,var(--score-mid-text)_20%,transparent)]",
    bar: "score-bar-mid",
  },
  low: {
    badge: "score-surface-low border border-[color-mix(in_srgb,var(--score-low-text)_20%,transparent)]",
    bar: "score-bar-low",
  },
  neutral: {
    badge: "surface-neutral border border-border",
    bar: "bg-muted-foreground/40",
  },
  accent: {
    badge: "surface-accent border border-[color-mix(in_srgb,var(--color-accent)_20%,transparent)]",
    bar: "bg-primary",
  },
} as const;

export const CLASSIFICATION_STYLES = {
  ...SCORE_STYLE,
  emerald: SCORE_STYLE.high,
  amber: SCORE_STYLE.mid,
  sky: SCORE_STYLE.accent,
  zinc: SCORE_STYLE.neutral,
  red: SCORE_STYLE.low,
} as const;

export type ClassificationColorKey = keyof typeof CLASSIFICATION_STYLES;

export function scoreColor(value: number): keyof typeof SCORE_STYLE {
  if (value >= 70) return "high";
  if (value >= 40) return "mid";
  return "low";
}

export function formatHours(hours: number): string {
  if (hours >= 10) return `${Math.round(hours)} Std.`;
  if (hours >= 1) return `${hours.toFixed(1).replace(".", ",")} Std.`;
  const minutes = Math.round(hours * 60);
  return `${minutes} Min.`;
}
