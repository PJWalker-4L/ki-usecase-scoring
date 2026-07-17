"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CircleHelp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  QUESTIONS,
  computeScores,
  scoreColor,
  formatHours,
  CLASSIFICATION_STYLES,
  type Answers,
  type ClassificationColorKey,
} from "@/lib/scoring";
import FallSteckbrief from "@/components/FallSteckbrief";
import { EMPTY_BRIEF, RISIKO_BADGE, RISIKO_OPTIONS, type FallBrief } from "@/types/brief";
import { saveCase } from "@/lib/storage";

export default function FaktenScorer() {
  const [brief, setBrief] = useState<FallBrief>(EMPTY_BRIEF);
  const [answers, setAnswers] = useState<Answers>({});
  const [justSaved, setJustSaved] = useState(false);

  const answeredCount = QUESTIONS.filter((q) => answers[q.id]).length;
  const allAnswered = answeredCount === QUESTIONS.length;
  const result = computeScores(answers);
  const { hoursPerMonth, wertScore, machbarkeitScore, gesamtScore, einordnung } = result;

  useEffect(() => {
    if (!justSaved) return;
    const timeout = setTimeout(() => setJustSaved(false), 2500);
    return () => clearTimeout(timeout);
  }, [justSaved]);

  function reset() {
    setAnswers({});
    setBrief(EMPTY_BRIEF);
    setJustSaved(false);
  }

  function handleSave() {
    saveCase({ brief, answers, result });
    setJustSaved(true);
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-16">
      <header className="mb-10">
        <p className="text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Klarsicht · Fakten-Scorer
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
          Einen KI-Anwendungsfall bewerten
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
          Beantworte ein paar konkrete Fragen zu deinem Arbeitsalltag — und die
          Anwendung leitet{" "}
          <ScoreInfo
            label="Nutzen-Score"
            description="Gewichteter Wert aus gebundener Arbeitszeit (70 %) und strategischer Bedeutung fürs Geschäft (30 %)."
          />{" "}
          und{" "}
          <ScoreInfo
            label="Machbarkeits-Score"
            description="Gewichteter Wert aus Datenverfügbarkeit (50 %) und Wiederholbarkeit des Ablaufs (50 %)."
          />{" "}
          daraus ab.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Questions column */}
        <div className="flex flex-col gap-6">
          <FallSteckbrief brief={brief} onChange={setBrief} />

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
        <aside className="lg:sticky lg:top-8 lg:self-start flex flex-col gap-4">
          {/* Fall-Zusammenfassung */}
          {(brief.problem || brief.loesung || brief.ziel || brief.risiko) && (
            <Card className="rounded-2xl border-zinc-200 bg-white py-0 dark:border-zinc-800 dark:bg-zinc-900">
              <CardContent className="p-5">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Fall-Zusammenfassung
                </h2>
                <div className="flex flex-col gap-2.5">
                  {brief.problem && (
                    <div>
                      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Problem</p>
                      <p className="mt-0.5 line-clamp-2 text-sm text-zinc-800 dark:text-zinc-200">
                        {brief.problem}
                      </p>
                    </div>
                  )}
                  {brief.loesung && (
                    <div>
                      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Lösung</p>
                      <p className="mt-0.5 line-clamp-2 text-sm text-zinc-800 dark:text-zinc-200">
                        {brief.loesung}
                      </p>
                    </div>
                  )}
                  {brief.ziel && (
                    <div>
                      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Ziel</p>
                      <p className="mt-0.5 line-clamp-2 text-sm text-zinc-800 dark:text-zinc-200">
                        {brief.ziel}
                      </p>
                    </div>
                  )}
                  {brief.risiko && (
                    <div className="pt-1">
                      <Badge
                        variant="outline"
                        className={RISIKO_BADGE[brief.risiko]}
                      >
                        {RISIKO_OPTIONS.find((r) => r.id === brief.risiko)?.label}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="rounded-2xl border-zinc-200 bg-white py-0 dark:border-zinc-800 dark:bg-zinc-900">
            <CardContent className="p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Ergebnis
              </h2>

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
                        CLASSIFICATION_STYLES[einordnung.colorClass as ClassificationColorKey]?.badge ??
                          CLASSIFICATION_STYLES.zinc.badge,
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
                    <ScoreBar
                      label="Nutzen-Score"
                      value={wertScore}
                      description="Gewichteter Wert aus gebundener Arbeitszeit (70 %) und strategischer Bedeutung fürs Geschäft (30 %)."
                    />
                  )}
                  {machbarkeitScore != null && (
                    <ScoreBar
                      label="Machbarkeits-Score"
                      value={machbarkeitScore}
                      description="Gewichteter Wert aus Datenverfügbarkeit (50 %) und Wiederholbarkeit des Ablaufs (50 %)."
                    />
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

                  {/* Save */}
                  <div className="flex flex-col gap-2">
                    <Button onClick={handleSave} className="w-full">
                      {justSaved ? "Gespeichert" : "Fall speichern"}
                    </Button>
                    {justSaved && (
                      <Link
                        href="/faelle"
                        className="text-center text-xs font-medium text-zinc-500 underline-offset-4 hover:text-zinc-800 hover:underline dark:text-zinc-400 dark:hover:text-zinc-200"
                      >
                        Zur Rangliste →
                      </Link>
                    )}
                  </div>

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

function ScoreInfo({ label, description }: { label: string; description: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1 whitespace-nowrap font-medium text-zinc-700 underline decoration-dotted decoration-zinc-400 underline-offset-2 dark:text-zinc-300"
        >
          {label}
          <CircleHelp className="size-3.5 text-zinc-400 dark:text-zinc-500" />
        </button>
      </TooltipTrigger>
      <TooltipContent>{description}</TooltipContent>
    </Tooltip>
  );
}

function ScoreBar({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description?: string;
}) {
  const color = scoreColor(value) as ClassificationColorKey;
  const barColor = CLASSIFICATION_STYLES[color]?.bar ?? CLASSIFICATION_STYLES.zinc.bar;

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
      {description && (
        <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
      )}
    </div>
  );
}
