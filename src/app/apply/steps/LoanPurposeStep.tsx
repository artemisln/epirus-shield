"use client";

import { OptionCard, OptionCardGrid, Icon } from "@/app/components/ui";
import type { IconName } from "@/app/components/ui";
import { LoanPurpose, LoanPurposeLabels } from "@/domain/loan";

interface LoanPurposeStepProps {
  onSelect: (purpose: LoanPurpose) => void;
}

const PURPOSE_OPTIONS: { purpose: LoanPurpose; icon: IconName }[] = [
  { purpose: LoanPurpose.CONSUMER, icon: "money" },
  { purpose: LoanPurpose.HOME_IMPROVEMENT, icon: "house" },
  { purpose: LoanPurpose.VEHICLE, icon: "car" },
  { purpose: LoanPurpose.DEBT_CONSOLIDATION, icon: "money" },
  { purpose: LoanPurpose.EDUCATION, icon: "bank" },
  { purpose: LoanPurpose.MEDICAL, icon: "shield" },
  { purpose: LoanPurpose.OTHER, icon: "money" },
];

export function LoanPurposeStep({ onSelect }: LoanPurposeStepProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 text-center">
          Για ποιο σκοπό είναι το δάνειο;
        </h1>
        <p className="text-muted mb-8 text-center">
          Επιλέξτε τον σκοπό του δανείου
        </p>

        <OptionCardGrid columns={2}>
          {PURPOSE_OPTIONS.map((option) => (
            <OptionCard
              key={option.purpose}
              label={LoanPurposeLabels[option.purpose]}
              onClick={() => onSelect(option.purpose)}
              icon={<Icon name={option.icon} size={48} />}
            />
          ))}
        </OptionCardGrid>
      </div>
    </div>
  );
}
