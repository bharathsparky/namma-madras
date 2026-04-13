import type { SuperAppHeroTheme } from '@/constants/homeHero';
import { colors } from '@/constants/theme';

/**
 * Stay hub: text panel stays in the blue “shelter” family; hero art is the shared-room / beds scene.
 * `category-stay-room.webp` — category tile + stay hub hero (`cover` in `categoryHubVisual`).
 */
export const stayHubHero = {
  textPanel: '#2E4A63',
  textPanelDeep: '#1E1A18',
  panelGradient: ['#243748', '#2E4A63', '#334E62'] as const,
  accentWarm: '#6BB3E0',
  panelHairline: 'rgba(255, 255, 255, 0.1)',
  panelTopShade: ['rgba(14, 24, 36, 0.22)', 'transparent'] as const,
  illustrationFadeMid: 'rgba(46, 74, 99, 0.1)',
  illustrationFadeDeep: 'rgba(46, 74, 99, 0.24)',
  illustrationFadeBottom: '#2E4A63',
  illustrationWarmBloom: 'rgba(232, 170, 120, 0.08)',
  illustrationTopScrim: ['rgba(18, 28, 38, 0.28)', 'rgba(18, 28, 38, 0.06)', 'transparent'] as const,
  panelAtmosphere: ['rgba(255,255,255,0.05)', 'transparent', 'rgba(100, 170, 220, 0.07)'] as const,
  greetingTextShadow: 'rgba(12, 22, 34, 0.38)',
  bridgeMid: '#E4EBF2',
  bridgeBottom: colors.surfaceDark,
  bridgeTint: '#3D5568',
  iconPressBg: 'rgba(255, 255, 255, 0.14)',
  heroPanelTopSeparator: false,
  illustrationBottomBlendHeightPx: 118,
  heroBannerBottomEdge: false,
  illustrationBandArtHeightPx: 132,
} as const satisfies SuperAppHeroTheme;
