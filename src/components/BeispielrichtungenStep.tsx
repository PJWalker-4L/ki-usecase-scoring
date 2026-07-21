"use client";

import { Lightbulb, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionIcon, SectionLabel, SurfaceCard } from "@/components/shared";
import { AUTOMATISIERUNGSTYP_LABELS } from "@/lib/automatisierungstyp";
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

      <SurfaceCard contentClassName="p-5">
        <SectionLabel className="mb-4">Beispiele für Automatisierungsoptionen</SectionLabel>
        <ul className="flex flex-col gap-4">
          {classification.beispielrichtungen.map((item) => {
            const meta = AUTOMATISIERUNGSTYP_LABELS[item.typ];
            return (
              <li
                key={`${item.typ}-${item.text}`}
                className="rounded-2xl border border-border/60 bg-muted/30 p-4"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-xs font-medium">
                    {meta.label}
                  </Badge>
                </div>
                <p className="text-sm leading-6">{item.text}</p>
                <p className="mt-2 text-xs text-muted-foreground">{meta.hint}</p>
              </li>
            );
          })}
        </ul>
      </SurfaceCard>

      <SurfaceCard contentClassName="p-5">
        <div className="mb-3 flex items-center gap-2">
          <TriangleAlert className="size-4 text-muted-foreground" strokeWidth={1.5} />
          <SectionLabel>Typische Fallstricke</SectionLabel>
        </div>
        <ul className="flex list-disc flex-col gap-2.5 pl-4 text-sm leading-6 text-muted-foreground">
          {classification.fallstricke.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </SurfaceCard>
    </div>
  );
}
