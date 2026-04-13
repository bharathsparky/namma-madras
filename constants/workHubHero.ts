import type { SuperAppHeroTheme } from '@/constants/homeHero';
import { colors } from '@/constants/theme';

/**
 * Work hub — warm amber aligned with category work #D4922E.
 * Hero art: `category-work-hard-hat.webp` — hard hat + gloves; shared with category grid tile.
 */
export const workHubHero = {
  textPanel: '#4A3828',
  textPanelDeep: '#3D2E20',
  panelGradient: ['#3D3224', '#4A3828', '#524230'] as const,
  accentWarm: '#E8B86A',
  panelHairline: 'rgba(255, 255, 255, 0.1)',
  panelTopShade: ['rgba(24, 18, 12, 0.22)', 'transparent'] as const,
  illustrationFadeMid: 'rgba(74, 56, 40, 0.1)',
  illustrationFadeDeep: 'rgba(74, 56, 40, 0.22)',
  illustrationFadeBottom: '#4A3828',
  illustrationWarmBloom: 'rgba(232, 184, 106, 0.1)',
  illustrationTopScrim: ['rgba(28, 22, 16, 0.2)', 'rgba(28, 22, 16, 0.06)', 'transparent'] as const,
  panelAtmosphere: ['rgba(255,255,255,0.05)', 'transparent', 'rgba(212, 146, 46, 0.08)'] as const,
  greetingTextShadow: 'rgba(12, 10, 8, 0.38)',
  bridgeMid: '#EDE8E0',
  bridgeBottom: colors.surfaceDark,
  bridgeTint: '#5C4D3A',
  iconPressBg: 'rgba(255, 255, 255, 0.14)',
  heroPanelTopSeparator: false,
  illustrationBottomBlendHeightPx: 112,
  heroBannerBottomEdge: false,
} as const satisfies SuperAppHeroTheme;
