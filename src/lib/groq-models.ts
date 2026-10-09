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

/**
 * gpt-oss teilt sich max_completion_tokens mit dem Reasoning (Default: medium).
 * Ohne explizites Budget bricht strict JSON in Phase 2 ab — fallstricke und
 * empfehlung fehlen, Groq antwortet 400 json_validate_failed.
 */
export const GROQ_COMPLETION_TOKENS = {
  initial: 4096,
  beispiele: 16384,
  cap: 32768,
} as const;

export function groqMaxCompletionTokens(schemaName: string): number {
  return schemaName === "prozess_beispiele"
    ? GROQ_COMPLETION_TOKENS.beispiele
    : GROQ_COMPLETION_TOKENS.initial;
}

/** Nur gpt-oss akzeptiert low/medium/high. Andere Groq-Modelle lehnen den Parameter mit 400 ab. */
export function groqSupportsReasoningEffort(model: string): boolean {
  return model.startsWith("openai/gpt-oss");
}

export function isGroqTokenTruncation(detail: string): boolean {
  return /max completion tokens/i.test(detail);
}

export function bumpGroqCompletionTokens(current: number): number {
  if (current >= GROQ_COMPLETION_TOKENS.cap) return current;
  return Math.min(current * 2, GROQ_COMPLETION_TOKENS.cap);
}
