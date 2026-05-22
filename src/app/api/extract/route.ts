import { NextRequest, NextResponse } from "next/server";
import { createBedrockAdapter } from "@/infrastructure/bedrock";
import { getSampleDocumentByType } from "@/infrastructure/sample-data";
import { DocumentType } from "@/domain/documents";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const typeStr = formData.get("type") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const documentType = (typeStr as DocumentType) || DocumentType.E1;

    const hasCredentials =
      process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY;

    if (!hasCredentials) {
      const sampleDoc = getSampleDocumentByType(documentType);
      if (sampleDoc) {
        return NextResponse.json({
          document: { ...sampleDoc, rawFileName: file.name },
          success: true,
          usedSampleData: true,
        });
      }
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const adapter = createBedrockAdapter();
    const result = await adapter.extractDocument(base64, file.type, file.name);

    if (!result.success) {
      const sampleDoc = getSampleDocumentByType(documentType);
      if (sampleDoc) {
        return NextResponse.json({
          document: { ...sampleDoc, rawFileName: file.name },
          success: true,
          usedSampleData: true,
          originalError: result.error,
        });
      }
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      document: result.document,
      success: true,
    });
  } catch (error) {
    console.error("Extract API error:", error);
    return NextResponse.json(
      { error: "Failed to extract document data" },
      { status: 500 }
    );
  }
}
