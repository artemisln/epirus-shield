import {
  DocumentType,
  ExtractedDocument,
  createExtractedDocument,
  E1Fields,
  EkkatharistikoFields,
  MisthodosiaFields,
  BankStatementFields,
} from "@/domain/documents";

// MOCK: Sample data for demo purposes when no real documents are uploaded
// These represent realistic Greek tax/financial documents

export const sampleE1: ExtractedDocument = createExtractedDocument(
  DocumentType.E1,
  {
    taxYear: { value: 2023, confidence: 0.95 },
    grossIncome: { value: 28000, confidence: 0.92 },
    netIncome: { value: 21000, confidence: 0.90 },
    taxPaid: { value: 4200, confidence: 0.88 },
    afm: { value: "123456789", confidence: 0.98 },
    fullName: { value: "ΓΕΩΡΓΙΟΣ ΠΑΠΑΔΟΠΟΥΛΟΣ", confidence: 0.95 },
  } as E1Fields,
  [],
  "sample_e1_2023.pdf"
);

export const sampleEkkatharistiko: ExtractedDocument = createExtractedDocument(
  DocumentType.EKKATHARISTIKO,
  {
    taxYear: { value: 2023, confidence: 0.95 },
    totalIncome: { value: 28000, confidence: 0.93 },
    taxDue: { value: 4500, confidence: 0.90 },
    taxPaid: { value: 4200, confidence: 0.88 },
    refundOrDebt: { value: -300, confidence: 0.85 },
    afm: { value: "123456789", confidence: 0.98 },
  } as EkkatharistikoFields,
  [],
  "sample_ekkatharistiko_2023.pdf"
);

export const sampleMisthodosia: ExtractedDocument = createExtractedDocument(
  DocumentType.MISTHODOSIA,
  {
    employerName: { value: "ΤΕΧΝΟΛΟΓΙΚΕΣ ΛΥΣΕΙΣ Α.Ε.", confidence: 0.92 },
    employeeName: { value: "ΓΕΩΡΓΙΟΣ ΠΑΠΑΔΟΠΟΥΛΟΣ", confidence: 0.95 },
    afm: { value: "123456789", confidence: 0.98 },
    grossSalary: { value: 2100, confidence: 0.90 },
    netSalary: { value: 1650, confidence: 0.92 },
    period: { value: "Μάρτιος 2024", confidence: 0.88 },
    deductions: { value: 450, confidence: 0.85 },
  } as MisthodosiaFields,
  [],
  "sample_misthodosia_032024.pdf"
);

export const sampleBankStatement: ExtractedDocument = createExtractedDocument(
  DocumentType.BANK_STATEMENT,
  {
    accountHolder: { value: "ΓΕΩΡΓΙΟΣ ΠΑΠΑΔΟΠΟΥΛΟΣ", confidence: 0.95 },
    iban: { value: "GR16 0110 1250 0000 0001 2300 695", confidence: 0.98 },
    periodStart: { value: "01/01/2024", confidence: 0.90 },
    periodEnd: { value: "31/03/2024", confidence: 0.90 },
    openingBalance: { value: 3250.45, confidence: 0.92 },
    closingBalance: { value: 4120.80, confidence: 0.92 },
    totalCredits: { value: 5200, confidence: 0.88 },
    totalDebits: { value: 4329.65, confidence: 0.88 },
    regularIncomeDetected: { value: true, confidence: 0.85 },
    existingLoanPayments: { value: 180, confidence: 0.80 },
  } as BankStatementFields,
  ["Εντοπίστηκε μηνιαία δόση δανείου €180"],
  "sample_bank_statement_q1_2024.pdf"
);

export const allSampleDocuments: ExtractedDocument[] = [
  sampleE1,
  sampleEkkatharistiko,
  sampleMisthodosia,
  sampleBankStatement,
];

export function getSampleDocumentByType(type: DocumentType): ExtractedDocument | null {
  return allSampleDocuments.find((d) => d.type === type) || null;
}

export function getMinimalSampleDocuments(): ExtractedDocument[] {
  return [sampleE1, sampleEkkatharistiko];
}

export function getFullSampleDocuments(): ExtractedDocument[] {
  return allSampleDocuments;
}

// MOCK: Sample explanation for demo when Bedrock is unavailable
export const sampleExplanationApprove = `Με βάση την ανάλυση των εγγράφων σας, η αίτησή σας πληροί τις προϋποθέσεις για προέγκριση δανείου.

Τα κύρια στοιχεία που λάβαμε υπόψη είναι το σταθερό μηνιαίο εισόδημά σας από μισθωτή εργασία, η καλή αναλογία μεταξύ των υποχρεώσεών σας και του εισοδήματός σας, καθώς και η τακτική ροή εισοδήματος που επιβεβαιώθηκε από την κίνηση του λογαριασμού σας.

Η εκτιμώμενη μηνιαία δόση είναι εντός των δυνατοτήτων αποπληρωμής σας, αφήνοντας επαρκές περιθώριο για τα καθημερινά σας έξοδα.

Το επόμενο βήμα είναι να επικοινωνήσει μαζί σας ένας εξειδικευμένος σύμβουλος της τράπεζας για να ολοκληρώσει την αξιολόγηση και να σας ενημερώσει για τους ακριβείς όρους του δανείου. Η τελική έγκριση γίνεται πάντα από εξουσιοδοτημένο στέλεχος.`;

export const sampleExplanationReview = `Η αίτησή σας χρειάζεται περαιτέρω αξιολόγηση από εξειδικευμένο στέλεχος της τράπεζας.

Αυτό δεν σημαίνει απόρριψη - απλώς χρειαζόμαστε λίγο περισσότερο χρόνο για να εξετάσουμε ορισμένες λεπτομέρειες. Συγκεκριμένα, θέλουμε να διασταυρώσουμε κάποια στοιχεία εισοδήματος και να αξιολογήσουμε καλύτερα την ικανότητα αποπληρωμής.

Ένας σύμβουλος θα επικοινωνήσει μαζί σας εντός 2-3 εργάσιμων ημερών. Μπορεί να σας ζητηθούν πρόσθετα δικαιολογητικά, όπως πρόσφατη βεβαίωση εργοδότη ή επιπλέον κινήσεις λογαριασμού.

Παραμείνετε διαθέσιμοι στο τηλέφωνο που δηλώσατε και ελέγξτε το email σας για ενημερώσεις.`;

export const sampleExplanationDecline = `Δυστυχώς, με βάση τα τρέχοντα στοιχεία, η αίτησή σας δεν πληροί τις ελάχιστες προϋποθέσεις για το ποσό που ζητήσατε.

Ο κύριος λόγος είναι ότι η αναλογία των μηνιαίων υποχρεώσεων προς το εισόδημά σας υπερβαίνει τα όρια που θέτει η τράπεζα για υπεύθυνο δανεισμό. Αυτό σημαίνει ότι η μηνιαία δόση θα επιβάρυνε υπερβολικά τον προϋπολογισμό σας.

Μπορείτε να εξετάσετε τις εξής εναλλακτικές: αίτηση για μικρότερο ποσό, επιλογή μεγαλύτερης διάρκειας αποπληρωμής, ή υποβολή νέας αίτησης αφού μειωθούν οι υπάρχουσες υποχρεώσεις σας.

Ένας σύμβουλος μπορεί να σας βοηθήσει να βρείτε την καλύτερη λύση για την περίπτωσή σας. Μη διστάσετε να επικοινωνήσετε μαζί μας.`;
