"use client";

import { ChevronDown, ClipboardList } from "lucide-react";
import {
  FormField,
  SectionIcon,
  SurfaceCard,
} from "@/components/shared";
import { Textarea } from "@/components/ui/textarea";
import { EMPTY_BRIEF, type FallBrief } from "@/types/brief";

interface Props {
  brief: FallBrief;
  onChange: (brief: FallBrief) => void;
  /** When true, omit outer SurfaceCard (wizard already provides chrome). */
  bare?: boolean;
}

const ABLAUF_SCHABLONE = "Ich nehme …, mache …, damit …";

const FIELDS: {
  key: keyof Pick<FallBrief, "problem" | "ziel">;
  label: string;
  hint: string;
  placeholder: string;
  required: boolean;
}[] = [
  {
    key: "problem",
    label: "Aktueller Ablauf",
    hint: "Beschreiben Sie den heutigen Durchlauf — Input, Arbeit, Zwischenergebnis.",
    placeholder:
      "Ich nehme eingehende Rechnungen, prüfe Beträge und trage sie ins ERP ein, damit die Buchhaltung weiterarbeiten kann.",
    required: true,
  },
  {
    key: "ziel",
    label: "Was soll am Ende vorliegen?",
    hint: "Soll-Zustand — was liegt vor, ohne dass Sie alles selbst erledigen müssen? Kontrolle kann bei Ihnen bleiben.",
    placeholder:
      "Am Ende liegen freigegebene Buchungssätze im ERP vor, ohne manuelles Abtippen — die Freigabe bleibt bei mir.",
    required: true,
  },
];

const BEISPIELE: { title: string; ablauf: string; ziel: string }[] = [
  {
    title: "Rechnungseingang",
    ablauf:
      "Ich nehme täglich eingehende Rechnungen aus dem Postfach, prüfe Beträge und trage sie manuell ins ERP ein, damit die Buchhaltung weiterarbeiten kann.",
    ziel:
      "Am Ende liegen freigegebene Buchungssätze im ERP vor, ohne manuelles Abtippen — die Freigabe bleibt bei mir.",
  },
  {
    title: "Kundenanfragen",
    ablauf:
      "Ich nehme eingehende Kundenanfragen per E-Mail, recherchiere Antworten in drei Systemen und antworte einzeln, damit keine Anfrage offen bleibt.",
    ziel:
      "Am Ende liegt ein Antwortentwurf vor, ohne dass ich in jedem System suchen muss — Versand und Tonfall prüfe ich selbst.",
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
            Beschreiben Sie den heutigen Ablauf als konkreten Durchlauf — und was
            am Ende anders sein soll. Die Satzschablone hilft beim ersten Satz.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <p className="surface-inset px-4 py-3 text-sm leading-6 text-muted-foreground">
          <span className="font-medium text-foreground">Satzschablone für den Ablauf:</span>{" "}
          {ABLAUF_SCHABLONE}
        </p>

        {FIELDS.map(({ key, label, hint, placeholder, required }) => (
          <FormField
            key={key}
            id={`brief-${key}`}
            label={label}
            hint={hint}
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

        <details className="group surface-inset rounded-lg px-4 py-3 text-sm">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 font-medium text-foreground [&::-webkit-details-marker]:hidden">
            Zwei ausgefüllte Beispiele ansehen
            <ChevronDown
              className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <div className="mt-4 flex flex-col gap-4 border-t border-border pt-4">
            {BEISPIELE.map(({ title, ablauf, ziel }) => (
              <div key={title} className="flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {title}
                </p>
                <p className="leading-6 text-muted-foreground">
                  <span className="font-medium text-foreground">Ablauf:</span> {ablauf}
                </p>
                <p className="leading-6 text-muted-foreground">
                  <span className="font-medium text-foreground">Ziel:</span> {ziel}
                </p>
              </div>
            ))}
          </div>
        </details>

        {(brief.problem || brief.ziel) && (
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
