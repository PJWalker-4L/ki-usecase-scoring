"use client";

import { CircleHelp } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function ScoreInfoHint({
  label,
  meaning,
  formula,
  className,
}: {
  label: string;
  meaning: string;
  formula?: string;
  className?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex shrink-0 text-muted-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            className
          )}
          aria-label={`${label} erklären`}
        >
          <CircleHelp className="size-3.5" strokeWidth={1.5} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" align="start">
        <p className="text-sm leading-5 text-foreground">{meaning}</p>
        {formula && (
          <p className="mt-2 border-t border-border/60 pt-2 text-xs leading-5 text-muted-foreground">
            {formula}
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
}
