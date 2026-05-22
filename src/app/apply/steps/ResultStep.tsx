"use client";

import { Button, Card, CardContent } from "@/app/components/ui";
import { VoiceAssistant } from "@/app/components/voice";
import {
  Assessment,
  Decision,
  DecisionLabels,
  DecisionDescriptions,
  AssessmentFactor,
} from "@/domain/loan";

interface ResultStepProps {
  assessment: Assessment;
  explanation: string;
  onClose: () => void;
  onContact: () => void;
}

const DECISION_COLORS: Record<Decision, { bg: string; text: string; icon: string }> = {
  [Decision.APPROVE]: { bg: "bg-success/10", text: "text-success", icon: "text-success" },
  [Decision.REVIEW]: { bg: "bg-warning/10", text: "text-warning", icon: "text-warning" },
  [Decision.DECLINE]: { bg: "bg-secondary/10", text: "text-secondary", icon: "text-secondary" },
};

export function ResultStep({ assessment, explanation, onClose, onContact }: ResultStepProps) {
  const colors = DECISION_COLORS[assessment.decision];

  const voicePrompt = `${DecisionLabels[assessment.decision]}. ${explanation}`;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Αποτέλεσμα Αξιολόγησης</h2>
            <p className="text-sm text-muted mt-1">Προκαταρκτική απόφαση</p>
          </div>
          <VoiceAssistant prompt={voicePrompt} autoSpeak showMicButton={false} />
        </div>

        <Card className={`${colors.bg} border-0 mb-6`}>
          <CardContent className="p-0">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full ${colors.bg} flex items-center justify-center`}>
                <DecisionIcon decision={assessment.decision} className={`w-8 h-8 ${colors.icon}`} />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${colors.text}`}>
                  {DecisionLabels[assessment.decision]}
                </h3>
                <p className="text-sm text-muted">{DecisionDescriptions[assessment.decision]}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-0">
            <h4 className="font-medium text-foreground mb-3">Ανάλυση</h4>
            <p className="text-sm text-muted whitespace-pre-line">{explanation}</p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-0">
            <h4 className="font-medium text-foreground mb-4">Παράγοντες Αξιολόγησης</h4>
            <div className="space-y-3">
              {assessment.factors.map((factor, index) => (
                <FactorRow key={index} factor={factor} />
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="bg-surface-elevated rounded-xl p-4 text-center">
          <p className="text-xs text-muted">
            Η τελική απόφαση λαμβάνεται από εξουσιοδοτημένο στέλεχος της τράπεζας.
            Αυτή είναι μια προκαταρκτική αξιολόγηση βασισμένη στα στοιχεία που υποβάλατε.
          </p>
        </div>
      </div>

      <div className="sticky bottom-0 bg-background border-t border-border p-4 mt-6">
        <div className="max-w-2xl mx-auto flex justify-between">
          <Button variant="ghost" onClick={onClose}>
            Κλείσιμο
          </Button>
          <Button onClick={onContact} size="lg">
            Επικοινωνία
          </Button>
        </div>
      </div>
    </div>
  );
}

function DecisionIcon({ decision, className }: { decision: Decision; className?: string }) {
  switch (decision) {
    case Decision.APPROVE:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
        </svg>
      );
    case Decision.REVIEW:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
        </svg>
      );
    case Decision.DECLINE:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
        </svg>
      );
  }
}

function FactorRow({ factor }: { factor: AssessmentFactor }) {
  const impactColors = {
    positive: "text-success",
    negative: "text-secondary",
    neutral: "text-muted",
  };

  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-border last:border-0">
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{factor.name}</p>
        <p className="text-xs text-muted">{factor.description}</p>
      </div>
      <div className={`text-sm font-medium ${impactColors[factor.impact]}`}>
        {factor.value}
      </div>
    </div>
  );
}
