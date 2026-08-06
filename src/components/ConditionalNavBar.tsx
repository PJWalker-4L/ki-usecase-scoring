"use client";

import { usePathname } from "next/navigation";
import NavBar from "@/components/NavBar";

function isIntroPath(pathname: string | null): boolean {
  if (!pathname) return false;
  if (pathname === "/") return true;
  // Locale-Prefix ohne weiteren Pfad (z. B. /en nach Rewrite auf Intro)
  return /^\/[a-z]{2}\/?$/.test(pathname);
}

export default function ConditionalNavBar() {
  const pathname = usePathname();
  if (isIntroPath(pathname)) return null;
  return <NavBar />;
}
