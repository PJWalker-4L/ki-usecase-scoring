"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChoiceGroup,
  DetailField,
  FlowShell,
  GebundeneArbeitszeit,
  ScoreMeter,
  SectionLabel,
  SurfaceCard,
  type ChoiceItem,
} from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BeispielrichtungenStep from "@/components/BeispielrichtungenStep";
import FallSteckbrief from "@/components/FallSteckbrief";
import RisikoStep from "@/components/RisikoStep";
import {
  QUESTIONS,
  computeScores,
  formatFrequencyPerMonth,
  getAnswer,
  isAuswirkungFristGewaehlt,
  resolveAnswerId,
  WIZARD_QUESTION_COUNT,
  CLASSIFICATION_STYLES,
  type Answers,
  type ClassificationColorKey,
  type Question,
} from "@/lib/scoring";
import { classifyBeispiele, classifyInitial } from "@/lib/classify-client";
import { resolveEmpfehlung } from "@/lib/empfehlung";
import { formatPrioritaetHinweis, isPrioritaetAusgeschlossen } from "@/lib/prioritaet";
import { getCaseById, saveCase, updateCase } from "@/lib/storage";
import { cn } from "@/lib/utils";
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

function questionOptionsAsChoices(question: Question): ChoiceItem[] {
  return question.options.map((option) => ({
    id: option.id,
    label: option.label,
    hint: option.hint,
    suffix:
      option.perMonth != null
        ? formatFrequencyPerMonth(option.perMonth)
        : undefined,
  }));
}

type Step =
  | "brief"
  | "classifying-initial"
  | "classifying-beispiele"
  | "examples"
  | { kind: "question"; index: number }
  | "risiko"
  | "result";

const TOTAL_STEPS = QUESTIONS.length + 4; // Steckbrief + 6 Bewertungsfragen + Risiko + Beispiele + Ergebnis

