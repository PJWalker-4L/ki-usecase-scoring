"use client";

import { Card, CardContent } from "@/components/ui/card";
import { EMPTY_BRIEF, RISIKO_OPTIONS, type FallBrief } from "@/types/brief";

interface Props {
  brief: FallBrief;
  onChange: (brief: FallBrief) => void;
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
    label: "Ziel / Erwartetes Ergebnis",
    placeholder: "z. B. Bearbeitungszeit um 70 % senken, Fehlerquote halbieren.",
  },
];

export default function FallSteckbrief({ brief, onChange }: Props) {
  function set<K extends keyof FallBrief>(key: K, value: FallBrief[K]) {
    onChange({ ...brief, [key]: value });
  }

  return (
    <Card className="rounded-2xl border-zinc-200 bg-white py-0 dark:border-zinc-800 dark:bg-zinc-900">
      <CardContent className="p-5">
        <div className="mb-4 flex items-baseline gap-2">
          <span className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Fall-Steckbrief
          </span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            Optional — hilft dir und anderen, den Use Case einzuordnen.
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {FIELDS.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label
                htmlFor={`brief-${key}`}
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                {label}
              </label>
              <textarea
                id={`brief-${key}`}
                rows={2}
                value={brief[key]}
                onChange={(e) => set(key, e.target.value)}
                placeholder={placeholder}
                className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-zinc-100 dark:focus:ring-zinc-100/10"
              />
            </div>
          ))}

          <div>
            <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Risiko-Einschätzung
            </p>
            <div className="flex flex-wrap gap-2">
              {RISIKO_OPTIONS.map((option) => {
                const active = brief.risiko === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      set("risiko", active ? "" : option.id)
                    }
                    className={[
                      "rounded-full border px-3 py-1.5 text-sm font-medium transition",
                      active ? option.activeClass : option.inactiveClass,
                    ].join(" ")}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {(brief.problem || brief.loesung || brief.ziel || brief.risiko) && (
            <button
              type="button"
              onClick={() => onChange(EMPTY_BRIEF)}
              className="self-start text-xs text-zinc-400 underline-offset-2 hover:text-zinc-600 hover:underline dark:text-zinc-600 dark:hover:text-zinc-400"
            >
              Steckbrief löschen
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
