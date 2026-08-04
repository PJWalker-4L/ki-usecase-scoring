"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Sparkles } from "lucide-react";
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
  DATEN_STUFENHINWEIS,
  PERSONEN_ZAEHLHINWEIS,
  ZEITAUFWAND_HINWEIS,
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
import {
  AUFGABENBESCHREIBUNG_WIZARD,
  FALL_ZUSAMMENFASSUNG,
  FELD_ABLAUF,
  FELD_LOESUNG,
  FELD_ZIEL,
  WIZARD_EINORDNUNG_LOADING,
  WIZARD_RISIKO_FOOTER,
} from "@/lib/copy/aufgabenbeschreibung";
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
        : option.rangeLabel,
  }));
}

type Step =
  | "brief"
  | "classifying-beispiele"
  | { kind: "question"; index: number }
  | "risiko"
  | "result";

const TOTAL_STEPS = QUESTIONS.length + 3; // Steckbrief + 6 Bewertungsfragen + Risiko + Ergebnis

/** Fragen mit eigenem WizardHintDetails — keine Option-Hints in ChoiceGroup nach Auswahl. */
const QUESTIONS_WITH_WIZARD_HINT = new Set(["personen", "daten", "zeitaufwand"]);

function briefClassifyKey(b: FallBrief): string {
  return `${b.problem.trim()}|${b.ziel.trim()}|${b.loesung.trim()}`;
}

function wizardQuestionStepIndex(step: Step): number | null {
  if (step === "brief") return 0;
  if (typeof step === "object" && step.kind === "question") return 1 + step.index;
  return null;
}

function stepIndex(step: Step): number {
  if (step === "brief") return 0;
  if (typeof step === "object" && step.kind === "question") {
    return 1 + step.index;
  }
  if (step === "risiko") return 1 + QUESTIONS.length;
  if (step === "classifying-beispiele") return TOTAL_STEPS - 1;
  if (step === "result") return TOTAL_STEPS - 1;
  return 0;
}

function WizardHintDetails({
  toggle,
  text,
}: {
  toggle: string;
  text: string;
}) {
  const panelId = useId();
  const [open, setOpen] = useState(true);

  return (
    <details
      className="group rounded-[var(--radius-lg)] border border-border bg-background px-4 py-3 text-sm"
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary
        aria-expanded={open}
        aria-controls={panelId}
        className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-md font-semibold text-primary outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30 [&::-webkit-details-marker]:hidden"
      >
        {toggle}
        <ChevronDown
          className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <p
        id={panelId}
        role="region"
        aria-label={toggle}
        className="mt-3 border-t border-border pt-3 leading-6 text-muted-foreground"
      >
        {text}
      </p>
    </details>
  );
}

