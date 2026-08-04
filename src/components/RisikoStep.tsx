"use client";

import { useId, useState } from "react";
import { ChevronDown, ShieldAlert } from "lucide-react";
import { ChipSelect, SectionIcon, SurfaceCard } from "@/components/shared";
import {
  RISIKO_COMPLIANCE_HINWEIS,
  RISIKO_WARUM_HINWEIS,
  getRisikoChipOptions,
  type RisikoId,
} from "@/types/brief";
import type { RisikoVorschlag } from "@/types/classification";

function WarumFragtDetails() {
  const panelId = useId();
  const [open, setOpen] = useState(true);

  return (
    <details
      className="group rounded-[var(--radius-lg)] border border-border bg-background px-4 py-3 text-sm"
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary
        aria-expanded={open}
        aria-controls={panelId}
        className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-md font-semibold text-primary outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30 [&::-webkit-details-marker]:hidden"
      >
        {RISIKO_WARUM_HINWEIS.toggle}
        <ChevronDown
          className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <p
        id={panelId}
        role="region"
        aria-label={RISIKO_WARUM_HINWEIS.toggle}
        className="mt-3 border-t border-border pt-3 leading-6 text-muted-foreground"
      >
        {RISIKO_WARUM_HINWEIS.text}
      </p>
    </details>
  );
}

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

      <WarumFragtDetails />

      <p
        role="note"
        className="surface-inset px-4 py-3 text-xs leading-5 text-muted-foreground"
      >
        {RISIKO_COMPLIANCE_HINWEIS}
      </p>
    </div>
  );
}
