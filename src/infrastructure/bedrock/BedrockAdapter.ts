import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";

export interface ScamAnalysisResult {
  isLikelyScam: boolean;
  confidence: number;
  reasons: string[];
  explanation: string;
}

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

export class BedrockAdapter {
  private client: BedrockRuntimeClient;
  private modelId: string;

  constructor() {
    this.client = getBedrockClient();
    this.modelId = getModelId();
  }

  async analyzeEmailForScam(
    emailContent: string,
    senderAddress: string,
    subject: string
  ): Promise<ScamAnalysisResult> {
    try {
      const prompt = `Αναλύστε το παρακάτω email για πιθανή απάτη/phishing που προσποιείται τράπεζα.

Αποστολέας: ${senderAddress}
Θέμα: ${subject}

Περιεχόμενο:
${emailContent}

Αξιολογήστε αν το email:
1. Ζητά προσωπικά στοιχεία ή κωδικούς
2. Δημιουργεί αίσθηση επείγοντος
3. Περιέχει ύποπτους συνδέσμους
4. Έχει γραμματικά/ορθογραφικά λάθη
5. Η διεύθυνση αποστολέα φαίνεται ύποπτη

Απαντήστε ΜΟΝΟ με JSON:
\`\`\`json
{
  "isLikelyScam": true/false,
  "confidence": 0.0-1.0,
  "reasons": ["λόγος 1", "λόγος 2"],
  "explanation": "Σύντομη εξήγηση στα ελληνικά για τον χρήστη"
}
\`\`\``;

      const command = new ConverseCommand({
        modelId: this.modelId,
        messages: [{ role: "user", content: [{ text: prompt }] }],
        inferenceConfig: {
          maxTokens: 1000,
          temperature: 0.1,
        },
      });

      const response = await this.client.send(command);
      const responseText = response.output?.message?.content?.[0]?.text || "";

      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) ||
        responseText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        return {
          isLikelyScam: parsed.isLikelyScam ?? false,
          confidence: parsed.confidence ?? 0.5,
          reasons: parsed.reasons ?? [],
          explanation: parsed.explanation ?? "",
        };
      }

      return {
        isLikelyScam: false,
        confidence: 0,
        reasons: [],
        explanation: "Δεν ήταν δυνατή η ανάλυση",
      };
    } catch (error) {
      console.error("Bedrock analysis error:", error);
      return {
        isLikelyScam: false,
        confidence: 0,
        reasons: [],
        explanation: "Σφάλμα ανάλυσης",
      };
    }
  }
}

export function createBedrockAdapter(): BedrockAdapter {
  return new BedrockAdapter();
}
