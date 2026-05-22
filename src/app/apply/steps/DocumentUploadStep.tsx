"use client";

import { useState, useRef } from "react";
import { Icon } from "@/app/components/ui";
import { DocumentType, DocumentTypeShortLabels } from "@/domain/documents";

interface UploadedFile {
  file: File;
  type: DocumentType;
  preview?: string;
}

interface DocumentUploadStepProps {
  onFilesChange: (files: UploadedFile[], hasRequired: boolean) => void;
  onUseSampleData: () => void;
}

const REQUIRED_DOCS = [DocumentType.E1, DocumentType.EKKATHARISTIKO];

export function DocumentUploadStep({ onFilesChange, onUseSampleData }: DocumentUploadStepProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedType, setSelectedType] = useState<DocumentType>(DocumentType.E1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadedTypes = new Set(uploadedFiles.map((f) => f.type));
  const hasRequiredDocs = REQUIRED_DOCS.every((t) => uploadedTypes.has(t));

  const updateFiles = (newFiles: UploadedFile[]) => {
    setUploadedFiles(newFiles);
    const newUploadedTypes = new Set(newFiles.map((f) => f.type));
    const newHasRequired = REQUIRED_DOCS.every((t) => newUploadedTypes.has(t));
    onFilesChange(newFiles, newHasRequired);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newFiles = uploadedFiles.filter((f) => f.type !== selectedType);
    newFiles.push({ file, type: selectedType });
    updateFiles(newFiles);

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
    const newFiles = uploadedFiles.filter((f) => f.type !== type);
    updateFiles(newFiles);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-center mb-6">
        <Icon name="upload" size={96} />
      </div>

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
                w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left cursor-pointer
                ${uploaded
                  ? "border-success bg-success/5"
                  : isSelected
                    ? "border-foreground"
                    : "border-border hover:border-muted"
                }
              `}
            >
              <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                {uploaded ? (
                  <div className="w-10 h-10 rounded-full bg-success text-white flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : (
                  <Icon name="tax-doc" size={48} />
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
                  className="p-2 text-muted hover:text-error rounded-full hover:bg-surface-elevated cursor-pointer"
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
          className="text-sm text-muted underline underline-offset-4 hover:text-foreground transition-colors cursor-pointer"
        >
          Χρήση δοκιμαστικών δεδομένων
        </button>
      </div>
    </div>
  );
}
