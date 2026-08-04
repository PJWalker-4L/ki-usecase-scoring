"use client";

import { Fragment, useId, useState } from "react";
import { ChevronDown, ClipboardList, TextQuote } from "lucide-react";
import {
  FormField,
  SectionIcon,
  SurfaceCard,
} from "@/components/shared";
import { Textarea } from "@/components/ui/textarea";
import {
  ABLAUF_SCHABLONE_TEILE,
  FELD_ABLAUF,
  STECKBRIEF_BEISPIELE,
  STECKBRIEF_COPY,
  STECKBRIEF_FIELDS,
} from "@/lib/copy/aufgabenbeschreibung";
import { EMPTY_BRIEF, type FallBrief } from "@/types/brief";

interface Props {
  brief: FallBrief;
  onChange: (brief: FallBrief) => void;
  /** When true, omit outer SurfaceCard (wizard already provides chrome). */
  bare?: boolean;
}

export default function FallSteckbrief({ brief, onChange, bare = false }: Props) {
  const beispielePanelId = useId();
  const schabloneId = useId();
  const [beispieleOpen, setBeispieleOpen] = useState(false);

  function set<K extends keyof FallBrief>(key: K, value: FallBrief[K]) {
    onChange({ ...brief, [key]: value });
  }

  const body = (
    <>
      <div className="mb-5 flex items-start gap-4">
        <SectionIcon icon={ClipboardList} />
        <p className="text-sm leading-6 text-muted-foreground">
          {STECKBRIEF_COPY.intro}
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <aside
          id={schabloneId}
          aria-label={STECKBRIEF_COPY.schabloneLabel}
          className="surface-highlight flex gap-3 rounded-xl border-l-[3px] border-l-[var(--color-brand)] px-4 py-3.5 sm:gap-4 sm:px-5 sm:py-4"
        >
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-background/70 text-[var(--color-brand)] ring-1 ring-[color-mix(in_srgb,var(--color-brand)_18%,transparent)]"
            aria-hidden
          >
            <TextQuote className="size-4" strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold tracking-wide text-[var(--color-brand)]">
              {STECKBRIEF_COPY.schabloneLabel}
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-2">
              {ABLAUF_SCHABLONE_TEILE.map((teil, index) => (
                <Fragment key={teil.label}>
                  {index > 0 && (
                    <span
                      className="hidden text-muted-foreground/45 select-none sm:inline"
                      aria-hidden
                    >
                      →
                    </span>
                  )}
                  <span className="inline-flex items-baseline gap-1 rounded-lg bg-background/90 px-3 py-1.5 text-sm shadow-sm ring-1 ring-border/70">
                    <span className="font-medium text-foreground">{teil.label}</span>
                    <span className="text-muted-foreground">{teil.slot}</span>
                  </span>
                </Fragment>
              ))}
            </div>
          </div>
        </aside>

        {STECKBRIEF_FIELDS.map(({ key, label, hint, placeholder, required }) => (
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
              className="resize-y"
              rows={2}
              required={required}
              aria-required={required}
              aria-describedby={key === "problem" ? schabloneId : undefined}
              value={brief[key]}
              onChange={(e) => set(key, e.target.value)}
              placeholder={placeholder}
            />
          </FormField>
        ))}

        <details
          className="group surface-inset rounded-lg px-4 py-3 text-sm"
          open={beispieleOpen}
          onToggle={(event) => setBeispieleOpen(event.currentTarget.open)}
        >
          <summary
            aria-expanded={beispieleOpen}
            aria-controls={beispielePanelId}
            className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-md font-medium text-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30 [&::-webkit-details-marker]:hidden"
          >
            {STECKBRIEF_COPY.beispieleToggle}
            <ChevronDown
              className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <div
            id={beispielePanelId}
            role="region"
            aria-label={STECKBRIEF_COPY.beispieleToggle}
            className="mt-4 flex flex-col gap-4 border-t border-border pt-4"
          >
            {STECKBRIEF_BEISPIELE.map(({ title, ablauf, ziel }) => (
              <div key={title} className="flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {title}
                </p>
                <p className="leading-6 text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {FELD_ABLAUF.kurzLabel}:
                  </span>{" "}
                  {ablauf}
                </p>
                <p className="leading-6 text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {STECKBRIEF_COPY.beispielZielLabel}
                  </span>{" "}
                  {ziel}
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
            {STECKBRIEF_COPY.loeschen}
          </button>
        )}
      </div>
    </>
  );

  if (bare) return <div>{body}</div>;

  return <SurfaceCard>{body}</SurfaceCard>;
}
