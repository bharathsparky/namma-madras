import type { SuperAppHeroTheme } from '@/constants/homeHero';
import { colors } from '@/constants/theme';

/**
 * Medical hub — deep green panels aligned with category medical accent (#2A9B62).
 * Hero art: `category-medical-ambulance.webp` — ambulance scene; shared with category grid tile.
 */
export const medicalHubHero = {
  textPanel: '#1E4D3A',
  textPanelDeep: '#163C32',
  /** Top stop matches `textPanelDeep` / image fade end — no seam at the hero → panel join. */
  panelGradient: ['#163C32', '#1E4D3A', '#215945'] as const,
  accentWarm: '#6BD4A8',
  panelHairline: 'rgba(255, 255, 255, 0.1)',
  panelTopShade: ['rgba(10, 28, 22, 0.28)', 'transparent'] as const,
  /** Very light tint — most of the illustration stays visible. */
  illustrationFadeMid: 'rgba(22, 58, 46, 0.07)',
  /** Gentle second stop before solid (avoids a hard “band” of color). */
  illustrationFadeDeep: 'rgba(22, 58, 46, 0.16)',
  /** Match `textPanelDeep` + band bg — only the last part of the gradient is fully opaque. */
  illustrationFadeBottom: '#163C32',
  illustrationWarmBloom: 'rgba(100, 220, 170, 0.2)',
  /** Light scrim — status bar area stays readable without a heavy veil. */
  illustrationTopScrim: ['rgba(10, 36, 28, 0.14)', 'rgba(10, 36, 28, 0.03)', 'transparent'] as const,
  panelAtmosphere: ['rgba(255,255,255,0.05)', 'transparent', 'rgba(90, 200, 150, 0.07)'] as const,
  greetingTextShadow: 'rgba(8, 20, 16, 0.42)',
  bridgeMid: '#E8EEEA',
  bridgeBottom: colors.surfaceDark,
  /** Closer to panel + canvas so the strip below the hero doesn’t gray-shift. */
  bridgeTint: '#2E5A4A',
  iconPressBg: 'rgba(255, 255, 255, 0.14)',
  /** Taller strip for the wide medical banner. */
  illustrationBandArtHeightPx: 136,
  /** Long feather so the fade reads as atmosphere, not a slab of overlay. */
  illustrationBottomBlendHeightPx: 168,
  /** Bloom fights clean handoff on wide banners. */
  illustrationUseWarmBloom: false,
  illustrationBandImageAlign: 'center',
  heroPanelTopSeparator: false,
  /** Grounds the art + ties into the green panel without a heavy blend. */
  heroBannerBottomEdge: true,
} as const satisfies SuperAppHeroTheme;
