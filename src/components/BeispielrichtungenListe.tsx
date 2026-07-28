"use client";

import { Sparkles, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionLabel, SurfaceCard } from "@/components/shared";
import {
  AUTOMATISIERUNGSTYP_LABELS,
  normalizeAutomatisierungstyp,
} from "@/lib/automatisierungstyp";
import { resolveEmpfehlung } from "@/lib/empfehlung";
import type { ClassificationResult } from "@/types/classification";

export default function BeispielrichtungenListe({
  classification,
}: {
  classification: ClassificationResult;
}) {
  const empfehlung = resolveEmpfehlung(classification);
  const showFallstrickeBlock =
    classification.fallstricke.length > 0 || empfehlung != null;

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
                className="rounded-2xl border border-border/60 bg-muted/30 p-4"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-xs font-medium">
                    {meta.label}
                  </Badge>
                  {isRecommended && (
                    <Badge variant="secondary" className="text-xs font-medium">
                      Empfohlen
                    </Badge>
                  )}
                </div>
                <p className="text-sm leading-6">{item.text}</p>
                <p className="mt-2 text-xs text-muted-foreground">{meta.hint}</p>
              </li>
            );
          })}
        </ul>
      </SurfaceCard>

      {showFallstrickeBlock && (
        <SurfaceCard contentClassName="p-5">
          {classification.fallstricke.length > 0 && (
            <>
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
            </>
          )}

          {empfehlung && (
            <div
              className={
                classification.fallstricke.length > 0
                  ? "mt-5 border-t border-border/60 pt-5"
                  : undefined
              }
            >
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="size-4 text-primary" strokeWidth={1.5} />
                <SectionLabel>Empfohlene Option</SectionLabel>
              </div>
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                <div className="mb-2">
                  <Badge variant="outline" className="text-xs font-medium">
                    {
                      AUTOMATISIERUNGSTYP_LABELS[
                        normalizeAutomatisierungstyp(empfehlung.option.typ) ??
                          "sonstiges"
                      ].label
                    }
                  </Badge>
                </div>
                <p className="text-sm leading-6">{empfehlung.option.text}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {empfehlung.begruendung}
                </p>
              </div>
            </div>
          )}
        </SurfaceCard>
      )}
    </div>
  );
}
