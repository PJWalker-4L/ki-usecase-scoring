"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CLASSIFICATION_STYLES, type ClassificationColorKey } from "@/lib/scoring";
import { RISIKO_BADGE, RISIKO_OPTIONS } from "@/types/brief";
import { deleteCase, getSavedCases } from "@/lib/storage";
import type { SavedCase } from "@/types/case";

function sortCases(cases: SavedCase[]): SavedCase[] {
  return [...cases].sort((a, b) => {
    const aBlocked = a.brief.risiko === "inakzeptabel";
    const bBlocked = b.brief.risiko === "inakzeptabel";
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
    setCases(getSavedCases());
    setLoaded(true);
  }, []);

  function handleDelete(id: string) {
    setCases(deleteCase(id));
  }

  const sorted = sortCases(cases);

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-16">
      <header className="mb-10">
        <p className="text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Klarsicht · Rangliste
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
          Gespeicherte Fälle
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
          Sortiert nach Gesamt-Score. Fälle mit dem Risiko &ldquo;Inakzeptabel&rdquo;
          stehen unabhängig vom Score ganz unten.
        </p>
      </header>

      {loaded && sorted.length === 0 && (
        <Card className="rounded-2xl border-zinc-200 bg-white py-0 dark:border-zinc-800 dark:bg-zinc-900">
          <CardContent className="p-8 text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Noch keine Fälle gespeichert. Bewerte einen Fall im Fakten-Scorer
              und klicke dort auf &ldquo;Fall speichern&rdquo;.
            </p>
            <Link
              href="/scorer"
              className="mt-4 inline-block text-sm font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50"
            >
              Zum Fakten-Scorer →
            </Link>
          </CardContent>
        </Card>
      )}

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
  const blocked = brief.risiko === "inakzeptabel";
  const colorKey = (result.einordnung?.colorClass ?? "zinc") as ClassificationColorKey;
  const badgeClass = blocked
    ? CLASSIFICATION_STYLES.zinc.badge
    : CLASSIFICATION_STYLES[colorKey]?.badge ?? CLASSIFICATION_STYLES.zinc.badge;
  const title = brief.problem.trim() || "Unbenannter Fall";
  const savedDate = new Date(item.savedAt).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <Card className="rounded-2xl border-zinc-200 bg-white py-0 dark:border-zinc-800 dark:bg-zinc-900">
      <CardContent className="flex items-start gap-4 p-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          {rank}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {title}
            </p>
            {brief.risiko && (
              <Badge variant="outline" className={RISIKO_BADGE[brief.risiko]}>
                {RISIKO_OPTIONS.find((r) => r.id === brief.risiko)?.label}
              </Badge>
            )}
          </div>

          {brief.loesung && (
            <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
              {brief.loesung}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {blocked ? (
              <Badge variant="outline" className={badgeClass}>
                Zurückgestellt — Risiko inakzeptabel
              </Badge>
            ) : (
              result.einordnung && (
                <Badge variant="outline" className={badgeClass}>
                  {result.einordnung.title}
                </Badge>
              )
            )}
            <span className="text-xs text-zinc-400 dark:text-zinc-500">
              Gespeichert am {savedDate}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="text-2xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
            {result.gesamtScore ?? "–"}
            <span className="text-xs font-normal text-zinc-400 dark:text-zinc-500">
              /100
            </span>
          </span>
          <Button
            variant="ghost"
            size="xs"
            onClick={onDelete}
            className="text-zinc-400 hover:text-red-600 dark:text-zinc-500 dark:hover:text-red-400"
          >
            Löschen
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
