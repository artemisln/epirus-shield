import { ExtractedDocument } from "@/domain/documents";
import { Assessment, LoanApplication } from "@/domain/loan";

export interface DocumentExtractionResult {
  document: ExtractedDocument;
  success: boolean;
  error?: string;
}

export interface ExplanationResult {
  explanation: string;
  success: boolean;
  error?: string;
}

export interface LLMPort {
  extractDocument(
    fileBase64: string,
    mimeType: string,
    fileName: string
  ): Promise<DocumentExtractionResult>;

  generateExplanation(
    application: LoanApplication,
    assessment: Assessment
  ): Promise<ExplanationResult>;
}
