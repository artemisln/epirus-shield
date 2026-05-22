"use client";

import { useEffect, useState } from "react";
import { VoiceAssistant } from "@/app/components/voice";

interface ProcessingStage {
  id: string;
  label: string;
  status: "pending" | "active" | "completed" | "error";
}

interface ProcessingStepProps {
  onComplete: () => void;
  onProgress?: (stage: string) => void;
}

const INITIAL_STAGES: ProcessingStage[] = [
  { id: "extract", label: "Ανάγνωση εγγράφων...", status: "pending" },
  { id: "validate", label: "Έλεγχος στοιχείων...", status: "pending" },
  { id: "assess", label: "Αξιολόγηση αίτησης...", status: "pending" },
  { id: "explain", label: "Προετοιμασία απάντησης...", status: "pending" },
];

const VOICE_PROMPT = `Παρακαλώ περιμένετε. Η τεχνητή νοημοσύνη αναλύει τα έγγραφά σας και αξιολογεί την αίτησή σας.`;

export function ProcessingStep({ onComplete, onProgress }: ProcessingStepProps) {
  const [stages, setStages] = useState<ProcessingStage[]>(INITIAL_STAGES);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    const processStages = async () => {
      for (let i = 0; i < INITIAL_STAGES.length; i++) {
        setCurrentStageIndex(i);
        setStages((prev) =>
          prev.map((s, idx) => ({
            ...s,
            status: idx === i ? "active" : idx < i ? "completed" : "pending",
          }))
        );

        onProgress?.(INITIAL_STAGES[i].id);

        const delay = 1500 + Math.random() * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));

        setStages((prev) =>
          prev.map((s, idx) => ({
            ...s,
            status: idx <= i ? "completed" : "pending",
          }))
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
      onComplete();
    };

    processStages();
  }, [onComplete, onProgress]);

  return (
    <div className="flex flex-col items-center justify-center min-h-96 px-4">
      <div className="w-20 h-20 mb-8 relative">
        <div className="absolute inset-0 rounded-full border-4 border-surface-elevated" />
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8 text-primary"
            aria-hidden="true"
          >
            <path d="M12 .75a8.25 8.25 0 00-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 00.577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.714 6.714 0 01-.937-.171.75.75 0 11.374-1.453 5.261 5.261 0 002.626 0 .75.75 0 11.374 1.452 6.712 6.712 0 01-.937.172v4.66c0 .327.277.586.6.545.364-.047.722-.112 1.074-.195a.75.75 0 00.577-.706c.02-.615.448-1.225 1.134-1.623A8.25 8.25 0 0012 .75z" />
            <path
              fillRule="evenodd"
              d="M9.013 19.9a.75.75 0 01.877-.597 11.319 11.319 0 004.22 0 .75.75 0 11.28 1.473 12.819 12.819 0 01-4.78 0 .75.75 0 01-.597-.876zM9.754 22.344a.75.75 0 01.824-.668 13.682 13.682 0 002.844 0 .75.75 0 11.156 1.492 15.156 15.156 0 01-3.156 0 .75.75 0 01-.668-.824z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      <h2 className="text-xl font-bold text-foreground mb-2 text-center">
        Επεξεργασία Αίτησης
      </h2>
      <p className="text-muted text-center mb-8">
        Η τεχνητή νοημοσύνη αναλύει τα έγγραφά σας
      </p>

      <div className="w-full max-w-sm space-y-3">
        {stages.map((stage, index) => (
          <div
            key={stage.id}
            className={`
              flex items-center gap-3 p-3 rounded-lg transition-all duration-300
              ${stage.status === "active" ? "bg-primary/10" : ""}
              ${stage.status === "completed" ? "bg-success/10" : ""}
            `}
          >
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                transition-all duration-300
                ${stage.status === "pending" ? "bg-surface-elevated text-muted" : ""}
                ${stage.status === "active" ? "bg-primary text-primary-foreground" : ""}
                ${stage.status === "completed" ? "bg-success text-white" : ""}
                ${stage.status === "error" ? "bg-secondary text-secondary-foreground" : ""}
              `}
            >
              {stage.status === "completed" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : stage.status === "active" ? (
                <div className="w-3 h-3 rounded-full bg-current animate-pulse" />
              ) : (
                <span className="text-xs font-medium">{index + 1}</span>
              )}
            </div>
            <span
              className={`
                text-sm transition-all duration-300
                ${stage.status === "active" ? "text-primary font-medium" : ""}
                ${stage.status === "completed" ? "text-success" : ""}
                ${stage.status === "pending" ? "text-muted" : ""}
              `}
            >
              {stage.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <VoiceAssistant prompt={VOICE_PROMPT} autoSpeak showMicButton={false} />
      </div>
    </div>
  );
}
