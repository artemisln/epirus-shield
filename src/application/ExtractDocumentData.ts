import { LLMPort, DocumentExtractionResult } from "./ports";

export async function extractDocumentData(
  fileBase64: string,
  mimeType: string,
  fileName: string,
  llmPort: LLMPort
): Promise<DocumentExtractionResult> {
  return llmPort.extractDocument(fileBase64, mimeType, fileName);
}
