import { cn } from "@/lib/utils";

export default function BrandName({ className }: { className?: string }) {
  return (
    <em className={cn("font-brand uppercase italic", className)}>KLARSICHT</em>
  );
}
