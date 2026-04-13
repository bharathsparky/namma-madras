import { colors } from '@/constants/theme';

/** Hero tokens for food home or category hubs (stay, future categories). */
export type SuperAppHeroTheme = {
  textPanel: string;
  textPanelDeep: string;
  panelGradient: readonly [string, string, string];
  accentWarm: string;
  panelHairline: string;
  panelTopShade: readonly [string, string];
  illustrationFadeMid: string;
  /** Optional mid-dark stop before solid panel — softer than jumping mid → opaque. */
  illustrationFadeDeep?: string;
  illustrationFadeBottom: string;
  illustrationWarmBloom: string;
  illustrationTopScrim: readonly [string, string, string];
  panelAtmosphere: readonly [string, string, string];
  greetingTextShadow: string;
  bridgeMid: string;
  bridgeBottom: string;
  bridgeTint: string;
  iconPressBg: string;
  /** Illustration strip height below status bar (default 122). */
  illustrationBandArtHeightPx?: number;
  /** Bottom corner radius of the art strip; default 0 (square). Set e.g. 32 for rounded bottom corners. */
  illustrationBandBottomRadius?: number;
  /** Height of the bottom fade over the image (default 92). */
  illustrationBottomBlendHeightPx?: number;
  /** Diagonal warm bloom on the image; default true — set false for wide photo banners. */
  illustrationUseWarmBloom?: boolean;
  /** Vertical alignment of `cover` / `contain` art in the strip; default `bottom` (home skyline). */
  illustrationBandImageAlign?: 'center' | 'bottom';
  /**
   * Top “seam” under the illustration: inset shade + hairline above the greeting.
   * Disable for flush photo banners (e.g. medical) so nothing reads as a line above the title.
   */
  heroPanelTopSeparator?: boolean;
  /** Thin bottom edge tint + accent line on the art strip (medical banner). */
  heroBannerBottomEdge?: boolean;
  /**
   * Mesh overlay on illustration strip + text panel (`BannerGradientNoise`).
   * Default `dark` (warm dusk). Use `cool` for teal hubs (hygiene) where warm mesh reads invisible.
   */
  bannerNoiseVariant?: 'dark' | 'light' | 'brand' | 'cool' | 'marketplace';
};

/**
 * Hero chrome: warm dusk tied to illustration + **accessible** contrast for white text.
 * Tints echo sunset/plum from the hero art (solid surfaces, no blur).
 */
export const homeHero = {
  /** Solid “ink” behind type — slightly lifted from pure black-plum for readability */
  textPanel: '#3D3349',
  textPanelDeep: '#322A3E',
  /** Vertical panel behind greeting (subtle shift, not flat fill) */
  panelGradient: ['#383045', '#3D3349', '#403846'] as const,
  /** Sunset accent from the art — not neon; pairs with dusk */
  accentWarm: '#F0A04B',
  /** Soft line where illustration meets type block */
  panelHairline: 'rgba(255, 255, 255, 0.1)',
  /** Inset shade at top of type block (depth at seam) */
  panelTopShade: ['rgba(22, 14, 28, 0.2)', 'transparent'] as const,
  illustrationFadeMid: 'rgba(61, 51, 73, 0.1)',
  illustrationFadeDeep: 'rgba(61, 51, 73, 0.22)',
  illustrationFadeBottom: '#3D3349',
  /** Warm bloom where skyline meets type — pulls orange from the illustration */
  illustrationWarmBloom: 'rgba(232, 148, 98, 0.1)',
  /** Scrim over the top of the illustration band (status / sky) */
  illustrationTopScrim: ['rgba(26, 18, 32, 0.22)', 'rgba(26, 18, 32, 0.06)', 'transparent'] as const,
  /** Subtle wash across the text panel (ties accent to palette) */
  panelAtmosphere: ['rgba(255,255,255,0.055)', 'transparent', 'rgba(240,160,75,0.065)'] as const,
  /** Under greeting — depth without muddying type */
  greetingTextShadow: 'rgba(18, 12, 24, 0.35)',
  /** Bridge hero → app canvas — slightly warmer than neutral gray */
  bridgeMid: '#E9E2DC',
  bridgeBottom: colors.surfaceDark,
  /** Extra plum-gray stop so bridge eases into canvas */
  bridgeTint: '#4A4252',
  /** Icon hit feedback on dusk panel */
  iconPressBg: 'rgba(255, 255, 255, 0.14)',
  heroPanelTopSeparator: false,
  illustrationBottomBlendHeightPx: 118,
  heroBannerBottomEdge: false,
} as const satisfies SuperAppHeroTheme;
