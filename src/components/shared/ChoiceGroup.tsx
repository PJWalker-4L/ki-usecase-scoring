"use client";

import { useCallback, useId, useRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

export type ChoiceItem = {
  id: string;
  label: string;
  hint?: string;
  /** Rechte Spalte (z. B. Monats-Häufigkeit), immer sichtbar bei variant="split". */
  suffix?: string;
};

const choiceVariants = cva(
  "min-h-11 w-full border px-5 py-3.5 text-left transition-[background,color,border-color] duration-150 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
  {
    variants: {
      selected: {
        true: "border-transparent bg-primary text-primary-foreground",
        false:
          "border-border bg-background text-foreground hover:border-[color-mix(in_srgb,var(--color-text)_20%,transparent)] hover:bg-muted/40",
      },
      layout: {
        default: "rounded-full",
        split: "rounded-[var(--radius-lg)]",
      },
    },
    defaultVariants: {
      selected: false,
      layout: "default",
    },
  }
);

export default function ChoiceGroup({
  options,
  value,
  onChange,
  name,
  label,
  className,
  revealHintOnSelect = true,
  variant = "default",
}: {
  options: ChoiceItem[];
  value?: string;
  onChange: (id: string) => void;
  name?: string;
  label?: string;
  className?: string;
  revealHintOnSelect?: boolean;
  /** split: Label links, suffix rechts (Häufigkeitsfrage). */
  variant?: "default" | "split";
}) {
  const split = variant === "split";
  const groupId = useId();
  const groupName = name ?? groupId;
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const focusIndex = useCallback((index: number) => {
    const el = refs.current[index];
    el?.focus();
  }, []);

  function handleKeyDown(event: React.KeyboardEvent, index: number) {
    let next = index;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      next = (index + 1) % options.length;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      next = (index - 1 + options.length) % options.length;
    } else if (event.key === "Home") {
      event.preventDefault();
      next = 0;
    } else if (event.key === "End") {
      event.preventDefault();
      next = options.length - 1;
    } else {
      return;
    }
    focusIndex(next);
    onChange(options[next].id);
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn("flex flex-col gap-2.5", className)}
    >
      {options.map((option, index) => {
        const selected = value === option.id;
        const showHint =
          !split && option.hint && (!revealHintOnSelect || selected);

        return (
          <button
            key={option.id}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected || (!value && index === 0) ? 0 : -1}
            name={groupName}
            onClick={() => onChange(option.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={choiceVariants({
              selected,
              layout: split ? "split" : "default",
            })}
          >
            {split ? (
              <span className="flex w-full items-center justify-between gap-4">
                <span className="min-w-0 text-left text-sm font-semibold">
                  {option.label}
                </span>
                {option.suffix && (
                  <span
                    className={cn(
                      "shrink-0 text-sm tabular-nums",
                      selected
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                    )}
                  >
                    {option.suffix}
                  </span>
                )}
              </span>
            ) : (
              <>
                <span className="block text-sm font-semibold">{option.label}</span>
                {showHint && (
                  <span
                    className={cn(
                      "mt-0.5 block text-xs leading-5",
                      selected
                        ? "text-primary-foreground/85"
                        : "text-muted-foreground"
                    )}
                  >
                    {option.hint}
                  </span>
                )}
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}
