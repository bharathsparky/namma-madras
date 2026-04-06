import type { Lang, PlaceRow } from '@/db/types';
import { localeForLang } from '@/utils/localeForLang';
import { pickTaEn } from '@/utils/pickTaEn';
import type { SortedFoodPlaceItem } from '@/utils/foodPlaceSort';

function costRank(p: PlaceRow): number {
  if (p.cost_type === 'free') return 0;
  if (p.cost_type === 'subsidised') return 1;
  return 2;
}

function placeName(p: PlaceRow, lang: Lang): string {
  return pickTaEn(lang, p.name_ta, p.name_en);
}

/**
 * Learn hub: **nearest first**, then free → subsidised → paid, then name.
 */
export function sortLearnHubPlaces(items: SortedFoodPlaceItem[], lang: Lang): SortedFoodPlaceItem[] {
  const copy = [...items];
  copy.sort((a, b) => {
    const da = a.distanceKm ?? 999;
    const db = b.distanceKm ?? 999;
    if (da !== db) return da - db;
    const ca = costRank(a.place);
    const cb = costRank(b.place);
    if (ca !== cb) return ca - cb;
    return placeName(a.place, lang).localeCompare(placeName(b.place, lang), localeForLang(lang));
  });
  return copy;
}
