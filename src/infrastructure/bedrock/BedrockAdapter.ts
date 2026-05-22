import {
  BedrockRuntimeClient,
  ConverseCommand,
  ContentBlock,
  ImageFormat,
  DocumentFormat,
} from "@aws-sdk/client-bedrock-runtime";
import {
  LLMPort,
  DocumentExtractionResult,
  ExplanationResult,
} from "@/application/ports";
import {
  DocumentType,
  ExtractedDocument,
  createExtractedDocument,
  E1Fields,
  EkkatharistikoFields,
  MisthodosiaFields,
  BankStatementFields,
  ExtractedField,
} from "@/domain/documents";
import { Assessment, LoanApplication, DecisionLabels } from "@/domain/loan";

function getBedrockClient(): BedrockRuntimeClient {
  return new BedrockRuntimeClient({
    region: process.env.AWS_REGION || "eu-west-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  });
}

function getModelId(): string {
  return process.env.BEDROCK_MODEL_ID || "anthropic.claude-3-5-sonnet-20241022-v2:0";
}

function mimeToImageFormat(mimeType: string): ImageFormat | null {
  const mapping: Record<string, ImageFormat> = {
    "image/jpeg": "jpeg",
    "image/jpg": "jpeg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
  };
  return mapping[mimeType] || null;
}

function mimeToDocumentFormat(mimeType: string): DocumentFormat | null {
  const mapping: Record<string, DocumentFormat> = {
    "application/pdf": "pdf",
  };
  return mapping[mimeType] || null;
}

function detectDocumentType(text: string): DocumentType {
  const lowerText = text.toLowerCase();

  if (lowerText.includes("ε1") || lowerText.includes("e1") || lowerText.includes("δήλωση φορολογίας")) {
    return DocumentType.E1;
  }
  if (lowerText.includes("εκκαθαριστικό") || lowerText.includes("πράξη διοικητικού προσδιορισμού")) {
    return DocumentType.EKKATHARISTIKO;
  }
  if (lowerText.includes("μισθοδοσία") || lowerText.includes("βεβαίωση αποδοχών") || lowerText.includes("payslip")) {
    return DocumentType.MISTHODOSIA;
  }
  if (lowerText.includes("κίνηση") || lowerText.includes("statement") || lowerText.includes("iban")) {
    return DocumentType.BANK_STATEMENT;
  }

  return DocumentType.E1;
}

function createField(value: string | number | boolean | null, confidence: number = 0.85): ExtractedField {
  return { value, confidence };
}

function parseExtractionResponse(responseText: string, detectedType: DocumentType): ExtractedDocument {
  let parsed: Record<string, unknown> = {};
  try {
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) ||
      responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);
    }
  } catch {
    parsed = {};
  }

  const warnings: string[] = [];

  switch (detectedType) {
    case DocumentType.E1: {
      const fields: E1Fields = {
        taxYear: createField(parsed.taxYear as number || parsed.tax_year as number || null),
        grossIncome: createField(parsed.grossIncome as number || parsed.gross_income as number || null),
        netIncome: createField(parsed.netIncome as number || parsed.net_income as number || null),
        taxPaid: createField(parsed.taxPaid as number || parsed.tax_paid as number || null),
        afm: createField(parsed.afm as string || parsed.AFM as string || null),
        fullName: createField(parsed.fullName as string || parsed.full_name as string || null),
      };
      if (!fields.grossIncome.value) warnings.push("Δεν βρέθηκε μικτό εισόδημα");
      return createExtractedDocument(detectedType, fields, warnings);
    }

    case DocumentType.EKKATHARISTIKO: {
      const fields: EkkatharistikoFields = {
        taxYear: createField(parsed.taxYear as number || null),
        totalIncome: createField(parsed.totalIncome as number || parsed.total_income as number || null),
        taxDue: createField(parsed.taxDue as number || parsed.tax_due as number || null),
        taxPaid: createField(parsed.taxPaid as number || null),
        refundOrDebt: createField(parsed.refundOrDebt as number || parsed.refund as number || null),
        afm: createField(parsed.afm as string || null),
      };
      return createExtractedDocument(detectedType, fields, warnings);
    }

    case DocumentType.MISTHODOSIA: {
      const fields: MisthodosiaFields = {
        employerName: createField(parsed.employerName as string || parsed.employer as string || null),
        employeeName: createField(parsed.employeeName as string || parsed.employee as string || null),
        afm: createField(parsed.afm as string || null),
        grossSalary: createField(parsed.grossSalary as number || parsed.gross_salary as number || null),
        netSalary: createField(parsed.netSalary as number || parsed.net_salary as number || null),
        period: createField(parsed.period as string || null),
        deductions: createField(parsed.deductions as number || null),
      };
      return createExtractedDocument(detectedType, fields, warnings);
    }

    case DocumentType.BANK_STATEMENT: {
      const fields: BankStatementFields = {
        accountHolder: createField(parsed.accountHolder as string || null),
        iban: createField(parsed.iban as string || parsed.IBAN as string || null),
        periodStart: createField(parsed.periodStart as string || null),
        periodEnd: createField(parsed.periodEnd as string || null),
        openingBalance: createField(parsed.openingBalance as number || null),
        closingBalance: createField(parsed.closingBalance as number || null),
        totalCredits: createField(parsed.totalCredits as number || null),
        totalDebits: createField(parsed.totalDebits as number || null),
        regularIncomeDetected: createField(parsed.regularIncomeDetected as boolean || null),
        existingLoanPayments: createField(parsed.existingLoanPayments as number || null),
      };
      return createExtractedDocument(detectedType, fields, warnings);
    }
  }
}

