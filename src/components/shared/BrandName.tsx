import { cn } from "@/lib/utils";

export default function BrandName({ className }: { className?: string }) {
  return (
    <span className={cn("font-brand uppercase", className)}>KLARSICHT</span>
  );
}
