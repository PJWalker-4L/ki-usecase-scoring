"use client";

import { useState } from "react";

type Option = {
  id: string;
  label: string;
  hint?: string;
  /** Auf 0..100 normierter Beitrag dieser Antwort zum jeweiligen Kriterium. */
  points: number;
  /** Nur für Häufigkeit: Vorkommen pro Monat (für die Stunden-Hochrechnung). */
  perMonth?: number;
  /** Nur für Zeitaufwand: Minuten pro Durchführung. */
  minutes?: number;
  /** Nur für Personenzahl: Anzahl betroffener Personen (für die Hochrechnung). */
  persons?: number;
};

type Question = {
  id: string;
  title: string;
  subtitle: string;
  /** Welchem Ergebnisblock die Antwort zugerechnet wird. */
  dimension: "wert" | "machbarkeit";
  options: Option[];
};

const QUESTIONS: Question[] = [
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

type Answers = Record<string, string>;

function findOption(question: Question, optionId: string | undefined): Option | undefined {
  if (!optionId) return undefined;
  return question.options.find((o) => o.id === optionId);
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export default function FaktenScorer() {
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState<Answers>({});

  const answeredCount = QUESTIONS.filter((q) => answers[q.id]).length;
  const allAnswered = answeredCount === QUESTIONS.length;

  const haeufigkeit = findOption(QUESTIONS[0], answers["haeufigkeit"]);
  const zeitaufwand = findOption(QUESTIONS[1], answers["zeitaufwand"]);
  const personen = findOption(QUESTIONS[2], answers["personen"]);
  const strategie = findOption(QUESTIONS[3], answers["strategie"]);
  const daten = findOption(QUESTIONS[4], answers["daten"]);
  const standard = findOption(QUESTIONS[5], answers["standard"]);

  // Konkrete, nachvollziehbare Kennzahl: gebundene Arbeitszeit pro Monat.
  const hoursPerMonth =
    haeufigkeit?.perMonth != null && zeitaufwand?.minutes != null && personen?.persons != null
      ? (haeufigkeit.perMonth * zeitaufwand.minutes * personen.persons) / 60
      : null;

  // Zeit-Wert aus der konkreten Stundenzahl (40 h/Monat ≈ Vollausschlag).
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

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-16">
      <header className="mb-10">
        <p className="text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          KIST · Fakten-Scorer
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
          Einen KI-Anwendungsfall bewerten
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
          Keine abstrakten Noten. Beantworte ein paar konkrete Fragen zu deinem
          Arbeitsalltag — das Werkzeug leitet Wert und Machbarkeit daraus ab.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <label
              htmlFor="usecase-name"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Um welche Aufgabe geht es?
            </label>
            <input
              id="usecase-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z. B. Eingangsrechnungen sortieren und zuordnen"
              className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-100 dark:focus:ring-zinc-100/10"
            />
          </div>

          {QUESTIONS.map((question, index) => {
            const selected = answers[question.id];
            return (
              <fieldset
                key={question.id}
                className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <legend className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-zinc-400 dark:text-zinc-500">
                    {index + 1}
                  </span>
                  <span className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                    {question.title}
                  </span>
                </legend>
                <p className="mb-4 mt-1 pl-6 text-sm text-zinc-500 dark:text-zinc-400">
                  {question.subtitle}
                </p>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {question.options.map((option) => {
                    const active = selected === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() =>
                          setAnswers((prev) => ({ ...prev, [question.id]: option.id }))
                        }
                        className={[
                          "flex flex-col items-start rounded-xl border px-3.5 py-3 text-left transition",
                          active
                            ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                            : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-zinc-500",
                        ].join(" ")}
                      >
                        <span className="text-sm font-medium">{option.label}</span>
                        {option.hint && (
                          <span
                            className={[
                              "mt-0.5 text-xs",
                              active
                                ? "text-white/70 dark:text-zinc-900/70"
                                : "text-zinc-500 dark:text-zinc-400",
                            ].join(" ")}
                          >
                            {option.hint}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            );
          })}
        </div>

        <aside className="lg:sticky lg:top-8 lg:self-start">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Ergebnis
            </h2>

            {name.trim() && (
              <p className="mt-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                {name.trim()}
              </p>
            )}

            {!allAnswered ? (
              <div className="mt-4">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Beantworte die Fragen, um die Bewertung zu sehen.
                </p>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-zinc-900 transition-all dark:bg-zinc-100"
                    style={{ width: `${(answeredCount / QUESTIONS.length) * 100}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                  {answeredCount} von {QUESTIONS.length} beantwortet
                </p>
              </div>
            ) : (
              <div className="mt-4 flex flex-col gap-5">
                {hoursPerMonth != null && (
                  <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-950">
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Gebundene Arbeitszeit
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                      ≈ {formatHours(hoursPerMonth)} / Monat
                    </p>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      Hochgerechnet aus Häufigkeit, Dauer und Personenzahl —
                      das ist das Einsparpotenzial, um das es geht.
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Gesamt-Score</span>
                  <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                    {gesamtScore}
                  </span>
                </div>

                <ScoreBar label="Wert" value={wertScore!} />
                <ScoreBar label="Machbarkeit" value={machbarkeitScore!} />

                {einordnung && (
                  <div
                    className={`rounded-xl border p-4 ${einordnung.className}`}
                  >
                    <p className="text-sm font-semibold">{einordnung.title}</p>
                    <p className="mt-1 text-xs opacity-80">{einordnung.description}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm text-zinc-600 dark:text-zinc-400">{label}</span>
        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{value}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div
          className="h-full rounded-full bg-zinc-900 transition-all dark:bg-zinc-100"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function classify(
  wert: number,
  machbarkeit: number,
): { title: string; description: string; className: string } {
  const wertHoch = wert >= 50;
  const machbarHoch = machbarkeit >= 50;

  if (wertHoch && machbarHoch) {
    return {
      title: "Quick Win — als Erstes angehen",
      description: "Hoher Nutzen und gut machbar. Idealer Startpunkt.",
      className:
        "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200",
    };
  }
  if (wertHoch && !machbarHoch) {
    return {
      title: "Strategischer Fall — Potenzial mit Aufwand",
      description: "Der Nutzen ist da, aber Daten oder Ablauf müssen erst vorbereitet werden.",
      className:
        "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200",
    };
  }
  if (!wertHoch && machbarHoch) {
    return {
      title: "Nebenbei-Verbesserung",
      description: "Leicht umsetzbar, aber begrenzter Hebel. Mitnehmen, wenn Kapazität frei ist.",
      className:
        "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900/50 dark:bg-sky-950/40 dark:text-sky-200",
    };
  }
  return {
    title: "Zurückstellen",
    description: "Aktuell weder großer Hebel noch leicht machbar. Später erneut prüfen.",
    className:
      "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300",
  };
}

function formatHours(hours: number): string {
  if (hours >= 10) return `${Math.round(hours)} Std.`;
  if (hours >= 1) return `${hours.toFixed(1).replace(".", ",")} Std.`;
  const minutes = Math.round(hours * 60);
  return `${minutes} Min.`;
}
