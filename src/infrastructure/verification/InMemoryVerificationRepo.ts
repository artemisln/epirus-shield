import {
  VerifiedNumber,
  VerifiedDomain,
  CallContext,
  ScamReport,
  createVerifiedNumber,
  createVerifiedDomain,
  createIdleContext,
  phoneMatches,
  domainMatches,
  extractDomainFromEmail,
} from "@/domain/verification";

// DEMO: In-memory store - resets on server restart
const verifiedNumbers: Map<string, VerifiedNumber> = new Map();
const verifiedDomains: Map<string, VerifiedDomain> = new Map();
const scamReports: ScamReport[] = [];
let currentCallContext: CallContext = createIdleContext();

// DEMO: Seed with sample data
function seedDemoData() {
  if (verifiedNumbers.size === 0) {
    const numbers = [
      createVerifiedNumber("+302101234567", "Εξυπηρέτηση Πελατών", "Κεντρική Γραμμή"),
      createVerifiedNumber("+302101234568", "Τμήμα Δανείων"),
      createVerifiedNumber("+302101234569", "Τμήμα Καρτών"),
      createVerifiedNumber("+306901234567", "Ασφάλεια Λογαριασμού"),
    ];
    numbers.forEach((n) => verifiedNumbers.set(n.id, n));
  }

  if (verifiedDomains.size === 0) {
    const domains = [
      createVerifiedDomain("epirusbank.gr", "Epirus Bank"),
      createVerifiedDomain("epirus-bank.gr", "Epirus Bank"),
      createVerifiedDomain("mail.epirusbank.gr", "Epirus Bank"),
    ];
    domains.forEach((d) => verifiedDomains.set(d.id, d));
  }
}

seedDemoData();

export const VerificationRepository = {
  getVerifiedNumbers(): VerifiedNumber[] {
    return Array.from(verifiedNumbers.values());
  },

  getVerifiedNumber(id: string): VerifiedNumber | undefined {
    return verifiedNumbers.get(id);
  },

  addVerifiedNumber(phone: string, department: string, label?: string): VerifiedNumber {
    const number = createVerifiedNumber(phone, department, label);
    verifiedNumbers.set(number.id, number);
    return number;
  },

  removeVerifiedNumber(id: string): boolean {
    return verifiedNumbers.delete(id);
  },

  findVerifiedNumberByPhone(phone: string): VerifiedNumber | undefined {
    return Array.from(verifiedNumbers.values()).find((n) => phoneMatches(n.phone, phone));
  },

  getVerifiedDomains(): VerifiedDomain[] {
    return Array.from(verifiedDomains.values());
  },

  getVerifiedDomain(id: string): VerifiedDomain | undefined {
    return verifiedDomains.get(id);
  },

  addVerifiedDomain(domain: string, organization: string): VerifiedDomain {
    const d = createVerifiedDomain(domain, organization);
    verifiedDomains.set(d.id, d);
    return d;
  },

  removeVerifiedDomain(id: string): boolean {
    return verifiedDomains.delete(id);
  },

  isEmailDomainVerified(email: string): { verified: boolean; domain?: VerifiedDomain } {
    const emailDomain = extractDomainFromEmail(email);
    if (!emailDomain) return { verified: false };

    const match = Array.from(verifiedDomains.values()).find((d) =>
      domainMatches(emailDomain, d.domain)
    );
    return match ? { verified: true, domain: match } : { verified: false };
  },

  getCallContext(): CallContext {
    return currentCallContext;
  },

  setCallContext(context: CallContext): void {
    currentCallContext = context;
  },

  getScamReports(): ScamReport[] {
    return [...scamReports];
  },

  addScamReport(report: ScamReport): void {
    scamReports.unshift(report);
    if (scamReports.length > 100) {
      scamReports.pop();
    }
  },
};
