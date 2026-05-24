import { getSeedVerifiedNumbers } from '@/domain/data';
import scamSeed from '@/domain/data/scam-numbers.json';
import { normalizePhone } from '@/domain/verification';
import { getScamReports } from '@/lib/reports';
import {
  CallDetector,
  type CallDirectoryEntry,
  type CallDirectoryStatus,
} from '@/modules/call-detector';

/** Converts a phone string to the integer form the Call Directory needs. */
function toDirectoryNumber(phone: string): number | null {
  const digits = normalizePhone(phone).replace(/\D/g, '');
  if (digits.length < 6) {
    return null;
  }
  const value = Number(digits);
  return Number.isSafeInteger(value) ? value : null;
}

/**
 * Builds the de-duplicated, ascending number list for the Call Directory:
 * verified Epirus Bank numbers (✓) and known + reported scam numbers (⚠️).
 */
export async function buildCallDirectoryEntries(): Promise<CallDirectoryEntry[]> {
  const byNumber = new Map<number, CallDirectoryEntry>();

  for (const verified of getSeedVerifiedNumbers()) {
    const number = toDirectoryNumber(verified.phone);
    if (number !== null && !byNumber.has(number)) {
      byNumber.set(number, {
        number,
        label: `✓ Epirus Bank — ${verified.department}`,
      });
    }
  }

  const scamPhones = new Set<string>(scamSeed as string[]);
  for (const report of await getScamReports()) {
    scamPhones.add(report.reportedNumber);
  }
  for (const phone of scamPhones) {
    const number = toDirectoryNumber(phone);
    if (number !== null && !byNumber.has(number)) {
      byNumber.set(number, {
        number,
        label: '⚠️ Πιθανή απάτη — Epirus Shield',
      });
    }
  }

  // CXCallDirectory requires strictly ascending phone numbers.
  return [...byNumber.values()].sort((a, b) => a.number - b.number);
}

/** Pushes the current number list to the Call Directory extension. */
export async function syncCallDirectory(): Promise<number> {
  const entries = await buildCallDirectoryEntries();
  await CallDetector.syncCallDirectory(entries);
  return entries.length;
}

/** Reads whether the user has enabled the extension in iOS Settings. */
export async function getCallDirectoryStatus(): Promise<CallDirectoryStatus> {
  return CallDetector.getCallDirectoryStatus();
}
