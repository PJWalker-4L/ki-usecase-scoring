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
import { CLASSIFICATION_STYLES, type ClassificationColorKey } from "@/lib/scoring";
import { formatPrioritaetHinweis, isPrioritaetAusgeschlossen } from "@/lib/prioritaet";
import {
  deleteCase,
  getSavedCases,
  reorderCases,
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
  if (cases.some((item) => item.sortOrder != null)) {
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

  const activeCase = activeId ? cases.find((item) => item.id === activeId) : null;
  const activeRank = activeId ? cases.findIndex((item) => item.id === activeId) + 1 : 0;

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
            können Sie die Reihenfolge manuell anpassen — z.&nbsp;B. wenn
            strategische Prioritäten über den Score gehen.
          </>
        }
      />

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
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={cases.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-5">
              {cases.map((item, index) => (
                <SortableRanglisteItem
                  key={item.id}
                  rank={index + 1}
                  item={item}
                  isDragging={activeId === item.id}
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
  onDelete,
  onToggleStatus,
}: {
  rank: number;
  item: SavedCase;
  isDragging: boolean;
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
  } = useSortable({ id: item.id });

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
        dragHandleRef={setActivatorNodeRef}
        dragHandleProps={{ ...attributes, ...listeners }}
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
  isOverlay = false,
  onDelete,
  onToggleStatus,
}: {
  rank: number;
  item: SavedCase;
  dragHandleRef?: (element: HTMLElement | null) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
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

  return (
    <SurfaceCard
      className={isOverlay ? "shadow-[var(--shadow-elevated-md)] ring-2 ring-primary/20" : undefined}
      contentClassName={[
        "p-5 sm:p-7",
        erledigt ? "opacity-80" : "",
      ].join(" ")}
    >
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_10.5rem] lg:items-start lg:gap-x-12">
        <div className="flex items-start gap-2">
          <button
            type="button"
            ref={dragHandleRef}
            {...dragHandleProps}
            aria-label={`Reihenfolge für Platz ${rank} ändern`}
            className={[
              "mt-0.5 flex size-10 shrink-0 cursor-grab items-center justify-center rounded-full border border-border/60 bg-muted/40 text-muted-foreground transition-colors",
              "hover:bg-muted hover:text-foreground active:cursor-grabbing",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "touch-none",
              isOverlay ? "cursor-grabbing" : "",
            ].join(" ")}
          >
            <GripVertical className="size-4" aria-hidden />
          </button>
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold tabular-nums text-muted-foreground">
            {rank}
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
