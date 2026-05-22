import { NextRequest, NextResponse } from "next/server";
import { VerificationRepository } from "@/infrastructure/verification";
import {
  CallState,
  createIdleContext,
  createVerifiedContext,
  createScamContext,
} from "@/domain/verification";

// DEMO: This endpoint controls the call state for live demos
// In production, this would be connected to actual call detection

export async function GET() {
  const context = VerificationRepository.getCallContext();
  return NextResponse.json(context);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { state, callerNumber, department, label } = body;

    if (!state || !Object.values(CallState).includes(state)) {
      return NextResponse.json(
        { error: "Μη έγκυρο state. Χρησιμοποιήστε: idle, verified, scam" },
        { status: 400 }
      );
    }

    let context;
    switch (state) {
      case CallState.IDLE:
        context = createIdleContext();
        break;
      case CallState.VERIFIED:
        if (!department) {
          return NextResponse.json(
            { error: "Απαιτείται department για verified state" },
            { status: 400 }
          );
        }
        context = createVerifiedContext(callerNumber || "", department, label);
        break;
      case CallState.SCAM:
        context = createScamContext(callerNumber);
        break;
      default:
        context = createIdleContext();
    }

    VerificationRepository.setCallContext(context);
    return NextResponse.json(context);
  } catch {
    return NextResponse.json(
      { error: "Μη έγκυρο αίτημα" },
      { status: 400 }
    );
  }
}
