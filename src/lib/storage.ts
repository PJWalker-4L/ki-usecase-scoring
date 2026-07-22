import type { CaseStatus, SavedCase } from "@/types/case";
import { isBriefRisiko, type FallBrief } from "@/types/brief";
import { normalizeAutomatisierungstyp } from "@/lib/automatisierungstyp";
import type {
  Beispielrichtung,
  ClassificationResult,
} from "@/types/classification";

const STORAGE_KEY = "kist-cases-v1";

function normalizeBeispielrichtungen(raw: unknown): Beispielrichtung[] {
  if (!Array.isArray(raw)) return [];

  const result: Beispielrichtung[] = [];
  for (const item of raw) {
    if (typeof item === "string" && item.trim()) {
      result.push({ text: item.trim(), typ: "assistenz" });
      continue;
    }
    if (!item || typeof item !== "object") continue;

    const row = item as Record<string, unknown>;
    const text = typeof row.text === "string" ? row.text.trim() : "";
    if (!text) continue;

    result.push({
      text,
      typ: normalizeAutomatisierungstyp(row.typ) ?? "sonstiges",
    });
  }
  return result;
}

function normalizeClassification(
  raw: ClassificationResult | undefined
): ClassificationResult | undefined {
  if (!raw) return undefined;

  return {
    ...raw,
    beispielrichtungen: normalizeBeispielrichtungen(raw.beispielrichtungen),
    fallstricke: Array.isArray(raw.fallstricke)
      ? raw.fallstricke
          .filter(
            (item): item is string =>
              typeof item === "string" && item.trim().length > 0
          )
          .map((item) => item.trim())
      : [],
  };
}

function normalizeBrief(raw: Partial<FallBrief> | undefined): FallBrief {
  return {
    problem: typeof raw?.problem === "string" ? raw.problem : "",
    loesung: typeof raw?.loesung === "string" ? raw.loesung : "",
    ziel: typeof raw?.ziel === "string" ? raw.ziel : "",
    risiko: isBriefRisiko(raw?.risiko) ? raw.risiko : "",
  };
}

function normalizeCase(raw: SavedCase): SavedCase {
  return {
    ...raw,
    brief: normalizeBrief(raw.brief),
    status: raw.status === "erledigt" ? "erledigt" : "unerledigt",
    classification: normalizeClassification(raw.classification),
    sortOrder:
      typeof raw.sortOrder === "number" && Number.isFinite(raw.sortOrder)
        ? raw.sortOrder
        : undefined,
  };
}

export function hasManualCaseOrder(cases: SavedCase[]): boolean {
  return cases.some((item) => item.sortOrder != null);
}

export function getSavedCases(): SavedCase[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.map((item) => normalizeCase(item as SavedCase))
      : [];
  } catch {
    return [];
  }
}

export function saveCase(
  entry: Omit<SavedCase, "id" | "savedAt"> & { status?: CaseStatus }
): SavedCase {
  const all = getSavedCases();
  const savedCase: SavedCase = normalizeCase({
    ...entry,
    status: entry.status ?? "unerledigt",
    id: crypto.randomUUID(),
    savedAt: new Date().toISOString(),
    sortOrder: hasManualCaseOrder(all) ? all.length : undefined,
  });
  all.push(savedCase);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return savedCase;
}

export function getCaseById(id: string): SavedCase | undefined {
  return getSavedCases().find((c) => c.id === id);
}

export function updateCase(
  id: string,
  entry: Omit<SavedCase, "id" | "savedAt">
): SavedCase | null {
  const all = getSavedCases();
  const index = all.findIndex((c) => c.id === id);
  if (index === -1) return null;

  const updated: SavedCase = normalizeCase({
    ...entry,
    status: entry.status ?? all[index].status ?? "unerledigt",
    sortOrder: entry.sortOrder ?? all[index].sortOrder,
    id,
    savedAt: all[index].savedAt,
  });
  all[index] = updated;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return updated;
}

export function setCaseStatus(id: string, status: CaseStatus): SavedCase | null {
  const all = getSavedCases();
  const index = all.findIndex((c) => c.id === id);
  if (index === -1) return null;

  all[index] = { ...all[index], status };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return all[index];
}

export function deleteCase(id: string): SavedCase[] {
  const remaining = getSavedCases().filter((c) => c.id !== id);
  const reindexed = hasManualCaseOrder(remaining)
    ? remaining.map((item, index) => ({ ...item, sortOrder: index }))
    : remaining;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reindexed));
  return reindexed;
}

export function resetCasesToScoreOrder(): SavedCase[] {
  const all = getSavedCases().map(({ sortOrder: _sortOrder, ...item }) => item);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return all;
}

export function reorderCases(orderedIds: string[]): SavedCase[] {
  const all = getSavedCases();
  const byId = new Map(all.map((item) => [item.id, item]));
  const reordered: SavedCase[] = [];

  for (const [index, id] of orderedIds.entries()) {
    const item = byId.get(id);
    if (!item) continue;
    reordered.push({ ...item, sortOrder: index });
    byId.delete(id);
  }

  for (const item of byId.values()) {
    reordered.push({ ...item, sortOrder: reordered.length });
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reordered));
  return reordered;
}
