import { normalizePhone } from "./VerifiedNumber";

export interface TrustedNumber {
  id: string;
  phone: string;
  trustedAt: Date;
}

export function createTrustedNumber(phone: string): TrustedNumber {
  return {
    id: crypto.randomUUID(),
    phone: normalizePhone(phone),
    trustedAt: new Date(),
  };
}
