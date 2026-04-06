import type { WorkPlace, WorkType } from '@/data/seeds/work';

/** Quick filters for labour stands — subset of `WorkType` that appears in seed data. */
export type WorkLabourFilterId =
  | 'all'
  | 'construction'
  | 'loading_unloading'
  | 'factory_industrial'
  | 'film_shoots';

export const WORK_LABOUR_FILTER_ORDER: WorkLabourFilterId[] = [
  'all',
  'construction',
  'loading_unloading',
  'factory_industrial',
  'film_shoots',
];

/**
 * Stand matches if it lists the type, or lists `all_types` (mixed hiring at that stand).
 */
export function matchesLabourWorkFilter(place: WorkPlace, id: WorkLabourFilterId): boolean {
  if (id === 'all') return true;
  if (place.work_types.includes(id as WorkType)) return true;
  if (place.work_types.includes('all_types')) return true;
  return false;
}

export function filterLabourStands(places: WorkPlace[], id: WorkLabourFilterId): WorkPlace[] {
  return places.filter((p) => matchesLabourWorkFilter(p, id));
}
