"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { classifyBeispiele, classifyInitial } from "@/lib/classify-client";
import { formatPrioritaetHinweis, isPrioritaetAusgeschlossen } from "@/lib/prioritaet";
import { getCaseById, saveCase, updateCase } from "@/lib/storage";
import {
  EMPTY_BRIEF,
  RISIKO_BADGE,
  RISIKO_OPTIONS,
  isBriefCoreComplete,
  type FallBrief,
  type RisikoId,
} from "@/types/brief";
import type {
  ClassificationResult,
  InitialClassificationResult,
} from "@/types/classification";

type Step =
  | "brief"
  | "classifying-initial"
  | "classifying-beispiele"
  | "examples"
  | { kind: "question"; index: number }
  | "risiko"
  | "result";

const TOTAL_STEPS = QUESTIONS.length + 4; // brief + 6 Fragen + Risiko + Beispiele + Ergebnis

function stepIndex(step: Step, hasExamples: boolean): number {
  if (step === "brief") return 0;
  if (step === "classifying-initial") return 1;
  if (typeof step === "object" && step.kind === "question") {
    return 1 + step.index;
  }
  if (step === "risiko") return 1 + QUESTIONS.length;
  if (step === "classifying-beispiele") return TOTAL_STEPS - 2;
  if (step === "examples") return TOTAL_STEPS - 2;
  if (step === "result") return TOTAL_STEPS - 1;
  return 0;
}

