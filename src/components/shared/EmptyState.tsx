import SurfaceCard from "@/components/shared/SurfaceCard";
import { cn } from "@/lib/utils";

export default function EmptyState({
  illustration,
  children,
  action,
  className,
  variant = "card",
}: {
  illustration?: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  /** `plain` = centered in page flow without SurfaceCard */
  variant?: "card" | "plain";
}) {
  const content = (
    <div className="flex flex-col items-center gap-2 sm:gap-2.5">
      {illustration}
      <div className="max-w-sm text-sm leading-6 text-muted-foreground">
        {children}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );

  if (variant === "plain") {
    return (
      <div className={cn("flex flex-col items-center py-2 text-center sm:py-3", className)}>
        {content}
      </div>
    );
  }

  return (
    <SurfaceCard
      contentClassName={cn(
        "flex flex-col items-center p-6 text-center sm:p-8",
        className
      )}
    >
      {content}
    </SurfaceCard>
  );
}
