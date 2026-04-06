import type { SQLiteDatabase } from 'expo-sqlite';
import type { CategoryRow, EmergencyContactRow, HealthcareSosRow, PlaceRow } from '@/db/types';

const EARTH_KM = 6371;

export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}

export function getEmergencyContacts(db: SQLiteDatabase): EmergencyContactRow[] {
  return db.getAllSync<EmergencyContactRow>(
    'SELECT * FROM emergency_contacts ORDER BY sort_order ASC',
  );
}

export function getCategories(db: SQLiteDatabase): CategoryRow[] {
  return db.getAllSync<CategoryRow>('SELECT * FROM categories ORDER BY sort_order ASC');
}

export function getCategoryBySlug(db: SQLiteDatabase, slug: string): CategoryRow | null {
  return db.getFirstSync<CategoryRow>('SELECT * FROM categories WHERE slug = ?', slug);
}

export function getPlacesByCategory(
  db: SQLiteDatabase,
  categoryId: number,
  opts?: { costFreeOnly?: boolean },
): PlaceRow[] {
  let sql = 'SELECT * FROM places WHERE is_active = 1 AND category_id = ?';
  const params: (string | number)[] = [categoryId];
  if (opts?.costFreeOnly) {
    sql += " AND cost_type = 'free'";
  }
  sql += ' ORDER BY name_en ASC';
  return db.getAllSync<PlaceRow>(sql, ...params);
}

/** Stay hub: free first, then subsidised, then paid; then name. */
export function getStayPlaces(db: SQLiteDatabase): PlaceRow[] {
  return db.getAllSync<PlaceRow>(
    `SELECT * FROM places
     WHERE is_active = 1 AND category_id = 2
     ORDER BY CASE cost_type WHEN 'free' THEN 0 WHEN 'subsidised' THEN 1 ELSE 2 END,
              name_en ASC`,
  );
}

export function getPlaceById(db: SQLiteDatabase, id: number): PlaceRow | null {
  return db.getFirstSync<PlaceRow>('SELECT * FROM places WHERE id = ? AND is_active = 1', id);
}

export function searchPlaces(db: SQLiteDatabase, query: string): PlaceRow[] {
  const q = query.trim();
  if (!q) return [];
  const p = `%${q.replace(/%/g, '\\%')}%`;
  return db.getAllSync<PlaceRow>(
    `SELECT * FROM places WHERE is_active = 1 AND (
      name_en LIKE ? ESCAPE '\\' OR name_ta LIKE ? ESCAPE '\\' OR area LIKE ? ESCAPE '\\'
      OR sub_category LIKE ? ESCAPE '\\' OR IFNULL(description_en,'') LIKE ? ESCAPE '\\'
      OR IFNULL(description_ta,'') LIKE ? ESCAPE '\\'
    ) ORDER BY name_en ASC LIMIT 200`,
    p,
    p,
    p,
    p,
    p,
    p,
  );
}

export type PlaceRowWithOptionalDistance = PlaceRow & { distanceKm?: number };

/** `getHubCategoryPlaces` rows may include straight-line `distanceKm` when GPS is on. */
export function distanceKmIfPresent(p: PlaceRow): number | undefined {
  const d = (p as PlaceRowWithOptionalDistance).distanceKm;
  return typeof d === 'number' ? d : undefined;
}

/** Search: when location is on, sort by straight-line distance (nearest first). */
export function searchPlacesSortedByDistance(
  db: SQLiteDatabase,
  query: string,
  lat: number | null,
  lon: number | null,
): PlaceRowWithOptionalDistance[] {
  const rows = searchPlaces(db, query);
  if (lat == null || lon == null) return rows;
  const mapped: PlaceRowWithOptionalDistance[] = rows.map((p) => {
    if (p.latitude == null || p.longitude == null) return { ...p };
    return { ...p, distanceKm: haversineKm(lat, lon, p.latitude, p.longitude) };
  });
  mapped.sort((a, b) => {
    const da = a.distanceKm;
    const db = b.distanceKm;
    if (da != null && db != null && da !== db) return da - db;
    if (da != null && db == null) return -1;
    if (da == null && db != null) return 1;
    return (a.name_en ?? '').localeCompare(b.name_en ?? '');
  });
  return mapped;
}

export function getPlacesWithCoordinates(
  db: SQLiteDatabase,
  categoryId?: number,
): PlaceRow[] {
  let sql =
    'SELECT * FROM places WHERE is_active = 1 AND latitude IS NOT NULL AND longitude IS NOT NULL';
  if (categoryId != null) {
    sql += ' AND category_id = ?';
    return db.getAllSync<PlaceRow>(sql, categoryId);
  }
  return db.getAllSync<PlaceRow>(sql);
}

