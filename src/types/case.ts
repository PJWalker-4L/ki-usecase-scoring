import type { Answers, ScoreResult } from "@/lib/scoring";
import type { FallBrief } from "@/types/brief";
import type { ClassificationResult } from "@/types/classification";

export type CaseStatus = "unerledigt" | "erledigt";

export type SavedCase = {
  id: string;
  savedAt: string;
  status: CaseStatus;
  brief: FallBrief;
  answers: Answers;
  result: ScoreResult;
  classification?: ClassificationResult;
};
