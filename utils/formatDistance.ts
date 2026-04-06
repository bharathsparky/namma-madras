import type { TFunction } from 'i18next';
import type { Lang } from '@/db/types';
import { toTamilNumerals } from '@/utils/tamilNumerals';

/**
 * Zomato-style line: "700 m away", "1.2 km away" (EN) / Tamil equivalents.
 * Under 1 km → metres; 1 km+ → km with one decimal when &lt; 10 km.
 */
export function formatDistanceAway(
  distanceKm: number,
  lang: Lang,
  tamilNumerals: boolean,
  t: TFunction,
): string {
  if (!Number.isFinite(distanceKm) || distanceKm < 0) return '';

  if (distanceKm < 1) {
    const m = Math.round(distanceKm * 1000);
    const numStr = lang === 'ta' && tamilNumerals ? toTamilNumerals(m, 0) : String(m);
    return t('common.distanceMetersAway', { m: numStr });
  }

  const kmStr =
    distanceKm < 10
      ? (() => {
          const r = Math.round(distanceKm * 10) / 10;
          return Number.isInteger(r) ? String(r) : r.toFixed(1);
        })()
      : String(Math.round(distanceKm));

  if (lang === 'ta' && tamilNumerals) {
    const n = parseFloat(kmStr);
    const decimals = kmStr.includes('.') ? 1 : 0;
    const numStr = toTamilNumerals(n, decimals);
    return t('common.distanceKmAway', { km: numStr });
  }

  return t('common.distanceKmAway', { km: kmStr });
}
