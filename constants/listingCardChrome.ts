import { StyleSheet, type ViewStyle } from 'react-native';
import { listingCardLift } from '@/constants/elevation';
import { colors } from '@/constants/theme';

/** Flat list rows — hairline only; no lift (see `FoodPlaceCard` `surface="listRow"`). */
export const foodPlaceListRowDivider: ViewStyle = {
  borderBottomWidth: StyleSheet.hairlineWidth,
  borderBottomColor: colors.borderSubtle,
};

/**
 * Shared list-row chrome for hubs + food home — one elevation + border language.
 * Avoid Tailwind `border` + `/opacity` on RN roots (color often fails → black ring).
 */
export const listingCardOutline = {
  brand: { borderWidth: 1 as const, borderColor: colors.borderSubtle },
  inkSoft: { borderWidth: 1 as const, borderColor: 'rgba(31, 28, 26, 0.09)' },
  inkSofter: { borderWidth: 1 as const, borderColor: 'rgba(31, 28, 26, 0.07)' },
  hero: { borderWidth: 1 as const, borderColor: 'rgba(31, 28, 26, 0.14)' },
  hygiene: { borderWidth: 1 as const, borderColor: 'rgba(52, 152, 219, 0.22)' },
  work: { borderWidth: 1 as const, borderColor: 'rgba(212, 146, 46, 0.24)' },
  /** Emergency / SOS helplines — same shell as other hubs; warm red edge */
  emergency: { borderWidth: 1 as const, borderColor: 'rgba(226, 55, 68, 0.2)' },
} as const;

export type ListingCardOutlineKey = keyof typeof listingCardOutline;

export function listingCardShell(outline: ViewStyle): ViewStyle[] {
  return [listingCardLift, outline];
}

/** `FoodPlaceCard` `surface="card"` — hub uses brand edge; food list uses tier / deemphasis. */
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
