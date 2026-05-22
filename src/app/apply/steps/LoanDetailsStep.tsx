"use client";

import { useState } from "react";
import { Button, Input, Select } from "@/app/components/ui";
import { VoiceAssistant } from "@/app/components/voice";
import {
  LoanPurpose,
  LoanPurposeLabels,
  LoanDetails,
  LOAN_AMOUNT_MIN,
  LOAN_AMOUNT_MAX,
  LOAN_TERM_MIN,
  LOAN_TERM_MAX,
} from "@/domain/loan";

interface LoanDetailsStepProps {
  initialData?: Partial<LoanDetails>;
  onNext: (data: LoanDetails) => void;
  onBack: () => void;
}

const VOICE_PROMPT = `Επιλέξτε το ποσό του δανείου που επιθυμείτε, τη διάρκεια αποπληρωμής σε μήνες, και τον σκοπό του δανείου. 
Όταν είστε έτοιμοι, πατήστε Συνέχεια.`;

const purposeOptions = Object.entries(LoanPurposeLabels).map(([value, label]) => ({
  value,
  label,
}));

const termOptions = [
  { value: "12", label: "12 μήνες (1 έτος)" },
  { value: "24", label: "24 μήνες (2 έτη)" },
  { value: "36", label: "36 μήνες (3 έτη)" },
  { value: "48", label: "48 μήνες (4 έτη)" },
  { value: "60", label: "60 μήνες (5 έτη)" },
  { value: "72", label: "72 μήνες (6 έτη)" },
  { value: "84", label: "84 μήνες (7 έτη)" },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("el-GR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function calculateMonthlyPayment(amount: number, termMonths: number, rate: number = 0.08): number {
  const monthlyRate = rate / 12;
  if (monthlyRate === 0) return amount / termMonths;
  return (amount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);
}

export function LoanDetailsStep({ initialData, onNext, onBack }: LoanDetailsStepProps) {
  const [amount, setAmount] = useState(initialData?.amount || 10000);
  const [termMonths, setTermMonths] = useState(initialData?.termMonths || 36);
  const [purpose, setPurpose] = useState<LoanPurpose>(
    initialData?.purpose || LoanPurpose.CONSUMER
  );

  const monthlyPayment = calculateMonthlyPayment(amount, termMonths);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ amount, termMonths, purpose });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Στοιχεία Δανείου</h2>
            <p className="text-sm text-muted mt-1">
              Επιλέξτε το ποσό και τη διάρκεια που επιθυμείτε
            </p>
          </div>
          <VoiceAssistant prompt={VOICE_PROMPT} showMicButton={false} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Ποσό Δανείου
            </label>
            <div className="bg-surface-elevated rounded-xl p-4">
              <div className="text-3xl font-bold text-primary text-center mb-4">
                {formatCurrency(amount)}
              </div>
              <input
                type="range"
                min={LOAN_AMOUNT_MIN}
                max={LOAN_AMOUNT_MAX}
                step={500}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                aria-label="Ποσό δανείου"
              />
              <div className="flex justify-between text-xs text-muted mt-2">
                <span>{formatCurrency(LOAN_AMOUNT_MIN)}</span>
                <span>{formatCurrency(LOAN_AMOUNT_MAX)}</span>
              </div>
            </div>
          </div>

          <Select
            label="Διάρκεια Αποπληρωμής"
            options={termOptions}
            value={String(termMonths)}
            onChange={(e) => setTermMonths(Number(e.target.value))}
          />

          <Select
            label="Σκοπός Δανείου"
            options={purposeOptions}
            value={purpose}
            onChange={(e) => setPurpose(e.target.value as LoanPurpose)}
          />

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted">Εκτιμώμενη Μηνιαία Δόση</p>
                <p className="text-xs text-muted mt-1">
                  (Ενδεικτικό επιτόκιο 8%)
                </p>
              </div>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(monthlyPayment)}
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="sticky bottom-0 bg-background border-t border-border p-4 mt-6">
        <div className="max-w-2xl mx-auto flex justify-between">
          <Button variant="ghost" onClick={onBack}>
            Πίσω
          </Button>
          <Button onClick={() => onNext({ amount, termMonths, purpose })} size="lg">
            Συνέχεια
          </Button>
        </div>
      </div>
    </div>
  );
}
