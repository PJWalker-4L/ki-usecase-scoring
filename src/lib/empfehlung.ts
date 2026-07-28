import type { Beispielrichtung, ClassificationResult } from "@/types/classification";

export type AufgeloesteEmpfehlung = {
  option: Beispielrichtung;
  begruendung: string;
};

export function resolveEmpfehlung(
  classification: ClassificationResult | null | undefined
): AufgeloesteEmpfehlung | null {
  if (!classification?.empfehlung) return null;

  const option = classification.beispielrichtungen[classification.empfehlung.index];
  if (!option) return null;

  return { option, begruendung: classification.empfehlung.begruendung };
}
