import type { SuperAppHeroTheme } from '@/constants/homeHero';
import { colors } from '@/constants/theme';

/**
 * Hygiene hub — cool teal / water tone, distinct from medical green.
 * Hero art: `category-hygiene-shower.webp` — shower / bath; shared with category grid tile.
 */
export const hygieneHubHero = {
  textPanel: '#2A4A52',
  textPanelDeep: '#1F3A42',
  panelGradient: ['#1F3A42', '#2A4A52', '#2E525A'] as const,
  accentWarm: '#5EC4D4',
  panelHairline: 'rgba(255, 255, 255, 0.1)',
  panelTopShade: ['rgba(12, 32, 38, 0.25)', 'transparent'] as const,
  illustrationFadeMid: 'rgba(42, 74, 82, 0.1)',
  illustrationFadeDeep: 'rgba(42, 74, 82, 0.2)',
  illustrationFadeBottom: '#2A4A52',
  illustrationWarmBloom: 'rgba(94, 196, 212, 0.14)',
  illustrationTopScrim: ['rgba(18, 40, 48, 0.2)', 'rgba(18, 40, 48, 0.06)', 'transparent'] as const,
  panelAtmosphere: ['rgba(255,255,255,0.05)', 'transparent', 'rgba(94, 196, 212, 0.06)'] as const,
  greetingTextShadow: 'rgba(8, 24, 28, 0.38)',
  bridgeMid: '#E4ECEE',
  bridgeBottom: colors.surfaceDark,
  bridgeTint: '#3D5C66',
  iconPressBg: 'rgba(255, 255, 255, 0.14)',
  heroPanelTopSeparator: false,
  illustrationBottomBlendHeightPx: 118,
  heroBannerBottomEdge: false,
  /** Warm dusk mesh is invisible on teal — use cool cyan wash in hero + panel. */
  bannerNoiseVariant: 'cool',
} as const satisfies SuperAppHeroTheme;
