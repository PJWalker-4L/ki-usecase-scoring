export const GROQ_CHAT_MODEL_DEFAULT = "openai/gpt-oss-20b";
export const GROQ_CHAT_MODEL_FALLBACK = "llama-3.3-70b-versatile";

/** Chat-taugliche Groq-Modelle (Stand: Models-API). Whisper/Prompt-Guard ausgeschlossen. */
export const GROQ_CHAT_MODELS = [
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "qwen/qwen3.6-27b",
  "groq/compound",
  "groq/compound-mini",
] as const;

const MODELS_URL = "https://api.groq.com/openai/v1/models";
const CACHE_MS = 60 * 60 * 1000;

let modelCache: { ids: string[]; fetchedAt: number } | null = null;

export async function fetchGroqModelIds(apiKey: string): Promise<string[]> {
  const response = await fetch(MODELS_URL, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!response.ok) return [];
  const payload = (await response.json()) as { data?: { id: string }[] };
  return (payload.data ?? []).map((m) => m.id);
}

/** Bevorzugtes Modell, wenn verfügbar — sonst Default/Fallback laut Models-API. */
export async function resolveGroqModel(
  apiKey: string,
  preferred?: string
): Promise<string> {
  const wanted = preferred?.trim() || GROQ_CHAT_MODEL_DEFAULT;
  const now = Date.now();

  if (!modelCache || now - modelCache.fetchedAt > CACHE_MS) {
    try {
      const ids = await fetchGroqModelIds(apiKey);
      if (ids.length > 0) {
        modelCache = { ids, fetchedAt: now };
      }
    } catch {
      return wanted;
    }
  }

  const ids = modelCache?.ids ?? [];
  if (ids.length === 0) return wanted;
  if (ids.includes(wanted)) return wanted;

  for (const candidate of [
    GROQ_CHAT_MODEL_DEFAULT,
    GROQ_CHAT_MODEL_FALLBACK,
    ...GROQ_CHAT_MODELS,
  ]) {
    if (ids.includes(candidate)) return candidate;
  }

  return wanted;
}

export function groqUsesStrictJsonSchema(model: string): boolean {
  return model.startsWith("openai/gpt-oss") && process.env.GROQ_JSON_STRICT !== "false";
}
