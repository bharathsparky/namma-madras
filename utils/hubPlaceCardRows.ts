import type { Lang, PlaceRow } from '@/db/types';
import type { PlaceWithDistance } from '@/db/queries';
import {
  buildSortedFoodPlaces,
  sortFoodPlaceItems,
  type HomeFoodSortId,
} from '@/utils/foodPlaceSort';

/**
 * Rows for `FoodPlaceCard` `variant="hub"` — same tier/distance/ETA pipeline as hub screens.
 */
export function hubPlaceCardRows(
  places: (PlaceRow | PlaceWithDistance)[],
  now: Date,
  lang: Lang,
  sort: HomeFoodSortId = 'nearest',
) {
  const sorted = buildSortedFoodPlaces(places, now, lang);
  return sortFoodPlaceItems(sorted, sort, lang);
}
