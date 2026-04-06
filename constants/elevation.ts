import { Platform, type ViewStyle } from 'react-native';

/**
 * Asphalt Aloha — Low / High shadow tokens (light source perpendicular to screen).
 * @see https://asphalt.gojek.io/pages/foundations_shadows.html
 */

/** Low elevation — narrower shadow */
export const shadowLow: ViewStyle =
  Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#101010',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
    },
    android: { elevation: 1 },
    default: {},
  }) ?? {};

/** High elevation — larger spread */
export const shadowHigh: ViewStyle =
  Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#101010',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 14,
    },
    android: { elevation: 5 },
    default: {},
  }) ?? {};

/**
 * List cards — soft lift with **green-tinted** shadow (not a harsh black halo).
 * Pair with subtle `border-primary/10` edges instead of heavy ink outlines.
 */
export const listingCardLift: ViewStyle =
  Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#1A3D24',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.07,
      shadowRadius: 10,
    },
    android: { elevation: 3 },
    default: {},
  }) ?? {};

/** Alias — same as Low shadow */
export const elevationSoft = shadowLow;

/** Hero / prominent cards */
export const elevationRaised = shadowHigh;

/** Category grid tiles — soft lift, warm neutral (not harsh black). */
export const promoCategoryCardShadow: ViewStyle =
  Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#1a2430',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.11,
      shadowRadius: 16,
    },
    android: { elevation: 6 },
    default: {},
  }) ?? {};
