"use client";

import { Icon } from "@/app/components/ui";
import type { IconName } from "@/app/components/ui";
import {
  Assessment,
  Decision,
  DecisionLabels,
  AssessmentFactor,
} from "@/domain/loan";

interface ResultStepProps {
  assessment: Assessment;
  explanation: string;
}

const DECISION_CONFIG: Record<Decision, { bgClass: string; textClass: string; icon: IconName }> = {
  [Decision.APPROVE]: {
    bgClass: "bg-success/10",
    textClass: "text-success",
    icon: "approved",
  },
  [Decision.REVIEW]: {
    bgClass: "bg-warning/10",
    textClass: "text-warning",
    icon: "shield",
  },
  [Decision.DECLINE]: {
    bgClass: "bg-error/10",
    textClass: "text-error",
    icon: "shield",
  },
};

function getFactorIcon(impact: AssessmentFactor["impact"]) {
  if (impact === "positive") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-success">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
      </svg>
    );
  }
  if (impact === "negative") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-error">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-warning">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
    </svg>
  );
}

function getShortExplanation(decision: Decision): string {
  switch (decision) {
    case Decision.APPROVE:
      return "Η αίτησή σας πληροί τις προϋποθέσεις για προέγκριση.";
    case Decision.REVIEW:
      return "Χρειάζεται επιπλέον αξιολόγηση από εξειδικευμένο στέλεχος.";
    case Decision.DECLINE:
      return "Η αίτηση δεν πληροί τις ελάχιστες προϋποθέσεις αυτή τη στιγμή.";
  }
}

export function ResultStep({ assessment }: ResultStepProps) {
  const config = DECISION_CONFIG[assessment.decision];

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-center mb-4">
        <Icon name={config.icon} size={120} />
      </div>

      <div className={`rounded-2xl p-6 mb-6 ${config.bgClass}`}>
        <h1 className={`text-2xl font-bold text-center ${config.textClass}`}>
          {DecisionLabels[assessment.decision]}
        </h1>
        <p className="text-sm text-muted mt-2 text-center">
          {getShortExplanation(assessment.decision)}
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {assessment.factors.map((factor, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 rounded-xl border border-border"
          >
            {getFactorIcon(factor.impact)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{factor.name}</p>
            </div>
            <p className="text-sm font-medium text-foreground">{factor.value}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted text-center">
        Η τελική απόφαση λαμβάνεται από εξουσιοδοτημένο στέλεχος.
      </p>
    </div>
  );
}
