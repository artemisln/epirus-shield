import { DocumentType } from "./DocumentType";

export interface ExtractedField {
  value: string | number | boolean | null;
  confidence: number;
  rawText?: string;
}

export interface E1Fields {
  taxYear: ExtractedField;
  grossIncome: ExtractedField;
  netIncome: ExtractedField;
  taxPaid: ExtractedField;
  afm: ExtractedField;
  fullName: ExtractedField;
}

export interface EkkatharistikoFields {
  taxYear: ExtractedField;
  totalIncome: ExtractedField;
  taxDue: ExtractedField;
  taxPaid: ExtractedField;
  refundOrDebt: ExtractedField;
  afm: ExtractedField;
}

export interface MisthodosiaFields {
  employerName: ExtractedField;
  employeeName: ExtractedField;
  afm: ExtractedField;
  grossSalary: ExtractedField;
  netSalary: ExtractedField;
  period: ExtractedField;
  deductions: ExtractedField;
}

export interface BankStatementFields {
  accountHolder: ExtractedField;
  iban: ExtractedField;
  periodStart: ExtractedField;
  periodEnd: ExtractedField;
  openingBalance: ExtractedField;
  closingBalance: ExtractedField;
  totalCredits: ExtractedField;
  totalDebits: ExtractedField;
  regularIncomeDetected: ExtractedField;
  existingLoanPayments: ExtractedField;
}

export type DocumentFields =
  | E1Fields
  | EkkatharistikoFields
  | MisthodosiaFields
  | BankStatementFields;

export interface ExtractedDocument {
  id: string;
  type: DocumentType;
  fields: DocumentFields;
  overallConfidence: number;
  extractedAt: Date;
  warnings: string[];
  rawFileName?: string;
}

export function createExtractedDocument(
  type: DocumentType,
  fields: DocumentFields,
  warnings: string[] = [],
  rawFileName?: string
): ExtractedDocument {
  const confidences = Object.values(fields)
    .filter((f): f is ExtractedField => f !== null && typeof f === "object" && "confidence" in f)
    .map((f) => f.confidence);

  const overallConfidence =
    confidences.length > 0
      ? confidences.reduce((a, b) => a + b, 0) / confidences.length
      : 0;

  return {
    id: crypto.randomUUID(),
    type,
    fields,
    overallConfidence,
    extractedAt: new Date(),
    warnings,
    rawFileName,
  };
}