function wizardQuestionStepIndex(step: Step): number | null {
  if (step === "brief") return 0;
  if (typeof step === "object" && step.kind === "question") return 1 + step.index;
  return null;
}

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
  const [saveError, setSaveError] = useState<string | null>(null);
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
  const empfehlung = resolveEmpfehlung(classification);
  const scoreVisuals = einordnung
    ? CLASSIFICATION_STYLES[einordnung.colorClass as ClassificationColorKey]
    : null;

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
    setSaveError(null);
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
    setSaveError(null);

    const existing = editingId ? getCaseById(editingId) : undefined;
    const payload = {
      brief,
      answers,
      result,
      classification: classification ?? undefined,
      status: existing?.status ?? "unerledigt" as const,
    };

    if (editingId) {
      const updated = updateCase(editingId, payload);
      if (!updated) {
        setSaveError(
          "Speichern fehlgeschlagen — der Fall wurde nicht gefunden. Bitte kehre zur Rangliste zurück."
        );
        return;
      }
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
        stepCount={WIZARD_QUESTION_COUNT}
        eyebrow={`Frage 1 von ${WIZARD_QUESTION_COUNT}`}
        title="Fall beschreiben"
        description="Beschreiben Sie den heutigen Ablauf als konkreten Durchlauf — die Satzschablone hilft beim ersten Satz. Ihre Beschreibung fließt nicht in den Punktwert ein."
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
    const rawSelected = getAnswer(answers, question.id);
    const selected =
      question.id === "auswirkung"
        ? resolveAnswerId("auswirkung", rawSelected)
        : rawSelected;
    const wizardStep = wizardQuestionStepIndex(step)!;

    return (
      <FlowShell
        stepIndex={wizardStep}
        stepCount={WIZARD_QUESTION_COUNT}
        eyebrow={`Frage ${wizardStep + 1} von ${WIZARD_QUESTION_COUNT}`}
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
          <p className="mb-4 surface-inset px-4 py-3 text-sm text-muted-foreground">
            {classifyError}
          </p>
        )}
        <ChoiceGroup
          label={question.title}
          variant={question.id === "haeufigkeit" ? "split" : "default"}
          options={questionOptionsAsChoices(question)}
          value={selected}
          onChange={(id) =>
            setAnswers((prev) => {
              if (question.id === "auswirkung") {
                const { strategie: _legacy, ...rest } = prev;
                return { ...rest, auswirkung: id };
              }
              return { ...prev, [question.id]: id };
            })
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
        eyebrow="Risiko beim KI-Einsatz"
        title="Was passiert, wenn die Automatisierung einen Fehler macht?"
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
          showAuswirkungFristHinweis={isAuswirkungFristGewaehlt(answers)}
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
          {saveError && (
            <p className="surface-inset px-4 py-3 text-sm text-muted-foreground">
              {saveError}
            </p>
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
          <p className="surface-inset px-4 py-3 text-sm text-muted-foreground">
            {classifyError}
          </p>
        )}

        {(brief.problem || brief.loesung || brief.ziel || brief.risiko) && (
          <SurfaceCard contentClassName="p-5">
            <SectionLabel className="mb-4">Fall-Zusammenfassung</SectionLabel>
            <div className="flex flex-col gap-4">
              {brief.problem && (
                <DetailField label="Aktueller Ablauf">
                  <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {brief.problem}
                  </p>
                </DetailField>
              )}
              {brief.loesung && (
                <DetailField label="Lösungsansatz">
                  <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {brief.loesung}
                  </p>
                </DetailField>
              )}
              {brief.ziel && (
                <DetailField label="Ziel">
                  <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {brief.ziel}
                  </p>
                </DetailField>
              )}
              {empfehlung && (
                <DetailField label="Empfohlene Option für Automatisierung">
                  <p className="text-sm leading-6 text-muted-foreground">
                    {empfehlung.option.text}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground/80">
                    {empfehlung.begruendung}
                  </p>
                </DetailField>
              )}
              {brief.risiko && (
                <DetailField label="Risiko">
                  <Badge variant="outline" className={RISIKO_BADGE[brief.risiko]}>
                    {RISIKO_OPTIONS.find((r) => r.id === brief.risiko)?.label}
                  </Badge>
                </DetailField>
              )}
            </div>
          </SurfaceCard>
        )}

        <SurfaceCard>
          {prioritaetHinweis ? (
            <div className="mb-5 rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--score-low-text)_25%,transparent)] bg-[color-mix(in_srgb,var(--score-low-text)_8%,transparent)] p-4">
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
                  "mb-5 rounded-[var(--radius-lg)] p-4",
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
            <div className="mb-5 grid gap-6 sm:grid-cols-2 sm:items-end">
              <div>
                <span className="text-sm text-muted-foreground">
                  {ausgeschlossen ? "Berechneter Nutzen" : "Gesamt-Score"}
                </span>
                <span
                  className={cn(
                    "mt-1 block text-4xl font-bold tabular-nums",
                    !ausgeschlossen && scoreVisuals?.scoreText
                  )}
                >
                  {gesamtScore}
                  <span className="text-sm font-normal text-muted-foreground">
                    /100
                  </span>
                </span>
              </div>
              {hoursPerMonth != null && (
                <GebundeneArbeitszeit hoursPerMonth={hoursPerMonth} />
              )}
            </div>
          )}

          <div className="flex flex-col gap-5">
            {wertScore != null && (
              <ScoreMeter
                label="Nutzen-Score"
                value={wertScore}
                description="Gewichteter Wert aus gebundener Arbeitszeit (70 %) und Reichweite der Auswirkung (30 %)."
              />
            )}
            {machbarkeitScore != null && (
              <ScoreMeter
                label="Machbarkeits-Score"
                value={machbarkeitScore}
                description="Gewichteter Wert aus Datenverfügbarkeit (50 %) und Wiederholbarkeit des Ablaufs (50 %)."
              />
            )}
          </div>
        </SurfaceCard>
      </div>
    </FlowShell>
  );
}
