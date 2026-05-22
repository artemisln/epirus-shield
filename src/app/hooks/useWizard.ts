"use client";

import { useState, useCallback } from "react";

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
}

interface UseWizardOptions<T> {
  steps: WizardStep[];
  initialData: T;
  onComplete?: (data: T) => void;
}

interface UseWizardReturn<T> {
  currentStep: number;
  currentStepData: WizardStep;
  isFirstStep: boolean;
  isLastStep: boolean;
  progress: number;
  data: T;
  goToNext: () => void;
  goToPrevious: () => void;
  goToStep: (step: number) => void;
  updateData: (updates: Partial<T>) => void;
  reset: () => void;
}

export function useWizard<T extends object>(options: UseWizardOptions<T>): UseWizardReturn<T> {
  const { steps, initialData, onComplete } = options;

  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<T>(initialData);

  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const goToNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      onComplete?.(data);
    }
  }, [currentStep, steps.length, data, onComplete]);

  const goToPrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 0 && step < steps.length) {
        setCurrentStep(step);
      }
    },
    [steps.length]
  );

  const updateData = useCallback((updates: Partial<T>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setData(initialData);
  }, [initialData]);

  return {
    currentStep,
    currentStepData,
    isFirstStep,
    isLastStep,
    progress,
    data,
    goToNext,
    goToPrevious,
    goToStep,
    updateData,
    reset,
  };
}
