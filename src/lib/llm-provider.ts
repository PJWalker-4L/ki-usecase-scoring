import { groqUsesStrictJsonSchema } from "@/lib/groq-models";

export type LlmProvider = "groq" | "xai" | "openai";

export type ResponseFormatMode = "json_schema_strict" | "json_object";

export type LlmProviderConfig = {
  provider: LlmProvider;
  apiKey: string;
  chatCompletionsUrl: string;
  model: string;
  responseFormat: ResponseFormatMode;
};

function chatUrl(base: string): string {
  const trimmed = base.replace(/\/+$/, "");
  return trimmed.endsWith("/chat/completions")
    ? trimmed
    : `${trimmed}/chat/completions`;
}

function isGroqKey(key: string): boolean {
  return key.startsWith("gsk_");
}

/** Groq (gsk_*), xAI/Grok, OpenAI — in dieser Priorität. */
export function resolveLlmProvider(): LlmProviderConfig | null {
  const groqKey =
    process.env.GROQ_API_KEY?.trim() ??
    (() => {
      const candidate =
        process.env.XAI_API_KEY?.trim() ?? process.env.GROK_API_KEY?.trim();
      return candidate && isGroqKey(candidate) ? candidate : undefined;
    })();

  if (groqKey) {
    const model = process.env.GROQ_MODEL?.trim() || "openai/gpt-oss-20b";
    return {
      provider: "groq",
      apiKey: groqKey,
      chatCompletionsUrl: chatUrl(
        process.env.GROQ_BASE_URL ?? "https://api.groq.com/openai/v1"
      ),
      model,
      responseFormat: groqUsesStrictJsonSchema(model)
        ? "json_schema_strict"
        : "json_object",
    };
  }

  const xaiKey = process.env.XAI_API_KEY?.trim() ?? process.env.GROK_API_KEY?.trim();
  if (xaiKey && !isGroqKey(xaiKey)) {
    const base =
      process.env.XAI_BASE_URL ??
      process.env.GROK_BASE_URL ??
      "https://api.x.ai/v1";
    return {
      provider: "xai",
      apiKey: xaiKey,
      chatCompletionsUrl: chatUrl(base),
      model:
        process.env.XAI_MODEL ??
        process.env.GROK_MODEL ??
        "grok-3-mini",
      responseFormat: "json_schema_strict",
    };
  }

  const openaiKey = process.env.OPENAI_API_KEY?.trim();
  if (openaiKey) {
    const base = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
    return {
      provider: "openai",
      apiKey: openaiKey,
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      chatCompletionsUrl: chatUrl(base),
      responseFormat: "json_schema_strict",
    };
  }

  return null;
}

export function missingLlmConfigMessage(): string {
  return "Klassifikation nicht konfiguriert (GROQ_API_KEY, XAI_API_KEY oder OPENAI_API_KEY fehlt).";
}
