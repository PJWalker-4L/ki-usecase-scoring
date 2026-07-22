"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavLink, ThemeToggle } from "@/components/shared";

const NAV_LINKS = [
  { href: "/start", label: "Start" },
  { href: "/scorer", label: "Bewertung" },
  { href: "/faelle", label: "Rangliste" },
] as const;

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-5 py-4 sm:px-8">
        <Link href="/start" className="flex shrink-0 items-center">
          <Image
            src="/klarsicht_logo.png"
            alt="KLARSICHT"
            width={569}
            height={66}
            priority
            className="logo-mark h-5 w-auto sm:h-6"
          />
        </Link>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <nav
            aria-label="Hauptnavigation"
            className="hidden items-center gap-6 sm:flex"
          >
            {NAV_LINKS.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <NavLink key={link.href} href={link.href} active={active}>
                  {link.label}
                </NavLink>
              );
            })}
          </nav>

          <ThemeToggle />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="sm:hidden"
                aria-label="Menü öffnen"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100%,20rem)]">
              <SheetHeader>
                <SheetTitle className="text-left font-headline text-lg">
                  Navigation
                </SheetTitle>
              </SheetHeader>
              <nav
                aria-label="Hauptnavigation (mobil)"
                className="mt-4 flex flex-col gap-1 px-2"
              >
                {NAV_LINKS.map((link) => {
                  const active =
                    pathname === link.href ||
                    pathname.startsWith(`${link.href}/`);
                  return (
                    <NavLink
                      key={link.href}
                      href={link.href}
                      active={active}
                      onClick={() => setOpen(false)}
                      className="rounded-[var(--radius-sm)] px-3 py-3 text-base no-underline hover:bg-muted hover:no-underline"
                    >
                      {link.label}
                    </NavLink>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
