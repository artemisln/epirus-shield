import {
  DocumentType,
  E1Fields,
  EkkatharistikoFields,
  MisthodosiaFields,
  BankStatementFields,
} from "@/domain/documents";
import {
  LoanApplication,
  Assessment,
  AssessmentFactor,
  Decision,
  createAssessment,
} from "@/domain/loan";

// MOCK: This entire module contains simplified creditworthiness logic for demo purposes.
// A real implementation would use proper credit scoring models, external credit bureau data,
// and regulatory-compliant underwriting rules.

interface IncomeData {
  annualGross: number;
  annualNet: number;
  monthlyNet: number;
  isVerified: boolean;
}

interface ObligationData {
  existingMonthlyPayments: number;
  detectedLoans: number;
}

function extractIncomeData(application: LoanApplication): IncomeData {
  let annualGross = 0;
  let annualNet = 0;
  let monthlyNet = 0;
  let isVerified = false;

  const e1 = application.documents.find((d) => d.type === DocumentType.E1);
  if (e1) {
    const fields = e1.fields as E1Fields;
    annualGross = (fields.grossIncome.value as number) || 0;
    annualNet = (fields.netIncome.value as number) || annualGross * 0.75;
    isVerified = true;
  }

  const ekk = application.documents.find((d) => d.type === DocumentType.EKKATHARISTIKO);
  if (ekk) {
    const fields = ekk.fields as EkkatharistikoFields;
    if (!annualGross) {
      annualGross = (fields.totalIncome.value as number) || 0;
      annualNet = annualGross * 0.75;
    }
    isVerified = true;
  }

  const misth = application.documents.find((d) => d.type === DocumentType.MISTHODOSIA);
  if (misth) {
    const fields = misth.fields as MisthodosiaFields;
    monthlyNet = (fields.netSalary.value as number) || 0;
    if (!annualNet && monthlyNet) {
      annualNet = monthlyNet * 14;
      annualGross = annualNet / 0.75;
    }
  }

  if (!monthlyNet && annualNet) {
    monthlyNet = annualNet / 14;
  }

  return { annualGross, annualNet, monthlyNet, isVerified };
}

function extractObligationData(application: LoanApplication): ObligationData {
  let existingMonthlyPayments = 0;
  let detectedLoans = 0;

  const bankStatement = application.documents.find((d) => d.type === DocumentType.BANK_STATEMENT);
  if (bankStatement) {
    const fields = bankStatement.fields as BankStatementFields;
    existingMonthlyPayments = (fields.existingLoanPayments.value as number) || 0;
    if (existingMonthlyPayments > 0) {
      detectedLoans = 1;
    }
  }

  return { existingMonthlyPayments, detectedLoans };
}

function calculateMonthlyPayment(principal: number, termMonths: number, annualRate: number): number {
  // MOCK: Using standard amortization formula
  const monthlyRate = annualRate / 12;
  if (monthlyRate === 0) return principal / termMonths;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);
}

function calculateScore(
  dti: number,
  incomeVerified: boolean,
  monthlyCapacity: number,
  requestedPayment: number
): number {
  // MOCK: Simplified scoring 0-100
  let score = 50;

  if (dti < 0.3) score += 20;
  else if (dti < 0.4) score += 10;
  else if (dti > 0.5) score -= 20;

  if (incomeVerified) score += 15;

  const capacityRatio = monthlyCapacity / requestedPayment;
  if (capacityRatio > 2) score += 15;
  else if (capacityRatio > 1.5) score += 10;
  else if (capacityRatio < 1) score -= 25;

  return Math.max(0, Math.min(100, score));
}

export function assessCreditworthiness(application: LoanApplication): Assessment {
  // MOCK: All scoring logic is simplified for demo
  const income = extractIncomeData(application);
  const obligations = extractObligationData(application);
  const loanDetails = application.loanDetails!;

  const assumedRate = 0.08; // MOCK: 8% annual rate
  const requestedMonthlyPayment = calculateMonthlyPayment(
    loanDetails.amount,
    loanDetails.termMonths,
    assumedRate
  );

  const totalMonthlyObligations = obligations.existingMonthlyPayments + requestedMonthlyPayment;
  const dti = income.monthlyNet > 0 ? totalMonthlyObligations / income.monthlyNet : 1;

  const disposableIncome = income.monthlyNet * 0.4;
  const monthlyCapacity = Math.max(0, disposableIncome - obligations.existingMonthlyPayments);

  const score = calculateScore(dti, income.isVerified, monthlyCapacity, requestedMonthlyPayment);

  const factors: AssessmentFactor[] = [];

  factors.push({
    name: "Μηνιαίο Εισόδημα",
    value: `€${income.monthlyNet.toLocaleString("el-GR")}`,
    impact: income.monthlyNet > 1500 ? "positive" : income.monthlyNet > 800 ? "neutral" : "negative",
    description: income.isVerified
      ? "Επιβεβαιωμένο από φορολογικά έγγραφα"
      : "Δεν επιβεβαιώθηκε πλήρως",
  });

  factors.push({
    name: "Δείκτης Χρέους/Εισοδήματος",
    value: `${(dti * 100).toFixed(1)}%`,
    impact: dti < 0.35 ? "positive" : dti < 0.45 ? "neutral" : "negative",
    description: dti < 0.35
      ? "Υγιής αναλογία χρέους προς εισόδημα"
      : dti < 0.45
        ? "Αποδεκτή αναλογία χρέους"
        : "Υψηλή επιβάρυνση χρέους",
  });

  factors.push({
    name: "Μηνιαία Δόση",
    value: `€${requestedMonthlyPayment.toFixed(2)}`,
    impact: requestedMonthlyPayment < monthlyCapacity ? "positive" : "negative",
    description: `Εκτιμώμενη δόση για ${loanDetails.termMonths} μήνες`,
  });

  if (obligations.existingMonthlyPayments > 0) {
    factors.push({
      name: "Υφιστάμενες Υποχρεώσεις",
      value: `€${obligations.existingMonthlyPayments.toLocaleString("el-GR")}/μήνα`,
      impact: "negative",
      description: "Εντοπίστηκαν υπάρχουσες δανειακές υποχρεώσεις",
    });
  }

  factors.push({
    name: "Ικανότητα Αποπληρωμής",
    value: `€${monthlyCapacity.toFixed(2)}/μήνα`,
    impact: monthlyCapacity > requestedMonthlyPayment * 1.2 ? "positive" : "neutral",
    description: "Διαθέσιμο ποσό για δόσεις (40% εισοδήματος - υποχρεώσεις)",
  });

  let decision: Decision;
  if (score >= 70 && dti < 0.4 && monthlyCapacity >= requestedMonthlyPayment) {
    decision = Decision.APPROVE;
  } else if (score >= 50 && dti < 0.5) {
    decision = Decision.REVIEW;
  } else {
    decision = Decision.DECLINE;
  }

  const suggestedMaxAmount =
    decision === Decision.DECLINE
      ? Math.max(0, monthlyCapacity * loanDetails.termMonths * 0.8)
      : undefined;

  return createAssessment(
    decision,
    score,
    factors,
    dti,
    monthlyCapacity,
    suggestedMaxAmount
  );
}
