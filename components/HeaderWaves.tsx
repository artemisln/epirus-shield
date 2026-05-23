import Svg, { Path, Rect } from 'react-native-svg';

interface WaveProps {
  width: number;
  height: number;
}

/**
 * Navy Epirus Bank wave pattern for the dashboard header.
 * Sized explicitly (no percentages) so it reliably fills the header.
 */
export function HeaderWaves({ width, height }: WaveProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 400 260"
      preserveAspectRatio="none">
      <Rect x={0} y={0} width={400} height={260} fill="#243B72" />
      <Path
        d="M0,150 C70,116 140,184 212,156 C284,130 344,172 400,150 L400,260 L0,260 Z"
        fill="#33518d"
      />
      <Path
        d="M0,190 C84,154 152,214 238,188 C314,162 360,200 400,186 L400,260 L0,260 Z"
        fill="#74203a"
        opacity={0.9}
      />
      <Path
        d="M0,220 C96,196 182,236 264,220 C332,206 372,226 400,220 L400,260 L0,260 Z"
        fill="#3f63a8"
        opacity={0.55}
      />
    </Svg>
  );
}

/** Faint brand waves washed across the bottom of an account card. */
export function CardWaves({ width, height }: WaveProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 240 80"
      preserveAspectRatio="none">
      <Path
        d="M0,40 C44,24 92,58 140,42 C184,28 214,48 240,40 L240,80 L0,80 Z"
        fill="#243B72"
        opacity={0.07}
      />
      <Path
        d="M0,56 C50,42 104,70 160,54 C200,42 222,58 240,52 L240,80 L0,80 Z"
        fill="#bb1616"
        opacity={0.08}
      />
    </Svg>
  );
}
