"use client";

import { useState, useCallback } from "react";
import { WizardShell } from "@/app/components/wizard";
import { StepTransition } from "@/app/components/wizard";
import {
  WelcomeStep,
  LoanAmountStep,
  LoanTermStep,
  LoanPurposeStep,
  DocumentUploadStep,
  ProcessingStep,
  ResultStep,
} from "./steps";
import {
  LoanApplication,
  LoanDetails,
  LoanPurpose,
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
  { id: "amount", title: "Ποσό" },
  { id: "term", title: "Διάρκεια" },
  { id: "purpose", title: "Σκοπός" },
  { id: "documents", title: "Έγγραφα" },
  { id: "processing", title: "Επεξεργασία" },
  { id: "result", title: "Αποτέλεσμα" },
];

const USER_DECISION_STEPS = 5;

interface UploadedFile {
  file: File;
  type: DocumentType;
  preview?: string;
}

export default function ApplyPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [application, setApplication] = useState<LoanApplication>(createLoanApplication());
  const [loanAmount, setLoanAmount] = useState(10000);
  const [loanTerm, setLoanTerm] = useState(36);
  const [loanPurpose, setLoanPurpose] = useState<LoanPurpose>(LoanPurpose.CONSUMER);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [explanation, setExplanation] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [hasRequiredDocs, setHasRequiredDocs] = useState(false);

  const currentStepId = WIZARD_STEPS[currentStep].id;
  const showProgress = currentStep < USER_DECISION_STEPS;

  const handleNext = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, WIZARD_STEPS.length - 1));
  }, []);

  const handleBack = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  }, []);

  const handleAmountChange = useCallback((amount: number) => {
    setLoanAmount(amount);
  }, []);

  const handleTermSelect = useCallback((term: number) => {
    setLoanTerm(term);
    handleNext();
  }, [handleNext]);

  const handlePurposeSelect = useCallback((purpose: LoanPurpose) => {
    setLoanPurpose(purpose);
    const details: LoanDetails = {
      amount: loanAmount,
      termMonths: loanTerm,
      purpose,
    };
    setApplication((app) => updateLoanApplication(app, { loanDetails: details }));
    handleNext();
  }, [handleNext, loanAmount, loanTerm]);

  const handleFilesChange = useCallback((files: UploadedFile[], hasRequired: boolean) => {
    setUploadedFiles(files);
    setHasRequiredDocs(hasRequired);
  }, []);

  const handleDocumentsSubmit = useCallback(async () => {
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
    setLoanAmount(10000);
    setLoanTerm(36);
    setLoanPurpose(LoanPurpose.CONSUMER);
    setAssessment(null);
    setExplanation("");
    setUploadedFiles([]);
    setHasRequiredDocs(false);
  }, []);

  const handleContact = useCallback(() => {
    alert("Ένας σύμβουλος θα επικοινωνήσει μαζί σας σύντομα.");
  }, []);

  const getPrimaryAction = () => {
    switch (currentStepId) {
      case "welcome":
        return { label: "Ξεκινήστε", onClick: handleNext };
      case "amount":
        return { label: "Συνέχεια", onClick: handleNext };
      case "term":
      case "purpose":
        return undefined;
      case "documents":
        return { label: "Υποβολή", onClick: handleDocumentsSubmit, disabled: !hasRequiredDocs };
      case "processing":
        return undefined;
      case "result":
        return { label: "Επικοινωνία", onClick: handleContact };
      default:
        return undefined;
    }
  };

  const getSecondaryAction = () => {
    if (currentStepId === "result") {
      return { label: "Κλείσιμο", onClick: handleClose };
    }
    return undefined;
  };

  return (
    <WizardShell
      totalSteps={USER_DECISION_STEPS}
      currentStep={Math.min(currentStep, USER_DECISION_STEPS - 1)}
      showProgress={showProgress}
      onBack={handleBack}
      showBackButton={currentStep > 0 && currentStep < WIZARD_STEPS.length - 2}
      primaryAction={getPrimaryAction()}
      secondaryAction={getSecondaryAction()}
    >
      <StepTransition stepKey={currentStep}>
        {currentStepId === "welcome" && <WelcomeStep onNext={handleNext} />}

        {currentStepId === "amount" && (
          <LoanAmountStep
            initialAmount={loanAmount}
            onAmountChange={handleAmountChange}
          />
        )}

        {currentStepId === "term" && (
          <LoanTermStep
            initialTerm={loanTerm}
            amount={loanAmount}
            onSelect={handleTermSelect}
          />
        )}

        {currentStepId === "purpose" && (
          <LoanPurposeStep onSelect={handlePurposeSelect} />
        )}

        {currentStepId === "documents" && (
          <DocumentUploadStep
            onFilesChange={handleFilesChange}
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
        name: "Εισόδημα",
        value: "Επαρκές",
        impact: "positive",
        description: "Επιβεβαιωμένο από φορολογικά έγγραφα",
      },
      {
        name: "Δείκτης χρέους",
        value: "28%",
        impact: "positive",
        description: "Υγιής αναλογία",
      },
      {
        name: "Μηνιαία δόση",
        value: "€312",
        impact: "positive",
        description: "Εντός δυνατοτήτων",
      },
    ],
    debtToIncomeRatio: 0.285,
    monthlyPaymentCapacity: 480,
    assessedAt: new Date(),
  };
}
