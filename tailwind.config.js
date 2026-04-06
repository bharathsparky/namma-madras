/** @type {import('tailwindcss').Config} */
/** Asphalt Aloha Green (consumer) — brand #00AA13, 4px grid, tinted neutrals (no pure #000/#fff). */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#00AA13',
        'primary-dim': '#008F0F',
        'on-primary': '#FFFFFF',
        ink: '#101010',
        'ink-muted': '#5C5F62',
        'ink-faint': '#8A8D91',
        'surface-dark': '#F3F4F6',
        'surface-card-dark': '#FFFFFF',
        'surface-inset': '#E8EAED',
        accent: '#E23744',
        'accent-deep': '#C62A36',
        emergency: '#E23744',
        'badge-free': '#008F0F',
        'badge-subsidised': '#B8890F',
        'badge-open': '#1F8A4A',
        'badge-closed': '#C73D38',
        'badge-upcoming': '#C9780F',
        food: '#C45A2E',
        stay: '#3D7AB8',
        medical: '#2A9B62',
        work: '#D4922E',
        learn: '#1FA896',
        hygiene: '#3498DB',
      },
      fontFamily: {
        mukta: ['MuktaMalar_400Regular'],
        'mukta-medium': ['MuktaMalar_500Medium'],
        'mukta-bold': ['MuktaMalar_700Bold'],
        /** Maison Neue stand-in (Book / Demi / Bold → 400 / 600 / 700) */
        sans: ['Manrope_400Regular'],
        'sans-medium': ['Manrope_600SemiBold'],
        'sans-bold': ['Manrope_700Bold'],
      },
    },
  },
  plugins: [],
};
