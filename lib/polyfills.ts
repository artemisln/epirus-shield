// Polyfill `crypto.randomUUID` for the verification domain code (domain/verification/*),
// which is shared with the former web app and calls the Web Crypto API.
// Hermes has no global `crypto`, so we back it with expo-crypto.
import { randomUUID } from 'expo-crypto';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalScope = globalThis as any;

if (!globalScope.crypto) {
  globalScope.crypto = {};
}

if (typeof globalScope.crypto.randomUUID !== 'function') {
  globalScope.crypto.randomUUID = randomUUID;
}
