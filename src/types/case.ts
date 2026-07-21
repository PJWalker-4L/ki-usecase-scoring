import type { Answers, ScoreResult } from "@/lib/scoring";
import type { FallBrief } from "@/types/brief";
import type { ClassificationResult } from "@/types/classification";

export type SavedCase = {
  id: string;
  savedAt: string;
  brief: FallBrief;
  answers: Answers;
  result: ScoreResult;
  classification?: ClassificationResult;
};
