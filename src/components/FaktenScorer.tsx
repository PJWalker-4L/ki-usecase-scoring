"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  QUESTIONS,
  computeScores,
  scoreColor,
  formatHours,
  type Answers,
} from "@/lib/scoring";

const COLOR_STYLES = {
  emerald: {
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
    bar: "bg-emerald-500",
  },
  amber: {
    badge: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
    bar: "bg-amber-400",
  },
  sky: {
    badge: "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800",
    bar: "bg-sky-500",
  },
  zinc: {
    badge: "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
    bar: "bg-zinc-400",
  },
  red: {
    badge: "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800",
    bar: "bg-red-400",
  },
} as const;

type ColorKey = keyof typeof COLOR_STYLES;

export default function FaktenScorer() {
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState<Answers>({});

  const answeredCount = QUESTIONS.filter((q) => answers[q.id]).length;
  const allAnswered = answeredCount === QUESTIONS.length;
  const { hoursPerMonth, wertScore, machbarkeitScore, gesamtScore, einordnung } =
    computeScores(answers);

  function reset() {
    setAnswers({});
    setName("");
  }

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
        {/* Questions column */}
        <div className="flex flex-col gap-6">
          <Card className="rounded-2xl border-zinc-200 bg-white py-0 dark:border-zinc-800 dark:bg-zinc-900">
            <CardContent className="p-5">
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
            </CardContent>
          </Card>

          {QUESTIONS.map((question, index) => {
            const selected = answers[question.id];
            return (
              <Card
                key={question.id}
                className="rounded-2xl border-zinc-200 bg-white py-0 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <CardContent className="p-5">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm font-semibold text-zinc-400 dark:text-zinc-500">
                      {index + 1}
                    </span>
                    <span className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                      {question.title}
                    </span>
                  </div>
                  <p className="mb-4 pl-5 text-sm text-zinc-500 dark:text-zinc-400">
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
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Results sidebar */}
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <Card className="rounded-2xl border-zinc-200 bg-white py-0 dark:border-zinc-800 dark:bg-zinc-900">
            <CardContent className="p-6">
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
                  <Progress
                    value={(answeredCount / QUESTIONS.length) * 100}
                    className="mt-4 h-2 bg-zinc-100 dark:bg-zinc-800"
                  />
                  <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                    {answeredCount} von {QUESTIONS.length} beantwortet
                  </p>
                </div>
              ) : (
                <div className="mt-4 flex flex-col gap-5">
                  {/* 1 — Classification hero */}
                  {einordnung && (
                    <div
                      className={[
                        "rounded-xl border p-4",
                        COLOR_STYLES[einordnung.colorClass as ColorKey]?.badge ??
                          COLOR_STYLES.zinc.badge,
                      ].join(" ")}
                    >
                      <p className="text-sm font-semibold">{einordnung.title}</p>
                      <p className="mt-1 text-xs opacity-80">{einordnung.description}</p>
                    </div>
                  )}

                  {/* 2 — Gesamt-Score */}
                  {gesamtScore != null && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">
                        Gesamt-Score
                      </span>
                      <span className="text-3xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
                        {gesamtScore}
                        <span className="text-sm font-normal text-zinc-400 dark:text-zinc-500">
                          /100
                        </span>
                      </span>
                    </div>
                  )}

                  {/* 3 — Colored score bars */}
                  {wertScore != null && (
                    <ScoreBar label="Wert" value={wertScore} />
                  )}
                  {machbarkeitScore != null && (
                    <ScoreBar label="Machbarkeit" value={machbarkeitScore} />
                  )}

                  {/* 4 — Hours basis */}
                  {hoursPerMonth != null && (
                    <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-950">
                      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Gebundene Arbeitszeit
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                        ≈ {formatHours(hoursPerMonth)} / Monat
                      </p>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        Hochgerechnet aus Häufigkeit, Dauer und Personenzahl.
                      </p>
                    </div>
                  )}

                  {/* Reset */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={reset}
                    className="w-full text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                  >
                    Neue Bewertung
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = scoreColor(value) as ColorKey;
  const barColor = COLOR_STYLES[color]?.bar ?? COLOR_STYLES.zinc.bar;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm text-zinc-600 dark:text-zinc-400">{label}</span>
        <span className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
          {value}
        </span>
      </div>
      <Progress
        value={value}
        className="h-2 bg-zinc-100 dark:bg-zinc-800"
        indicatorClassName={barColor}
      />
    </div>
  );
}
