import type { Lang, PlaceRow } from '@/db/types';
import { localeForLang } from '@/utils/localeForLang';
import { pickTaEn } from '@/utils/pickTaEn';
import type { PlaceWithDistance } from '@/db/queries';
import { getArrivalHintKey, getFirstMealWindowStart } from '@/utils/mealArrivalHint';
import { travelMinutesFromDistanceKm } from '@/utils/travelEta';

/** Home food list ordering (after tier/distance base list is built). */
export type HomeFoodSortId = 'smart' | 'nearest' | 'meal_window' | 'name';

const NO_DISTANCE = 1e9;
const NO_MEAL_START = 9999;

export type FoodServingTier = 0 | 1 | 2;

export type SortedFoodPlaceItem = {
  place: PlaceRow | PlaceWithDistance;
  tier: FoodServingTier;
  /** Closed / before window — Zomato-style de-emphasis */
  dimmed: boolean;
  distanceKm?: number;
  etaMinutes?: number;
};

function distanceOf(p: PlaceRow | PlaceWithDistance): number | undefined {
  return 'distanceKm' in p ? p.distanceKm : undefined;
}

function placeName(p: PlaceRow, lang: Lang): string {
  return pickTaEn(lang, p.name_ta, p.name_en);
}

/**
 * Tier 0: likely serving when you arrive (or always open / closing soon).
 * Tier 1: unknown / on call — still worth showing prominently.
 * Tier 2: late or before today’s window — greyed, sorted to bottom.
 */
export function getFoodServingTier(place: PlaceRow, now: Date, travelMinutes: number): FoodServingTier {
  if (place.frequency === 'on_call') return 1;
  const hint = getArrivalHintKey(place, travelMinutes, now);
  if (hint === 'likely' || hint === 'always_open' || hint === 'closing_soon') return 0;
  if (hint === 'late' || hint === 'before_open') return 2;
  return 1;
}

export function buildSortedFoodPlaces(
  places: PlaceRow[] | PlaceWithDistance[],
  now: Date,
  lang: Lang,
): SortedFoodPlaceItem[] {
  const items: SortedFoodPlaceItem[] = places.map((place) => {
    const distanceKm = distanceOf(place);
    const etaMinutes =
      distanceKm != null ? travelMinutesFromDistanceKm(distanceKm) : 0;
    const tier = getFoodServingTier(place, now, etaMinutes);
    return {
      place,
      tier,
      dimmed: tier === 2,
      distanceKm,
      etaMinutes: distanceKm != null ? etaMinutes : undefined,
    };
  });

  items.sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier;
    const da = a.distanceKm ?? 999;
    const db = b.distanceKm ?? 999;
    if (da !== db) return da - db;
    return placeName(a.place, lang).localeCompare(placeName(b.place, lang));
  });

  return items;
}

function mealWindowSortKey(place: PlaceRow): number {
  const start = getFirstMealWindowStart(place);
  return start == null ? NO_MEAL_START : start;
}

/**
 * Re-orders food list chips without recomputing tiers.
 * `smart` keeps the default: open / likely first, then distance, then name.
 */
export function sortFoodPlaceItems(
  items: SortedFoodPlaceItem[],
  mode: HomeFoodSortId,
  lang: Lang,
): SortedFoodPlaceItem[] {
  if (mode === 'smart') return [...items];

  const copy = [...items];
  const loc = localeForLang(lang);

  if (mode === 'nearest') {
    copy.sort((a, b) => {
      const da = a.distanceKm ?? NO_DISTANCE;
      const db = b.distanceKm ?? NO_DISTANCE;
      if (da !== db) return da - db;
      return placeName(a.place, lang).localeCompare(placeName(b.place, lang), loc);
    });
    return copy;
  }

  if (mode === 'name') {
    copy.sort((a, b) => placeName(a.place, lang).localeCompare(placeName(b.place, lang), loc));
    return copy;
  }

  // meal_window — earliest listed serving window first; unclear timings last
  copy.sort((a, b) => {
    const ka = mealWindowSortKey(a.place);
    const kb = mealWindowSortKey(b.place);
    if (ka !== kb) return ka - kb;
    return placeName(a.place, lang).localeCompare(placeName(b.place, lang), loc);
  });
  return copy;
}
