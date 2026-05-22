"use client";

import { useState, useRef } from "react";
import { Button, Card, CardContent } from "@/app/components/ui";
import { VoiceAssistant } from "@/app/components/voice";
import { DocumentType, DocumentTypeLabels, DocumentTypeShortLabels } from "@/domain/documents";

interface UploadedFile {
  file: File;
  type: DocumentType;
  preview?: string;
}

interface DocumentUploadStepProps {
  onNext: (files: UploadedFile[]) => void;
  onBack: () => void;
  onUseSampleData: () => void;
}

const VOICE_PROMPT = `Ανεβάστε τα έγγραφά σας. Χρειαζόμαστε τουλάχιστον το Ε1 και το εκκαθαριστικό σημείωμα. 
Μπορείτε να τραβήξετε φωτογραφία ή να επιλέξετε αρχείο PDF.
Αν θέλετε να δείτε μια επίδειξη, πατήστε Χρήση Δοκιμαστικών Δεδομένων.`;

const REQUIRED_DOCS = [DocumentType.E1, DocumentType.EKKATHARISTIKO];
const OPTIONAL_DOCS = [DocumentType.MISTHODOSIA, DocumentType.BANK_STATEMENT];

export function DocumentUploadStep({ onNext, onBack, onUseSampleData }: DocumentUploadStepProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedType, setSelectedType] = useState<DocumentType>(DocumentType.E1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadedTypes = new Set(uploadedFiles.map((f) => f.type));
  const hasRequiredDocs = REQUIRED_DOCS.every((t) => uploadedTypes.has(t));

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let preview: string | undefined;
    if (file.type.startsWith("image/")) {
      preview = URL.createObjectURL(file);
    }

    setUploadedFiles((prev) => {
      const filtered = prev.filter((f) => f.type !== selectedType);
      return [...filtered, { file, type: selectedType, preview }];
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    const remainingRequired = REQUIRED_DOCS.filter(
      (t) => t !== selectedType && !uploadedTypes.has(t)
    );
    if (remainingRequired.length > 0) {
      setSelectedType(remainingRequired[0]);
    } else {
      const remainingOptional = OPTIONAL_DOCS.filter(
        (t) => t !== selectedType && !uploadedTypes.has(t)
      );
      if (remainingOptional.length > 0) {
        setSelectedType(remainingOptional[0]);
      }
    }
  };

  const handleRemoveFile = (type: DocumentType) => {
    setUploadedFiles((prev) => prev.filter((f) => f.type !== type));
  };

  const handleSubmit = () => {
    if (hasRequiredDocs) {
      onNext(uploadedFiles);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Ανέβασμα Εγγράφων</h2>
            <p className="text-sm text-muted mt-1">
              Ανεβάστε τα απαραίτητα δικαιολογητικά
            </p>
          </div>
          <VoiceAssistant prompt={VOICE_PROMPT} showMicButton={false} />
        </div>

        <div className="space-y-4 mb-6">
          <p className="text-sm font-medium text-foreground">Απαιτούμενα έγγραφα:</p>
          <div className="grid gap-3">
            {REQUIRED_DOCS.map((type) => {
              const uploaded = uploadedFiles.find((f) => f.type === type);
              return (
                <DocumentCard
                  key={type}
                  type={type}
                  uploaded={uploaded}
                  isRequired
                  isSelected={selectedType === type}
                  onSelect={() => setSelectedType(type)}
                  onRemove={() => handleRemoveFile(type)}
                />
              );
            })}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <p className="text-sm font-medium text-foreground">Προαιρετικά έγγραφα:</p>
          <div className="grid gap-3">
            {OPTIONAL_DOCS.map((type) => {
              const uploaded = uploadedFiles.find((f) => f.type === type);
              return (
                <DocumentCard
                  key={type}
                  type={type}
                  uploaded={uploaded}
                  isRequired={false}
                  isSelected={selectedType === type}
                  onSelect={() => setSelectedType(type)}
                  onRemove={() => handleRemoveFile(type)}
                />
              );
            })}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileSelect}
          className="hidden"
          aria-label="Επιλογή αρχείου"
        />

        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 mr-2"
              aria-hidden="true"
            >
              <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
              <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
            </svg>
            Ανέβασμα {DocumentTypeShortLabels[selectedType]}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-2 text-muted">ή</span>
            </div>
          </div>

          <Button variant="ghost" onClick={onUseSampleData} className="w-full text-sm">
            Χρήση Δοκιμαστικών Δεδομένων (Demo)
          </Button>
        </div>
      </div>

      <div className="sticky bottom-0 bg-background border-t border-border p-4 mt-6">
        <div className="max-w-2xl mx-auto flex justify-between">
          <Button variant="ghost" onClick={onBack}>
            Πίσω
          </Button>
          <Button onClick={handleSubmit} size="lg" disabled={!hasRequiredDocs}>
            Υποβολή
          </Button>
        </div>
      </div>
    </div>
  );
}

interface DocumentCardProps {
  type: DocumentType;
  uploaded?: UploadedFile;
  isRequired: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

function DocumentCard({
  type,
  uploaded,
  isRequired,
  isSelected,
  onSelect,
  onRemove,
}: DocumentCardProps) {
  return (
    <Card
      variant={isSelected ? "outlined" : "default"}
      padding="sm"
      className={`
        cursor-pointer transition-all
        ${isSelected ? "ring-2 ring-primary" : ""}
        ${uploaded ? "bg-success/5 border-success" : ""}
      `}
    >
      <CardContent className="p-0">
        <button
          type="button"
          onClick={onSelect}
          className="w-full flex items-center gap-3 text-left"
        >
          <div
            className={`
              w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
              ${uploaded ? "bg-success text-white" : "bg-surface-elevated text-muted"}
            `}
          >
            {uploaded ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path d="M3 3.5A1.5 1.5 0 014.5 2h6.879a1.5 1.5 0 011.06.44l4.122 4.12A1.5 1.5 0 0117 7.622V16.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13z" />
              </svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {DocumentTypeShortLabels[type]}
              {isRequired && <span className="text-secondary ml-1">*</span>}
            </p>
            <p className="text-xs text-muted truncate">
              {uploaded ? uploaded.file.name : DocumentTypeLabels[type]}
            </p>
          </div>
          {uploaded && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="p-1 text-muted hover:text-secondary"
              aria-label={`Αφαίρεση ${DocumentTypeShortLabels[type]}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          )}
        </button>
      </CardContent>
    </Card>
  );
}
