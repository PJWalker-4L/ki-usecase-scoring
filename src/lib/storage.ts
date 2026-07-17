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

export function deleteCase(id: string): SavedCase[] {
  const remaining = getSavedCases().filter((c) => c.id !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
  return remaining;
}
