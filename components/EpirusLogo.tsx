import LogoColor from '@/assets/epirus-bank-logo.svg';
import LogoWhite from '@/assets/epirus-bank-logo-white.svg';

// Aspect ratio from the source SVG viewBox (569.31 × 63.3).
const ASPECT = 569.31 / 63.3;

interface EpirusLogoProps {
  /** Rendered width in px. Height is derived from the logo aspect ratio. */
  width?: number;
  /** `white` for dark backgrounds (navy/red), `color` for light backgrounds. */
  variant?: 'white' | 'color';
}

export function EpirusLogo({ width = 120, variant = 'white' }: EpirusLogoProps) {
  const Logo = variant === 'white' ? LogoWhite : LogoColor;
  return <Logo width={width} height={width / ASPECT} />;
}