export type PlaceWithDistance = PlaceRow & { distanceKm: number };

export function getNearbyPlaces(
  db: SQLiteDatabase,
  lat: number,
  lon: number,
  opts?: { categoryId?: number; maxKm?: number },
): PlaceWithDistance[] {
  const maxKm = opts?.maxKm ?? 50;
  let rows = getPlacesWithCoordinates(db, opts?.categoryId);
  const withD = rows
    .map((place) => {
      if (place.latitude == null || place.longitude == null) return null;
      const distanceKm = haversineKm(lat, lon, place.latitude, place.longitude);
      return { ...place, distanceKm };
    })
    .filter((x): x is PlaceWithDistance => x != null && x.distanceKm <= maxKm);
  withD.sort((a, b) => a.distanceKm - b.distanceKm);
  return withD;
}

/** Nearby (25 km) when location is on; otherwise alphabetical full category list. */
export function getCategoryPlacesForHome(
  db: SQLiteDatabase,
  categoryId: number,
  lat: number | null,
  lon: number | null,
): PlaceWithDistance[] | PlaceRow[] {
  if (lat != null && lon != null) {
    return getNearbyPlaces(db, lat, lon, { categoryId, maxKm: 25 });
  }
  return getPlacesByCategory(db, categoryId);
}

/**
 * Hub listings: every place in the category, with distance when coords exist.
 * Places without coordinates sort after those with distance (e.g. helplines).
 */
export function getHubCategoryPlaces(
  db: SQLiteDatabase,
  categoryId: number,
  lat: number | null,
  lon: number | null,
): PlaceWithDistance[] | PlaceRow[] {
  const rows = getPlacesByCategory(db, categoryId);
  if (lat == null || lon == null) return rows;
  const withCoords: PlaceWithDistance[] = [];
  const withoutCoords: PlaceRow[] = [];
  for (const p of rows) {
    if (p.latitude != null && p.longitude != null) {
      withCoords.push({
        ...p,
        distanceKm: haversineKm(lat, lon, p.latitude, p.longitude),
      });
    } else {
      withoutCoords.push(p);
    }
  }
  withCoords.sort((a, b) => a.distanceKm - b.distanceKm);
  return [...withCoords, ...withoutCoords];
}

export function getHealthcareSosNumbers(db: SQLiteDatabase): HealthcareSosRow[] {
  return db.getAllSync<HealthcareSosRow>(
    'SELECT * FROM healthcare_sos_numbers ORDER BY sort_order ASC, id ASC',
  );
}

export function getFoodPlacesForHome(
  db: SQLiteDatabase,
  lat: number | null,
  lon: number | null,
): PlaceWithDistance[] | PlaceRow[] {
  return getCategoryPlacesForHome(db, 1, lat, lon);
}

export function getApprovedTipForPlace(db: SQLiteDatabase, placeId: number): string | null {
  const row = db.getFirstSync<{ tip_text: string }>(
    `SELECT tip_text FROM user_tips WHERE place_id = ? AND status = 'approved' ORDER BY moderated_at DESC LIMIT 1`,
    placeId,
  );
  return row?.tip_text ?? null;
}

export function insertUserTip(db: SQLiteDatabase, placeId: number, tipText: string): void {
  db.runSync(
    `INSERT INTO user_tips (place_id, tip_text, status) VALUES (?, ?, 'pending')`,
    placeId,
    tipText.slice(0, 280),
  );
}

export function getSavedPlaceIds(db: SQLiteDatabase): number[] {
  const rows = db.getAllSync<{ place_id: number }>('SELECT place_id FROM saved_places ORDER BY saved_at DESC');
  return rows.map((r) => r.place_id);
}

export function isPlaceSaved(db: SQLiteDatabase, placeId: number): boolean {
  const row = db.getFirstSync<{ c: number }>(
    'SELECT COUNT(*) as c FROM saved_places WHERE place_id = ?',
    placeId,
  );
  return (row?.c ?? 0) > 0;
}

export function toggleSavedPlace(db: SQLiteDatabase, placeId: number, save: boolean): void {
  if (save) {
    db.runSync(
      'INSERT OR IGNORE INTO saved_places (place_id) VALUES (?)',
      placeId,
    );
  } else {
    db.runSync('DELETE FROM saved_places WHERE place_id = ?', placeId);
  }
}

export function getConfigValue(db: SQLiteDatabase, key: string): string | null {
  const row = db.getFirstSync<{ value: string }>('SELECT value FROM app_config WHERE key = ?', key);
  return row?.value ?? null;
}

export function setConfigValue(db: SQLiteDatabase, key: string, value: string): void {
  db.runSync('INSERT OR REPLACE INTO app_config (key, value) VALUES (?, ?)', key, value);
}
