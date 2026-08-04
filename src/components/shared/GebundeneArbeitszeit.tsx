import { cn } from "@/lib/utils";
import {
  GEBUNDENE_ARBEIT_HERKUNFT,
  formatGebundeneArbeitszeit,
} from "@/lib/scoring";

export default function GebundeneArbeitszeit({
  hoursPerMonth,
  variant = "prominent",
  showHerkunft = true,
  align = "left",
  className,
}: {
  hoursPerMonth: number;
  variant?: "prominent" | "compact";
  showHerkunft?: boolean;
  align?: "left" | "right";
  className?: string;
}) {
  const formatted = formatGebundeneArbeitszeit(hoursPerMonth);
  const prominent = variant === "prominent";

  return (
    <div
      className={cn(
        align === "right" && "text-right",
        className
      )}
    >
      <p
        className={cn(
          "font-semibold tabular-nums text-foreground",
          prominent ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"
        )}
      >
        {formatted}
      </p>
      <p
        className={cn(
          "text-muted-foreground",
          prominent ? "mt-1 text-sm" : "mt-0.5 text-xs"
        )}
      >
        aktuell gebundene Arbeitszeit
      </p>
      {showHerkunft && (
        <p
          className={cn(
            "text-muted-foreground",
            prominent ? "mt-1 text-xs" : "mt-0.5 text-[0.6875rem] leading-snug"
          )}
        >
          {GEBUNDENE_ARBEIT_HERKUNFT}
        </p>
      )}
    </div>
  );
}
