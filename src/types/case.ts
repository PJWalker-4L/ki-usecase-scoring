import type { Answers, ScoreResult } from "@/lib/scoring";
import type { FallBrief } from "@/types/brief";

export type SavedCase = {
  id: string;
  savedAt: string;
  brief: FallBrief;
  answers: Answers;
  result: ScoreResult;
};
