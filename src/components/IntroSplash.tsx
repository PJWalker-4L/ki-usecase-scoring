"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MeshGradient } from "@/components/ui/mesh-gradient-shader";

export default function IntroSplash() {
  const router = useRouter();
  const [settled, setSettled] = useState(false);
  const [expanding, setExpanding] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(query.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    router.prefetch("/start");
  }, [router]);

  const handleLogoClick = () => {
    if (expanding) return;
    if (reduceMotion) {
      router.push("/start");
      return;
    }
    if (!settled) return;
    setExpanding(true);
  };

  const handleExpanded = () => {
    requestAnimationFrame(() => {
      router.push("/start");
    });
  };

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-background">
      <MeshGradient
        speed={10}
        intensity={2}
        grain={0.75}
        dotRadius={0.09}
        pulseAmplitude={0.12}
        pulsePeriodMs={3600}
        expandMs={650}
        reduceMotion={reduceMotion}
        expanding={expanding}
        onSettled={() => setSettled(true)}
        onExpanded={handleExpanded}
      />

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-2 text-center">
        <button
          type="button"
          onClick={handleLogoClick}
          disabled={!settled && !reduceMotion}
          aria-label="Zur Startseite"
          className={[
            "pointer-events-auto rounded-sm transition-opacity duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
            settled || reduceMotion ? "cursor-pointer opacity-100" : "cursor-default opacity-0",
            expanding ? "opacity-0" : "",
          ].join(" ")}
        >
          <Image
            src="/klarsicht_logo.png"
            alt="Klarsicht"
            width={569}
            height={66}
            className="h-[9px] w-auto sm:h-3"
            style={{
              filter:
                "brightness(0) invert(1) drop-shadow(0 1px 8px rgba(20, 32, 46, 0.45))",
            }}
          />
        </button>
      </div>
    </div>
  );
}
