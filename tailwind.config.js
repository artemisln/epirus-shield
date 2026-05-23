/** @type {import('tailwindcss').Config} */
// Design tokens ported from the Epirus Shield web app (src/app/globals.css).
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './providers/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#222222',
        primary: {
          DEFAULT: '#243B72', // Epirus navy
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#bb1616', // alert red — scam / warning
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#717171',
          light: '#dddddd',
        },
        surface: {
          DEFAULT: '#ffffff',
          elevated: '#f7f7f7',
        },
        border: '#ebebeb',
        success: '#008a05',
        warning: '#b45309',
        error: '#c13515',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        full: '9999px',
      },
      fontFamily: {
        // Manrope static weights from @expo-google-fonts/manrope.
        // Named distinctly from Tailwind's fontWeight utilities to avoid clashes.
        sans: ['Manrope_400Regular'],
        'sans-medium': ['Manrope_500Medium'],
        'sans-semibold': ['Manrope_600SemiBold'],
        'sans-bold': ['Manrope_700Bold'],
      },
    },
  },
  plugins: [],
};
