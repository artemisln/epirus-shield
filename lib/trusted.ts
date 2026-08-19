import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  TrustedNumber,
  createTrustedNumber,
  phoneMatches,
} from '@/domain/verification';

// Trusted numbers are stored on-device only (fully-local app — no backend).
const STORAGE_KEY = 'epirus-shield:trusted-numbers';
const MAX_TRUSTED = 100;

/** Returns all locally stored trusted numbers, newest first. */
export async function getTrustedNumbers(): Promise<TrustedNumber[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as TrustedNumber[];
    return parsed.map((entry) => ({
      ...entry,
      trustedAt: new Date(entry.trustedAt),
    }));
  } catch {
    return [];
  }
}

/** Marks a number as trusted on-device and returns the stored entry. */
export async function addTrustedNumber(phone: string): Promise<TrustedNumber> {
  const existing = await getTrustedNumbers();
  const already = existing.find((entry) => phoneMatches(entry.phone, phone));
  if (already) {
    return already;
  }
  const trusted = createTrustedNumber(phone);
  const next = [trusted, ...existing].slice(0, MAX_TRUSTED);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return trusted;
}
