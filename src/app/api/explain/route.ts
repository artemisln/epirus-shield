import { NextRequest, NextResponse } from "next/server";
import { createBedrockAdapter } from "@/infrastructure/bedrock";
import {
  sampleExplanationApprove,
  sampleExplanationReview,
  sampleExplanationDecline,
} from "@/infrastructure/sample-data";
import { Assessment, Decision, createLoanApplication, updateLoanApplication, LoanPurpose } from "@/domain/loan";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assessment, loanDetails } = body as {
      assessment: Assessment;
      loanDetails?: { amount: number; termMonths: number; purpose: string };
    };

    if (!assessment) {
      return NextResponse.json(
        { error: "Assessment is required" },
        { status: 400 }
      );
    }

    const hasCredentials =
      process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY;

    if (!hasCredentials) {
      const explanation = getSampleExplanation(assessment.decision);
      return NextResponse.json({
        explanation,
        success: true,
        usedSampleData: true,
      });
    }

    let application = createLoanApplication();
    if (loanDetails) {
      application = updateLoanApplication(application, {
        loanDetails: {
          amount: loanDetails.amount,
          termMonths: loanDetails.termMonths,
          purpose: loanDetails.purpose as LoanPurpose,
        },
      });
    }

    const adapter = createBedrockAdapter();
    const result = await adapter.generateExplanation(application, assessment);

    if (!result.success) {
      const explanation = getSampleExplanation(assessment.decision);
      return NextResponse.json({
        explanation,
        success: true,
        usedSampleData: true,
        originalError: result.error,
      });
    }

    return NextResponse.json({
      explanation: result.explanation,
      success: true,
    });
  } catch (error) {
    console.error("Explain API error:", error);
    const explanation = sampleExplanationApprove;
    return NextResponse.json({
      explanation,
      success: true,
      usedSampleData: true,
    });
  }
}

function getSampleExplanation(decision: Decision): string {
  switch (decision) {
    case Decision.APPROVE:
      return sampleExplanationApprove;
    case Decision.REVIEW:
      return sampleExplanationReview;
    case Decision.DECLINE:
      return sampleExplanationDecline;
    default:
      return sampleExplanationReview;
  }
}
