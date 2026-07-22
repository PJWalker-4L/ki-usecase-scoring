"use client";

import { useEffect, useState } from "react";
import { Lightbulb, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import BeispielrichtungenListe from "@/components/BeispielrichtungenListe";
import { classifyBeispiele } from "@/lib/classify-client";
import { cn } from "@/lib/utils";
import type { Answers } from "@/lib/scoring";
import type { FallBrief } from "@/types/brief";
import type { ClassificationResult } from "@/types/classification";

const DESKTOP_SHEET_QUERY = "(min-width: 640px)";

function useResponsiveSheetSide(): "bottom" | "right" {
  const [side, setSide] = useState<"bottom" | "right">("bottom");

  useEffect(() => {
    const query = window.matchMedia(DESKTOP_SHEET_QUERY);
    const sync = () => setSide(query.matches ? "right" : "bottom");
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return side;
}

export default function BeispielloesungenSheet({
  classification,
  brief,
  answers,
  onUpdated,
}: {
  classification: ClassificationResult;
  brief: FallBrief;
  answers: Answers;
  onUpdated: (next: ClassificationResult) => void;
}) {
  const side = useResponsiveSheetSide();
  const [current, setCurrent] = useState(classification);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCurrent(classification);
  }, [classification]);

  const risiko =
    brief.risiko || classification.risikoVorschlag?.stufe || null;
  const canRegenerate = Boolean(risiko && classification.archetypId);

  async function handleRegenerate() {
    if (!risiko || !classification.archetypId || regenerating) return;

    setRegenerating(true);
    setError(null);

    const response = await classifyBeispiele({
      ablauf: brief.problem,
      ziel: brief.ziel,
      loesung: brief.loesung || undefined,
      archetypId: classification.archetypId,
      risiko,
      answers,
    });

    setRegenerating(false);

    if (!response.ok) {
      setError(response.message);
      return;
    }

    const next: ClassificationResult = {
      ...classification,
      beispielrichtungen: response.data.beispielrichtungen,
      fallstricke: response.data.fallstricke,
    };
    setCurrent(next);
    onUpdated(next);
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="w-full sm:w-auto">
          <Lightbulb className="size-3.5" />
          Beispiellösungen
        </Button>
      </SheetTrigger>
      <SheetContent
        side={side}
        className={cn(
          "w-full gap-0",
          side === "bottom" && "max-h-[90vh] rounded-t-[var(--radius-xl)]",
          side === "right" && "sm:max-w-lg"
        )}
      >
        <SheetHeader>
          <SheetTitle>Beispiellösungen</SheetTitle>
          <SheetDescription>
            Von der KI vorgeschlagene Automatisierungsoptionen für diesen Fall — als
            Orientierung, keine fertige Lösung.
          </SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
          {regenerating ? (
            <p className="rounded-2xl bg-muted/70 px-4 py-6 text-sm text-muted-foreground">
              Neue Beispiellösungen werden erstellt …
            </p>
          ) : (
            <BeispielrichtungenListe classification={current} />
          )}
          {error && (
            <p className="mt-3 rounded-2xl bg-muted/70 px-4 py-3 text-sm text-muted-foreground">
              {error}
            </p>
          )}
        </div>
        <SheetFooter className="border-t border-border/60">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!canRegenerate || regenerating}
            onClick={() => void handleRegenerate()}
            className="w-full"
          >
            <RefreshCw
              className={cn("size-3.5", regenerating && "animate-spin")}
            />
            {regenerating ? "Wird neu generiert …" : "Neu generieren"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
