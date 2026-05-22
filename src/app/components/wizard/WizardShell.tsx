"use client";

import { ReactNode } from "react";
import { ProgressBar } from "@/app/components/ui";
import { VoiceAssistant } from "@/app/components/voice";

interface WizardStep {
  id: string;
  title: string;
}

interface WizardShellProps {
  steps: WizardStep[];
  currentStep: number;
  children: ReactNode;
  voicePrompt?: string;
  showVoice?: boolean;
}

export function WizardShell({
  steps,
  currentStep,
  children,
  voicePrompt,
  showVoice = true,
}: WizardShellProps) {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-primary text-primary-foreground shadow-md">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8"
                aria-hidden="true"
              >
                <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
                <path
                  fillRule="evenodd"
                  d="M20.25 10.332v9.918H21a.75.75 0 010 1.5H3a.75.75 0 010-1.5h.75v-9.918a.75.75 0 01.634-.74A49.109 49.109 0 0112 9c2.59 0 5.134.202 7.616.592a.75.75 0 01.634.74zm-7.5 2.418a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75zm3-.75a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0v-6.75a.75.75 0 01.75-.75zM9 12.75a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h1 className="text-lg font-bold">Epirus Bank</h1>
                <p className="text-xs opacity-80">Δάνειο σε 5 Λεπτά</p>
              </div>
            </div>
            {showVoice && (
              <VoiceAssistant
                prompt={voicePrompt}
                autoSpeak={false}
                showMicButton={false}
              />
            )}
          </div>
          <ProgressBar progress={progress} size="sm" />
        </div>
      </header>

      <nav className="bg-surface border-b border-border" aria-label="Βήματα αίτησης">
        <div className="max-w-2xl mx-auto px-4">
          <ol className="flex overflow-x-auto py-2 gap-1 text-xs">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <li
                  key={step.id}
                  className={`
                    flex items-center gap-1 px-2 py-1 rounded whitespace-nowrap
                    ${isActive ? "bg-primary/10 text-primary font-medium" : ""}
                    ${isCompleted ? "text-success" : ""}
                    ${!isActive && !isCompleted ? "text-muted" : ""}
                  `}
                  aria-current={isActive ? "step" : undefined}
                >
                  <span
                    className={`
                      flex items-center justify-center w-5 h-5 rounded-full text-xs
                      ${isActive ? "bg-primary text-primary-foreground" : ""}
                      ${isCompleted ? "bg-success text-white" : ""}
                      ${!isActive && !isCompleted ? "bg-surface-elevated" : ""}
                    `}
                  >
                    {isCompleted ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-3 h-3"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span className="hidden sm:inline">{step.title}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </nav>

      <main className="flex-1 flex flex-col">
        <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">{children}</div>
      </main>

      <footer className="bg-surface border-t border-border py-3 text-center text-xs text-muted">
        <p>&copy; 2024 Epirus Bank. Με επιφύλαξη παντός δικαιώματος.</p>
      </footer>
    </div>
  );
}
