import { cn } from "@/lib/utils";

export default function DetailField({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-2.5">
        <span
          className="h-3.5 w-0.5 shrink-0 rounded-full bg-primary"
          aria-hidden
        />
        <h3 className="font-headline text-xs font-semibold uppercase tracking-[0.05em] text-foreground">
          {label}
        </h3>
      </div>
      <div className="pl-3">{children}</div>
    </div>
  );
}
