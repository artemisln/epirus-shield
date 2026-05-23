export interface VerifiedNumber {
  id: string;
  phone: string;
  department: string;
  label?: string;
  createdAt: Date;
}

export function createVerifiedNumber(
  phone: string,
  department: string,
  label?: string
): VerifiedNumber {
  return {
    id: crypto.randomUUID(),
    phone: normalizePhone(phone),
    department,
    label,
    createdAt: new Date(),
  };
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("30") && digits.length === 12) {
    return `+${digits}`;
  }
  if (digits.length === 10 && digits.startsWith("2")) {
    return `+30${digits}`;
  }
  return phone;
}

export function phoneMatches(a: string, b: string): boolean {
  return normalizePhone(a) === normalizePhone(b);
}
