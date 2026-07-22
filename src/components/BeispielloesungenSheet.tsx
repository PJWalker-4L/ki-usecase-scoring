"use client";

import { useEffect, useState } from "react";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import BeispielrichtungenListe from "@/components/BeispielrichtungenListe";
import { cn } from "@/lib/utils";
import type { ClassificationResult } from "@/types/classification";

const DESKTOP_SHEET_QUERY = "(min-width: 640px)";

function useResponsiveSheetSide(): "bottom" | "right" {
  const [side, setSide] = useState<"bottom" | "right">("bottom");

  useEffect(() => {
    const query = window.matchMedia(DESKTOP_SHEET_QUERY);
    const sync = () => setSide(query.matches ? "right" : "bottom");
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return side;
}

export default function BeispielloesungenSheet({
  classification,
}: {
  classification: ClassificationResult;
}) {
  const side = useResponsiveSheetSide();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="w-full sm:w-auto">
          <Lightbulb className="size-3.5" />
          Beispiellösungen
        </Button>
      </SheetTrigger>
      <SheetContent
        side={side}
        className={cn(
          "w-full gap-0",
          side === "bottom" && "max-h-[90vh] rounded-t-[var(--radius-xl)]",
          side === "right" && "sm:max-w-lg"
        )}
      >
        <SheetHeader>
          <SheetTitle>Beispiellösungen</SheetTitle>
          <SheetDescription>
            Von der KI vorgeschlagene Automatisierungsoptionen für diesen Fall — als
            Orientierung, keine fertige Lösung.
          </SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
          <BeispielrichtungenListe classification={classification} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
