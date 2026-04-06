/**
 * Stay hub amber / reality-banner colors as plain RN values.
 * NativeWind often fails on `border-[#hex]/opacity` and `bg-[#hex]/opacity` (slash on arbitrary hex).
 */
export const STAY_AMBER_TICKET = {
  borderColor: 'rgba(212, 160, 23, 0.4)',
  backgroundCard: '#FFF8E6',
  backgroundPanel: 'rgba(255, 248, 230, 0.95)',
  textLabel: '#7A5A00',
  textDetail: '#5C4500',
  icon: '#A67C00',
} as const;

export const STAY_REALITY_BANNER = {
  borderColor: 'rgba(196, 165, 116, 0.35)',
  background: '#FDF6E8',
  icon: '#B8860B',
} as const;
