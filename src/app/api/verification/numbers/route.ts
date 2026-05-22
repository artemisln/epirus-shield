import { NextRequest, NextResponse } from "next/server";
import { VerificationRepository } from "@/infrastructure/verification";

export async function GET() {
  const numbers = VerificationRepository.getVerifiedNumbers();
  return NextResponse.json({ numbers });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, department, label } = body;

    if (!phone || !department) {
      return NextResponse.json(
        { error: "Απαιτούνται phone και department" },
        { status: 400 }
      );
    }

    const number = VerificationRepository.addVerifiedNumber(phone, department, label);
    return NextResponse.json({ number }, { status: 201 });
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

    const deleted = VerificationRepository.removeVerifiedNumber(id);
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
