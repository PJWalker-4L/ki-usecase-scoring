"use client";

import { TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionLabel, SurfaceCard } from "@/components/shared";
import { AUTOMATISIERUNGSTYP_LABELS } from "@/lib/automatisierungstyp";
import type { ClassificationResult } from "@/types/classification";

export default function BeispielrichtungenListe({
  classification,
}: {
  classification: ClassificationResult;
}) {
  return (
    <div className="flex flex-col gap-5">
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

      {classification.fallstricke.length > 0 && (
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
      )}
    </div>
  );
}
