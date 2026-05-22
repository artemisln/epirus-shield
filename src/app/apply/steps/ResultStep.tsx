"use client";

import { ReactNode } from "react";
import { Button } from "@/app/components/ui";
import {
  Assessment,
  Decision,
  DecisionLabels,
  AssessmentFactor,
} from "@/domain/loan";

interface ResultStepProps {
  assessment: Assessment;
  explanation: string;
  onClose: () => void;
  onContact: () => void;
}

const DECISION_CONFIG: Record<Decision, { bgClass: string; iconClass: string; icon: ReactNode }> = {
  [Decision.APPROVE]: {
    bgClass: "bg-success/10",
    iconClass: "text-success",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
      </svg>
    ),
  },
  [Decision.REVIEW]: {
    bgClass: "bg-warning/10",
    iconClass: "text-warning",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
      </svg>
    ),
  },
  [Decision.DECLINE]: {
    bgClass: "bg-error/10",
    iconClass: "text-error",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
      </svg>
    ),
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

export function ResultStep({ assessment, onClose, onContact }: ResultStepProps) {
  const config = DECISION_CONFIG[assessment.decision];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <div className={`rounded-2xl p-6 mb-6 ${config.bgClass}`}>
          <div className="flex items-center gap-4">
            <div className={config.iconClass}>
              {config.icon}
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {DecisionLabels[assessment.decision]}
              </h1>
              <p className="text-sm text-muted mt-1">
                {getShortExplanation(assessment.decision)}
              </p>
            </div>
          </div>
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

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onClose}>
          Κλείσιμο
        </Button>
        <Button onClick={onContact} size="lg">
          Επικοινωνία
        </Button>
      </div>
    </div>
  );
}
