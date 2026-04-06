/**
 * Asphalt Aloha (Gojek) design foundations — public docs only.
 * @see https://asphalt.gojek.io/
 *
 * Typography: Maison Neue (Book, Demi, Bold) — app uses Manrope as licensed stand-in (en).
 * Spacing: 4px base grid. Shadows: Low / High elevation. Brand green: #00AA13.
 */
export const ASPHALT_DOC = 'https://asphalt.gojek.io/';

/** Latest Gojek green (foundations → Colors) */
export const asphaltBrandGreen = '#00AA13';

/** Green consumer theme — light fills (inferred UI roles: Fill / readable ink) */
export const asphaltGreenLight = {
  fillDefault: '#FFFFFF',
  fillCanvas: '#F3F4F6',
  fillMuted: '#E8EAED',
  ink: '#101010',
  inkSecondary: '#5C5F62',
  inkTertiary: '#8A8D91',
  border: 'rgba(16, 16, 16, 0.10)',
  onBrand: '#FFFFFF',
} as const;

/**
 * Linear type scale: base 12pt × 1.3; line heights rounded to 4px grid (typography foundations).
 */
export const asphaltType = {
  caption: { fontSize: 12, lineHeight: 16 },
  bodySmall: { fontSize: 12, lineHeight: 16 },
  bodyModerate: { fontSize: 16, lineHeight: 20 },
  titleSmall: { fontSize: 16, lineHeight: 20 },
  titleModerate: { fontSize: 20, lineHeight: 24 },
  titleLarge: { fontSize: 28, lineHeight: 32 },
  titleHero: { fontSize: 36, lineHeight: 40 },
} as const;

/** 4px spacing multiples (use via tailwind or `space * n`) */
export const asphaltSpace = (units: number) => units * 4;
