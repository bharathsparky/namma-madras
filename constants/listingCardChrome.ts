import type { ViewStyle } from 'react-native';
import { listingCardLift } from '@/constants/elevation';
import { colors } from '@/constants/theme';

/**
 * Shared list-row chrome for hubs + food home — one elevation + border language.
 * Avoid Tailwind `border` + `/opacity` on RN roots (color often fails → black ring).
 */
export const listingCardOutline = {
  brand: { borderWidth: 1 as const, borderColor: colors.borderSubtle },
  inkSoft: { borderWidth: 1 as const, borderColor: 'rgba(22, 26, 25, 0.09)' },
  inkSofter: { borderWidth: 1 as const, borderColor: 'rgba(22, 26, 25, 0.07)' },
  hero: { borderWidth: 1 as const, borderColor: 'rgba(0, 170, 19, 0.24)' },
  hygiene: { borderWidth: 1 as const, borderColor: 'rgba(52, 152, 219, 0.22)' },
  work: { borderWidth: 1 as const, borderColor: 'rgba(212, 146, 46, 0.24)' },
} as const;

export type ListingCardOutlineKey = keyof typeof listingCardOutline;

export function listingCardShell(outline: ViewStyle): ViewStyle[] {
  return [listingCardLift, outline];
}

/** `FoodPlaceCard` — hub uses brand edge; food list uses tier / deemphasis. */
export function foodPlaceCardOutline(
  variant: 'food' | 'hub',
  deemphasized: boolean,
  dimmed: boolean,
): ViewStyle {
  if (variant === 'hub') return listingCardOutline.brand;
  if (deemphasized) return listingCardOutline.inkSofter;
  if (dimmed) return listingCardOutline.inkSoft;
  return listingCardOutline.brand;
}
