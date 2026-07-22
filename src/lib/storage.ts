import type { CaseStatus, SavedCase } from "@/types/case";
import { isBriefRisiko, type FallBrief } from "@/types/brief";

const STORAGE_KEY = "kist-cases-v1";

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
  };
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
  const savedCase: SavedCase = {
    ...entry,
    status: entry.status ?? "unerledigt",
    id: crypto.randomUUID(),
    savedAt: new Date().toISOString(),
  };
  const all = getSavedCases();
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
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
  return remaining;
}
