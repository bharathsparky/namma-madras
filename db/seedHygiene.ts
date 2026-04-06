import type { SQLiteDatabase } from 'expo-sqlite';
import {
  HYGIENE_SEED,
  type CostTier,
  type HygieneCategory,
  type HygienePlace,
} from '@/data/seeds/hygiene';
import type { CostType, Frequency, GenderAccess } from '@/db/types';
import {
  INSERT_LEARN_SQL,
  LEARN_INSERT_COLUMNS,
  learnRowToBindArray,
  type LearnPlaceInsertRow,
} from '@/db/seedLearn';

export const HYGIENE_PLACE_ID_OFFSET = 60_000;
export const HYGIENE_CATEGORY_ID = 9;
const SEED_FLAG_KEY = 'hygiene_places_seed_v1';

function normalizePhone(raw: string | null): string | null {
  const p = raw?.trim();
  if (!p) return null;
  return p.replace(/\s+/g, ' ').trim();
}

function normalizeWebsite(raw: string | null): string | null {
  const w = raw?.trim();
  if (!w) return null;
  if (/^https?:\/\//i.test(w)) return w;
  return `https://${w}`;
}

function mapCostTier(tier: CostTier): CostType {
  if (tier === 'free') return 'free';
  if (tier === 'nominal') return 'subsidised';
  return 'paid';
}

function mapGender(g: HygienePlace['gender_access']): GenderAccess {
  if (g === 'women_only') return 'women';
  if (g === 'men_only') return 'men';
  return 'all';
}

function mapFrequency(cat: HygieneCategory): Frequency {
  if (cat === 'barber') return 'periodic';
  if (cat === 'clothes') return 'periodic';
  return 'daily';
}

function mapSubCategory(cat: HygieneCategory): string {
  return `hygiene_${cat}`;
}

function buildDescription(p: HygienePlace, lang: 'en' | 'ta'): string {
  const services = lang === 'ta' ? p.services_ta : p.services_en;
  const note = lang === 'ta' ? p.note_ta : p.note_en;
  const cost = lang === 'ta' ? p.cost_ta : p.cost_en;
  const parts = [services.trim(), note.trim(), cost.trim()];
  if (p.has_disabled_access) {
    parts.push(
      lang === 'ta' ? 'மாற்றுத்திறன் அணுகல்: உள்ளது.' : 'Disabled access: available.',
    );
  }
  return parts.filter(Boolean).join('\n\n');
}

function mapHygieneToRow(p: HygienePlace, dbId: number, timestamp: string): LearnPlaceInsertRow {
  const costType = mapCostTier(p.cost_tier);
  const costNoteEn = costType === 'free' ? null : p.cost_en;
  const costNoteTa = costType === 'free' ? null : p.cost_ta;
  const descEn = buildDescription(p, 'en');
  const descTa = buildDescription(p, 'ta');

  return {
    id: dbId,
    name_en: p.name_en,
    name_ta: p.name_ta,
    category_id: HYGIENE_CATEGORY_ID,
    sub_category: mapSubCategory(p.category),
    area: p.area,
    full_address: p.full_address,
    latitude: p.latitude,
    longitude: p.longitude,
    cost_type: costType,
    cost_note_en: costNoteEn,
    cost_note_ta: costNoteTa,
    frequency: mapFrequency(p.category),
    serving_days: null,
    timing_en: p.timing_en,
    timing_ta: p.timing_ta,
    contact_phone: normalizePhone(p.phone),
    contact_phone2: null,
    website: normalizeWebsite(p.website),
    description_en: descEn || null,
    description_ta: descTa || null,
    cover_image_url: null,
    gender_access: mapGender(p.gender_access),
    capacity_note: null,
    documents_required: null,
    is_verified: p.is_verified ? 1 : 0,
    verified_date: null,
    verified_by_org: null,
    is_active: 1,
    created_at: timestamp,
    updated_at: timestamp,
    is_emergency_24h: 0,
    access_type: p.category === 'barber' ? 'barber' : null,
    stay_kind: null,
    stay_gender_raw: null,
    requires_valid_ticket: 0,
    includes_food: 0,
    hospital_guest_only: 0,
    ngo_name: null,
    has_ac: 0,
    has_wifi: 0,
  };
}

const UPSERT_CATEGORY_SQL = `
INSERT OR REPLACE INTO categories (id, slug, label_en, label_ta, icon_name, color_hex, sort_order)
VALUES (?, ?, ?, ?, ?, ?, ?)
`;

/**
 * Loads hygiene places from `HYGIENE_SEED` and ensures category id 9 exists.
 */
export async function seedHygieneDatabase(db: SQLiteDatabase): Promise<void> {
  const flag = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_config WHERE key = ?',
    [SEED_FLAG_KEY],
  );
  if (flag?.value === '1') return;

  const timestamp = new Date().toISOString();

  await db.withTransactionAsync(async () => {
    await db.runAsync(UPSERT_CATEGORY_SQL, [
      HYGIENE_CATEGORY_ID,
      'hygiene',
      'Hygiene',
      'சுகாதாரம்',
      'water-outline',
      '#3498DB',
      6,
    ]);

    await db.runAsync(
      'DELETE FROM saved_places WHERE place_id IN (SELECT id FROM places WHERE category_id = ?)',
      [HYGIENE_CATEGORY_ID],
    );
    await db.runAsync(
      'DELETE FROM user_tips WHERE place_id IN (SELECT id FROM places WHERE category_id = ?)',
      [HYGIENE_CATEGORY_ID],
    );
    await db.runAsync('DELETE FROM places WHERE category_id = ?', [HYGIENE_CATEGORY_ID]);

    for (const p of HYGIENE_SEED) {
      const dbId = HYGIENE_PLACE_ID_OFFSET + p.id;
      const r = mapHygieneToRow(p, dbId, timestamp);
      const values = learnRowToBindArray(r);
      await db.runAsync(INSERT_LEARN_SQL, values);
    }

    await db.runAsync('INSERT OR REPLACE INTO app_config (key, value) VALUES (?, ?)', [
      SEED_FLAG_KEY,
      '1',
    ]);
  });
}
