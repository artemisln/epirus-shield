"use client";

import { Icon } from "@/app/components/ui";

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext: _onNext }: WelcomeStepProps) {
  return (
    <div className="flex flex-col h-full items-center justify-center text-center">
      <div className="mb-8">
        <Icon name="bank" size={160} />
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
        Ας ξεκινήσουμε την αίτησή σας
      </h1>

      <p className="text-muted max-w-sm">
        Απάντηση σε λίγα λεπτά με τη βοήθεια τεχνητής νοημοσύνης
      </p>
    </div>
  );
}
