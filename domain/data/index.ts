import { createVerifiedNumber, VerifiedNumber } from '../verification';
import rawVerifiedNumbers from './verified-numbers.json';

/** Shape of an entry in verified-numbers.json. */
export interface SeedVerifiedNumber {
  phone: string;
  department: string;
  label?: string;
}

/** The bundled, read-only list of genuine Epirus Bank phone numbers. */
export const SEED_VERIFIED_NUMBERS = rawVerifiedNumbers as SeedVerifiedNumber[];

/** Materialises the bundled seed into full VerifiedNumber domain objects. */
export function getSeedVerifiedNumbers(): VerifiedNumber[] {
  return SEED_VERIFIED_NUMBERS.map((entry) =>
    createVerifiedNumber(entry.phone, entry.department, entry.label),
  );
}
