import { NextRequest, NextResponse } from "next/server";
import { VerificationRepository } from "@/infrastructure/verification";

export async function GET() {
  const domains = VerificationRepository.getVerifiedDomains();
  return NextResponse.json({ domains });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain, organization } = body;

    if (!domain || !organization) {
      return NextResponse.json(
        { error: "Απαιτούνται domain και organization" },
        { status: 400 }
      );
    }

    const d = VerificationRepository.addVerifiedDomain(domain, organization);
    return NextResponse.json({ domain: d }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Μη έγκυρο αίτημα" },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Απαιτείται id" },
        { status: 400 }
      );
    }

    const deleted = VerificationRepository.removeVerifiedDomain(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Δεν βρέθηκε" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Σφάλμα διαγραφής" },
      { status: 500 }
    );
  }
}
