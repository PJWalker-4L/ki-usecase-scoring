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
  required: boolean;
}[] = [
  {
    key: "problem",
    label: "Aktueller Ablauf",
    placeholder:
      "z. B. Jeden Tag prüfen Sachbearbeiter 40 Eingangsrechnungen manuell und tragen Beträge ins ERP ein.",
    required: true,
  },
  {
    key: "loesung",
    label: "Lösungsansatz",
    placeholder:
      "z. B. KI liest Rechnungs-PDFs aus, extrahiert Beträge und Lieferanten und schlägt die Buchungszuordnung vor.",
    required: false,
  },
  {
    key: "ziel",
    label: "Ziel des Prozesses / Erwartetes Ergebnis",
    placeholder: "z. B. Bearbeitungszeit um 70 % senken, Fehlerquote halbieren.",
    required: true,
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
            Aktueller Ablauf und Ziel sind Pflichtfelder. Lösungsansatz und
            Risiko-Einschätzung sind optional.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {FIELDS.map(({ key, label, placeholder, required }) => (
          <FormField
            key={key}
            id={`brief-${key}`}
            label={label}
            required={required}
            optional={!required}
          >
            <Textarea
              id={`brief-${key}`}
              rows={2}
              required={required}
              aria-required={required}
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