const EXTRACTION_PROMPT = `Αναλύστε το παρακάτω ελληνικό φορολογικό/τραπεζικό έγγραφο και εξάγετε τα δεδομένα σε JSON.

Πρώτα προσδιορίστε τον τύπο εγγράφου:
- E1: Δήλωση Φορολογίας Εισοδήματος
- EKKATHARISTIKO: Εκκαθαριστικό Σημείωμα
- MISTHODOSIA: Βεβαίωση Αποδοχών / Μισθοδοσία
- BANK_STATEMENT: Κίνηση Τραπεζικού Λογαριασμού

Για E1/Εκκαθαριστικό εξάγετε: taxYear, grossIncome, netIncome, taxPaid, afm, fullName, totalIncome
Για Μισθοδοσία εξάγετε: employerName, employeeName, afm, grossSalary, netSalary, period, deductions
Για Κίνηση Λογαριασμού εξάγετε: accountHolder, iban, periodStart, periodEnd, openingBalance, closingBalance, totalCredits, totalDebits, regularIncomeDetected (boolean), existingLoanPayments (αν εντοπίσετε δόσεις δανείων)

Τα ποσά σε ευρώ ως αριθμούς (χωρίς σύμβολο €).
Απαντήστε ΜΟΝΟ με JSON:

\`\`\`json
{
  "documentType": "...",
  ...extracted fields...
}
\`\`\``;

export class BedrockAdapter implements LLMPort {
  private client: BedrockRuntimeClient;
  private modelId: string;

  constructor() {
    this.client = getBedrockClient();
    this.modelId = getModelId();
  }

  async extractDocument(
    fileBase64: string,
    mimeType: string,
    fileName: string
  ): Promise<DocumentExtractionResult> {
    try {
      const imageFormat = mimeToImageFormat(mimeType);
      const documentFormat = mimeToDocumentFormat(mimeType);

      const content: ContentBlock[] = [{ text: EXTRACTION_PROMPT }];

      if (imageFormat) {
        content.push({
          image: {
            format: imageFormat,
            source: { bytes: Buffer.from(fileBase64, "base64") },
          },
        });
      } else if (documentFormat) {
        content.push({
          document: {
            format: documentFormat,
            name: fileName.replace(/[^a-zA-Z0-9_.-]/g, "_"),
            source: { bytes: Buffer.from(fileBase64, "base64") },
          },
        });
      } else {
        return {
          document: null as unknown as ExtractedDocument,
          success: false,
          error: `Μη υποστηριζόμενος τύπος αρχείου: ${mimeType}`,
        };
      }

      const command = new ConverseCommand({
        modelId: this.modelId,
        messages: [{ role: "user", content }],
        inferenceConfig: {
          maxTokens: 2000,
          temperature: 0.1,
        },
      });

      const response = await this.client.send(command);
      const responseText = response.output?.message?.content?.[0]?.text || "";

      const detectedType = detectDocumentType(responseText);
      const document = parseExtractionResponse(responseText, detectedType);
      document.rawFileName = fileName;

      return { document, success: true };
    } catch (error) {
      console.error("Bedrock extraction error:", error);
      return {
        document: null as unknown as ExtractedDocument,
        success: false,
        error: error instanceof Error ? error.message : "Σφάλμα εξαγωγής δεδομένων",
      };
    }
  }

  async generateExplanation(
    application: LoanApplication,
    assessment: Assessment
  ): Promise<ExplanationResult> {
    try {
      const factorsSummary = assessment.factors
        .map((f) => `- ${f.name}: ${f.value} (${f.description})`)
        .join("\n");

      const prompt = `Είστε τραπεζικός σύμβουλος. Εξηγήστε σε απλά ελληνικά την απόφαση για αίτηση δανείου.

Στοιχεία αίτησης:
- Ποσό: €${application.loanDetails?.amount.toLocaleString("el-GR")}
- Διάρκεια: ${application.loanDetails?.termMonths} μήνες

Αποτέλεσμα αξιολόγησης: ${DecisionLabels[assessment.decision]}
Βαθμολογία: ${assessment.score}/100
Δείκτης χρέους/εισοδήματος: ${(assessment.debtToIncomeRatio * 100).toFixed(1)}%

Παράγοντες:
${factorsSummary}

Γράψτε μια σύντομη, φιλική εξήγηση (3-4 παραγράφους) που:
1. Εξηγεί την απόφαση με απλά λόγια
2. Αναφέρει τους κύριους παράγοντες
3. Δίνει συμβουλές για το επόμενο βήμα
4. Τονίζει ότι η τελική απόφαση γίνεται από εξειδικευμένο στέλεχος

Μην χρησιμοποιείτε τεχνικούς όρους. Να είστε ενθαρρυντικοί αλλά ειλικρινείς.`;

      const command = new ConverseCommand({
        modelId: this.modelId,
        messages: [{ role: "user", content: [{ text: prompt }] }],
        inferenceConfig: {
          maxTokens: 1000,
          temperature: 0.7,
        },
      });

      const response = await this.client.send(command);
      const explanation = response.output?.message?.content?.[0]?.text || "";

      return { explanation, success: true };
    } catch (error) {
      console.error("Bedrock explanation error:", error);
      return {
        explanation: "",
        success: false,
        error: error instanceof Error ? error.message : "Σφάλμα δημιουργίας εξήγησης",
      };
    }
  }
}

export function createBedrockAdapter(): LLMPort {
  return new BedrockAdapter();
}
