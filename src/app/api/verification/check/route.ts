import { NextRequest, NextResponse } from "next/server";
import { VerificationRepository } from "@/infrastructure/verification";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, value } = body;

    if (!type || !value) {
      return NextResponse.json(
        { error: "Απαιτούνται type και value" },
        { status: 400 }
      );
    }

    if (type === "phone") {
      const match = VerificationRepository.findVerifiedNumberByPhone(value);
      if (match) {
        return NextResponse.json({
          verified: true,
          type: "phone",
          department: match.department,
          label: match.label,
        });
      }
      return NextResponse.json({ verified: false, type: "phone" });
    }

    if (type === "email") {
      const result = VerificationRepository.isEmailDomainVerified(value);
      if (result.verified && result.domain) {
        return NextResponse.json({
          verified: true,
          type: "email",
          organization: result.domain.organization,
          domain: result.domain.domain,
        });
      }
      return NextResponse.json({ verified: false, type: "email" });
    }

    return NextResponse.json(
      { error: "Μη έγκυρος τύπος. Χρησιμοποιήστε phone ή email" },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { error: "Μη έγκυρο αίτημα" },
      { status: 400 }
    );
  }
}
