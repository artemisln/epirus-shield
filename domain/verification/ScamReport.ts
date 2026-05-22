export interface ScamReport {
  id: string;
  reportedNumber: string;
  reportedAt: Date;
  userNotes?: string;
}

export function createScamReport(
  reportedNumber: string,
  userNotes?: string
): ScamReport {
  return {
    id: crypto.randomUUID(),
    reportedNumber,
    reportedAt: new Date(),
    userNotes,
  };
}
