import type { SQLiteDatabase } from 'expo-sqlite';
import { PLACES_SEED, type PlaceSeed } from '@/data/seeds/places';

/** Avoid PK collisions with non-food rows seeded first (they use low auto-increment ids). */
export const FOOD_PLACE_ID_OFFSET = 10_000;

const FOOD_CATEGORY_ID = 1;
const SEED_FLAG_KEY = 'food_places_seed_v1';

function normalizeWebsite(raw: string | null): string | null {
  const w = raw?.trim();
  if (!w) return null;
  if (/^https?:\/\//i.test(w)) return w;
  return `https://${w}`;
}

function normalizePhone(raw: string | null): string | null {
  const p = raw?.trim();
  if (!p) return null;
  return p.replace(/\s+/g, ' ').trim();
}

function buildDescription(
  food: string,
  note: string,
  outsideGcc: boolean,
  lang: 'en' | 'ta',
): string {
  const parts = [food.trim(), note.trim()].filter(Boolean);
  let body = parts.join('\n\n');
  if (outsideGcc) {
    body +=
      lang === 'ta'
        ? '\n\n(GCC வரம்பிற்கு வெளியே உள்ள இடம்.)'
        : '\n\n(Location outside Greater Chennai Corporation limits.)';
  }
  return body || '';
}

function mapSeedToRow(p: PlaceSeed, dbId: number, timestamp: string) {
  const subCategory = `${p.category}_${p.sub_category}`;
  const costType = p.cost_type === 'subsidised' ? 'subsidised' : 'free';
  return {
    id: dbId,
    name_en: p.name_en,
    name_ta: p.name_ta,
    category_id: FOOD_CATEGORY_ID,
    sub_category: subCategory,
    area: p.area,
    full_address: p.full_address,
    latitude: p.latitude,
    longitude: p.longitude,
    cost_type: costType,
    cost_note_en: null as string | null,
    cost_note_ta: null as string | null,
    frequency: p.frequency,
    serving_days: null as string | null,
    timing_en: p.timing_en,
    timing_ta: p.timing_ta,
    contact_phone: normalizePhone(p.contact_phone),
    contact_phone2: normalizePhone(p.contact_phone2),
    website: normalizeWebsite(p.website),
    description_en: buildDescription(p.food_en, p.note_en, p.is_outside_gcc, 'en'),
    description_ta: buildDescription(p.food_ta, p.note_ta, p.is_outside_gcc, 'ta'),
    cover_image_url: null as string | null,
    gender_access: p.gender_access,
    capacity_note: null as string | null,
    documents_required: null as string | null,
    is_verified: p.is_verified ? 1 : 0,
    verified_date: null as string | null,
    verified_by_org: null as string | null,
    is_active: 1,
    created_at: timestamp,
    updated_at: timestamp,
  };
}

const INSERT_SQL = `
INSERT OR REPLACE INTO places (
  id, name_en, name_ta, category_id, sub_category, area, full_address,
  latitude, longitude, cost_type, cost_note_en, cost_note_ta, frequency,
  serving_days, timing_en, timing_ta, contact_phone, contact_phone2, website,
  description_en, description_ta, cover_image_url, gender_access, capacity_note,
  documents_required, is_verified, verified_date, verified_by_org, is_active,
  created_at, updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

/**
 * Loads `PLACES_SEED` into SQLite: removes existing food rows (`category_id = 1`), then upserts
 * all seed rows by primary key (`FOOD_PLACE_ID_OFFSET + seed.id`). Runs once per install unless the
 * flag `food_places_seed_v1` is cleared.
 */
export async function seedDatabase(db: SQLiteDatabase): Promise<void> {
  const flag = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_config WHERE key = ?',
    [SEED_FLAG_KEY],
  );
  if (flag?.value === '1') return;

  const timestamp = new Date().toISOString();

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      'DELETE FROM saved_places WHERE place_id IN (SELECT id FROM places WHERE category_id = ?)',
      [FOOD_CATEGORY_ID],
    );
    await db.runAsync(
      'DELETE FROM user_tips WHERE place_id IN (SELECT id FROM places WHERE category_id = ?)',
      [FOOD_CATEGORY_ID],
    );
    await db.runAsync('DELETE FROM places WHERE category_id = ?', [FOOD_CATEGORY_ID]);

    for (const p of PLACES_SEED) {
      const dbId = FOOD_PLACE_ID_OFFSET + p.id;
      const r = mapSeedToRow(p, dbId, timestamp);
      await db.runAsync(INSERT_SQL, [
        r.id,
        r.name_en,
        r.name_ta,
        r.category_id,
        r.sub_category,
        r.area,
        r.full_address,
        r.latitude,
        r.longitude,
        r.cost_type,
        r.cost_note_en,
        r.cost_note_ta,
        r.frequency,
        r.serving_days,
        r.timing_en,
        r.timing_ta,
        r.contact_phone,
        r.contact_phone2,
        r.website,
        r.description_en,
        r.description_ta,
        r.cover_image_url,
        r.gender_access,
        r.capacity_note,
        r.documents_required,
        r.is_verified,
        r.verified_date,
        r.verified_by_org,
        r.is_active,
        r.created_at,
        r.updated_at,
      ]);
    }

    await db.runAsync('INSERT OR REPLACE INTO app_config (key, value) VALUES (?, ?)', [
      SEED_FLAG_KEY,
      '1',
    ]);
  });
}
