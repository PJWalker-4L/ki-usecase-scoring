import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Einige Browser / Preview-Hosts (z. B. Cursor IDE) hängen fälschlich ein
 * Locale-Prefix wie `/en` an. Die App ist deutsch und hat keine i18n-Routen —
 * daher Prefix abstreifen und intern auf die echten Pfade umschreiben.
 */
const LOCALE_PREFIXES = new Set(["en", "de"]);

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segment = pathname.split("/")[1];

  if (!segment || !LOCALE_PREFIXES.has(segment)) {
    return NextResponse.next();
  }

  const stripped = pathname.slice(segment.length + 1) || "/";
  const url = request.nextUrl.clone();
  url.pathname = stripped;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/en", "/en/:path*", "/de", "/de/:path*"],
};
