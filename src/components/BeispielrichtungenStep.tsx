"use client";

import { Lightbulb } from "lucide-react";
import { SectionIcon } from "@/components/shared";
import BeispielrichtungenListe from "@/components/BeispielrichtungenListe";
import type { ClassificationResult } from "@/types/classification";

export default function BeispielrichtungenStep({
  classification,
}: {
  classification: ClassificationResult;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-4">
        <SectionIcon icon={Lightbulb} />
        <div>
          <p className="text-sm leading-6 text-muted-foreground">
            Passende Optionen für deinen Fall — inklusive Art der Automatisierung.
            Keine fertige Lösung; Orientierung vor dem Ergebnis.
          </p>
        </div>
      </div>

      <BeispielrichtungenListe classification={classification} />
    </div>
  );
}
