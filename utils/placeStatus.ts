import type { TFunction } from 'i18next';
import type { Lang } from '@/db/types';
import type { PlaceRow } from '@/db/types';
import { colors } from '@/constants/theme';
import { placeDisplayTiming } from '@/utils/seedLocale';

export type PlaceStatusKind = 'open' | 'closed' | 'upcoming';

/** Lightweight display helper — does not parse complex timing rules. */
export function getPlaceStatusChip(
  place: PlaceRow,
  lang: Lang,
  t: TFunction,
): { kind: PlaceStatusKind; label: string } {
  const timing =
    lang === 'ta'
      ? place.timing_ta || place.timing_en
      : lang === 'hi'
        ? placeDisplayTiming(place, lang, t) || place.timing_en || place.timing_ta
        : place.timing_en || place.timing_ta;
  const low = (timing || '').toLowerCase();
  if (low.includes('24/7') || low.includes('24×7')) {
    return {
      kind: 'open',
      label: t('common.openNow'),
    };
  }
  if (place.frequency === 'on_call') {
    return {
      kind: 'upcoming',
      label: t('common.onCall'),
    };
  }
  if (timing) {
    return { kind: 'upcoming', label: timing };
  }
  return {
    kind: 'upcoming',
    label: t('common.seeTimings'),
  };
}

/** Dot + label color for hub list cards (non-food) — matches food tier dot semantics. */
export function hubAccentForStatusKind(kind: PlaceStatusKind): { dot: string; label: string } {
  if (kind === 'open') return { dot: colors.badgeOpen, label: colors.badgeOpen };
  if (kind === 'closed') return { dot: colors.badgeClosed, label: colors.badgeClosed };
  return { dot: colors.badgeUpcoming, label: colors.inkMuted };
}
