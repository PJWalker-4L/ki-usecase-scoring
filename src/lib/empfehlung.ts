import type { Beispielrichtung, ClassificationResult } from "@/types/classification";
import {
  EMPFEHLUNG_ANSATZ_PREFIX,
  type AutomatisierungstypId,
  normalizeAutomatisierungstyp,
} from "@/lib/automatisierungstyp";

export type AufgeloesteEmpfehlung = {
  option: Beispielrichtung;
  begruendung: string;
};

/** Stellt den typabhängigen Satzanfang für empfehlung.begruendung sicher. */
export function formatEmpfehlungBegruendung(
  typ: AutomatisierungstypId,
  begruendung: string
): string {
  const trimmed = begruendung.trim();
  if (!trimmed) return trimmed;

  const prefix = EMPFEHLUNG_ANSATZ_PREFIX[typ];
  const lower = trimmed.toLowerCase();
  if (lower.startsWith(prefix.toLowerCase())) {
    const rest = trimmed
      .slice(prefix.length)
      .replace(/^\s*,?\s*weil\s*/i, " ")
      .trimStart();
    return rest ? `${prefix} ${rest}` : trimmed;
  }

  const body = trimmed.replace(/^weil\s+/i, "").replace(/^,\s*/, "");
  return `${prefix} ${body}`;
}

export function resolveEmpfehlung(
  classification: ClassificationResult | null | undefined
): AufgeloesteEmpfehlung | null {
  if (!classification?.empfehlung) return null;

  const option = classification.beispielrichtungen[classification.empfehlung.index];
  if (!option) return null;

  const typ = normalizeAutomatisierungstyp(option.typ) ?? "sonstiges";
  return {
    option,
    begruendung: formatEmpfehlungBegruendung(typ, classification.empfehlung.begruendung),
  };
}
