import { getVercelOidcToken } from "@vercel/oidc";
import { groqUsesStrictJsonSchema } from "@/lib/groq-models";

export type LlmProvider = "groq" | "xai" | "openai" | "gateway";

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

function gatewayConfig(apiKey: string): LlmProviderConfig {
  const model =
    process.env.AI_GATEWAY_MODEL?.trim() ||
    process.env.GROQ_MODEL?.trim() ||
    "openai/gpt-oss-20b";

  return {
    provider: "gateway",
    apiKey,
    chatCompletionsUrl: chatUrl(
      process.env.AI_GATEWAY_BASE_URL ?? "https://ai-gateway.vercel.sh/v1"
    ),
    model,
    responseFormat: groqUsesStrictJsonSchema(model)
      ? "json_schema_strict"
      : model.includes("gpt-oss")
        ? "json_schema_strict"
        : "json_object",
  };
}

/**
 * Groq (gsk_*) → xAI/Grok → OpenAI → Vercel AI Gateway (API-Key oder OIDC).
 */
export async function resolveLlmProvider(): Promise<LlmProviderConfig | null> {
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

  const gatewayKey = process.env.AI_GATEWAY_API_KEY?.trim();
  if (gatewayKey) {
    return gatewayConfig(gatewayKey);
  }

  try {
    const oidc = (await getVercelOidcToken())?.trim();
    if (oidc) {
      return gatewayConfig(oidc);
    }
  } catch {
    // Lokal ohne `vercel env pull` / ohne Deployment: kein OIDC.
  }

  return null;
}

/** Technische Diagnose für Server-Logs. */
export function missingLlmConfigMessage(): string {
  return "Klassifikation nicht konfiguriert (GROQ_API_KEY, XAI_API_KEY, OPENAI_API_KEY, AI_GATEWAY_API_KEY oder Vercel-OIDC fehlt).";
}

/** Nutzerseitige Meldung — ohne interne Env-Namen. */
export function userFacingLlmUnavailableMessage(): string {
  return "Die KI-Analyse ist derzeit nicht verfügbar. Du kannst trotzdem fortfahren.";
}
