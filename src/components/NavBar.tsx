"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Start" },
  { href: "/scorer", label: "Fakten-Scorer" },
  { href: "/faelle", label: "Rangliste" },
] as const;

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          Klarsicht
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Hauptnavigation" className="hidden items-center gap-6 sm:flex">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "text-sm font-medium underline-offset-4 hover:text-zinc-900 hover:underline dark:hover:text-zinc-50",
                  active
                    ? "text-zinc-900 dark:text-zinc-50"
                    : "text-zinc-500 dark:text-zinc-400",
                ].join(" ")}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          className="inline-flex size-9 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 sm:hidden dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile nav panel */}
      <nav
        id="mobile-nav"
        aria-label="Hauptnavigation (mobil)"
        className={[
          "sm:hidden",
          open ? "block" : "hidden",
          "border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950",
        ].join(" ")}
      >
        <div className="flex flex-col px-5 py-2 sm:px-8">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "rounded-md px-2 py-3 text-base font-medium",
                  active
                    ? "text-zinc-900 dark:text-zinc-50"
                    : "text-zinc-500 dark:text-zinc-400",
                ].join(" ")}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
