"use client";

import { OptionCard, OptionCardGrid } from "@/app/components/ui";

interface LoanTermStepProps {
  initialTerm?: number;
  amount: number;
  onSelect: (termMonths: number) => void;
}

const TERM_OPTIONS = [
  { months: 12, label: "12 μήνες", sublabel: "1 έτος" },
  { months: 24, label: "24 μήνες", sublabel: "2 έτη" },
  { months: 36, label: "36 μήνες", sublabel: "3 έτη" },
  { months: 48, label: "48 μήνες", sublabel: "4 έτη" },
  { months: 60, label: "60 μήνες", sublabel: "5 έτη" },
];

function calculateMonthlyPayment(amount: number, termMonths: number, rate: number = 0.08): number {
  const monthlyRate = rate / 12;
  if (monthlyRate === 0) return amount / termMonths;
  return (amount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("el-GR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function LoanTermStep({ amount, onSelect }: LoanTermStepProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 text-center">
          Σε πόσο καιρό θέλετε να αποπληρώσετε;
        </h1>
        <p className="text-muted mb-8 text-center">
          Επιλέξτε τη διάρκεια αποπληρωμής
        </p>

        <OptionCardGrid columns={2}>
          {TERM_OPTIONS.map((option) => {
            const monthlyPayment = calculateMonthlyPayment(amount, option.months);
            return (
              <OptionCard
                key={option.months}
                label={option.label}
                sublabel={`~${formatCurrency(monthlyPayment)}/μήνα`}
                onClick={() => onSelect(option.months)}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
              />
            );
          })}
        </OptionCardGrid>
      </div>
    </div>
  );
}
