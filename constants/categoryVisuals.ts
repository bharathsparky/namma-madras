import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, ui } from '@/constants/theme';

type IonName = keyof typeof Ionicons.glyphMap;

/** Curated accents + Ionicons — accents match `colors.*` / tailwind category tokens. */
export const CATEGORY_VISUAL: Record<string, { accent: string; icon: IonName }> = {
  food: { accent: colors.food, icon: 'restaurant-outline' },
  stay: { accent: colors.stay, icon: 'bed-outline' },
  medical: { accent: colors.medical, icon: 'medkit-outline' },
  work: { accent: colors.work, icon: 'briefcase-outline' },
  learn: { accent: colors.learn, icon: 'library-outline' },
  emergency: { accent: colors.emergency, icon: 'call-outline' },
  hygiene: { accent: colors.hygiene, icon: 'water-outline' },
};

export function categoryAccentForSlug(slug: string, fallbackHex: string): string {
  return CATEGORY_VISUAL[slug]?.accent ?? fallbackHex;
}

export function categoryIconForSlug(slug: string): IonName {
  return CATEGORY_VISUAL[slug]?.icon ?? 'ellipse-outline';
}

/** Gradient stops for image-forward tiles (squircle hero). */
export function categoryGradientForSlug(slug: string, fallbackHex: string): [string, string] {
  const base = CATEGORY_VISUAL[slug]?.accent ?? fallbackHex;
  return [base, `${base}B3`];
}

/** 8-digit `#RRGGBBAA` fill behind list icons (RN-supported). */
export function categoryAccentFill(accent: string, alphaByte = '24'): string {
  const core = accent.trim();
  if (!/^#[0-9A-Fa-f]{6}$/.test(core)) return ui.accentFillInvalid;
  return `${core}${alphaByte}`;
}

/** Place rows only have category_id — matches seed order in DB. */
export const CATEGORY_ID_ACCENT: Record<number, string> = {
  1: CATEGORY_VISUAL.food.accent,
  2: CATEGORY_VISUAL.stay.accent,
  3: CATEGORY_VISUAL.medical.accent,
  5: CATEGORY_VISUAL.work.accent,
  7: CATEGORY_VISUAL.learn.accent,
  8: CATEGORY_VISUAL.emergency.accent,
  9: CATEGORY_VISUAL.hygiene.accent,
};

/** Maps `places.category_id` to slug for gradients/icons on hub list cards. */
export const CATEGORY_ID_SLUG: Record<number, string> = {
  1: 'food',
  2: 'stay',
  3: 'medical',
  5: 'work',
  7: 'learn',
  8: 'emergency',
  9: 'hygiene',
};
