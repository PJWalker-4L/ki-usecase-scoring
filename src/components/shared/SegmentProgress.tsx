import { cn } from "@/lib/utils";

export default function SegmentProgress({
  total,
  current,
  label = "Fortschritt",
  className,
}: {
  total: number;
  /** 0-based index of the current step */
  current: number;
  label?: string;
  className?: string;
}) {
  const clamped = Math.min(Math.max(current, 0), Math.max(total - 1, 0));

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={clamped + 1}
      className={cn("flex w-full gap-1.5", className)}
    >
      {Array.from({ length: total }, (_, i) => {
        const done = i < clamped;
        const active = i === clamped;
        return (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-150",
              done || active
                ? "bg-[var(--color-text)]"
                : "bg-muted"
            )}
          />
        );
      })}
    </div>
  );
}
