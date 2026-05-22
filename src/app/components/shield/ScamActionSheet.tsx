"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui";

interface ScamActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  callerNumber?: string;
}

export function ScamActionSheet({ isOpen, onClose, callerNumber }: ScamActionSheetProps) {
  const [isReporting, setIsReporting] = useState(false);
  const [reported, setReported] = useState(false);

  if (!isOpen) return null;

  const handleReport = async () => {
    setIsReporting(true);
    try {
      await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportedNumber: callerNumber || "Άγνωστος",
        }),
      });
      setReported(true);
    } catch (error) {
      console.error("Failed to report:", error);
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-foreground/50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-3xl p-6 pb-10 animate-slide-up">
        <div className="w-12 h-1 bg-muted-light rounded-full mx-auto mb-6" />

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8 text-secondary"
            >
              <path
                fillRule="evenodd"
                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            Προσοχή: Πιθανή Απάτη
          </h2>
          <p className="text-muted text-sm">
            Η Epirus Bank δεν σας καλεί αυτή τη στιγμή.
            Μην δίνετε προσωπικά στοιχεία ή κωδικούς.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {!reported ? (
            <Button
              variant="secondary"
              size="lg"
              className="w-full bg-secondary text-secondary-foreground"
              onClick={handleReport}
              isLoading={isReporting}
            >
              Αναφέρετε την κλήση
            </Button>
          ) : (
            <div className="w-full py-4 px-6 bg-success/10 text-success text-center rounded-full font-semibold">
              ✓ Η αναφορά καταχωρήθηκε
            </div>
          )}

          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={onClose}
          >
            Κλείστε αμέσως το τηλέφωνο
          </Button>
        </div>

        <div className="bg-surface-elevated rounded-2xl p-4">
          <h3 className="font-semibold text-foreground mb-2 text-sm">
            Συμβουλές Ασφαλείας
          </h3>
          <ul className="text-sm text-muted space-y-1">
            <li>• Η τράπεζα δεν ζητά ποτέ κωδικούς τηλεφωνικά</li>
            <li>• Μην κάνετε μεταφορές κατά τη διάρκεια κλήσης</li>
            <li>• Σε αμφιβολία, κλείστε και καλέστε εσείς την τράπεζα</li>
          </ul>
        </div>
      </div>
    </>
  );
}
