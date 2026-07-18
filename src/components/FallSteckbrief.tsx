"use client";

import { ClipboardList } from "lucide-react";
import {
  ChipSelect,
  FormField,
  SectionIcon,
  SurfaceCard,
} from "@/components/shared";
import { Textarea } from "@/components/ui/textarea";
import { EMPTY_BRIEF, RISIKO_OPTIONS, type FallBrief } from "@/types/brief";

interface Props {
  brief: FallBrief;
  onChange: (brief: FallBrief) => void;
  /** When true, omit outer SurfaceCard (wizard already provides chrome). */
  bare?: boolean;
}

const FIELDS: {
  key: keyof Pick<FallBrief, "problem" | "loesung" | "ziel">;
  label: string;
  placeholder: string;
}[] = [
  {
    key: "problem",
    label: "Problem / Herausforderung",
    placeholder:
      "z. B. Unsere Sachbearbeiter prüfen täglich 40 Eingangsrechnungen manuell — fehleranfällig und zeitaufwändig.",
  },
  {
    key: "loesung",
    label: "Lösungsansatz",
    placeholder:
      "z. B. KI liest Rechnungs-PDFs aus, extrahiert Beträge und Lieferanten und schlägt die Buchungszuordnung vor.",
  },
  {
    key: "ziel",
    label: "Ziel des Prozesses / Erwartetes Ergebnis",
    placeholder: "z. B. Bearbeitungszeit um 70 % senken, Fehlerquote halbieren.",
  },
];

export default function FallSteckbrief({ brief, onChange, bare = false }: Props) {
  function set<K extends keyof FallBrief>(key: K, value: FallBrief[K]) {
    onChange({ ...brief, [key]: value });
  }

  const body = (
    <>
      <div className="mb-5 flex items-start gap-4">
        <SectionIcon icon={ClipboardList} />
        <div>
          <h2 className="text-lg font-semibold sm:text-xl">Fall-Steckbrief</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Beschreibe den Use Case in drei Pflichtfeldern. Die Risiko-Einschätzung
            ist optional.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {FIELDS.map(({ key, label, placeholder }) => (
          <FormField key={key} id={`brief-${key}`} label={label} required>
            <Textarea
              id={`brief-${key}`}
              rows={2}
              required
              aria-required="true"
              value={brief[key]}
              onChange={(e) => set(key, e.target.value)}
              placeholder={placeholder}
            />
          </FormField>
        ))}

        <div>
          <p className="mb-3 text-sm font-semibold text-muted-foreground">
            Risiko-Einschätzung{" "}
            <span className="font-normal">(optional)</span>
          </p>
          <ChipSelect
            label="Risiko-Einschätzung"
            options={RISIKO_OPTIONS}
            value={brief.risiko}
            onChange={(v) => set("risiko", v)}
          />
        </div>

        {(brief.problem || brief.loesung || brief.ziel || brief.risiko) && (
          <button
            type="button"
            onClick={() => onChange(EMPTY_BRIEF)}
            className="self-start text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            Steckbrief löschen
          </button>
        )}
      </div>
    </>
  );

  if (bare) return <div>{body}</div>;

  return <SurfaceCard>{body}</SurfaceCard>;
}
