"use client";

import { TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionLabel, SurfaceCard } from "@/components/shared";
import {
  AUTOMATISIERUNGSTYP_BADGE,
  AUTOMATISIERUNGSTYP_LABELS,
  normalizeAutomatisierungstyp,
} from "@/lib/automatisierungstyp";
import { resolveEmpfehlung } from "@/lib/empfehlung";
import { EMPFEHLUNG_LABEL } from "@/lib/copy/aufgabenbeschreibung";
import type { ClassificationResult } from "@/types/classification";
import { cn } from "@/lib/utils";

export default function BeispielrichtungenListe({
  classification,
}: {
  classification: ClassificationResult;
}) {
  const empfehlung = resolveEmpfehlung(classification);

  return (
    <div className="flex flex-col gap-5">
      <SurfaceCard contentClassName="p-5">
        <SectionLabel className="mb-4">Beispiele für Automatisierungsoptionen</SectionLabel>
        <ul className="flex flex-col gap-4">
          {classification.beispielrichtungen.map((item, index) => {
            const typ = normalizeAutomatisierungstyp(item.typ) ?? "sonstiges";
            const meta = AUTOMATISIERUNGSTYP_LABELS[typ];
            const isRecommended =
              empfehlung != null && index === classification.empfehlung?.index;
            return (
              <li
                key={`${index}-${item.typ}-${item.text}`}
                className={cn(
                  "rounded-[var(--radius-lg)] border p-4",
                  isRecommended
                    ? "border-[color-mix(in_srgb,var(--color-brand)_35%,transparent)] bg-[var(--color-accent-subtle)]"
                    : "border-border/60 bg-muted/30"
                )}
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge
                    variant="soft"
                    className={cn("text-xs font-semibold", AUTOMATISIERUNGSTYP_BADGE[typ])}
                  >
                    {meta.label}
                  </Badge>
                  {isRecommended && (
                    <Badge variant="default" className="text-xs font-semibold">
                      {EMPFEHLUNG_LABEL}
                    </Badge>
                  )}
                </div>
                <p className="text-sm leading-6">{item.text}</p>
                {isRecommended && empfehlung && (
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {empfehlung.begruendung}
                  </p>
                )}
                <p className="mt-2 text-xs text-muted-foreground">{meta.hint}</p>
              </li>
            );
          })}
        </ul>
      </SurfaceCard>

      {classification.fallstricke.length > 0 && (
        <SurfaceCard contentClassName="p-5">
          <div className="mb-3 flex items-center gap-2">
            <TriangleAlert
              className="size-4 text-muted-foreground"
              strokeWidth={1.5}
            />
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
