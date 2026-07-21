import type { ClassificationResult, ClassifyRequest } from "@/types/classification";

export async function classifyProcess(
  input: ClassifyRequest
): Promise<{ ok: true; data: ClassificationResult } | { ok: false; message: string }> {
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
          "Beispielrichtungen konnten nicht geladen werden. Du kannst direkt mit den Fragen weitermachen.",
      };
    }

    const data = (await response.json()) as ClassificationResult;
    return { ok: true, data };
  } catch {
    return {
      ok: false,
      message:
        "Beispielrichtungen konnten nicht geladen werden. Du kannst direkt mit den Fragen weitermachen.",
    };
  }
}
