import type {
  Beispielrichtung,
  ClassificationResult,
  ClassifyRequest,
  InitialClassificationResult,
} from "@/types/classification";

export async function classifyInitial(
  input: Omit<Extract<ClassifyRequest, { phase: "initial" }>, "phase">
): Promise<
  { ok: true; data: InitialClassificationResult } | { ok: false; message: string }
> {
  return callClassify({ phase: "initial", ...input });
}

export async function classifyBeispiele(
  input: Omit<Extract<ClassifyRequest, { phase: "beispiele" }>, "phase">,
  options?: { signal?: AbortSignal }
): Promise<
  | { ok: true; data: Pick<ClassificationResult, "beispielrichtungen" | "fallstricke" | "empfehlung"> }
  | { ok: false; message: string; aborted?: boolean }
> {
  return callClassify({ phase: "beispiele", ...input }, options?.signal);
}

async function callClassify<T>(
  input: ClassifyRequest,
  signal?: AbortSignal
): Promise<{ ok: true; data: T } | { ok: false; message: string; aborted?: boolean }> {
  try {
    const response = await fetch("/api/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      signal,
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      return {
        ok: false,
        message:
          payload?.error ??
          "Die Analyse konnte nicht abgeschlossen werden. Du kannst trotzdem fortfahren.",
      };
    }

    const data = (await response.json()) as T;
    return { ok: true, data };
  } catch (error) {
    if (
      signal?.aborted ||
      (error instanceof DOMException && error.name === "AbortError")
    ) {
      return { ok: false, message: "", aborted: true };
    }
    return {
      ok: false,
      message:
        "Die Analyse konnte nicht abgeschlossen werden. Du kannst trotzdem fortfahren.",
    };
  }
}

/** @deprecated Use classifyInitial / classifyBeispiele */
export async function classifyProcess(input: ClassifyRequest) {
  if (input.phase === "beispiele") {
    return classifyBeispiele(input);
  }
  return classifyInitial(input);
}

export type { Beispielrichtung, ClassificationResult, InitialClassificationResult };
