"use client";

import { Button } from "@/app/components/ui";
import { VoiceAssistant } from "@/app/components/voice";

interface WelcomeStepProps {
  onNext: () => void;
}

const VOICE_PROMPT = `Καλώς ήρθατε στην υπηρεσία Δάνειο σε 5 Λεπτά της Epirus Bank. 
Με τη βοήθεια τεχνητής νοημοσύνης, θα αξιολογήσουμε την αίτησή σας γρήγορα και θα σας δώσουμε μια προκαταρκτική απάντηση. 
Πατήστε Ξεκινήστε για να συνεχίσετε.`;

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-10 h-10 text-primary"
            aria-hidden="true"
          >
            <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
            <path
              fillRule="evenodd"
              d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z"
              clipRule="evenodd"
            />
            <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-3">
          Καλώς ήρθατε
        </h1>

        <p className="text-muted max-w-md mb-6">
          Με τη βοήθεια τεχνητής νοημοσύνης, θα αξιολογήσουμε την αίτησή σας
          γρήγορα και θα σας δώσουμε μια προκαταρκτική απάντηση σε λίγα λεπτά.
        </p>

        <div className="bg-surface-elevated rounded-xl p-4 max-w-md w-full mb-6">
          <h2 className="font-medium text-foreground mb-3">Τι θα χρειαστείτε:</h2>
          <ul className="text-sm text-muted space-y-2 text-left">
            <li className="flex items-start gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5 text-success flex-shrink-0 mt-0.5"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Ε1 - Δήλωση Φορολογίας Εισοδήματος</span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5 text-success flex-shrink-0 mt-0.5"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Εκκαθαριστικό Σημείωμα</span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5 text-muted flex-shrink-0 mt-0.5"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Βεβαίωση Αποδοχών (προαιρετικά)</span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5 text-muted flex-shrink-0 mt-0.5"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Κίνηση Τραπεζικού Λογαριασμού (προαιρετικά)</span>
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted">
          <VoiceAssistant prompt={VOICE_PROMPT} autoSpeak showMicButton={false} />
          <span>Ακούστε τις οδηγίες</span>
        </div>
      </div>

      <div className="sticky bottom-0 bg-background border-t border-border p-4">
        <div className="max-w-2xl mx-auto flex justify-end">
          <Button onClick={onNext} size="lg">
            Ξεκινήστε
          </Button>
        </div>
      </div>
    </div>
  );
}
