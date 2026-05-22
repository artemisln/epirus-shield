"use client";

import { ReactNode } from "react";
import { SegmentedProgress } from "@/app/components/ui";

interface WizardShellProps {
  totalSteps: number;
  currentStep: number;
  children: ReactNode;
  showProgress?: boolean;
  onBack?: () => void;
  showBackButton?: boolean;
  footer?: ReactNode;
}

export function WizardShell({
  totalSteps,
  currentStep,
  children,
  showProgress = true,
  onBack,
  showBackButton = true,
  footer,
}: WizardShellProps) {
  const canGoBack = currentStep > 0 && showBackButton;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center justify-between">
          {canGoBack ? (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-muted transition-colors"
              aria-label="Πίσω"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="hidden sm:inline">Πίσω</span>
            </button>
          ) : (
            <div className="w-16" />
          )}

          <span className="text-sm font-medium text-muted">
            Epirus Bank
          </span>

          <div className="w-16" />
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <div className="flex-1 max-w-lg mx-auto w-full px-6 py-8 sm:py-12">
          {children}
        </div>
      </main>

      {(showProgress || footer) && (
        <footer className="sticky bottom-0 bg-background border-t border-border">
          <div className="max-w-lg mx-auto px-6 py-4 space-y-4">
            {showProgress && (
              <SegmentedProgress
                totalSteps={totalSteps}
                currentStep={currentStep}
              />
            )}
            {footer && (
              <div className="flex items-center justify-between">
                {footer}
              </div>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}
