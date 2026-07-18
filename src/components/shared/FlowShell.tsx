"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SegmentProgress from "@/components/shared/SegmentProgress";
import SectionLabel from "@/components/shared/SectionLabel";
import { cn } from "@/lib/utils";

export default function FlowShell({
  children,
  stepIndex,
  stepCount,
  eyebrow,
  title,
  description,
  onBack,
  footer,
  className,
}: {
  children: React.ReactNode;
  stepIndex: number;
  stepCount: number;
  eyebrow?: string;
  title?: string;
  description?: React.ReactNode;
  onBack?: () => void;
  footer?: React.ReactNode;
  className?: string;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [stepIndex]);

  return (
    <div
      className={cn(
        "mx-auto flex min-h-[calc(100dvh-4.5rem)] w-full max-w-xl flex-col bg-muted/40 px-5 py-6 sm:px-8 sm:py-10",
        className
      )}
    >
      <div className="mb-6 flex items-center gap-3">
        {onBack ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onBack}
            aria-label="Zurück"
            className="shrink-0 rounded-full text-muted-foreground"
          >
            <ChevronLeft className="size-5" strokeWidth={1.5} />
          </Button>
        ) : (
          <div className="size-9 shrink-0" aria-hidden />
        )}
        <SegmentProgress
          total={stepCount}
          current={stepIndex}
          className="flex-1"
        />
        <div className="size-9 shrink-0" aria-hidden />
      </div>

      <div className="flex flex-1 flex-col">
        {(eyebrow || title || description) && (
          <div className="mb-6">
            {eyebrow && <SectionLabel className="mb-2">{eyebrow}</SectionLabel>}
            {title && (
              <h2
                ref={headingRef}
                tabIndex={-1}
                className="text-2xl font-semibold outline-none sm:text-3xl"
              >
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}
        <div className="flex-1">{children}</div>
      </div>

      {footer && (
        <div className="sticky bottom-0 z-10 -mx-5 mt-8 border-t border-border/60 bg-muted/40 px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-sm sm:-mx-8 sm:px-8">
          {footer}
        </div>
      )}
    </div>
  );
}
