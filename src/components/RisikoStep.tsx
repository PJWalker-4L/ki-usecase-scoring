"use client";

import { ShieldAlert } from "lucide-react";
import { ChipSelect, SectionIcon, SurfaceCard } from "@/components/shared";
import { RISIKO_OPTIONS, type RisikoId } from "@/types/brief";
import type { RisikoVorschlag } from "@/types/classification";

export default function RisikoStep({
  risiko,
  vorschlag,
  onChange,
}: {
  risiko: "" | RisikoId;
  vorschlag?: RisikoVorschlag;
  onChange: (risiko: RisikoId) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-4">
        <SectionIcon icon={ShieldAlert} />
        <div>
          <p className="text-sm leading-6 text-muted-foreground">
            Wie gravierend wären Fehler, Datenmissbrauch oder falsche
            Entscheidungen in diesem Prozess?
          </p>
        </div>
      </div>

      {vorschlag && (
        <SurfaceCard contentClassName="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Vorschlag
          </p>
          <p className="mt-2 text-sm leading-6">{vorschlag.begruendung}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Du kannst die Stufe unten anpassen.
          </p>
        </SurfaceCard>
      )}

      <ChipSelect
        label="Risiko beim KI-Einsatz"
        options={RISIKO_OPTIONS}
        value={risiko}
        onChange={(value) => {
          if (value) onChange(value);
        }}
      />
    </div>
  );
}
