"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChoiceGroup,
  FlowShell,
  ScoreMeter,
  SectionLabel,
  SurfaceCard,
} from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FallSteckbrief from "@/components/FallSteckbrief";
import {
  QUESTIONS,
  computeScores,
  formatHours,
  CLASSIFICATION_STYLES,
  type Answers,
  type ClassificationColorKey,
} from "@/lib/scoring";
import { EMPTY_BRIEF, RISIKO_BADGE, RISIKO_OPTIONS, isBriefCoreComplete, type FallBrief } from "@/types/brief";
import { saveCase } from "@/lib/storage";

/** brief + 6 questions + result */
const STEP_COUNT = QUESTIONS.length + 2;

type Step = "brief" | number | "result";

function stepIndex(step: Step): number {
  if (step === "brief") return 0;
  if (step === "result") return QUESTIONS.length + 1;
  return step + 1;
}

export default function FaktenScorer() {
  const [brief, setBrief] = useState<FallBrief>(EMPTY_BRIEF);
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState<Step>("brief");
  const [justSaved, setJustSaved] = useState(false);

  const result = computeScores(answers);
  const { hoursPerMonth, wertScore, machbarkeitScore, gesamtScore, einordnung } =
    result;
  const briefComplete = isBriefCoreComplete(brief);

  useEffect(() => {
    if (!justSaved) return;
    const timeout = setTimeout(() => setJustSaved(false), 2500);
    return () => clearTimeout(timeout);
  }, [justSaved]);

  function reset() {
    setAnswers({});
    setBrief(EMPTY_BRIEF);
    setJustSaved(false);
    setStep("brief");
  }

  function handleSave() {
    saveCase({ brief, answers, result });
    setJustSaved(true);
  }

  function goNextFromBrief() {
    if (!isBriefCoreComplete(brief)) return;
    setStep(0);
  }

  function goNextFromQuestion(qIndex: number) {
    if (qIndex >= QUESTIONS.length - 1) setStep("result");
    else setStep(qIndex + 1);
  }

  function goBack() {
    if (step === "result") {
      setStep(QUESTIONS.length - 1);
      return;
    }
    if (typeof step === "number") {
      if (step === 0) setStep("brief");
      else setStep(step - 1);
    }
  }

  if (step === "brief") {
    return (
      <FlowShell
        stepIndex={stepIndex(step)}
        stepCount={STEP_COUNT}
        eyebrow={`Schritt 1 von ${STEP_COUNT}`}
        title="Fall beschreiben"
        description="Problem und Ziel sind Pflicht — damit ist der Use Case beschreibbar. Lösungsansatz und Risiko optional."
        footer={
          <Button
            type="button"
            size="lg"
            className="w-full"
            disabled={!briefComplete}
            onClick={goNextFromBrief}
          >
            Weiter zu den Fragen
          </Button>
        }
      >
        <FallSteckbrief brief={brief} onChange={setBrief} bare />
      </FlowShell>
    );
  }

  if (typeof step === "number") {
    const question = QUESTIONS[step];
    const selected = answers[question.id];

    return (
      <FlowShell
        stepIndex={stepIndex(step)}
        stepCount={STEP_COUNT}
        eyebrow={`Frage ${step + 1} von ${QUESTIONS.length}`}
        title={question.title}
        description={question.subtitle}
        onBack={goBack}
        footer={
          <Button
            type="button"
            size="lg"
            className="w-full"
            disabled={!selected}
            onClick={() => goNextFromQuestion(step)}
          >
            {step >= QUESTIONS.length - 1 ? "Ergebnis anzeigen" : "Weiter"}
          </Button>
        }
      >
        <ChoiceGroup
          label={question.title}
          options={question.options}
          value={selected}
          onChange={(id) =>
            setAnswers((prev) => ({ ...prev, [question.id]: id }))
          }
        />
      </FlowShell>
    );
  }

  // result step
  return (
    <FlowShell
      stepIndex={stepIndex("result")}
      stepCount={STEP_COUNT}
      onBack={goBack}
      title="Dein Ergebnis"
      footer={
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            size="lg"
            className="w-full"
            onClick={handleSave}
          >
            {justSaved ? "Gespeichert" : "Fall speichern"}
          </Button>
          {justSaved && (
            <Link
              href="/faelle"
              className="text-center text-xs font-medium text-primary underline-offset-4 hover:underline"
            >
              Zur Rangliste →
            </Link>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            className="w-full rounded-full text-muted-foreground hover:text-foreground"
          >
            Neue Bewertung
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        {(brief.problem || brief.loesung || brief.ziel || brief.risiko) && (
          <SurfaceCard contentClassName="p-5">
            <SectionLabel className="mb-3">Fall-Zusammenfassung</SectionLabel>
            <div className="flex flex-col gap-2.5">
              {brief.problem && (
                <div>
                  <SectionLabel className="text-[0.6875rem]">Problem</SectionLabel>
                  <p className="mt-0.5 line-clamp-3 text-sm">{brief.problem}</p>
                </div>
              )}
              {brief.loesung && (
                <div>
                  <SectionLabel className="text-[0.6875rem]">Lösung</SectionLabel>
                  <p className="mt-0.5 line-clamp-3 text-sm">{brief.loesung}</p>
                </div>
              )}
              {brief.ziel && (
                <div>
                  <SectionLabel className="text-[0.6875rem]">Ziel</SectionLabel>
                  <p className="mt-0.5 line-clamp-3 text-sm">{brief.ziel}</p>
                </div>
              )}
              {brief.risiko && (
                <div className="pt-1">
                  <Badge variant="outline" className={RISIKO_BADGE[brief.risiko]}>
                    {RISIKO_OPTIONS.find((r) => r.id === brief.risiko)?.label}
                  </Badge>
                </div>
              )}
            </div>
          </SurfaceCard>
        )}

        <SurfaceCard>
          {einordnung && (
            <div
              className={[
                "mb-5 rounded-2xl p-4",
                CLASSIFICATION_STYLES[
                  einordnung.colorClass as ClassificationColorKey
                ]?.badge ?? CLASSIFICATION_STYLES.neutral.badge,
              ].join(" ")}
            >
              <p className="text-sm font-semibold">{einordnung.title}</p>
              <p className="mt-1 text-xs opacity-80">{einordnung.description}</p>
            </div>
          )}

          {gesamtScore != null && (
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Gesamt-Score</span>
              <span className="text-4xl font-bold tabular-nums">
                {gesamtScore}
                <span className="text-sm font-normal text-muted-foreground">
                  /100
                </span>
              </span>
            </div>
          )}

          <div className="flex flex-col gap-5">
            {wertScore != null && (
              <ScoreMeter
                label="Nutzen-Score"
                value={wertScore}
                description="Gewichteter Wert aus gebundener Arbeitszeit (70 %) und strategischer Bedeutung fürs Geschäft (30 %)."
              />
            )}
            {machbarkeitScore != null && (
              <ScoreMeter
                label="Machbarkeits-Score"
                value={machbarkeitScore}
                description="Gewichteter Wert aus Datenverfügbarkeit (50 %) und Wiederholbarkeit des Ablaufs (50 %)."
              />
            )}

            {hoursPerMonth != null && (
              <div className="rounded-2xl bg-muted/70 p-4">
                <SectionLabel>Gebundene Arbeitszeit</SectionLabel>
                <p className="mt-1 text-2xl font-semibold tabular-nums">
                  ≈ {formatHours(hoursPerMonth)} / Monat
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Hochgerechnet aus Häufigkeit, Dauer und Personenzahl.
                </p>
              </div>
            )}
          </div>
        </SurfaceCard>
      </div>
    </FlowShell>
  );
}
