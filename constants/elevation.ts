import { Platform, type ViewStyle } from 'react-native';

import { warmShadowKey } from '@/constants/asphalt';

/**
 * Asphalt Aloha — Low / High shadow tokens (light source perpendicular to screen).
 * Kept **subtle** app-wide: borders carry separation; shadows only hint depth.
 * @see https://asphalt.gojek.io/pages/foundations_shadows.html
 */

/** Low elevation — hairline lift */
export const shadowLow: ViewStyle =
  Platform.select<ViewStyle>({
    ios: {
      shadowColor: warmShadowKey,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 3,
    },
    android: { elevation: 1 },
    default: {},
  }) ?? {};

/** High elevation — promo / hero tiles (still restrained) */
export const shadowHigh: ViewStyle =
  Platform.select<ViewStyle>({
    ios: {
      shadowColor: warmShadowKey,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 7,
    },
    android: { elevation: 2 },
    default: {},
  }) ?? {};

/**
 * List rows (`FoodPlaceCard`, hub cards) — border does separation; shadow is a hairline only.
 */
export const listingCardLift: ViewStyle =
  Platform.select<ViewStyle>({
    ios: {
      shadowColor: warmShadowKey,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.014,
      shadowRadius: 2,
    },
    android: { elevation: 1 },
    default: {},
  }) ?? {};

/** Alias — same as Low shadow */
export const elevationSoft = shadowLow;

/** Hero / prominent cards (e.g. medical SOS strip) */
export const elevationRaised = shadowHigh;

/** Category grid tiles — barely-there depth */
export const promoCategoryCardShadow: ViewStyle =
  Platform.select<ViewStyle>({
    ios: {
      shadowColor: warmShadowKey,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.045,
      shadowRadius: 8,
    },
    android: { elevation: 3 },
    default: {},
  }) ?? {};
