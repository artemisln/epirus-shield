import { NextRequest, NextResponse } from "next/server";
import { assessCreditworthiness } from "@/application";
import { createLoanApplication, updateLoanApplication, LoanPurpose } from "@/domain/loan";
import { ExtractedDocument } from "@/domain/documents";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documents, loanDetails } = body as {
      documents: ExtractedDocument[];
      loanDetails: { amount: number; termMonths: number; purpose: string };
    };

    if (!documents || !Array.isArray(documents)) {
      return NextResponse.json(
        { error: "Documents array is required" },
        { status: 400 }
      );
    }

    if (!loanDetails) {
      return NextResponse.json(
        { error: "Loan details are required" },
        { status: 400 }
      );
    }

    let application = createLoanApplication();
    application = updateLoanApplication(application, {
      documents,
      loanDetails: {
        amount: loanDetails.amount,
        termMonths: loanDetails.termMonths,
        purpose: loanDetails.purpose as LoanPurpose,
      },
    });

    const assessment = assessCreditworthiness(application);

    return NextResponse.json({
      assessment,
      success: true,
    });
  } catch (error) {
    console.error("Assess API error:", error);
    return NextResponse.json(
      { error: "Failed to assess creditworthiness" },
      { status: 500 }
    );
  }
}
