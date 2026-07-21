export type LlmProvider = "xai" | "openai";

export type LlmProviderConfig = {
  provider: LlmProvider;
  apiKey: string;
  chatCompletionsUrl: string;
  model: string;
};

function chatUrl(base: string): string {
  const trimmed = base.replace(/\/+$/, "");
  return trimmed.endsWith("/chat/completions")
    ? trimmed
    : `${trimmed}/chat/completions`;
}

/** xAI/Grok bevorzugt; OpenAI als optionaler Fallback. */
export function resolveLlmProvider(): LlmProviderConfig | null {
  const xaiKey = process.env.XAI_API_KEY ?? process.env.GROK_API_KEY;
  if (xaiKey?.trim()) {
    const base =
      process.env.XAI_BASE_URL ??
      process.env.GROK_BASE_URL ??
      "https://api.x.ai/v1";
    return {
      provider: "xai",
      apiKey: xaiKey.trim(),
      chatCompletionsUrl: chatUrl(base),
      model:
        process.env.XAI_MODEL ??
        process.env.GROK_MODEL ??
        "grok-3-mini",
    };
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey?.trim()) {
    const base = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
    return {
      provider: "openai",
      apiKey: openaiKey.trim(),
      chatCompletionsUrl: chatUrl(base),
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    };
  }

  return null;
}

export function missingLlmConfigMessage(): string {
  return "Klassifikation nicht konfiguriert (XAI_API_KEY oder OPENAI_API_KEY fehlt).";
}
