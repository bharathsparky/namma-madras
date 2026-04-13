import { asphaltBrandGreen, asphaltGreenLight } from '@/constants/asphalt';

/** App light theme — tailwind + RN `colors` sync; primary = onboarding teal */
export const colors = {
  primary: asphaltBrandGreen,
  /** Darker teal for pressed / emphasis */
  primaryDim: '#004D40',
  /** Teal-leaning ink on light surfaces (highlights, secondary emphasis) */
  inkBrandTeal: '#0E3D36',
  onPrimary: asphaltGreenLight.onBrand,
  surfaceDark: asphaltGreenLight.fillCanvas,
  surfaceCardDark: asphaltGreenLight.fillDefault,
  surfaceInset: asphaltGreenLight.fillMuted,
  selectedSurface: asphaltGreenLight.selectedSurface,
  primaryWashSolid: asphaltGreenLight.primaryWashSolid,
  chipRingWarm: asphaltGreenLight.chipRingWarm,
  /** Secondary CTA / emphasis (not core brand primaries on public docs) */
  accent: '#E23744',
  emergency: '#E23744',
  ink: asphaltGreenLight.ink,
  inkMuted: asphaltGreenLight.inkSecondary,
  inkFaint: asphaltGreenLight.inkTertiary,
  badgeFree: asphaltBrandGreen,
  badgeSubsidised: '#B8890F',
  badgeOpen: '#1F8A4A',
  badgeClosed: '#C73D38',
  badgeUpcoming: '#C9780F',
  mutedText: 'rgba(31, 28, 26, 0.55)',
  /** List/card edges — neutral (teal would read as “everything is branded”) */
  borderSubtle: 'rgba(31, 28, 26, 0.12)',
  /** Category hub accents — same hex as `tailwind.config.js` `theme.extend.colors` */
  food: '#C45A2E',
  stay: '#3D7AB8',
  medical: '#2A9B62',
  work: '#D4922E',
  learn: '#1FA896',
  hygiene: '#3498DB',
  /** Context / promo strip on home — warm neutral dark (not solid teal) */
  contextBannerStart: '#3F3C38',
  contextBannerEnd: '#2E2C29',
} as const;

/**
 * Translucent and semantic RGBA for inline RN styles (matches tailwind opacity intents).
 * Prefer `className` + tailwind when possible; use `ui` for APIs that require `style={}`.
 */
export const ui = {
  primaryWash: 'rgba(0, 105, 92, 0.08)',
  /** Icon wells / chips where teal would over-brand */
  neutralWash: 'rgba(31, 28, 26, 0.07)',
  badgeSubsidisedWash: 'rgba(184, 137, 15, 0.18)',
  badgeWomenOnlyWash: 'rgba(219, 39, 119, 0.14)',
  ripplePrimary: 'rgba(0, 105, 92, 0.07)',
  inkIcon75: 'rgba(31, 28, 26, 0.75)',
  inkIcon22: 'rgba(31, 28, 26, 0.22)',
  placeholderMuted: 'rgba(94, 88, 84, 0.5)',
  onboardingTrack: 'rgba(138, 131, 125, 0.4)',
  railFallback: 'rgba(31, 28, 26, 0.18)',
  accentFillInvalid: 'rgba(31, 28, 26, 0.08)',
  heroRippleLight: 'rgba(255, 255, 255, 0.22)',
  heroTagline: 'rgba(255, 252, 250, 0.86)',
  heroTime: 'rgba(255, 252, 250, 0.88)',
  dividerSubtle: 'rgba(31, 28, 26, 0.08)',
  switchThumbOff: '#EDE8E5',
  emergencyBorder14: 'rgba(226, 55, 68, 0.14)',
  emergencyWash10: 'rgba(226, 55, 68, 0.1)',
  emergencyWash09: 'rgba(226, 55, 68, 0.09)',
  emergencyBorder18: 'rgba(226, 55, 68, 0.18)',
  emergencyBorder20: 'rgba(226, 55, 68, 0.2)',
  emergencyGradientTop: ['rgba(226, 55, 68, 0.09)', 'rgba(255, 255, 255, 0)'] as const,
  medicalChipBorder: 'rgba(42, 155, 98, 0.22)',
  onHeroIconMuted: 'rgba(255, 255, 255, 0.5)',
  onPrimary92: 'rgba(255, 255, 255, 0.92)',
  /** Category chip on hero — selected outer squircle */
  chipOnHeroSelectedFill: 'rgba(255, 252, 250, 0.98)',
  chipOnHeroUnselectedFill: 'rgba(255, 255, 255, 0.07)',
  chipOnHeroBorder: 'rgba(255, 255, 255, 0.28)',
  chipOnHeroImageDim: 'rgba(0, 0, 0, 0.14)',
  chipOnHeroLabelMuted: 'rgba(255, 252, 250, 0.52)',
  chipOnHeroUnderline: 'rgba(255, 252, 250, 0.95)',
  marketplaceStripShadow: '#071A17',
  brandTealMuted: 'rgba(0, 105, 92, 0.78)',
  brandTealLine: 'rgba(0, 105, 92, 0.2)',
  primaryBorderMedium: 'rgba(0, 105, 92, 0.18)',
  logoHaloFade: 'rgba(250, 248, 245, 0)',
  /**
   * Warm-tinted body text on **light** surfaces (timings, NGO notes).
   * Must meet contrast on `surface-card-dark` / white — not the old light-beige-on-light mistake.
   */
  captionWarm: 'rgba(43, 38, 35, 0.94)',
} as const;

/**
 * Onboarding tokens — `teal` matches app `colors.primary` for one brand color everywhere.
 */
export const onboarding = {
  teal: asphaltBrandGreen,
  /** Top gradient wash in OnboardingShell */
  wash: 'rgba(0, 105, 92, 0.11)',
  iconWash: 'rgba(0, 105, 92, 0.1)',
  iconWashStrong: 'rgba(0, 105, 92, 0.14)',
  selectedBg: asphaltGreenLight.primaryWashSolid,
  borderGrey: '#DDD6CE',
  /** White text on teal buttons */
  onTeal: '#FFFFFF',
} as const;
