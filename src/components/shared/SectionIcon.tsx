import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SectionIcon({
  icon: Icon,
  className,
  size = "md",
}: {
  icon: LucideIcon;
  className?: string;
  size?: "md" | "lg";
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-2xl bg-[var(--color-accent-subtle)] text-[var(--color-accent)]",
        size === "md" ? "size-11" : "size-12",
        className
      )}
      aria-hidden
    >
      <Icon className="size-5" strokeWidth={1.5} />
    </div>
  );
}
