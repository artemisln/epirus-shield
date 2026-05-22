import { LLMPort, ExplanationResult } from "./ports";
import { Assessment, LoanApplication } from "@/domain/loan";

export async function explainDecision(
  application: LoanApplication,
  assessment: Assessment,
  llmPort: LLMPort
): Promise<ExplanationResult> {
  return llmPort.generateExplanation(application, assessment);
}
