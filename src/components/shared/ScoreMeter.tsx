"use client";

import { Progress } from "@/components/ui/progress";
import ScoreInfoHint from "@/components/shared/ScoreInfoHint";
import { SCORE_BAND_LABEL } from "@/lib/copy/scoring";
import {
  CLASSIFICATION_STYLES,
  scoreBand,
  scoreColor,
} from "@/lib/scoring";

export default function ScoreMeter({
  label,
  value,
  meaning,
  formula,
  showBand = true,
}: {
  label: string;
  value: number;
  /** Fallbezogene Bedeutung — im Info-Popover. */
  meaning?: string;
  /** Eine Zeile „So rechnen wir: …“ unter der Bedeutung. */
  formula?: string;
  /** Kleines Band-Label neben dem Zahlenwert (hoch / im Mittelfeld / niedrig). */
  showBand?: boolean;
}) {
  const color = scoreColor(value);
  const barColor =
    CLASSIFICATION_STYLES[color]?.bar ?? CLASSIFICATION_STYLES.neutral.bar;
  const bandLabel = showBand ? SCORE_BAND_LABEL[scoreBand(value)] : null;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          {label}
          {meaning && (
            <ScoreInfoHint label={label} meaning={meaning} formula={formula} />
          )}
        </span>
        <span className="inline-flex items-baseline gap-1.5">
          <span className="text-sm font-semibold tabular-nums">{value}</span>
          {bandLabel && (
            <span className="text-xs text-muted-foreground">{bandLabel}</span>
          )}
        </span>
      </div>
      <Progress
        value={value}
        className="h-1.5 rounded-full"
        indicatorClassName={barColor}
      />
    </div>
  );
}
