// JS-accessible copy of the design tokens in tailwind.config.js.
// Used where NativeWind classNames cannot reach: vector-icon colors,
// ActivityIndicator, StatusBar, native style props.
export const colors = {
  background: '#ffffff',
  foreground: '#222222',
  primary: '#243B72', // Epirus navy
  primaryForeground: '#ffffff',
  secondary: '#bb1616', // alert red — scam / warning
  secondaryForeground: '#ffffff',
  muted: '#717171',
  mutedLight: '#dddddd',
  surface: '#ffffff',
  surfaceElevated: '#f7f7f7',
  border: '#ebebeb',
  success: '#008a05',
  warning: '#b45309',
  error: '#c13515',
} as const;
