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
import BeispielrichtungenStep from "@/components/BeispielrichtungenStep";
import FallSteckbrief from "@/components/FallSteckbrief";
import RisikoStep from "@/components/RisikoStep";
import {
  QUESTIONS,
  computeScores,
  formatHours,
  CLASSIFICATION_STYLES,
  type Answers,
  type ClassificationColorKey,
} from "@/lib/scoring";
import { classifyProcess } from "@/lib/classify-client";
import { formatPrioritaetHinweis, isPrioritaetAusgeschlossen } from "@/lib/prioritaet";
import { saveCase } from "@/lib/storage";
import {
  EMPTY_BRIEF,
  RISIKO_BADGE,
  RISIKO_OPTIONS,
  isBriefCoreComplete,
  type FallBrief,
  type RisikoId,
} from "@/types/brief";
import type { ClassificationResult } from "@/types/classification";

type Step =
  | "brief"
  | "classifying"
  | "examples"
  | { kind: "question"; index: number }
  | "risiko"
  | "result";

function stepCount(hasExamples: boolean): number {
  return hasExamples ? QUESTIONS.length + 4 : QUESTIONS.length + 3;
}

function stepIndex(step: Step, hasExamples: boolean): number {
  if (step === "brief") return 0;
  if (step === "classifying") return hasExamples ? 1 : 0;
  if (step === "examples") return 1;

  const questionBase = hasExamples ? 2 : 1;
  if (typeof step === "object" && step.kind === "question") {
    return questionBase + step.index;
  }
  if (step === "risiko") return questionBase + QUESTIONS.length;
  return questionBase + QUESTIONS.length + 1;
}

