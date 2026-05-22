import { NextRequest, NextResponse } from "next/server";
import { validateApplication } from "@/application";
import { createLoanApplication, updateLoanApplication, LoanPurpose } from "@/domain/loan";
import { ExtractedDocument } from "@/domain/documents";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documents, loanDetails } = body as {
      documents: ExtractedDocument[];
      loanDetails?: { amount: number; termMonths: number; purpose: string };
    };

    if (!documents || !Array.isArray(documents)) {
      return NextResponse.json(
        { error: "Documents array is required" },
        { status: 400 }
      );
    }

    let application = createLoanApplication();
    application = updateLoanApplication(application, {
      documents,
      loanDetails: loanDetails
        ? {
            amount: loanDetails.amount,
            termMonths: loanDetails.termMonths,
            purpose: loanDetails.purpose as LoanPurpose,
          }
        : null,
    });

    const validationResult = validateApplication(application);

    return NextResponse.json({
      isValid: validationResult.isValid,
      issues: validationResult.issues,
      missingDocuments: validationResult.missingDocuments,
    });
  } catch (error) {
    console.error("Validate API error:", error);
    return NextResponse.json(
      { error: "Failed to validate application" },
      { status: 500 }
    );
  }
}
