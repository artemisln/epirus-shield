"use client";

import { useState, useCallback } from "react";
import { WizardShell } from "@/app/components/wizard";
import { StepTransition } from "@/app/components/wizard";
import {
  WelcomeStep,
  LoanDetailsStep,
  DocumentUploadStep,
  ProcessingStep,
  ResultStep,
} from "./steps";
import {
  LoanApplication,
  LoanDetails,
  Assessment,
  createLoanApplication,
  updateLoanApplication,
  ApplicationStatus,
  Decision,
} from "@/domain/loan";
import { ExtractedDocument, DocumentType } from "@/domain/documents";
import { getFullSampleDocuments, sampleExplanationApprove } from "@/infrastructure/sample-data";

const WIZARD_STEPS = [
  { id: "welcome", title: "Καλωσόρισμα" },
  { id: "details", title: "Στοιχεία" },
  { id: "documents", title: "Έγγραφα" },
  { id: "processing", title: "Επεξεργασία" },
  { id: "result", title: "Αποτέλεσμα" },
];

const VOICE_PROMPTS: Record<string, string> = {
  welcome: "Καλώς ήρθατε στην υπηρεσία Δάνειο σε 5 Λεπτά.",
  details: "Επιλέξτε το ποσό και τη διάρκεια του δανείου.",
  documents: "Ανεβάστε τα απαραίτητα έγγραφα.",
  processing: "Επεξεργαζόμαστε την αίτησή σας.",
  result: "Η αξιολόγηση ολοκληρώθηκε.",
};

interface UploadedFile {
  file: File;
  type: DocumentType;
  preview?: string;
}

export default function ApplyPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [application, setApplication] = useState<LoanApplication>(createLoanApplication());
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [explanation, setExplanation] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const currentStepId = WIZARD_STEPS[currentStep].id;

  const handleNext = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, WIZARD_STEPS.length - 1));
  }, []);

  const handleBack = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  }, []);

  const handleLoanDetails = useCallback((details: LoanDetails) => {
    setApplication((app) => updateLoanApplication(app, { loanDetails: details }));
    handleNext();
  }, [handleNext]);

  const handleDocumentsSubmit = useCallback(async (files: UploadedFile[]) => {
    setUploadedFiles(files);
    setApplication((app) =>
      updateLoanApplication(app, { status: ApplicationStatus.DOCUMENTS_UPLOADED })
    );
    handleNext();
  }, [handleNext]);

  const handleUseSampleData = useCallback(() => {
    const sampleDocs = getFullSampleDocuments();
    setApplication((app) =>
      updateLoanApplication(app, {
        documents: sampleDocs,
        status: ApplicationStatus.DOCUMENTS_UPLOADED,
      })
    );
    handleNext();
  }, [handleNext]);

  const handleProcessingComplete = useCallback(async () => {
    try {
      let documentsToProcess = application.documents;

      if (documentsToProcess.length === 0 && uploadedFiles.length > 0) {
        const extractedDocs: ExtractedDocument[] = [];

        for (const uploadedFile of uploadedFiles) {
          const formData = new FormData();
          formData.append("file", uploadedFile.file);
          formData.append("type", uploadedFile.type);

          try {
            const response = await fetch("/api/extract", {
              method: "POST",
              body: formData,
            });

            if (response.ok) {
              const data = await response.json();
              if (data.document) {
                extractedDocs.push(data.document);
              }
            }
          } catch {
            console.error("Extraction failed for", uploadedFile.file.name);
          }
        }

        if (extractedDocs.length === 0) {
          documentsToProcess = getFullSampleDocuments();
        } else {
          documentsToProcess = extractedDocs;
        }
      }

      if (documentsToProcess.length === 0) {
        documentsToProcess = getFullSampleDocuments();
      }

      setApplication((app) =>
        updateLoanApplication(app, {
          documents: documentsToProcess,
          status: ApplicationStatus.PROCESSING,
        })
      );

      const assessResponse = await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documents: documentsToProcess,
          loanDetails: application.loanDetails,
        }),
      });

      let assessmentResult: Assessment;
      if (assessResponse.ok) {
        const data = await assessResponse.json();
        assessmentResult = data.assessment;
      } else {
        assessmentResult = createMockAssessment();
      }

      setAssessment(assessmentResult);

      const explainResponse = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessment: assessmentResult,
          loanDetails: application.loanDetails,
        }),
      });

      let explanationText: string;
      if (explainResponse.ok) {
        const data = await explainResponse.json();
        explanationText = data.explanation;
      } else {
        explanationText = sampleExplanationApprove;
      }

      setExplanation(explanationText);

      setApplication((app) =>
        updateLoanApplication(app, {
          assessment: assessmentResult,
          explanation: explanationText,
          status: ApplicationStatus.ASSESSED,
        })
      );

      handleNext();
    } catch (error) {
      console.error("Processing error:", error);
      const mockAssessment = createMockAssessment();
      setAssessment(mockAssessment);
      setExplanation(sampleExplanationApprove);
      handleNext();
    }
  }, [application, uploadedFiles, handleNext]);

  const handleClose = useCallback(() => {
    setCurrentStep(0);
    setApplication(createLoanApplication());
    setAssessment(null);
    setExplanation("");
    setUploadedFiles([]);
  }, []);

  const handleContact = useCallback(() => {
    alert("Ένας σύμβουλος θα επικοινωνήσει μαζί σας σύντομα.");
  }, []);

  return (
    <WizardShell
      steps={WIZARD_STEPS}
      currentStep={currentStep}
      voicePrompt={VOICE_PROMPTS[currentStepId]}
    >
      <StepTransition stepKey={currentStep}>
        {currentStepId === "welcome" && <WelcomeStep onNext={handleNext} />}

        {currentStepId === "details" && (
          <LoanDetailsStep
            initialData={application.loanDetails || undefined}
            onNext={handleLoanDetails}
            onBack={handleBack}
          />
        )}

        {currentStepId === "documents" && (
          <DocumentUploadStep
            onNext={handleDocumentsSubmit}
            onBack={handleBack}
            onUseSampleData={handleUseSampleData}
          />
        )}

        {currentStepId === "processing" && (
          <ProcessingStep onComplete={handleProcessingComplete} />
        )}

        {currentStepId === "result" && assessment && (
          <ResultStep
            assessment={assessment}
            explanation={explanation}
            onClose={handleClose}
            onContact={handleContact}
          />
        )}
      </StepTransition>
    </WizardShell>
  );
}

function createMockAssessment(): Assessment {
  return {
    decision: Decision.APPROVE,
    score: 75,
    factors: [
      {
        name: "Μηνιαίο Εισόδημα",
        value: "€1.650",
        impact: "positive",
        description: "Επιβεβαιωμένο από φορολογικά έγγραφα",
      },
      {
        name: "Δείκτης Χρέους/Εισοδήματος",
        value: "28.5%",
        impact: "positive",
        description: "Υγιής αναλογία χρέους προς εισόδημα",
      },
      {
        name: "Μηνιαία Δόση",
        value: "€312.50",
        impact: "positive",
        description: "Εκτιμώμενη δόση για 36 μήνες",
      },
    ],
    debtToIncomeRatio: 0.285,
    monthlyPaymentCapacity: 480,
    assessedAt: new Date(),
  };
}
