"use client";

import { cn } from "@/lib/utils";

export type ChipOption<T extends string = string> = {
  id: T;
  label: string;
  activeClass?: string;
  inactiveClass?: string;
};

export default function ChipSelect<T extends string>({
  options,
  value,
  onChange,
  allowDeselect = true,
  label,
  className,
}: {
  options: readonly ChipOption<T>[];
  value: T | "";
  onChange: (value: T | "") => void;
  allowDeselect?: boolean;
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("flex flex-wrap gap-2", className)}
    >
      {options.map((option) => {
        const active = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            onClick={() => {
              if (active && allowDeselect) onChange("");
              else onChange(option.id);
            }}
            className={cn(
              "min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition",
              active
                ? option.activeClass ??
                    "border-transparent bg-[var(--color-text)] text-[var(--color-text-inverse)]"
                : option.inactiveClass ??
                    "border-border bg-background text-foreground hover:bg-muted/40"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
