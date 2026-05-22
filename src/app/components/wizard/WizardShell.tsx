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
  primaryAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function WizardShell({
  totalSteps,
  currentStep,
  children,
  showProgress = true,
  onBack,
  showBackButton = true,
  primaryAction,
  secondaryAction,
}: WizardShellProps) {
  const canGoBack = currentStep > 0 && showBackButton;
  const hasFooter = showProgress || primaryAction || secondaryAction;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center justify-between">
          {canGoBack ? (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-muted transition-colors cursor-pointer"
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

      {hasFooter && (
        <footer className="sticky bottom-0 bg-background border-t border-border safe-area-bottom">
          <div className="max-w-lg mx-auto px-6 py-4 space-y-4">
            {showProgress && (
              <SegmentedProgress
                totalSteps={totalSteps}
                currentStep={currentStep}
              />
            )}
            {(primaryAction || secondaryAction) && (
              <div className="flex gap-3">
                {secondaryAction && (
                  <button
                    type="button"
                    onClick={secondaryAction.onClick}
                    className="flex-1 py-4 px-6 text-base font-semibold text-foreground bg-surface border-2 border-border rounded-full hover:bg-surface-elevated transition-colors cursor-pointer"
                  >
                    {secondaryAction.label}
                  </button>
                )}
                {primaryAction && (
                  <button
                    type="button"
                    onClick={primaryAction.onClick}
                    disabled={primaryAction.disabled || primaryAction.loading}
                    className={`
                      flex-1 py-4 px-6 text-base font-semibold rounded-full transition-colors cursor-pointer
                      flex items-center justify-center
                      ${primaryAction.disabled
                        ? "bg-muted-light text-muted cursor-not-allowed"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                      }
                    `}
                  >
                    {primaryAction.loading ? (
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    ) : (
                      primaryAction.label
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}
