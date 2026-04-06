import { asphaltBrandGreen, asphaltGreenLight } from '@/constants/asphalt';

/** Asphalt Aloha Green (consumer) light theme — tailwind + RN `colors` sync */
export const colors = {
  primary: asphaltBrandGreen,
  primaryDim: '#008F0F',
  onPrimary: asphaltGreenLight.onBrand,
  surfaceDark: asphaltGreenLight.fillCanvas,
  surfaceCardDark: asphaltGreenLight.fillDefault,
  surfaceInset: asphaltGreenLight.fillMuted,
  /** Secondary CTA / emphasis (not core brand primaries on public docs) */
  accent: '#E23744',
  emergency: '#E23744',
  ink: asphaltGreenLight.ink,
  inkMuted: asphaltGreenLight.inkSecondary,
  inkFaint: asphaltGreenLight.inkTertiary,
  badgeFree: '#008F0F',
  badgeSubsidised: '#B8890F',
  badgeOpen: '#1F8A4A',
  badgeClosed: '#C73D38',
  badgeUpcoming: '#C9780F',
  mutedText: 'rgba(16, 16, 16, 0.55)',
  borderSubtle: 'rgba(0, 170, 19, 0.18)',
  /** Category hub accents — same hex as `tailwind.config.js` `theme.extend.colors` */
  food: '#C45A2E',
  stay: '#3D7AB8',
  medical: '#2A9B62',
  work: '#D4922E',
  learn: '#1FA896',
  hygiene: '#3498DB',
} as const;

/**
 * Translucent and semantic RGBA for inline RN styles (matches tailwind opacity intents).
 * Prefer `className` + tailwind when possible; use `ui` for APIs that require `style={}`.
 */
export const ui = {
  primaryWash: 'rgba(0, 170, 19, 0.12)',
  badgeSubsidisedWash: 'rgba(184, 137, 15, 0.18)',
  badgeWomenOnlyWash: 'rgba(219, 39, 119, 0.14)',
  ripplePrimary: 'rgba(0, 170, 19, 0.08)',
  inkIcon75: 'rgba(22, 26, 25, 0.75)',
  inkIcon22: 'rgba(22, 26, 25, 0.22)',
  placeholderMuted: 'rgba(92, 95, 98, 0.5)',
  onboardingTrack: 'rgba(138, 141, 145, 0.4)',
  railFallback: 'rgba(22, 26, 25, 0.18)',
  accentFillInvalid: 'rgba(16, 16, 16, 0.08)',
  heroRippleLight: 'rgba(255, 255, 255, 0.22)',
  heroTagline: 'rgba(255, 252, 250, 0.86)',
  heroTime: 'rgba(255, 252, 250, 0.88)',
  dividerSubtle: 'rgba(16, 16, 16, 0.08)',
  switchThumbOff: '#F4F4F5',
  emergencyBorder14: 'rgba(226, 55, 68, 0.14)',
  emergencyWash10: 'rgba(226, 55, 68, 0.1)',
  emergencyWash09: 'rgba(226, 55, 68, 0.09)',
  emergencyBorder18: 'rgba(226, 55, 68, 0.18)',
  emergencyBorder20: 'rgba(226, 55, 68, 0.2)',
  emergencyGradientTop: ['rgba(226, 55, 68, 0.09)', 'rgba(255, 255, 255, 0)'] as const,
  medicalChipBorder: 'rgba(42, 155, 98, 0.22)',
  onHeroIconMuted: 'rgba(255, 255, 255, 0.5)',
  onPrimary92: 'rgba(255, 255, 255, 0.92)',
  /**
   * Warm-tinted body text on **light** surfaces (timings, NGO notes).
   * Must meet contrast on `surface-card-dark` / white — not the old light-beige-on-light mistake.
   */
  captionWarm: 'rgba(52, 46, 42, 0.94)',
} as const;
