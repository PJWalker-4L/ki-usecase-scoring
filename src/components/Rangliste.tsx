"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DetailField,
  EmptyState,
  BrandName,
  PageHeader,
  SurfaceCard,
} from "@/components/shared";
import RobotMascot from "@/components/RobotMascot";
import { CLASSIFICATION_STYLES, type ClassificationColorKey } from "@/lib/scoring";
import { formatPrioritaetHinweis, isPrioritaetAusgeschlossen } from "@/lib/prioritaet";
import { deleteCase, getSavedCases, setCaseStatus } from "@/lib/storage";
import { RISIKO_BADGE, RISIKO_OPTIONS } from "@/types/brief";
import type { CaseStatus, SavedCase } from "@/types/case";

function sortCases(cases: SavedCase[]): SavedCase[] {
  return [...cases].sort((a, b) => {
    const aBlocked = isPrioritaetAusgeschlossen(a.brief.risiko);
    const bBlocked = isPrioritaetAusgeschlossen(b.brief.risiko);
    if (aBlocked !== bBlocked) return aBlocked ? 1 : -1;

    const aScore = a.result.gesamtScore ?? -1;
    const bScore = b.result.gesamtScore ?? -1;
    return bScore - aScore;
  });
}

export default function Rangliste() {
  const [cases, setCases] = useState<SavedCase[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setCases(getSavedCases());
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  function handleDelete(id: string) {
    setCases(deleteCase(id));
  }

  function handleToggleStatus(id: string) {
    const current = cases.find((item) => item.id === id);
    if (!current) return;

    const nextStatus: CaseStatus =
      current.status === "erledigt" ? "unerledigt" : "erledigt";
    const updated = setCaseStatus(id, nextStatus);
    if (!updated) return;

    setCases((prev) =>
      prev.map((item) => (item.id === id ? updated : item))
    );
  }

  const sorted = sortCases(cases);

  return (
    <div className="mx-auto w-full max-w-3xl bg-background px-5 py-10 sm:px-8 sm:py-16">
      <PageHeader
        eyebrow={
          <>
            <BrandName /> · Rangliste
          </>
        }
        title="Gespeicherte Fälle"
        align="left"
        className={loaded && sorted.length === 0 ? "mb-3 sm:mb-4" : undefined}
        description={
          <>
            Sortiert nach Gesamt-Score. Fälle mit Risiko &ldquo;Inakzeptabel&rdquo;
            behalten ihren berechneten Nutzen, stehen aber in der Priorisierung
            ganz unten.
          </>
        }
      />

      {loaded && sorted.length === 0 ? (
        <EmptyState
          variant="plain"
          illustration={
            <RobotMascot
              src="/robot_02.png"
              size="hero"
              className="mx-auto h-56 w-56 sm:h-72 sm:w-72"
            />
          }
          action={
            <Button asChild size="lg">
              <Link href="/scorer">Zur Bewertung</Link>
            </Button>
          }
        >
          Noch keine Fälle gespeichert. Bewerte einen Fall in der Bewertung und
          klicke dort auf &ldquo;Fall speichern&rdquo;.
        </EmptyState>
      ) : (
        <div className="flex flex-col gap-5">
          {sorted.map((item, index) => (
            <RanglisteItem
              key={item.id}
              rank={index + 1}
              item={item}
              onDelete={() => handleDelete(item.id)}
              onToggleStatus={() => handleToggleStatus(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RanglisteItem({
  rank,
  item,
  onDelete,
  onToggleStatus,
}: {
  rank: number;
  item: SavedCase;
  onDelete: () => void;
  onToggleStatus: () => void;
}) {
  const { brief, result, status } = item;
  const erledigt = status === "erledigt";
  const blocked = isPrioritaetAusgeschlossen(brief.risiko);
  const prioritaetHinweis = formatPrioritaetHinweis(result.gesamtScore, brief.risiko);
  const colorKey = (result.einordnung?.colorClass ?? "neutral") as ClassificationColorKey;
  const badgeClass = blocked
    ? CLASSIFICATION_STYLES.neutral.badge
    : CLASSIFICATION_STYLES[colorKey]?.badge ?? CLASSIFICATION_STYLES.neutral.badge;
  const savedDate = new Date(item.savedAt).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const risikoLabel = brief.risiko
    ? RISIKO_OPTIONS.find((r) => r.id === brief.risiko)?.label
    : null;

  return (
    <SurfaceCard
      contentClassName={[
        "p-5 sm:p-7",
        erledigt ? "opacity-80" : "",
      ].join(" ")}
    >
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_10.5rem] lg:items-start lg:gap-x-12">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold tabular-nums text-muted-foreground">
          {rank}
        </div>

        <div className="min-w-0 flex flex-col gap-4">
          {brief.problem?.trim() && (
            <DetailField label="Aktueller Ablauf">
              <p className="text-sm leading-6 break-words text-muted-foreground">
                {brief.problem}
              </p>
            </DetailField>
          )}

          {brief.ziel?.trim() && (
            <DetailField label="Ziel">
              <p className="text-sm leading-6 break-words text-muted-foreground">
                {brief.ziel}
              </p>
            </DetailField>
          )}

          {brief.loesung?.trim() && (
            <DetailField label="Lösungsansatz">
              <p className="text-sm leading-6 break-words text-muted-foreground">
                {brief.loesung}
              </p>
            </DetailField>
          )}

          {brief.risiko && risikoLabel && (
            <DetailField label="Risiko">
              <Badge variant="outline" className={RISIKO_BADGE[brief.risiko]}>
                {risikoLabel}
              </Badge>
            </DetailField>
          )}

          {(blocked && prioritaetHinweis) || result.einordnung ? (
            <DetailField label="Priorisierung">
              {blocked && prioritaetHinweis ? (
                <p className="text-sm leading-6 text-muted-foreground">
                  {prioritaetHinweis}
                </p>
              ) : (
                result.einordnung && (
                  <Badge variant="outline" className={badgeClass}>
                    {result.einordnung.title}
                  </Badge>
                )
              )}
            </DetailField>
          ) : null}

          <DetailField label="Status">
            <Badge variant={erledigt ? "secondary" : "outline"}>
              {erledigt ? "Erledigt" : "Unerledigt"}
            </Badge>
          </DetailField>

          <span className="text-xs text-muted-foreground">
            Gespeichert am {savedDate}
          </span>
        </div>

        <div className="border-t border-border/60 pt-5 lg:border-t-0 lg:pt-0 lg:text-right">
          <span className="text-xs text-muted-foreground">
            {blocked ? "Berechneter Nutzen" : "Gesamt-Score"}
          </span>
          <span className="mt-1 block font-headline text-4xl font-bold leading-none tabular-nums sm:text-5xl">
            {result.gesamtScore ?? "–"}
            <span className="text-sm font-normal text-muted-foreground">/100</span>
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2 border-t border-border/60 pt-5 sm:flex-row sm:flex-wrap sm:items-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onToggleStatus}
          className="w-full sm:w-auto"
        >
          {erledigt ? (
            <>
              <Circle className="size-3.5" />
              Als unerledigt markieren
            </>
          ) : (
            <>
              <CheckCircle2 className="size-3.5" />
              Als erledigt markieren
            </>
          )}
        </Button>
        <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
          <Link href={`/scorer?edit=${item.id}`}>
            <Pencil className="size-3.5" />
            Bearbeiten
          </Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onDelete}
          className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive sm:ml-auto sm:w-auto"
        >
          <Trash2 className="size-3.5" />
          Löschen
        </Button>
      </div>
    </SurfaceCard>
  );
}
