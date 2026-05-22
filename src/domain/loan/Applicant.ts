export interface Applicant {
  fullName: string;
  afm: string;
  phone: string;
  email: string;
}

export function createApplicant(
  fullName: string,
  afm: string,
  phone: string,
  email: string
): Applicant {
  return { fullName, afm, phone, email };
}

export function validateAfm(afm: string): boolean {
  if (!/^\d{9}$/.test(afm)) return false;
  
  const digits = afm.split("").map(Number);
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    sum += digits[i] * Math.pow(2, 8 - i);
  }
  const checkDigit = (sum % 11) % 10;
  return checkDigit === digits[8];
}
