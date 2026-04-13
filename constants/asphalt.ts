/**
 * Asphalt Aloha (Gojek) design foundations — public docs only.
 * @see https://asphalt.gojek.io/
 *
 * Typography: Maison Neue (Book, Demi, Bold) — English UI uses Proxima Nova (bundled); Hindi uses Manrope as Latin stand-in.
 * Spacing: 4px base grid. App brand primary: deep teal #00695C (aligned with onboarding).
 *
 * Namma Madras light theme: warm cream canvas + brown-gray inks (hospitality vs cool clinical grays).
 */
export const ASPHALT_DOC = 'https://asphalt.gojek.io/';

/** App brand primary — same teal as onboarding step 1 */
export const asphaltBrandGreen = '#00695C';

/**
 * Marketplace hero — warm charcoal with a hint of teal (brand-adjacent but not a “green wall”).
 * Android status bar should match index 0.
 */
export const marketplaceBannerGradient = ['#222826', '#2A3330', '#323E3B'] as const;

export const marketplaceStatusBarTint = marketplaceBannerGradient[0];

/** iOS elevation — warm charcoal (not pure black) for shadow keys */
export const warmShadowKey = '#1A1614';

/** Green consumer theme — light fills + readable ink (single source for theme + Tailwind) */
export const asphaltGreenLight = {
  fillDefault: '#FFFFFF',
  /** Main app canvas — warm cream */
  fillCanvas: '#FAF8F5',
  /** Inset wells, disabled tracks — warm gray-beige */
  fillMuted: '#EDE8E2',
  /** Primary body text — warm charcoal */
  ink: '#1F1C1A',
  inkSecondary: '#5E5854',
  inkTertiary: '#8A837D',
  border: 'rgba(31, 28, 26, 0.10)',
  onBrand: '#FFFFFF',
  /** Category chip fill on hero / selected rows — neutral warm (green reserved for CTAs) */
  selectedSurface: '#E3E0DB',
  /** Solid wash — onboarding selection, panels (neutral vs sage) */
  primaryWashSolid: '#E8E5E0',
  /** Chip ring on dark gradient — warm highlight */
  chipRingWarm: '#FFF7F0',
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
