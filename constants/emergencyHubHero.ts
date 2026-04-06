import type { SuperAppHeroTheme } from '@/constants/homeHero';
import { colors } from '@/constants/theme';

/**
 * Emergency hub — deep plum with emergency accent (#E23744) echo; readable white-on-panel.
 * Hero art: `hub-emergency-hero-banner.png` (emergency preparedness flat-lay); shared with category grid tile.
 */
export const emergencyHubHero = {
  textPanel: '#3D2E34',
  textPanelDeep: '#32262C',
  panelGradient: ['#32262C', '#3D2E34', '#423036'] as const,
  accentWarm: colors.emergency,
  panelHairline: 'rgba(255, 255, 255, 0.1)',
  panelTopShade: ['rgba(28, 14, 18, 0.22)', 'transparent'] as const,
  illustrationFadeMid: 'rgba(61, 46, 52, 0.1)',
  illustrationFadeDeep: 'rgba(61, 46, 52, 0.2)',
  illustrationFadeBottom: '#3D2E34',
  illustrationWarmBloom: 'rgba(226, 55, 68, 0.12)',
  illustrationTopScrim: ['rgba(26, 12, 18, 0.22)', 'rgba(26, 12, 18, 0.06)', 'transparent'] as const,
  panelAtmosphere: ['rgba(255,255,255,0.05)', 'transparent', 'rgba(226, 55, 68, 0.07)'] as const,
  greetingTextShadow: 'rgba(18, 8, 12, 0.38)',
  bridgeMid: '#E9E2E4',
  bridgeBottom: colors.surfaceDark,
  bridgeTint: '#52464A',
  iconPressBg: 'rgba(255, 255, 255, 0.14)',
  heroPanelTopSeparator: false,
  illustrationBottomBlendHeightPx: 118,
  heroBannerBottomEdge: false,
} as const satisfies SuperAppHeroTheme;
