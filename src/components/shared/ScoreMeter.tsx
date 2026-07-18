import { CircleHelp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CLASSIFICATION_STYLES,
  scoreColor,
} from "@/lib/scoring";

export default function ScoreMeter({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description?: string;
}) {
  const color = scoreColor(value);
  const barColor =
    CLASSIFICATION_STYLES[color]?.bar ?? CLASSIFICATION_STYLES.neutral.bar;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          {label}
          {description && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="inline-flex text-muted-foreground/70 hover:text-foreground"
                  aria-label={`${label} erklären`}
                >
                  <CircleHelp className="size-3.5" strokeWidth={1.5} />
                </button>
              </TooltipTrigger>
              <TooltipContent>{description}</TooltipContent>
            </Tooltip>
          )}
        </span>
        <span className="text-sm font-semibold tabular-nums">{value}</span>
      </div>
      <Progress
        value={value}
        className="h-1.5 rounded-full"
        indicatorClassName={barColor}
      />
    </div>
  );
}
