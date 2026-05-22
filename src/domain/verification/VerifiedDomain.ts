export interface VerifiedDomain {
  id: string;
  domain: string;
  organization: string;
  createdAt: Date;
}

export function createVerifiedDomain(
  domain: string,
  organization: string
): VerifiedDomain {
  return {
    id: crypto.randomUUID(),
    domain: normalizeDomain(domain),
    organization,
    createdAt: new Date(),
  };
}

export function normalizeDomain(domain: string): string {
  return domain.toLowerCase().trim();
}

export function extractDomainFromEmail(email: string): string | null {
  const match = email.match(/@([^@\s]+)$/);
  return match ? normalizeDomain(match[1]) : null;
}

export function domainMatches(emailDomain: string, verifiedDomain: string): boolean {
  const normalized = normalizeDomain(emailDomain);
  const verified = normalizeDomain(verifiedDomain);
  return normalized === verified || normalized.endsWith(`.${verified}`);
}
