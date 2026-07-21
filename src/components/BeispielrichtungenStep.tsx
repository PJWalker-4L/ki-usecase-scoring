"use client";

import { Lightbulb, TriangleAlert } from "lucide-react";
import { SectionIcon, SectionLabel, SurfaceCard } from "@/components/shared";
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
            Orientierung — keine fertige Lösung. Wenn etwas nicht passt, ignorier
            es und beantworte die Fragen danach ehrlich.
          </p>
        </div>
      </div>

      <SurfaceCard contentClassName="p-5">
        <SectionLabel className="mb-3">Beispiele für Automatisierungsoptionen</SectionLabel>
        <ul className="flex list-disc flex-col gap-2.5 pl-4 text-sm leading-6">
          {classification.beispielrichtungen.map((item) => (
            <li key={item}>{item}</li>
          ))}
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
