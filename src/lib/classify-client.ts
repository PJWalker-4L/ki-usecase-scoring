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
  input: Omit<Extract<ClassifyRequest, { phase: "beispiele" }>, "phase">
): Promise<
  { ok: true; data: Pick<ClassificationResult, "beispielrichtungen" | "fallstricke"> } |
    { ok: false; message: string }
> {
  return callClassify({ phase: "beispiele", ...input });
}

async function callClassify<T>(
  input: ClassifyRequest
): Promise<{ ok: true; data: T } | { ok: false; message: string }> {
  try {
    const response = await fetch("/api/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
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
  } catch {
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
