"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  CheckCircle2,
  Circle,
  GripVertical,
  ArrowDownWideNarrow,
  Pencil,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DetailField,
  EmptyState,
  BrandName,
  PageHeader,
  SurfaceCard,
} from "@/components/shared";
import RobotMascot from "@/components/RobotMascot";
import RanglisteFilterBar from "@/components/RanglisteFilterBar";
import BeispielloesungenSheet from "@/components/BeispielloesungenSheet";
import { CLASSIFICATION_STYLES, type ClassificationColorKey } from "@/lib/scoring";
import { formatPrioritaetHinweis, isPrioritaetAusgeschlossen } from "@/lib/prioritaet";
import {
  EMPTY_RANGLISTE_FILTERS,
  applyRanglisteFilters,
  hasActiveRanglisteConstraints,
  type RanglisteFilterState,
} from "@/lib/rangliste-filters";
import {
  deleteCase,
  getSavedCases,
  hasManualCaseOrder,
  reorderCases,
  resetCasesToScoreOrder,
  setCaseStatus,
} from "@/lib/storage";
import { RISIKO_BADGE, RISIKO_OPTIONS } from "@/types/brief";
import type { CaseStatus, SavedCase } from "@/types/case";

function sortCasesByScore(cases: SavedCase[]): SavedCase[] {
  return [...cases].sort((a, b) => {
    const aBlocked = isPrioritaetAusgeschlossen(a.brief.risiko);
    const bBlocked = isPrioritaetAusgeschlossen(b.brief.risiko);
    if (aBlocked !== bBlocked) return aBlocked ? 1 : -1;

    const aScore = a.result.gesamtScore ?? -1;
    const bScore = b.result.gesamtScore ?? -1;
    return bScore - aScore;
  });
}

function orderCases(cases: SavedCase[]): SavedCase[] {
  if (hasManualCaseOrder(cases)) {
    return [...cases].sort(
      (a, b) => (a.sortOrder ?? Number.MAX_SAFE_INTEGER) - (b.sortOrder ?? Number.MAX_SAFE_INTEGER)
    );
  }
  return sortCasesByScore(cases);
}

