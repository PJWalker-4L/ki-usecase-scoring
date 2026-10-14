import { NextResponse } from "next/server";

export const USAGE_COOKIE_NAME = "klarsicht_analysen";
export const MAX_ANALYSES_PER_BROWSER = 2;

export const USAGE_LIMIT_MESSAGE =
  "Du hast die zwei kostenlosen Durchläufe in diesem Browser genutzt.";

/** Produktion mit Limit; Dev und QUOTA_DISABLED=true sind ausgenommen. */
export function isUsageQuotaEnabled(): boolean {
  if (process.env.QUOTA_DISABLED === "true") return false;
  return process.env.NODE_ENV === "production";
}

export function readUsageCount(cookieHeader: string | null): number {
  if (!cookieHeader) return 0;

  for (const part of cookieHeader.split(";")) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const name = trimmed.slice(0, eq);
    if (name !== USAGE_COOKIE_NAME) continue;

    const raw = trimmed.slice(eq + 1);
    const value = Number.parseInt(decodeURIComponent(raw), 10);
    if (!Number.isFinite(value) || value < 0) return 0;
    return Math.min(value, MAX_ANALYSES_PER_BROWSER);
  }

  return 0;
}

export function canRunClassifyLlm(currentUses: number): boolean {
  return currentUses < MAX_ANALYSES_PER_BROWSER;
}

export function usageCountAfterSuccessfulBeispiele(currentUses: number): number {
  return Math.min(currentUses + 1, MAX_ANALYSES_PER_BROWSER);
}

export function usageLimitResponse(): NextResponse {
  return NextResponse.json({ error: USAGE_LIMIT_MESSAGE }, { status: 429 });
}

export function attachUsageCookie(response: NextResponse, count: number): void {
  response.cookies.set(USAGE_COOKIE_NAME, String(count), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 400,
  });
}
