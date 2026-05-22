"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui";
import { LOAN_AMOUNT_MIN, LOAN_AMOUNT_MAX } from "@/domain/loan";

interface LoanAmountStepProps {
  initialAmount?: number;
  onNext: (amount: number) => void;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("el-GR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function LoanAmountStep({ initialAmount, onNext }: LoanAmountStepProps) {
  const [amount, setAmount] = useState(initialAmount || 10000);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
          Πόσα χρήματα χρειάζεστε;
        </h1>
        <p className="text-muted mb-12">
          Σύρετε για να επιλέξετε το ποσό
        </p>

        <div className="w-full max-w-sm">
          <div className="text-5xl sm:text-6xl font-bold text-foreground mb-8">
            {formatCurrency(amount)}
          </div>

          <input
            type="range"
            min={LOAN_AMOUNT_MIN}
            max={LOAN_AMOUNT_MAX}
            step={500}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full"
            aria-label="Ποσό δανείου"
          />

          <div className="flex justify-between text-sm text-muted mt-4">
            <span>{formatCurrency(LOAN_AMOUNT_MIN)}</span>
            <span>{formatCurrency(LOAN_AMOUNT_MAX)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={() => onNext(amount)} size="lg">
          Συνέχεια
        </Button>
      </div>
    </div>
  );
}
