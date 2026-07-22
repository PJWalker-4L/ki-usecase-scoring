"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionLabel, SurfaceCard } from "@/components/shared";
import {
  EMPTY_RANGLISTE_FILTERS,
  PRIORISIERUNG_FILTER_OPTIONS,
  RISIKO_FILTER_OPTIONS,
  SCORE_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
  hasActiveRanglisteFilters,
  type RanglisteFilterState,
} from "@/lib/rangliste-filters";
import { cn } from "@/lib/utils";

function FilterChipGroup<T extends string>({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: readonly { id: T; label: string }[];
  selected: T[];
  onChange: (next: T[]) => void;
}) {
  function toggle(id: T) {
    onChange(
      selected.includes(id)
        ? selected.filter((value) => value !== id)
        : [...selected, id]
    );
  }

  return (
    <div>
      <p className="font-label mb-2 text-[0.6875rem] text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {options.map((option) => {
          const active = selected.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(option.id)}
              className={cn(
                "min-h-9 rounded-full border px-3 py-1.5 text-sm font-medium transition",
                active
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:bg-muted/40"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function RanglisteFilterBar({
  filters,
  onChange,
  totalCount,
  filteredCount,
}: {
  filters: RanglisteFilterState;
  onChange: (filters: RanglisteFilterState) => void;
  totalCount: number;
  filteredCount: number;
}) {
  const active = hasActiveRanglisteFilters(filters);

  return (
    <SurfaceCard contentClassName="p-4 sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-muted-foreground" aria-hidden />
          <SectionLabel className="mb-0">Filter</SectionLabel>
        </div>
        {active && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange(EMPTY_RANGLISTE_FILTERS)}
            className="h-8 shrink-0 gap-1.5 px-2 text-muted-foreground"
          >
            <X className="size-3.5" />
            Zurücksetzen
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <FilterChipGroup
          label="Priorisierung"
          options={PRIORISIERUNG_FILTER_OPTIONS}
          selected={filters.priorisierung}
          onChange={(priorisierung) => onChange({ ...filters, priorisierung })}
        />
        <FilterChipGroup
          label="Status"
          options={STATUS_FILTER_OPTIONS}
          selected={filters.status}
          onChange={(status) => onChange({ ...filters, status })}
        />
        <FilterChipGroup
          label="Gesamt-Score"
          options={SCORE_FILTER_OPTIONS}
          selected={filters.score}
          onChange={(score) => onChange({ ...filters, score })}
        />
        <FilterChipGroup
          label="Risiko"
          options={RISIKO_FILTER_OPTIONS}
          selected={filters.risiko}
          onChange={(risiko) => onChange({ ...filters, risiko })}
        />
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        {active ? (
          <>
            <span className="font-medium text-foreground">{filteredCount}</span> von{" "}
            {totalCount} Fällen
          </>
        ) : (
          <>{totalCount} Fälle</>
        )}
      </p>
    </SurfaceCard>
  );
}
