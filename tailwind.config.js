/** @type {import('tailwindcss').Config} */
/** App theme — brand primary #00695C, warm cream canvas, brown-gray ink, 4px grid. */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#00695C',
        'primary-dim': '#004D40',
        'ink-brand-teal': '#0E3D36',
        'on-primary': '#FFFFFF',
        ink: '#1F1C1A',
        'ink-muted': '#5E5854',
        'ink-faint': '#8A837D',
        'surface-dark': '#FAF8F5',
        'surface-card-dark': '#FFFFFF',
        'surface-inset': '#EDE8E2',
        'selected-surface': '#E3E0DB',
        'primary-wash-solid': '#E8E5E0',
        'chip-ring-warm': '#FFF7F0',
        'marketplace-status-bar': '#0A2E29',
        accent: '#E23744',
        'accent-deep': '#C62A36',
        emergency: '#E23744',
        'badge-free': '#00695C',
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
