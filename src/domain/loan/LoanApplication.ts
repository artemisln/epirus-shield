import { Applicant } from "./Applicant";
import { Assessment } from "./Assessment";
import { ExtractedDocument } from "../documents";

export enum LoanPurpose {
  CONSUMER = "CONSUMER",
  HOME_IMPROVEMENT = "HOME_IMPROVEMENT",
  VEHICLE = "VEHICLE",
  DEBT_CONSOLIDATION = "DEBT_CONSOLIDATION",
  EDUCATION = "EDUCATION",
  MEDICAL = "MEDICAL",
  OTHER = "OTHER",
}

export const LoanPurposeLabels: Record<LoanPurpose, string> = {
  [LoanPurpose.CONSUMER]: "Καταναλωτικό",
  [LoanPurpose.HOME_IMPROVEMENT]: "Ανακαίνιση Κατοικίας",
  [LoanPurpose.VEHICLE]: "Αγορά Οχήματος",
  [LoanPurpose.DEBT_CONSOLIDATION]: "Ενοποίηση Οφειλών",
  [LoanPurpose.EDUCATION]: "Σπουδές",
  [LoanPurpose.MEDICAL]: "Ιατρικά Έξοδα",
  [LoanPurpose.OTHER]: "Άλλο",
};

export enum ApplicationStatus {
  DRAFT = "DRAFT",
  DOCUMENTS_UPLOADED = "DOCUMENTS_UPLOADED",
  PROCESSING = "PROCESSING",
  ASSESSED = "ASSESSED",
  COMPLETED = "COMPLETED",
}

export interface LoanDetails {
  amount: number;
  termMonths: number;
  purpose: LoanPurpose;
}

export interface LoanApplication {
  id: string;
  applicant: Applicant | null;
  loanDetails: LoanDetails | null;
  documents: ExtractedDocument[];
  assessment: Assessment | null;
  explanation: string | null;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export function createLoanApplication(): LoanApplication {
  return {
    id: crypto.randomUUID(),
    applicant: null,
    loanDetails: null,
    documents: [],
    assessment: null,
    explanation: null,
    status: ApplicationStatus.DRAFT,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function updateLoanApplication(
  application: LoanApplication,
  updates: Partial<Omit<LoanApplication, "id" | "createdAt">>
): LoanApplication {
  return {
    ...application,
    ...updates,
    updatedAt: new Date(),
  };
}

export const LOAN_AMOUNT_MIN = 1000;
export const LOAN_AMOUNT_MAX = 50000;
export const LOAN_TERM_MIN = 6;
export const LOAN_TERM_MAX = 84;
