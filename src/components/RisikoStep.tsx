"use client";

import { ShieldAlert } from "lucide-react";
import { ChipSelect, SectionIcon, SurfaceCard } from "@/components/shared";
import { getRisikoChipOptions, type RisikoId } from "@/types/brief";
import type { RisikoVorschlag } from "@/types/classification";

export default function RisikoStep({
  risiko,
  vorschlag,
  showAuswirkungFristHinweis = false,
  onChange,
}: {
  risiko: "" | RisikoId;
  vorschlag?: RisikoVorschlag;
  showAuswirkungFristHinweis?: boolean;
  onChange: (risiko: RisikoId) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-4">
        <SectionIcon icon={ShieldAlert} />
        <div>
          <p className="text-sm font-semibold text-foreground">
            Was passiert, wenn die Automatisierung einen Fehler macht?
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Einschätze die Folgen eines fehlerhaften KI-Ergebnisses — nicht,
            was passiert, wenn die Aufgabe unerledigt bleibt.
          </p>
        </div>
      </div>

      {showAuswirkungFristHinweis && (
        <SurfaceCard contentClassName="p-5">
          <p className="text-sm leading-6 text-muted-foreground">
            Du hast angegeben, dass eine Frist daran hängt. Das sagt noch
            nichts darüber, wie riskant eine Automatisierung wäre — bitte hier
            getrennt einschätzen.
          </p>
        </SurfaceCard>
      )}

      {vorschlag && (
        <SurfaceCard contentClassName="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Einschätzung
          </p>
          <p className="mt-2 text-sm leading-6">{vorschlag.begruendung}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Du kannst die Stufe unten anpassen.
          </p>
        </SurfaceCard>
      )}

      <ChipSelect
        label="Risiko beim KI-Einsatz"
        options={getRisikoChipOptions()}
        value={risiko}
        onChange={(value) => {
          if (value) onChange(value);
        }}
      />
    </div>
  );
}
