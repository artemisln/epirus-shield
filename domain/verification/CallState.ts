export enum CallState {
  IDLE = "idle",
  VERIFIED = "verified",
  SCAM = "scam",
}

export interface CallContext {
  state: CallState;
  callerNumber?: string;
  department?: string;
  label?: string;
  detectedAt?: Date;
}

export function createIdleContext(): CallContext {
  return { state: CallState.IDLE };
}

export function createVerifiedContext(
  callerNumber: string,
  department: string,
  label?: string
): CallContext {
  return {
    state: CallState.VERIFIED,
    callerNumber,
    department,
    label,
    detectedAt: new Date(),
  };
}

export function createScamContext(callerNumber?: string): CallContext {
  return {
    state: CallState.SCAM,
    callerNumber,
    detectedAt: new Date(),
  };
}
