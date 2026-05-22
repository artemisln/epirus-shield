export enum DocumentType {
  E1 = "E1",
  EKKATHARISTIKO = "EKKATHARISTIKO",
  MISTHODOSIA = "MISTHODOSIA",
  BANK_STATEMENT = "BANK_STATEMENT",
}

export const DocumentTypeLabels: Record<DocumentType, string> = {
  [DocumentType.E1]: "Ε1 - Δήλωση Φορολογίας Εισοδήματος",
  [DocumentType.EKKATHARISTIKO]: "Εκκαθαριστικό Σημείωμα",
  [DocumentType.MISTHODOSIA]: "Βεβαίωση Αποδοχών / Μισθοδοσία",
  [DocumentType.BANK_STATEMENT]: "Κίνηση Τραπεζικού Λογαριασμού",
};

export const DocumentTypeShortLabels: Record<DocumentType, string> = {
  [DocumentType.E1]: "Ε1",
  [DocumentType.EKKATHARISTIKO]: "Εκκαθαριστικό",
  [DocumentType.MISTHODOSIA]: "Μισθοδοσία",
  [DocumentType.BANK_STATEMENT]: "Κίνηση Λογαριασμού",
};
