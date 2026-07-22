import { cn } from "@/lib/utils";
import SectionLabel from "@/components/shared/SectionLabel";

export default function PageHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  children,
}: {
  eyebrow?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <header
      className={cn(
        "mb-8 sm:mb-10",
        align === "center" ? "text-center" : "text-center sm:text-left",
        className
      )}
    >
      {eyebrow && <SectionLabel>{eyebrow}</SectionLabel>}
      <h1
        className={cn(
          "mt-2 text-3xl font-semibold sm:text-4xl",
          align === "center" && "mx-auto max-w-2xl"
        )}
      >
        {title}
      </h1>
      {description && (
        <p
          className={cn(
            "mt-3 max-w-2xl text-base leading-7 text-muted-foreground",
            align === "center" ? "mx-auto" : "mx-auto sm:mx-0"
          )}
        >
          {description}
        </p>
      )}
      {children}
    </header>
  );
}
