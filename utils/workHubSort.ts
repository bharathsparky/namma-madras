import { haversineKm } from '@/db/queries';
import type { WorkPlace } from '@/data/seeds/work';

const NO_COORD = 999_999;

export function sortWorkPlacesByDistance(
  places: WorkPlace[],
  lat: number | null,
  lon: number | null,
): WorkPlace[] {
  const copy = [...places];
  if (lat == null || lon == null) return copy;
  return copy.sort((a, b) => {
    const da =
      a.latitude != null && a.longitude != null
        ? haversineKm(lat, lon, a.latitude, a.longitude)
        : NO_COORD;
    const db =
      b.latitude != null && b.longitude != null
        ? haversineKm(lat, lon, b.latitude, b.longitude)
        : NO_COORD;
    return da - db;
  });
}
