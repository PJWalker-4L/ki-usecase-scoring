import { describe, expect, it } from "vitest";
import {
  GROQ_COMPLETION_TOKENS,
  bumpGroqCompletionTokens,
  groqMaxCompletionTokens,
  groqSupportsReasoningEffort,
  isGroqTokenTruncation,
} from "@/lib/groq-models";

describe("groq completion budget", () => {
  it("gibt Phase 2 genug Tokens für fallstricke und empfehlung", () => {
    expect(groqMaxCompletionTokens("prozess_beispiele")).toBe(
      GROQ_COMPLETION_TOKENS.beispiele
    );
    expect(GROQ_COMPLETION_TOKENS.beispiele).toBeGreaterThanOrEqual(8192);
  });

  it("hält Phase 1 kleiner als Phase 2", () => {
    expect(groqMaxCompletionTokens("prozess_initial")).toBeLessThan(
      groqMaxCompletionTokens("prozess_beispiele")
    );
  });

  it("setzt Reasoning nur für gpt-oss", () => {
    expect(groqSupportsReasoningEffort("openai/gpt-oss-20b")).toBe(true);
    expect(groqSupportsReasoningEffort("llama-3.3-70b-versatile")).toBe(false);
  });

  it("verdoppelt das Budget einmal bis zum Cap", () => {
    expect(bumpGroqCompletionTokens(16384)).toBe(32768);
    expect(bumpGroqCompletionTokens(32768)).toBe(32768);
  });

  it("erkennt Groq-Truncation", () => {
    expect(
      isGroqTokenTruncation(
        "max completion tokens reached before generating a valid document"
      )
    ).toBe(true);
    expect(isGroqTokenTruncation("Failed to validate JSON")).toBe(false);
  });
});
