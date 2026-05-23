// Ambient declaration for SVG files imported as React components
// (handled by react-native-svg-transformer).
declare module '*.svg' {
  import type React from 'react';
  import type { SvgProps } from 'react-native-svg';

  const content: React.FC<SvgProps>;
  export default content;
}
