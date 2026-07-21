"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  EmptyState,
  PageHeader,
  SectionLabel,
  SurfaceCard,
} from "@/components/shared";
import RobotMascot from "@/components/RobotMascot";
import { CLASSIFICATION_STYLES, type ClassificationColorKey } from "@/lib/scoring";
import { formatPrioritaetHinweis, isPrioritaetAusgeschlossen } from "@/lib/prioritaet";
import { RISIKO_BADGE, RISIKO_OPTIONS } from "@/types/brief";
import { deleteCase, getSavedCases } from "@/lib/storage";
import type { SavedCase } from "@/types/case";

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

  const sorted = sortCases(cases);

  return (
    <div className="mx-auto w-full max-w-3xl bg-background px-5 py-10 sm:px-8 sm:py-16">
      <PageHeader
        eyebrow="Klarsicht · Rangliste"
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
        <div className="flex flex-col gap-4">
          {sorted.map((item, index) => (
            <RanglisteItem
              key={item.id}
              rank={index + 1}
              item={item}
              onDelete={() => handleDelete(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RanglisteField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <SectionLabel className="text-[0.6875rem] text-muted-foreground">
        {label}
      </SectionLabel>
      <div className="mt-0.5">{children}</div>
    </div>
  );
}

function RanglisteItem({
  rank,
  item,
  onDelete,
}: {
  rank: number;
  item: SavedCase;
  onDelete: () => void;
}) {
  const { brief, result } = item;
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
    <SurfaceCard contentClassName="flex items-start gap-4 p-5 sm:p-6">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold tabular-nums text-muted-foreground">
        {rank}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-3">
          {brief.problem.trim() && (
            <RanglisteField label="Aktueller Ablauf">
              <p className="line-clamp-3 text-sm">{brief.problem}</p>
            </RanglisteField>
          )}

          {brief.ziel.trim() && (
            <RanglisteField label="Ziel">
              <p className="line-clamp-3 text-sm">{brief.ziel}</p>
            </RanglisteField>
          )}

          {brief.loesung.trim() && (
            <RanglisteField label="Lösungsansatz">
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {brief.loesung}
              </p>
            </RanglisteField>
          )}

          {risikoLabel && (
            <RanglisteField label="Risiko">
              <Badge variant="outline" className={RISIKO_BADGE[brief.risiko]}>
                {risikoLabel}
              </Badge>
            </RanglisteField>
          )}

          {(blocked && prioritaetHinweis) || result.einordnung ? (
            <RanglisteField label="Priorisierung">
              {blocked && prioritaetHinweis ? (
                <p className="text-sm font-medium text-muted-foreground">
                  {prioritaetHinweis}
                </p>
              ) : (
                result.einordnung && (
                  <Badge variant="outline" className={badgeClass}>
                    {result.einordnung.title}
                  </Badge>
                )
              )}
            </RanglisteField>
          ) : null}
        </div>

        <span className="mt-3 block text-xs text-muted-foreground">
          Gespeichert am {savedDate}
        </span>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <div className="text-right">
          <span className="text-xs text-muted-foreground">
            {blocked ? "Berechneter Nutzen" : "Gesamt-Score"}
          </span>
          <span className="block text-2xl font-bold tabular-nums">
            {result.gesamtScore ?? "–"}
            <span className="text-xs font-normal text-muted-foreground">/100</span>
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="rounded-full text-muted-foreground hover:text-foreground"
        >
          <Link href={`/scorer?edit=${item.id}`}>Bearbeiten</Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="rounded-full text-muted-foreground hover:text-destructive"
        >
          Löschen
        </Button>
      </div>
    </SurfaceCard>
  );
}
