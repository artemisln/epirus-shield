import {
  ExtractedDocument,
  DocumentType,
  E1Fields,
  EkkatharistikoFields,
  MisthodosiaFields,
  BankStatementFields,
} from "@/domain/documents";
import { LoanApplication } from "@/domain/loan";

export interface ValidationIssue {
  field: string;
  documentType: DocumentType;
  message: string;
  severity: "error" | "warning";
}

export interface ValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
  missingDocuments: DocumentType[];
}

function validateE1(doc: ExtractedDocument): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const fields = doc.fields as E1Fields;

  if (!fields.grossIncome.value || (fields.grossIncome.value as number) <= 0) {
    issues.push({
      field: "grossIncome",
      documentType: DocumentType.E1,
      message: "Δεν βρέθηκε έγκυρο μικτό εισόδημα στο Ε1",
      severity: "error",
    });
  }

  if (!fields.afm.value) {
    issues.push({
      field: "afm",
      documentType: DocumentType.E1,
      message: "Δεν βρέθηκε ΑΦΜ στο Ε1",
      severity: "error",
    });
  }

  if (fields.grossIncome.confidence < 0.7) {
    issues.push({
      field: "grossIncome",
      documentType: DocumentType.E1,
      message: "Χαμηλή βεβαιότητα ανάγνωσης εισοδήματος - παρακαλώ επιβεβαιώστε",
      severity: "warning",
    });
  }

  return issues;
}

function validateEkkatharistiko(doc: ExtractedDocument): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const fields = doc.fields as EkkatharistikoFields;

  if (!fields.totalIncome.value || (fields.totalIncome.value as number) <= 0) {
    issues.push({
      field: "totalIncome",
      documentType: DocumentType.EKKATHARISTIKO,
      message: "Δεν βρέθηκε συνολικό εισόδημα στο εκκαθαριστικό",
      severity: "error",
    });
  }

  return issues;
}

function validateMisthodosia(doc: ExtractedDocument): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const fields = doc.fields as MisthodosiaFields;

  if (!fields.netSalary.value || (fields.netSalary.value as number) <= 0) {
    issues.push({
      field: "netSalary",
      documentType: DocumentType.MISTHODOSIA,
      message: "Δεν βρέθηκε καθαρός μισθός στη βεβαίωση αποδοχών",
      severity: "error",
    });
  }

  if (!fields.employerName.value) {
    issues.push({
      field: "employerName",
      documentType: DocumentType.MISTHODOSIA,
      message: "Δεν βρέθηκε όνομα εργοδότη",
      severity: "warning",
    });
  }

  return issues;
}

function validateBankStatement(doc: ExtractedDocument): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const fields = doc.fields as BankStatementFields;

  if (!fields.regularIncomeDetected.value) {
    issues.push({
      field: "regularIncomeDetected",
      documentType: DocumentType.BANK_STATEMENT,
      message: "Δεν εντοπίστηκε τακτικό εισόδημα στην κίνηση λογαριασμού",
      severity: "warning",
    });
  }

  return issues;
}

function crossValidateDocuments(documents: ExtractedDocument[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const e1 = documents.find((d) => d.type === DocumentType.E1);
  const ekkatharistiko = documents.find((d) => d.type === DocumentType.EKKATHARISTIKO);
  const misthodosia = documents.find((d) => d.type === DocumentType.MISTHODOSIA);

  if (e1 && ekkatharistiko) {
    const e1Fields = e1.fields as E1Fields;
    const ekkFields = ekkatharistiko.fields as EkkatharistikoFields;

    if (e1Fields.afm.value && ekkFields.afm.value && e1Fields.afm.value !== ekkFields.afm.value) {
      issues.push({
        field: "afm",
        documentType: DocumentType.E1,
        message: "Το ΑΦΜ στο Ε1 δεν ταιριάζει με το εκκαθαριστικό",
        severity: "error",
      });
    }

    const e1Income = e1Fields.grossIncome.value as number;
    const ekkIncome = ekkFields.totalIncome.value as number;
    if (e1Income && ekkIncome && Math.abs(e1Income - ekkIncome) / e1Income > 0.1) {
      issues.push({
        field: "income",
        documentType: DocumentType.E1,
        message: "Σημαντική απόκλιση εισοδήματος μεταξύ Ε1 και εκκαθαριστικού",
        severity: "warning",
      });
    }
  }

  if (misthodosia && e1) {
    const misthFields = misthodosia.fields as MisthodosiaFields;
    const e1Fields = e1.fields as E1Fields;

    const monthlyFromE1 = (e1Fields.grossIncome.value as number) / 12;
    const monthlySalary = misthFields.grossSalary.value as number;

    if (monthlyFromE1 && monthlySalary && Math.abs(monthlyFromE1 - monthlySalary) / monthlyFromE1 > 0.2) {
      issues.push({
        field: "salary",
        documentType: DocumentType.MISTHODOSIA,
        message: "Ο μισθός δεν συμφωνεί με το ετήσιο εισόδημα του Ε1",
        severity: "warning",
      });
    }
  }

  return issues;
}

export function validateApplication(application: LoanApplication): ValidationResult {
  const issues: ValidationIssue[] = [];
  const uploadedTypes = new Set(application.documents.map((d) => d.type));

  const requiredDocuments = [DocumentType.E1, DocumentType.EKKATHARISTIKO];
  const missingDocuments = requiredDocuments.filter((t) => !uploadedTypes.has(t));

  for (const doc of application.documents) {
    switch (doc.type) {
      case DocumentType.E1:
        issues.push(...validateE1(doc));
        break;
      case DocumentType.EKKATHARISTIKO:
        issues.push(...validateEkkatharistiko(doc));
        break;
      case DocumentType.MISTHODOSIA:
        issues.push(...validateMisthodosia(doc));
        break;
      case DocumentType.BANK_STATEMENT:
        issues.push(...validateBankStatement(doc));
        break;
    }
  }

  issues.push(...crossValidateDocuments(application.documents));

  const hasErrors = issues.some((i) => i.severity === "error") || missingDocuments.length > 0;

  return {
    isValid: !hasErrors,
    issues,
    missingDocuments,
  };
}