export default function Rangliste() {
  const [cases, setCases] = useState<SavedCase[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filters, setFilters] = useState<RanglisteFilterState>(
    EMPTY_RANGLISTE_FILTERS
  );
  const [searchQuery, setSearchQuery] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const id = window.setTimeout(() => {
      setCases(orderCases(getSavedCases()));
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  function handleDelete(id: string) {
    setCases(orderCases(deleteCase(id)));
  }

  function handleToggleStatus(id: string) {
    const current = cases.find((item) => item.id === id);
    if (!current) return;

    const nextStatus: CaseStatus =
      current.status === "erledigt" ? "unerledigt" : "erledigt";
    const updated = setCaseStatus(id, nextStatus);
    if (!updated) return;

    setCases((prev) =>
      orderCases(prev.map((item) => (item.id === id ? updated : item)))
    );
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    if (hasActiveRanglisteConstraints(filters, searchQuery)) return;

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setCases((prev) => {
      const oldIndex = prev.findIndex((item) => item.id === active.id);
      const newIndex = prev.findIndex((item) => item.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return prev;

      const next = arrayMove(prev, oldIndex, newIndex);
      return orderCases(reorderCases(next.map((item) => item.id)));
    });
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  function handleResetToScoreOrder() {
    setCases(sortCasesByScore(resetCasesToScoreOrder()));
  }

  const activeCase = activeId ? cases.find((item) => item.id === activeId) : null;
  const activeRank = activeId ? cases.findIndex((item) => item.id === activeId) + 1 : 0;
  const filteredCases = applyRanglisteFilters(cases, filters, searchQuery);
  const filtersActive = hasActiveRanglisteConstraints(filters, searchQuery);
  const manualOrderActive = hasManualCaseOrder(cases);
  const rankById = new Map(cases.map((item, index) => [item.id, index + 1]));

  return (
    <div className="mx-auto w-full max-w-3xl bg-background px-5 py-10 sm:px-8 sm:py-16">
      <PageHeader
        eyebrow={
          <>
            <BrandName /> · Rangliste
          </>
        }
        title="Gespeicherte Fälle"
        align="left"
        className={loaded && cases.length === 0 ? "mb-3 sm:mb-4" : undefined}
        description={
          <>
            Standardmäßig nach Gesamt-Score sortiert. Per Drag&nbsp;&amp;&nbsp;Drop
            können Sie die Reihenfolge manuell anpassen. Suche und Filter helfen,
            Fälle gezielt einzugrenzen.
          </>
        }
      />

      {loaded && cases.length > 0 && (
        <div className="mb-5">
          <RanglisteFilterBar
            filters={filters}
            onChange={setFilters}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalCount={cases.length}
            filteredCount={filteredCases.length}
          />
        </div>
      )}

      {loaded && cases.length > 0 && manualOrderActive && (
        <div className="mb-5 flex flex-col gap-3 rounded-[var(--radius-card)] border border-border/60 bg-muted/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Die Reihenfolge wurde manuell angepasst.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={handleResetToScoreOrder}
          >
            <ArrowDownWideNarrow className="size-3.5" />
            Nach Gesamt-Score sortieren
          </Button>
        </div>
      )}

      {loaded && cases.length === 0 ? (
        <EmptyState
          variant="plain"
          illustration={
            <RobotMascot
              src="/robot_02.png"
              size="hero"
              className="mx-auto h-56 w-56 sm:h-72 sm:w-72"
            />
          }
          action={
            <Button asChild size="lg">
              <Link href="/scorer">Zur Bewertung</Link>
            </Button>
          }
        >
          Noch keine Fälle gespeichert. Bewerte einen Fall in der Bewertung und
          klicke dort auf &ldquo;Fall speichern&rdquo;.
        </EmptyState>
      ) : loaded && filteredCases.length === 0 ? (
        <SurfaceCard contentClassName="p-8 text-center">
          <p className="text-sm font-medium">
            {searchQuery.trim() ? "Keine Treffer für diese Suche" : "Keine Fälle für diese Filter"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Passen Sie Suche oder Filter an — oder setzen Sie alles zurück.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              setFilters(EMPTY_RANGLISTE_FILTERS);
              setSearchQuery("");
            }}
          >
            Zurücksetzen
          </Button>
        </SurfaceCard>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          {filtersActive && (
            <p className="mb-4 text-xs text-muted-foreground">
              Sortieren per Drag&nbsp;&amp;&nbsp;Drop ist bei aktiver Suche oder
              Filtern deaktiviert. Setzen Sie alles zurück, um die Reihenfolge zu
              ändern.
            </p>
          )}
          <SortableContext
            items={filteredCases.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-5">
              {filteredCases.map((item) => (
                <SortableRanglisteItem
                  key={item.id}
                  rank={rankById.get(item.id) ?? 0}
                  item={item}
                  isDragging={activeId === item.id}
                  dragDisabled={filtersActive}
                  onDelete={() => handleDelete(item.id)}
                  onToggleStatus={() => handleToggleStatus(item.id)}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay dropAnimation={{ duration: 200, easing: "ease" }}>
            {activeCase ? (
              <RanglisteItem
                rank={activeRank}
                item={activeCase}
                isOverlay
                onDelete={() => {}}
                onToggleStatus={() => {}}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}

function SortableRanglisteItem({
  rank,
  item,
  isDragging,
  dragDisabled = false,
  onDelete,
  onToggleStatus,
}: {
  rank: number;
  item: SavedCase;
  isDragging: boolean;
  dragDisabled?: boolean;
  onDelete: () => void;
  onToggleStatus: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id, disabled: dragDisabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? "opacity-40" : undefined}
    >
      <RanglisteItem
        rank={rank}
        item={item}
        dragDisabled={dragDisabled}
        dragHandleRef={setActivatorNodeRef}
        dragHandleProps={dragDisabled ? undefined : { ...attributes, ...listeners }}
        onDelete={onDelete}
        onToggleStatus={onToggleStatus}
      />
    </div>
  );
}

function RanglisteItem({
  rank,
  item,
  dragHandleRef,
  dragHandleProps,
  dragDisabled = false,
  isOverlay = false,
  onDelete,
  onToggleStatus,
}: {
  rank: number;
  item: SavedCase;
  dragHandleRef?: (element: HTMLElement | null) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
  dragDisabled?: boolean;
  isOverlay?: boolean;
  onDelete: () => void;
  onToggleStatus: () => void;
}) {
  const { brief, result, status } = item;
  const erledigt = status === "erledigt";
  const blocked = isPrioritaetAusgeschlossen(brief.risiko);
  const prioritaetHinweis = formatPrioritaetHinweis(result.gesamtScore, brief.risiko);
  const colorKey = (result.einordnung?.colorClass ?? "neutral") as ClassificationColorKey;
  const badgeClass = blocked
    ? CLASSIFICATION_STYLES.neutral.badge
    : CLASSIFICATION_STYLES[colorKey]?.badge ?? CLASSIFICATION_STYLES.neutral.badge;
  const savedDate = new Date(item.savedAt).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const risikoLabel = brief.risiko
    ? RISIKO_OPTIONS.find((r) => r.id === brief.risiko)?.label
    : null;
  const classification = item.classification;
  const hasBeispiele = (classification?.beispielrichtungen.length ?? 0) > 0;

  return (
    <SurfaceCard
      className={isOverlay ? "shadow-[var(--shadow-elevated-md)] ring-2 ring-primary/20" : undefined}
      contentClassName={[
        "p-5 sm:p-7",
        erledigt ? "opacity-80" : "",
      ].join(" ")}
    >
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_10.5rem] lg:items-start lg:gap-x-12">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            ref={dragHandleRef}
            {...dragHandleProps}
            disabled={dragDisabled}
            aria-label={
              dragDisabled
                ? `Platz ${rank} — Sortieren bei aktiven Filtern deaktiviert`
                : `Reihenfolge für Platz ${rank} ändern`
            }
            aria-disabled={dragDisabled}
            title={
              dragDisabled
                ? "Sortieren ist bei aktiven Filtern deaktiviert"
                : undefined
            }
            className={[
              "flex size-10 shrink-0 items-center justify-center rounded-full border border-border/60 bg-muted/40 text-muted-foreground transition-colors",
              dragDisabled
                ? "cursor-not-allowed opacity-40"
                : "cursor-grab hover:bg-muted hover:text-foreground active:cursor-grabbing",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "touch-none",
              isOverlay ? "cursor-grabbing" : "",
            ].join(" ")}
          >
            <GripVertical className="size-4" aria-hidden />
          </button>
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/5 sm:size-14">
            <span className="font-headline text-2xl font-bold leading-none tabular-nums text-foreground sm:text-3xl">
              {rank}
            </span>
          </div>
        </div>

        <div className="min-w-0 flex flex-col gap-4">
          {brief.problem?.trim() && (
            <DetailField label="Aktueller Ablauf">
              <p className="text-sm leading-6 break-words text-muted-foreground">
                {brief.problem}
              </p>
            </DetailField>
          )}

          {brief.ziel?.trim() && (
            <DetailField label="Ziel">
              <p className="text-sm leading-6 break-words text-muted-foreground">
                {brief.ziel}
              </p>
            </DetailField>
          )}

          {brief.loesung?.trim() && (
            <DetailField label="Lösungsansatz">
              <p className="text-sm leading-6 break-words text-muted-foreground">
                {brief.loesung}
              </p>
            </DetailField>
          )}

          {brief.risiko && risikoLabel && (
            <DetailField label="Risiko">
              <Badge variant="outline" className={RISIKO_BADGE[brief.risiko]}>
                {risikoLabel}
              </Badge>
            </DetailField>
          )}

          {(blocked && prioritaetHinweis) || result.einordnung ? (
            <DetailField label="Priorisierung">
              {blocked && prioritaetHinweis ? (
                <p className="text-sm leading-6 text-muted-foreground">
                  {prioritaetHinweis}
                </p>
              ) : (
                result.einordnung && (
                  <Badge variant="outline" className={badgeClass}>
                    {result.einordnung.title}
                  </Badge>
                )
              )}
            </DetailField>
          ) : null}

          <DetailField label="Status">
            <Badge variant={erledigt ? "secondary" : "outline"}>
              {erledigt ? "Erledigt" : "Unerledigt"}
            </Badge>
          </DetailField>

          <span className="text-xs text-muted-foreground">
            Gespeichert am {savedDate}
          </span>
        </div>

        <div className="border-t border-border/60 pt-5 lg:border-t-0 lg:pt-0 lg:text-right">
          <span className="text-xs text-muted-foreground">
            {blocked ? "Berechneter Nutzen" : "Gesamt-Score"}
          </span>
          <span className="mt-1 block font-headline text-4xl font-bold leading-none tabular-nums sm:text-5xl">
            {result.gesamtScore ?? "–"}
            <span className="text-sm font-normal text-muted-foreground">/100</span>
          </span>
        </div>
      </div>

      {!isOverlay && (
        <div className="mt-6 flex flex-col gap-2 border-t border-border/60 pt-5 sm:flex-row sm:flex-wrap sm:items-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onToggleStatus}
            className="w-full sm:w-auto"
          >
            {erledigt ? (
              <>
                <Circle className="size-3.5" />
                Als unerledigt markieren
              </>
            ) : (
              <>
                <CheckCircle2 className="size-3.5" />
                Als erledigt markieren
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
            <Link href={`/scorer?edit=${item.id}`}>
              <Pencil className="size-3.5" />
              Bearbeiten
            </Link>
          </Button>
          {classification && hasBeispiele && (
            <BeispielloesungenSheet classification={classification} />
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive sm:ml-auto sm:w-auto"
              >
                <Trash2 className="size-3.5" />
                Löschen
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Fall endgültig löschen?</AlertDialogTitle>
                <AlertDialogDescription>
                  Dieser gespeicherte Fall wird unwiderruflich entfernt. Diese
                  Aktion lässt sich nicht rückgängig machen.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                <AlertDialogAction
                  className={buttonVariants({ variant: "destructive" })}
                  onClick={onDelete}
                >
                  Endgültig löschen
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </SurfaceCard>
  );
}
