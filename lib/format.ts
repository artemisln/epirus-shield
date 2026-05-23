/**
 * Formats a number as a Greek-style euro amount.
 * e.g. 3247.65 -> "3.247,65" (dot thousands separator, comma decimal).
 * Done manually rather than via Intl to stay independent of Hermes locale data.
 */
export function formatEuro(amount: number): string {
  const fixed = Math.abs(amount).toFixed(2);
  const [intPart, decPart] = fixed.split('.');
  const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${withThousands},${decPart}`;
}
