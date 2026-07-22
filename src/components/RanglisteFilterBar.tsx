"use client";

import { ChevronDown, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  EMPTY_RANGLISTE_FILTERS,
  PRIORISIERUNG_FILTER_OPTIONS,
  RISIKO_FILTER_OPTIONS,
  SCORE_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
  hasActiveRanglisteFilters,
  hasActiveRanglisteSearch,
  type RanglisteFilterState,
} from "@/lib/rangliste-filters";
import { cn } from "@/lib/utils";

type FilterKey = keyof RanglisteFilterState;

type ActiveFilterTag = {
  key: FilterKey;
  id: string;
  label: string;
};

const FILTER_GROUPS: {
  key: FilterKey;
  label: string;
  options: readonly { id: string; label: string }[];
}[] = [
  { key: "priorisierung", label: "Priorisierung", options: PRIORISIERUNG_FILTER_OPTIONS },
  { key: "status", label: "Status", options: STATUS_FILTER_OPTIONS },
  { key: "score", label: "Gesamt-Score", options: SCORE_FILTER_OPTIONS },
  { key: "risiko", label: "Risiko", options: RISIKO_FILTER_OPTIONS },
];

function FilterPopover<T extends string>({
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
  const active = selected.length > 0;

  function toggle(id: T) {
    onChange(
      selected.includes(id)
        ? selected.filter((value) => value !== id)
        : [...selected, id]
    );
  }

  function clearGroup() {
    onChange([]);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            "h-8 gap-1.5 px-3 font-medium",
            active && "border-primary/30 bg-primary/5 text-foreground"
          )}
        >
          {label}
          {active && (
            <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[0.625rem] font-semibold text-primary-foreground">
              {selected.length}
            </span>
          )}
          <ChevronDown className="size-3.5 opacity-60" aria-hidden />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60">
        <div className="mb-1 flex items-center justify-between px-2 py-1">
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
          {active && (
            <button
              type="button"
              onClick={clearGroup}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Leeren
            </button>
          )}
        </div>
        <div className="flex flex-col gap-0.5" role="group" aria-label={label}>
          {options.map((option) => {
            const checked = selected.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                role="checkbox"
                aria-checked={checked}
                onClick={() => toggle(option.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-muted/60",
                  checked && "bg-muted/40"
                )}
              >
                <span
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded border",
                    checked
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background"
                  )}
                  aria-hidden
                >
                  {checked && (
                    <svg viewBox="0 0 12 12" className="size-2.5" fill="none">
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <span className="min-w-0 leading-snug">{option.label}</span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function buildActiveFilterTags(filters: RanglisteFilterState): ActiveFilterTag[] {
  const tags: ActiveFilterTag[] = [];

  for (const group of FILTER_GROUPS) {
    const selected = filters[group.key] as string[];
    for (const id of selected) {
      const option = group.options.find((item) => item.id === id);
      if (!option) continue;
      tags.push({ key: group.key, id, label: option.label });
    }
  }

  return tags;
}

export default function RanglisteFilterBar({
  filters,
  onChange,
  searchQuery,
  onSearchChange,
  totalCount,
  filteredCount,
}: {
  filters: RanglisteFilterState;
  onChange: (filters: RanglisteFilterState) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalCount: number;
  filteredCount: number;
}) {
  const filtersActive = hasActiveRanglisteFilters(filters);
  const searchActive = hasActiveRanglisteSearch(searchQuery);
  const active = filtersActive || searchActive;
  const activeTags = buildActiveFilterTags(filters);

  function removeTag(tag: ActiveFilterTag) {
    const current = filters[tag.key] as string[];
    onChange({
      ...filters,
      [tag.key]: current.filter((value) => value !== tag.id),
    });
  }

  function resetAll() {
    onChange(EMPTY_RANGLISTE_FILTERS);
    onSearchChange("");
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Aktueller Ablauf, Lösung oder Ziel …"
          aria-label="Fälle durchsuchen"
          className={cn(
            "h-10 w-full rounded-full border border-border bg-background py-2 pr-10 pl-10 text-sm shadow-[var(--shadow-elevated-sm)] outline-none transition-[color,box-shadow,border-color]",
            "placeholder:text-muted-foreground focus-visible:border-primary/20 focus-visible:ring-[3px] focus-visible:ring-ring/30"
          )}
        />
        {searchActive && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label="Suche leeren"
            className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <FilterPopover
            label="Priorisierung"
            options={PRIORISIERUNG_FILTER_OPTIONS}
            selected={filters.priorisierung}
            onChange={(priorisierung) => onChange({ ...filters, priorisierung })}
          />
          <FilterPopover
            label="Status"
            options={STATUS_FILTER_OPTIONS}
            selected={filters.status}
            onChange={(status) => onChange({ ...filters, status })}
          />
          <FilterPopover
            label="Gesamt-Score"
            options={SCORE_FILTER_OPTIONS}
            selected={filters.score}
            onChange={(score) => onChange({ ...filters, score })}
          />
          <FilterPopover
            label="Risiko"
            options={RISIKO_FILTER_OPTIONS}
            selected={filters.risiko}
            onChange={(risiko) => onChange({ ...filters, risiko })}
          />
        </div>

        <p className="shrink-0 text-xs text-muted-foreground sm:text-right">
          {active ? (
            <>
              <span className="font-medium text-foreground">{filteredCount}</span> von{" "}
              {totalCount} Fällen
            </>
          ) : (
            <>{totalCount} Fälle</>
          )}
        </p>
      </div>

      {(activeTags.length > 0 || searchActive) && (
        <div className="flex flex-wrap items-center gap-2">
          {searchActive && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-muted/30 py-0.5 pr-1.5 pl-2.5 text-xs text-foreground transition-colors hover:bg-muted/60"
            >
              Suche: {searchQuery.trim()}
              <X className="size-3 text-muted-foreground" aria-hidden />
              <span className="sr-only">Suche entfernen</span>
            </button>
          )}
          {activeTags.map((tag) => (
            <button
              key={`${tag.key}-${tag.id}`}
              type="button"
              onClick={() => removeTag(tag)}
              className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-muted/30 py-0.5 pr-1.5 pl-2.5 text-xs text-foreground transition-colors hover:bg-muted/60"
            >
              {tag.label}
              <X className="size-3 text-muted-foreground" aria-hidden />
              <span className="sr-only">Filter entfernen</span>
            </button>
          ))}
          <button
            type="button"
            onClick={resetAll}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Alle zurücksetzen
          </button>
        </div>
      )}
    </div>
  );
}
