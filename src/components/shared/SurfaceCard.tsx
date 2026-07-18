import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function SurfaceCard({
  children,
  className,
  contentClassName,
}: {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <Card variant="surface" className={className}>
      <CardContent className={cn("p-6 sm:p-7", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
