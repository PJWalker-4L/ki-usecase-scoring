import type { SavedCase } from "@/types/case";

const STORAGE_KEY = "kist-cases-v1";

export function getSavedCases(): SavedCase[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCase(entry: Omit<SavedCase, "id" | "savedAt">): SavedCase {
  const savedCase: SavedCase = {
    ...entry,
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

  const updated: SavedCase = {
    ...entry,
    id,
    savedAt: all[index].savedAt,
  };
  all[index] = updated;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return updated;
}

export function deleteCase(id: string): SavedCase[] {
  const remaining = getSavedCases().filter((c) => c.id !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
  return remaining;
}
