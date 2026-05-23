import AsyncStorage from '@react-native-async-storage/async-storage';

import { ScamReport, createScamReport } from '@/domain/verification';

// Scam reports are stored on-device only (fully-local app — no backend).
const STORAGE_KEY = 'epirus-shield:scam-reports';
const MAX_REPORTS = 100;

/** Returns all locally stored scam reports, newest first. */
export async function getScamReports(): Promise<ScamReport[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as ScamReport[];
    // Dates round-trip through JSON as strings — rehydrate them.
    return parsed.map((report) => ({
      ...report,
      reportedAt: new Date(report.reportedAt),
    }));
  } catch {
    return [];
  }
}

/** Records a scam report on-device and returns the created report. */
export async function addScamReport(
  reportedNumber: string,
  userNotes?: string,
): Promise<ScamReport> {
  const report = createScamReport(reportedNumber, userNotes);
  const existing = await getScamReports();
  const next = [report, ...existing].slice(0, MAX_REPORTS);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return report;
}