export default function FaktenScorer({ editCaseId }: { editCaseId?: string }) {
  const router = useRouter();
  const [brief, setBrief] = useState<FallBrief>(EMPTY_BRIEF);
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState<Step>("brief");
  const [initialClassification, setInitialClassification] =
    useState<InitialClassificationResult | null>(null);
  const [initialClassificationKey, setInitialClassificationKey] =
    useState<string | null>(null);
  const [classification, setClassification] = useState<ClassificationResult | null>(
    null
  );
  const [classifyError, setClassifyError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(!editCaseId);
  const [loadError, setLoadError] = useState<string | null>(null);
  const initialClassifyRef = useRef<{
    key: string;
    promise: Promise<InitialClassificationResult | null>;
  } | null>(null);
  const briefKeyRef = useRef(briefClassifyKey(brief));
  briefKeyRef.current = briefClassifyKey(brief);

  const hasExamples =
    classification != null && classification.beispielrichtungen.length > 0;
  const result = computeScores(answers);
  const { hoursPerMonth, wertScore, machbarkeitScore, gesamtScore, einordnung } =
    result;
  const briefComplete = isBriefCoreComplete(brief);
  const prioritaetHinweis = formatPrioritaetHinweis(gesamtScore, brief.risiko);
  const ausgeschlossen = isPrioritaetAusgeschlossen(brief.risiko);
  const scoreVisuals = einordnung
    ? CLASSIFICATION_STYLES[einordnung.colorClass as ClassificationColorKey]
    : null;

  useEffect(() => {
    if (!justSaved) return;
    const timeout = setTimeout(() => setJustSaved(false), 2500);
    return () => clearTimeout(timeout);
  }, [justSaved]);

  useEffect(() => {
    const key = briefClassifyKey(brief);

    if (initialClassificationKey != null && initialClassificationKey !== key) {
      setInitialClassification(null);
      setInitialClassificationKey(null);
    }

    if (
      initialClassifyRef.current != null &&
      initialClassifyRef.current.key !== key
    ) {
      initialClassifyRef.current = null;
    }
  }, [brief.problem, brief.ziel, brief.loesung, initialClassificationKey]);

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
      setInitialClassificationKey(briefClassifyKey(saved.brief));
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
        if (response.ok) {
          setInitialClassificationKey(briefClassifyKey(saved.brief));
          setInitialClassification(response.data);
        }
      });
    }

    setStep("result");
    setHydrated(true);
  }, [editCaseId]);

  function reset() {
    setAnswers({});
    setBrief(EMPTY_BRIEF);
    setInitialClassification(null);
    setInitialClassificationKey(null);
    setClassification(null);
    setClassifyError(null);
    setJustSaved(false);
    setSaveError(null);
    setEditingId(null);
    setLoadError(null);
    initialClassifyRef.current = null;
    setStep("brief");
  }

  function startInitialClassification(currentBrief: FallBrief): Promise<InitialClassificationResult | null> {
    const key = briefClassifyKey(currentBrief);
    if (initialClassifyRef.current?.key === key) {
      return initialClassifyRef.current.promise;
    }

    setClassifyError(null);

    const promise = classifyInitial({
      ablauf: currentBrief.problem,
      ziel: currentBrief.ziel,
      loesung: currentBrief.loesung || undefined,
    }).then((response) => {
      const stillCurrent =
        initialClassifyRef.current?.key === key &&
        briefKeyRef.current === key;

      if (response.ok) {
        if (stillCurrent) {
          setInitialClassification(response.data);
          setInitialClassificationKey(key);
          setBrief((prev) => {
            if (briefClassifyKey(prev) !== key || prev.risiko) return prev;
            return { ...prev, risiko: response.data.risikoVorschlag.stufe };
          });
        }
        return stillCurrent ? response.data : null;
      }

      if (stillCurrent) {
        setInitialClassification(null);
        setInitialClassificationKey(null);
        setClassifyError(response.message);
      }
      return null;
    });

    initialClassifyRef.current = { key, promise };
    return promise;
  }

  async function resolveInitialClassification(): Promise<InitialClassificationResult | null> {
    const key = briefClassifyKey(brief);
    if (initialClassification && initialClassificationKey === key) {
      return initialClassification;
    }
    if (!isBriefCoreComplete(brief)) return null;
    return startInitialClassification(brief);
  }

  const currentInitialClassification =
    initialClassification && initialClassificationKey === briefClassifyKey(brief)
      ? initialClassification
      : null;

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

  function goNextFromBrief() {
    if (!isBriefCoreComplete(brief)) return;
    void startInitialClassification(brief);
    setStep({ kind: "question", index: 0 });
  }

  function goNextFromQuestion(qIndex: number) {
    if (qIndex >= QUESTIONS.length - 1) setStep("risiko");
    else setStep({ kind: "question", index: qIndex + 1 });
  }

  async function goNextFromRisiko() {
    if (!brief.risiko) {
      setStep("result");
      return;
    }

    const initial = await resolveInitialClassification();
    if (!initial) {
      setStep("result");
      return;
    }

    setStep("classifying-beispiele");
    setClassifyError(null);

    const response = await classifyBeispiele({
      ablauf: brief.problem,
      ziel: brief.ziel,
      loesung: brief.loesung || undefined,
      archetypId: initial.archetypId,
      risiko: brief.risiko,
      answers,
    });

    if (response.ok) {
      setClassification({
        ...initial,
        ...response.data,
      });
      setStep("result");
      return;
    }

    setClassifyError(response.message);
    setClassification(null);
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
        title={AUFGABENBESCHREIBUNG_WIZARD.title}
        description={AUFGABENBESCHREIBUNG_WIZARD.description}
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

  if (step === "classifying-beispiele") {
    return (
      <FlowShell
        stepIndex={stepIndex(step)}
        stepCount={TOTAL_STEPS}
        title={WIZARD_EINORDNUNG_LOADING.title}
        description={WIZARD_EINORDNUNG_LOADING.description}
      >
        <div className="flex min-h-40 items-center justify-center" aria-busy="true" />
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
        <div className="flex flex-col gap-5">
          <ChoiceGroup
            label={question.title}
            variant={
              question.id === "haeufigkeit" || question.id === "zeitaufwand"
                ? "split"
                : "default"
            }
            revealHintOnSelect={!QUESTIONS_WITH_WIZARD_HINT.has(question.id)}
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
          {question.id === "personen" && (
            <WizardHintDetails
              toggle={PERSONEN_ZAEHLHINWEIS.toggle}
              text={PERSONEN_ZAEHLHINWEIS.text}
            />
          )}
          {question.id === "daten" && (
            <WizardHintDetails
              toggle={DATEN_STUFENHINWEIS.toggle}
              text={DATEN_STUFENHINWEIS.text}
            />
          )}
          {question.id === "zeitaufwand" && (
            <WizardHintDetails
              toggle={ZEITAUFWAND_HINWEIS.toggle}
              text={ZEITAUFWAND_HINWEIS.text}
            />
          )}
        </div>
      </FlowShell>
    );
  }

  if (step === "risiko") {
    return (
      <FlowShell
        stepIndex={stepIndex(step)}
        stepCount={TOTAL_STEPS}
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
            <Sparkles className="size-4" strokeWidth={1.5} aria-hidden />
            {WIZARD_RISIKO_FOOTER.cta}
          </Button>
        }
      >
        {classifyError && !currentInitialClassification && (
          <p className="mb-4 surface-inset px-4 py-3 text-sm text-muted-foreground">
            {classifyError}
          </p>
        )}
        <RisikoStep
          risiko={brief.risiko}
          vorschlag={currentInitialClassification?.risikoVorschlag}
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
      stepIndex={stepIndex("result")}
      stepCount={TOTAL_STEPS}
      onBack={goBack}
      title="Dein Ergebnis"
      footer={
        <div className="flex flex-col gap-2">
          {editingId && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => setStep({ kind: "question", index: 0 })}
            >
              Antworten ändern
            </Button>
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
            <SectionLabel className="mb-4">{FALL_ZUSAMMENFASSUNG.title}</SectionLabel>
            <div className="flex flex-col gap-4">
              {brief.problem && (
                <DetailField label={FELD_ABLAUF.kurzLabel}>
                  <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {brief.problem}
                  </p>
                </DetailField>
              )}
              {brief.loesung && (
                <DetailField label={FELD_LOESUNG.label}>
                  <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {brief.loesung}
                  </p>
                </DetailField>
              )}
              {brief.ziel && (
                <DetailField label={FELD_ZIEL.kurzLabel}>
                  <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {brief.ziel}
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

        {hasExamples && classification && (
          <BeispielrichtungenStep classification={classification} />
        )}
      </div>
    </FlowShell>
  );
}
