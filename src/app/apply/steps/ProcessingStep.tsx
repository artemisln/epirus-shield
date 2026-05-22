"use client";

import { useEffect, useState } from "react";

interface ProcessingStepProps {
  onComplete: () => void;
}

const STAGES = [
  "Ανάγνωση εγγράφων...",
  "Έλεγχος στοιχείων...",
  "Αξιολόγηση αίτησης...",
  "Προετοιμασία απάντησης...",
];

export function ProcessingStep({ onComplete }: ProcessingStepProps) {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const processStages = async () => {
      for (let i = 0; i < STAGES.length; i++) {
        setStageIndex(i);
        const delay = 1200 + Math.random() * 800;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      await new Promise((resolve) => setTimeout(resolve, 400));
      onComplete();
    };

    processStages();
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-96 text-center">
      <div className="w-16 h-16 mb-8 relative">
        <div className="absolute inset-0 rounded-full border-2 border-muted-light" />
        <div className="absolute inset-0 rounded-full border-2 border-foreground border-t-transparent animate-spin" />
      </div>

      <p className="text-lg text-foreground font-medium">
        {STAGES[stageIndex]}
      </p>
    </div>
  );
}