export default function FaktenScorer({ editCaseId }: { editCaseId?: string }) {
  const router = useRouter();
  const [brief, setBrief] = useState<FallBrief>(EMPTY_BRIEF);
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState<Step>("brief");
  const [initialClassification, setInitialClassification] =
    useState<InitialClassificationResult | null>(null);
  const [classification, setClassification] = useState<ClassificationResult | null>(
    null
  );
  const [classifyError, setClassifyError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(!editCaseId);
  const [loadError, setLoadError] = useState<string | null>(null);

  const hasExamples =
    classification != null && classification.beispielrichtungen.length > 0;
  const displaySteps = hasExamples || step === "examples" ? TOTAL_STEPS : TOTAL_STEPS - 1;
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

  useEffect(() => {
    if (!editCaseId) {
      setHydrated(true);
      return;
    }

    const saved = getCaseById(editCaseId);
    if (!saved) {
      setLoadError("Fall nicht gefunden.");
      setHydrated(true);
      return;
    }

    setBrief(saved.brief);
    setAnswers(saved.answers);
    setEditingId(saved.id);

    if (saved.classification) {
      setClassification(saved.classification);
      setInitialClassification({
        archetypId: saved.classification.archetypId,
        risikoVorschlag: saved.classification.risikoVorschlag,
      });
    } else {
      void classifyInitial({
        ablauf: saved.brief.problem,
        ziel: saved.brief.ziel,
        loesung: saved.brief.loesung || undefined,
      }).then((response) => {
        if (response.ok) setInitialClassification(response.data);
      });
    }

    setStep("result");
    setHydrated(true);
  }, [editCaseId]);

  function reset() {
    setAnswers({});
    setBrief(EMPTY_BRIEF);
    setInitialClassification(null);
    setClassification(null);
    setClassifyError(null);
    setJustSaved(false);
    setEditingId(null);
    setLoadError(null);
    setStep("brief");
  }

  function startNew() {
    if (editingId) {
      router.push("/scorer");
      return;
    }
    reset();
  }

  function handleSave() {
    const payload = {
      brief,
      answers,
      result,
      classification: classification ?? undefined,
    };

    if (editingId) {
      updateCase(editingId, payload);
    } else {
      saveCase(payload);
    }
    setJustSaved(true);
  }

  async function goNextFromBrief() {
    if (!isBriefCoreComplete(brief)) return;
    setStep("classifying-initial");
    setClassifyError(null);

    const response = await classifyInitial({
      ablauf: brief.problem,
      ziel: brief.ziel,
      loesung: brief.loesung || undefined,
    });

    if (response.ok) {
      setInitialClassification(response.data);
      setBrief((prev) => ({
        ...prev,
        risiko: response.data.risikoVorschlag.stufe,
      }));
      setStep({ kind: "question", index: 0 });
      return;
    }

    setInitialClassification(null);
    setClassifyError(response.message);
    setBrief((prev) => ({ ...prev, risiko: "" }));
    setStep({ kind: "question", index: 0 });
  }

  function goNextFromQuestion(qIndex: number) {
    if (qIndex >= QUESTIONS.length - 1) setStep("risiko");
    else setStep({ kind: "question", index: qIndex + 1 });
  }

  async function goNextFromRisiko() {
    if (!brief.risiko || !initialClassification) {
      setStep("result");
      return;
    }

    setStep("classifying-beispiele");
    setClassifyError(null);

    const response = await classifyBeispiele({
      ablauf: brief.problem,
      ziel: brief.ziel,
      loesung: brief.loesung || undefined,
      archetypId: initialClassification.archetypId,
      risiko: brief.risiko,
      answers,
    });

    if (response.ok) {
      setClassification({
        ...initialClassification,
        ...response.data,
      });
      setStep("examples");
      return;
    }

    setClassifyError(response.message);
    setClassification(null);
    setStep("result");
  }

  function goNextFromExamples() {
    setStep("result");
  }

  function goBack() {
    if (step === "result") {
      if (hasExamples) setStep("examples");
      else setStep("risiko");
      return;
    }
    if (step === "examples") {
      setStep("risiko");
      return;
    }
    if (step === "risiko") {
      setStep({ kind: "question", index: QUESTIONS.length - 1 });
      return;
    }
    if (typeof step === "object" && step.kind === "question") {
      if (step.index === 0) {
        setStep("brief");
        return;
      }
      setStep({ kind: "question", index: step.index - 1 });
    }
  }

  if (!hydrated) {
    return (
      <FlowShell
        stepIndex={0}
        stepCount={TOTAL_STEPS}
        title="Fall wird geladen …"
      >
        <div className="flex min-h-40 items-center justify-center">
          <p className="text-sm text-muted-foreground">Einen Moment …</p>
        </div>
      </FlowShell>
    );
  }

  if (loadError) {
    return (
      <FlowShell stepIndex={0} stepCount={1} title="Fall nicht gefunden">
        <p className="text-sm text-muted-foreground">{loadError}</p>
        <Button asChild className="mt-4">
          <Link href="/faelle">Zur Rangliste</Link>
        </Button>
      </FlowShell>
    );
  }

  if (step === "brief") {
    return (
      <FlowShell
        stepIndex={0}
        stepCount={displaySteps}
        eyebrow={`Schritt 1 von ${TOTAL_STEPS}`}
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

  if (step === "classifying-initial") {
    return (
      <FlowShell
        stepIndex={1}
        stepCount={displaySteps}
        title="Risiko wird eingeschätzt …"
        description="Einen Moment — wir ordnen deinen Prozess ein."
      >
        <div className="flex min-h-40 items-center justify-center">
          <p className="text-sm text-muted-foreground">Analyse läuft …</p>
        </div>
      </FlowShell>
    );
  }

  if (step === "classifying-beispiele") {
    return (
      <FlowShell
        stepIndex={TOTAL_STEPS - 2}
        stepCount={displaySteps}
        title="Beispiele werden erstellt …"
        description="Auf Basis deiner Antworten und des Risikos."
      >
        <div className="flex min-h-40 items-center justify-center">
          <p className="text-sm text-muted-foreground">Automatisierungsoptionen werden abgeleitet …</p>
        </div>
      </FlowShell>
    );
  }

  if (step === "examples" && classification) {
    return (
      <FlowShell
        stepIndex={stepIndex(step, hasExamples)}
        stepCount={displaySteps}
        eyebrow={`Schritt ${TOTAL_STEPS - 1} von ${TOTAL_STEPS}`}
        title="Beispiele für Automatisierungsoptionen"
        description="Passend zu deinem Fall, deinen Fakten und dem gewählten Risiko."
        onBack={goBack}
        footer={
          <Button
            type="button"
            size="lg"
            className="w-full"
            onClick={goNextFromExamples}
          >
            Ergebnis anzeigen
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

    return (
      <FlowShell
        stepIndex={stepIndex(step, hasExamples)}
        stepCount={displaySteps}
        eyebrow={`Frage ${step.index + 1} von ${QUESTIONS.length}`}
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
        {classifyError && step.index === 0 && (
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
        stepCount={displaySteps}
        eyebrow={`Schritt ${1 + QUESTIONS.length + 1} von ${TOTAL_STEPS}`}
        title="Risiko beim KI-Einsatz"
        onBack={goBack}
        footer={
          <Button
            type="button"
            size="lg"
            className="w-full"
            disabled={!brief.risiko}
            onClick={() => void goNextFromRisiko()}
          >
            Weiter zu den Beispielen
          </Button>
        }
      >
        <RisikoStep
          risiko={brief.risiko}
          vorschlag={initialClassification?.risikoVorschlag}
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
      stepCount={displaySteps}
      onBack={goBack}
      title="Dein Ergebnis"
      footer={
        <div className="flex flex-col gap-2">
          {editingId && (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => setStep({ kind: "question", index: 0 })}
              >
                Antworten ändern
              </Button>
              {hasExamples && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={() => setStep("examples")}
                >
                  Beispiele ansehen
                </Button>
              )}
            </div>
          )}
          <Button
            type="button"
            size="lg"
            className="w-full"
            onClick={handleSave}
          >
            {justSaved
              ? "Gespeichert"
              : editingId
                ? "Änderungen speichern"
                : "Fall speichern"}
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
            onClick={startNew}
            className="w-full rounded-full text-muted-foreground hover:text-foreground"
          >
            Neue Bewertung
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        {classifyError && !hasExamples && (
          <p className="rounded-2xl bg-muted/70 px-4 py-3 text-sm text-muted-foreground">
            {classifyError}
          </p>
        )}

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
