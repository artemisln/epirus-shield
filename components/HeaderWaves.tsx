import { StyleSheet } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

/**
 * Decorative Epirus Bank wave pattern for the navy header.
 * Renders as an absolute-fill background; stretches to the parent's size.
 */
export function HeaderWaves() {
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 400 260"
      preserveAspectRatio="none"
      style={StyleSheet.absoluteFill}>
      <Rect x={0} y={0} width={400} height={260} fill="#243B72" />
      <Path
        d="M0,118 C70,84 140,152 212,124 C284,98 344,140 400,118 L400,260 L0,260 Z"
        fill="#33518d"
      />
      <Path
        d="M0,164 C84,128 152,192 238,162 C314,136 360,176 400,160 L400,260 L0,260 Z"
        fill="#74203a"
        opacity={0.85}
      />
      <Path
        d="M0,198 C96,170 182,216 264,198 C332,184 372,206 400,198 L400,260 L0,260 Z"
        fill="#3f63a8"
        opacity={0.55}
      />
    </Svg>
  );
}