export default function FaktenScorer() {
  const [brief, setBrief] = useState<FallBrief>(EMPTY_BRIEF);
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState<Step>("brief");
  const [classification, setClassification] = useState<ClassificationResult | null>(
    null
  );
  const [classificationSkipped, setClassificationSkipped] = useState(false);
  const [classifyError, setClassifyError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  const hasExamples = classification != null;
  const totalSteps = stepCount(hasExamples);
  const result = computeScores(answers);
  const { hoursPerMonth, wertScore, machbarkeitScore, gesamtScore, einordnung } =
    result;
  const briefComplete = isBriefCoreComplete(brief);
  const prioritaetHinweis = formatPrioritaetHinweis(gesamtScore, brief.risiko);
  const ausgeschlossen = isPrioritaetAusgeschlossen(brief.risiko);

  useEffect(() => {
    if (!justSaved) return;
    const timeout = setTimeout(() => setJustSaved(false), 2500);
    return () => clearTimeout(timeout);
  }, [justSaved]);

  function reset() {
    setAnswers({});
    setBrief(EMPTY_BRIEF);
    setClassification(null);
    setClassificationSkipped(false);
    setClassifyError(null);
    setJustSaved(false);
    setStep("brief");
  }

  function handleSave() {
    saveCase({
      brief,
      answers,
      result,
      classification: classification ?? undefined,
    });
    setJustSaved(true);
  }

  async function goNextFromBrief() {
    if (!isBriefCoreComplete(brief)) return;
    setStep("classifying");
    setClassifyError(null);

    const response = await classifyProcess({
      ablauf: brief.problem,
      ziel: brief.ziel,
      loesung: brief.loesung || undefined,
    });

    if (response.ok) {
      setClassification(response.data);
      setClassificationSkipped(false);
      setBrief((prev) => ({
        ...prev,
        risiko: response.data.risikoVorschlag.stufe,
      }));
      setStep("examples");
      return;
    }

    setClassification(null);
    setClassificationSkipped(true);
    setClassifyError(response.message);
    setBrief((prev) => ({ ...prev, risiko: "" }));
    setStep({ kind: "question", index: 0 });
  }

  function goNextFromExamples() {
    setStep({ kind: "question", index: 0 });
  }

  function goNextFromQuestion(qIndex: number) {
    if (qIndex >= QUESTIONS.length - 1) setStep("risiko");
    else setStep({ kind: "question", index: qIndex + 1 });
  }

  function goNextFromRisiko() {
    if (!brief.risiko) return;
    setStep("result");
  }

  function goBack() {
    if (step === "result") {
      setStep("risiko");
      return;
    }
    if (step === "risiko") {
      setStep({ kind: "question", index: QUESTIONS.length - 1 });
      return;
    }
    if (typeof step === "object" && step.kind === "question") {
      if (step.index === 0) {
        if (hasExamples) setStep("examples");
        else setStep("brief");
        return;
      }
      setStep({ kind: "question", index: step.index - 1 });
    }
    if (step === "examples") setStep("brief");
  }

  if (step === "brief") {
    return (
      <FlowShell
        stepIndex={stepIndex(step, hasExamples)}
        stepCount={totalSteps}
        eyebrow={`Schritt 1 von ${stepCount(false)}`}
        title="Fall beschreiben"
        description="Aktueller Ablauf und Ziel sind Pflicht — damit ist der Anwendungsfall beschreibbar. Lösungsansatz optional."
        footer={
          <Button
            type="button"
            size="lg"
            className="w-full"
            disabled={!briefComplete}
            onClick={() => void goNextFromBrief()}
          >
            Weiter
          </Button>
        }
      >
        <FallSteckbrief brief={brief} onChange={setBrief} bare />
      </FlowShell>
    );
  }

  if (step === "classifying") {
    return (
      <FlowShell
        stepIndex={1}
        stepCount={stepCount(false) + 1}
        title="Beispiele werden vorbereitet …"
        description="Einen Moment — wir leiten typische Automatisierungsoptionen für deinen Prozess ab."
      >
        <div className="flex min-h-40 items-center justify-center">
          <p className="text-sm text-muted-foreground">Klassifikation läuft …</p>
        </div>
      </FlowShell>
    );
  }

  if (step === "examples" && classification) {
    return (
      <FlowShell
        stepIndex={stepIndex(step, hasExamples)}
        stepCount={totalSteps}
        eyebrow={`Schritt 2 von ${totalSteps}`}
        title="Beispiele für Automatisierungsoptionen"
        description="Orientierung vor der Bewertung — keine fertige Lösung."
        onBack={goBack}
        footer={
          <Button
            type="button"
            size="lg"
            className="w-full"
            onClick={goNextFromExamples}
          >
            Weiter zu den Fragen
          </Button>
        }
      >
        <BeispielrichtungenStep classification={classification} />
      </FlowShell>
    );
  }

  if (typeof step === "object" && step.kind === "question") {
    const question = QUESTIONS[step.index];
    const selected = answers[question.id];
    const questionNumber = step.index + 1;

    return (
      <FlowShell
        stepIndex={stepIndex(step, hasExamples)}
        stepCount={totalSteps}
        eyebrow={`Frage ${questionNumber} von ${QUESTIONS.length}`}
        title={question.title}
        description={question.subtitle}
        onBack={goBack}
        footer={
          <Button
            type="button"
            size="lg"
            className="w-full"
            disabled={!selected}
            onClick={() => goNextFromQuestion(step.index)}
          >
            {step.index >= QUESTIONS.length - 1 ? "Weiter zum Risiko" : "Weiter"}
          </Button>
        }
      >
        {classificationSkipped && step.index === 0 && classifyError && (
          <p className="mb-4 rounded-2xl bg-muted/70 px-4 py-3 text-sm text-muted-foreground">
            {classifyError}
          </p>
        )}
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

  if (step === "risiko") {
    return (
      <FlowShell
        stepIndex={stepIndex(step, hasExamples)}
        stepCount={totalSteps}
        eyebrow={`Schritt ${totalSteps - 1} von ${totalSteps}`}
        title="Risiko beim KI-Einsatz"
        onBack={goBack}
        footer={
          <Button
            type="button"
            size="lg"
            className="w-full"
            disabled={!brief.risiko}
            onClick={goNextFromRisiko}
          >
            Ergebnis anzeigen
          </Button>
        }
      >
        <RisikoStep
          risiko={brief.risiko}
          vorschlag={classification?.risikoVorschlag}
          onChange={(risiko: RisikoId) =>
            setBrief((prev) => ({ ...prev, risiko }))
          }
        />
      </FlowShell>
    );
  }

  return (
    <FlowShell
      stepIndex={stepIndex("result", hasExamples)}
      stepCount={totalSteps}
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
                  <SectionLabel className="text-[0.6875rem]">Aktueller Ablauf</SectionLabel>
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
          {prioritaetHinweis ? (
            <div className="mb-5 rounded-2xl border border-[color-mix(in_srgb,var(--score-low-text)_25%,transparent)] bg-[color-mix(in_srgb,var(--score-low-text)_8%,transparent)] p-4">
              <p className="text-sm font-semibold">{prioritaetHinweis}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Der Nutzen-Score bleibt sichtbar — in der Priorisierung wird der
                Fall wegen des Risikos zurückgestellt.
              </p>
            </div>
          ) : (
            einordnung && (
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
            )
          )}

          {gesamtScore != null && (
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {ausgeschlossen ? "Berechneter Nutzen" : "Gesamt-Score"}
              </span>
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
