"use client";

import { useState, useRef } from "react";
import { Button } from "@/app/components/ui";
import { DocumentType, DocumentTypeShortLabels } from "@/domain/documents";

interface UploadedFile {
  file: File;
  type: DocumentType;
  preview?: string;
}

interface DocumentUploadStepProps {
  onNext: (files: UploadedFile[]) => void;
  onUseSampleData: () => void;
}

const REQUIRED_DOCS = [DocumentType.E1, DocumentType.EKKATHARISTIKO];

export function DocumentUploadStep({ onNext, onUseSampleData }: DocumentUploadStepProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedType, setSelectedType] = useState<DocumentType>(DocumentType.E1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadedTypes = new Set(uploadedFiles.map((f) => f.type));
  const hasRequiredDocs = REQUIRED_DOCS.every((t) => uploadedTypes.has(t));

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFiles((prev) => {
      const filtered = prev.filter((f) => f.type !== selectedType);
      return [...filtered, { file, type: selectedType }];
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    const remainingRequired = REQUIRED_DOCS.filter(
      (t) => t !== selectedType && !uploadedTypes.has(t)
    );
    if (remainingRequired.length > 0) {
      setSelectedType(remainingRequired[0]);
    }
  };

  const handleRemoveFile = (type: DocumentType) => {
    setUploadedFiles((prev) => prev.filter((f) => f.type !== type));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 text-center">
          Ανεβάστε τα έγγραφά σας
        </h1>
        <p className="text-muted mb-8 text-center">
          Χρειαζόμαστε το Ε1 και το εκκαθαριστικό σας
        </p>

        <div className="space-y-3 mb-8">
          {REQUIRED_DOCS.map((type) => {
            const uploaded = uploadedFiles.find((f) => f.type === type);
            const isSelected = selectedType === type;

            return (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setSelectedType(type);
                  if (!uploaded) {
                    fileInputRef.current?.click();
                  }
                }}
                className={`
                  w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left
                  ${uploaded
                    ? "border-success bg-success/5"
                    : isSelected
                      ? "border-foreground"
                      : "border-border hover:border-muted"
                  }
                `}
              >
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                    ${uploaded ? "bg-success text-white" : "bg-surface-elevated text-muted"}
                  `}
                >
                  {uploaded ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
                      <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">
                    {DocumentTypeShortLabels[type]}
                  </p>
                  <p className="text-sm text-muted truncate">
                    {uploaded ? uploaded.file.name : "Πατήστε για ανέβασμα"}
                  </p>
                </div>
                {uploaded && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(type);
                    }}
                    className="p-2 text-muted hover:text-error rounded-full hover:bg-surface-elevated"
                    aria-label="Αφαίρεση"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  </button>
                )}
              </button>
            );
          })}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileSelect}
          className="hidden"
          aria-label="Επιλογή αρχείου"
        />

        <div className="text-center">
          <button
            type="button"
            onClick={onUseSampleData}
            className="text-sm text-muted underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Χρήση δοκιμαστικών δεδομένων
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={() => onNext(uploadedFiles)} size="lg" disabled={!hasRequiredDocs}>
          Υποβολή
        </Button>
      </div>
    </div>
  );
}
