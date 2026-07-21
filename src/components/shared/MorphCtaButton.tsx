"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MeshGradient } from "@/components/ui/mesh-gradient-shader";
import { cn } from "@/lib/utils";

type MorphCtaButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
  showArrow?: boolean;
};

/** Primary CTA with the same morphing mesh gradient as the intro splash. */
export default function MorphCtaButton({
  href,
  children,
  className,
  showArrow = true,
}: MorphCtaButtonProps) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(query.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);

  return (
    <Link
      href={href}
      className={cn(
        "relative inline-flex h-12 shrink-0 items-center justify-center overflow-hidden rounded-full px-8 text-base font-semibold text-white shadow-[var(--shadow-elevated-sm)] transition-[transform,opacity] outline-none",
        "hover:opacity-95 active:scale-[0.98]",
        "focus-visible:ring-[3px] focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      {reduceMotion ? (
        <span
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(135deg,#fc624b_0%,#f76dee_35%,#5869f7_70%,#b717af_100%)]"
        />
      ) : (
        <span aria-hidden className="absolute inset-0">
          <MeshGradient
            fill
            speed={10}
            intensity={2}
            grain={0.65}
            className="rounded-full"
          />
        </span>
      )}
      <span className="relative z-10 inline-flex items-center gap-2 drop-shadow-[0_1px_2px_rgba(20,32,46,0.35)]">
        {children}
        {showArrow ? <ArrowRight className="size-4" /> : null}
      </span>
    </Link>
  );
}
