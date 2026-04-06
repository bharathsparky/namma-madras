import type { SuperAppHeroTheme } from '@/constants/homeHero';
import { colors } from '@/constants/theme';

/**
 * Learn hub: teal slate aligned with category learn `#1FA896`.
 * Hero art: `hub-learn-hero-illustration.png` (vocational / skill-building flat-lay); shared with category grid tile; `cover` in `categoryHubVisual`.
 */
export const learnHubHero = {
  textPanel: '#2A4E4A',
  textPanelDeep: '#181E1E',
  panelGradient: ['#1F3D3A', '#2A4E4A', '#2E5654'] as const,
  accentWarm: '#5EC4B8',
  panelHairline: 'rgba(255, 255, 255, 0.1)',
  panelTopShade: ['rgba(12, 28, 26, 0.22)', 'transparent'] as const,
  illustrationFadeMid: 'rgba(42, 78, 74, 0.1)',
  illustrationFadeDeep: 'rgba(42, 78, 74, 0.22)',
  illustrationFadeBottom: '#2A4E4A',
  illustrationWarmBloom: 'rgba(232, 175, 120, 0.09)',
  illustrationTopScrim: ['rgba(14, 22, 24, 0.26)', 'rgba(14, 22, 24, 0.06)', 'transparent'] as const,
  panelAtmosphere: ['rgba(255,255,255,0.05)', 'transparent', 'rgba(31, 168, 150, 0.1)'] as const,
  greetingTextShadow: 'rgba(8, 16, 16, 0.4)',
  bridgeMid: '#E4EEEC',
  bridgeBottom: colors.surfaceDark,
  bridgeTint: '#3D5C58',
  iconPressBg: 'rgba(255, 255, 255, 0.14)',
  heroPanelTopSeparator: false,
  illustrationBottomBlendHeightPx: 118,
  heroBannerBottomEdge: false,
  illustrationBandArtHeightPx: 132,
} as const satisfies SuperAppHeroTheme;
