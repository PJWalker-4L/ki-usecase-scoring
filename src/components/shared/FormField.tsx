import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function FormField({
  id,
  label,
  hint,
  error,
  required,
  optional,
  children,
  className,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id} className="text-sm font-semibold text-foreground">
        {label}
        {required && (
          <span className="text-destructive" aria-hidden>
            {" "}
            *
          </span>
        )}
        {optional && (
          <span className="font-normal text-muted-foreground"> (optional)</span>
        )}
      </Label>
      {children}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
