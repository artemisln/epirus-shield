export enum Decision {
  APPROVE = "APPROVE",
  REVIEW = "REVIEW",
  DECLINE = "DECLINE",
}

export const DecisionLabels: Record<Decision, string> = {
  [Decision.APPROVE]: "Προέγκριση",
  [Decision.REVIEW]: "Απαιτείται Αξιολόγηση",
  [Decision.DECLINE]: "Δεν Πληρούνται οι Προϋποθέσεις",
};

export const DecisionDescriptions: Record<Decision, string> = {
  [Decision.APPROVE]: "Η αίτησή σας πληροί τις προϋποθέσεις για προέγκριση.",
  [Decision.REVIEW]: "Η αίτησή σας χρειάζεται περαιτέρω αξιολόγηση από εξειδικευμένο στέλεχος.",
  [Decision.DECLINE]: "Δυστυχώς, η αίτησή σας δεν πληροί τις ελάχιστες προϋποθέσεις αυτή τη στιγμή.",
};

export interface AssessmentFactor {
  name: string;
  value: string | number;
  impact: "positive" | "negative" | "neutral";
  description: string;
}

export interface Assessment {
  decision: Decision;
  score: number;
  factors: AssessmentFactor[];
  debtToIncomeRatio: number;
  monthlyPaymentCapacity: number;
  suggestedMaxAmount?: number;
  assessedAt: Date;
}

export function createAssessment(
  decision: Decision,
  score: number,
  factors: AssessmentFactor[],
  debtToIncomeRatio: number,
  monthlyPaymentCapacity: number,
  suggestedMaxAmount?: number
): Assessment {
  return {
    decision,
    score,
    factors,
    debtToIncomeRatio,
    monthlyPaymentCapacity,
    suggestedMaxAmount,
    assessedAt: new Date(),
  };
}
