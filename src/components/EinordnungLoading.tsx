"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WIZARD_EINORDNUNG_LOADING } from "@/lib/copy/aufgabenbeschreibung";
import { cn } from "@/lib/utils";

type StepState = "open" | "active" | "done";

const CANCEL_REVEAL_MS = 8000;
const STEP_ADVANCE_MS = 2600;
/** Mindestzeit auf dem Lade-Screen — verhindert Aufblitzen bei schneller API-Antwort. */
export const EINORDNUNG_LOADING_MIN_MS = 600;

function CheckMark({ className }: { className?: string }) {
  return (
    <Check
      className={cn("size-2.5 text-white", className)}
      strokeWidth={3}
      aria-hidden
    />
  );
}

export default function EinordnungLoading({
  onCancel,
}: {
  onCancel: () => void;
}) {
  const [stepStates, setStepStates] = useState<StepState[]>([
    "done",
    "active",
    "open",
  ]);
  const [showCancel, setShowCancel] = useState(false);

  useEffect(() => {
    const advance = window.setTimeout(() => {
      setStepStates(["done", "done", "active"]);
    }, STEP_ADVANCE_MS);
    const revealCancel = window.setTimeout(() => {
      setShowCancel(true);
    }, CANCEL_REVEAL_MS);

    return () => {
      window.clearTimeout(advance);
      window.clearTimeout(revealCancel);
    };
  }, []);

  return (
    <div className="flex min-h-[min(32rem,calc(100dvh-10rem))] flex-1 flex-col">
      <div
        className="flex flex-1 flex-col items-center justify-center px-1 text-center"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="einordnung-ring relative mb-8 size-[8.25rem]" aria-hidden>
          <span className="einordnung-ring-pulse absolute inset-[1.375rem] rounded-full" />
          <svg className="absolute inset-0 size-full" viewBox="0 0 120 120" fill="none">
            <circle
              className="einordnung-ring-track"
              cx="60"
              cy="60"
              r="52"
              strokeWidth="5"
            />
            <circle
              className="einordnung-ring-arc"
              cx="60"
              cy="60"
              r="52"
              strokeWidth="5"
            />
          </svg>
          <span className="absolute inset-0 grid place-items-center font-headline text-[0.8125rem] font-bold tracking-[0.12em] text-[var(--color-brand)]">
            KI
          </span>
        </div>

        <h2 className="font-headline max-w-[18rem] text-[1.55rem] font-bold leading-[1.18] tracking-[-0.015em] text-foreground sm:text-[1.65rem]">
          {WIZARD_EINORDNUNG_LOADING.title}
        </h2>
        <p className="mt-2.5 max-w-[17.5rem] text-[0.9rem] leading-[1.5] text-muted-foreground">
          {WIZARD_EINORDNUNG_LOADING.description}
        </p>

        <ul className="mt-8 flex w-full max-w-[18rem] flex-col gap-0.5 text-left">
          {WIZARD_EINORDNUNG_LOADING.steps.map((label, index) => {
            const state = stepStates[index] ?? "open";
            return (
              <li
                key={label}
                data-state={state}
                className={cn(
                  "flex items-center gap-2.5 rounded-[var(--radius-md)] px-3 py-2.5 text-[0.84rem] leading-snug transition-[color,background-color,box-shadow] duration-300",
                  state === "active" &&
                    "bg-[color-mix(in_srgb,var(--color-card)_62%,transparent)] font-semibold text-foreground shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-border)_70%,transparent)]",
                  state === "done" && "text-muted-foreground",
                  state === "open" && "text-[color-mix(in_srgb,var(--color-text-muted)_72%,transparent)]"
                )}
              >
                <span
                  className={cn(
                    "grid size-4 shrink-0 place-items-center rounded-full border-[1.5px] transition-[border-color,background-color] duration-300",
                    state === "done" &&
                      "border-[var(--score-high-text)] bg-[var(--score-high-text)]",
                    state === "active" &&
                      "einordnung-mark-spin border-[var(--color-brand)] border-dashed",
                    state === "open" &&
                      "border-[color-mix(in_srgb,var(--color-text-muted)_40%,transparent)]"
                  )}
                >
                  {state === "done" ? <CheckMark /> : null}
                </span>
                <span>{label}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-8 flex flex-col items-center pb-1 text-center">
        <p className="text-[0.78rem] leading-[1.45] text-muted-foreground">
          {WIZARD_EINORDNUNG_LOADING.hint}
        </p>
        {showCancel && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-3 font-semibold text-muted-foreground"
            onClick={onCancel}
          >
            {WIZARD_EINORDNUNG_LOADING.cancel}
          </Button>
        )}
      </div>
    </div>
  );
}
