import { NextRequest, NextResponse } from "next/server";
import { VerificationRepository } from "@/infrastructure/verification";
import { createScamReport } from "@/domain/verification";

export async function GET() {
  const reports = VerificationRepository.getScamReports();
  return NextResponse.json({ reports });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reportedNumber, userNotes } = body;

    if (!reportedNumber) {
      return NextResponse.json(
        { error: "Απαιτείται reportedNumber" },
        { status: 400 }
      );
    }

    const report = createScamReport(reportedNumber, userNotes);
    VerificationRepository.addScamReport(report);

    return NextResponse.json({ report }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Μη έγκυρο αίτημα" },
      { status: 400 }
    );
  }
}
