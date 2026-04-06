import type { SQLiteDatabase } from 'expo-sqlite';
import {
  EMERGENCY_NUMBERS,
  HEALTHCARE_SEED,
  type HealthcarePlace,
} from '@/data/seeds/healthcare';
import { healthSubCategoryFromHealthcareCategory } from '@/data/seeds/healthcareFilters';
import type { CostType, Frequency, GenderAccess } from '@/db/types';

export const MEDICAL_PLACE_ID_OFFSET = 20_000;
const MEDICAL_CATEGORY_ID = 3;
const SEED_FLAG_KEY = 'healthcare_places_seed_v1';

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

function mapCostType(costEn: string): CostType {
  const s = costEn.toLowerCase();
  if (s.includes('subsidis') || s.includes('subsidy')) return 'subsidised';
  if (/\bpaid\b|₹|rs\.|fee|charge/i.test(costEn)) return 'paid';
  return 'free';
}

function mapFrequency(av: HealthcarePlace['availability']): Frequency {
  if (av === 'on_call') return 'on_call';
  return 'daily';
}

function mapGenderAccess(p: HealthcarePlace): GenderAccess {
  if (p.access_type === 'women_children') return 'women';
  return 'all';
}

function mapHealthcareToRow(p: HealthcarePlace, dbId: number, timestamp: string) {
  const subCategory = healthSubCategoryFromHealthcareCategory(p.category);
  const description_en = [p.services_en.trim(), p.note_en.trim()].filter(Boolean).join('\n\n');
  const description_ta = [p.services_ta.trim(), p.note_ta.trim()].filter(Boolean).join('\n\n');
  const primaryPhone = normalizePhone(p.phone);
  const secondary =
    normalizePhone(p.phone2) ?? normalizePhone(p.phone_toll_free);
  return {
    id: dbId,
    name_en: p.name_en,
    name_ta: p.name_ta,
    category_id: MEDICAL_CATEGORY_ID,
    sub_category: subCategory,
    area: p.area,
    full_address: p.full_address,
    latitude: p.latitude,
    longitude: p.longitude,
    cost_type: mapCostType(p.cost_en),
    cost_note_en: p.cost_en.trim() || null,
    cost_note_ta: p.cost_ta.trim() || null,
    frequency: mapFrequency(p.availability),
    serving_days: null as string | null,
    timing_en: p.opd_timing_en.trim() || null,
    timing_ta: p.opd_timing_ta.trim() || null,
    contact_phone: primaryPhone,
    contact_phone2: secondary,
    website: normalizeWebsite(p.website),
    description_en: description_en || null,
    description_ta: description_ta || null,
    cover_image_url: null as string | null,
    gender_access: mapGenderAccess(p),
    capacity_note: p.beds != null ? `${p.beds} beds` : null,
    documents_required: null as string | null,
    is_verified: p.is_verified ? 1 : 0,
    verified_date: null as string | null,
    verified_by_org: null as string | null,
    is_active: 1,
    created_at: timestamp,
    updated_at: timestamp,
    is_emergency_24h: p.is_emergency_24h ? 1 : 0,
    access_type: p.access_type,
  };
}

const INSERT_PLACE_SQL = `
INSERT OR REPLACE INTO places (
  id, name_en, name_ta, category_id, sub_category, area, full_address,
  latitude, longitude, cost_type, cost_note_en, cost_note_ta, frequency,
  serving_days, timing_en, timing_ta, contact_phone, contact_phone2, website,
  description_en, description_ta, cover_image_url, gender_access, capacity_note,
  documents_required, is_verified, verified_date, verified_by_org, is_active,
  created_at, updated_at, is_emergency_24h, access_type
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

/**
 * Loads bundled healthcare rows + SOS numbers. Replaces all `category_id = medical` places.
 * Runs once per install unless `healthcare_places_seed_v1` is cleared.
 */
export async function seedHealthcareDatabase(db: SQLiteDatabase): Promise<void> {
  const flag = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_config WHERE key = ?',
    [SEED_FLAG_KEY],
  );
  if (flag?.value === '1') return;

  const timestamp = new Date().toISOString();

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      'DELETE FROM saved_places WHERE place_id IN (SELECT id FROM places WHERE category_id = ?)',
      [MEDICAL_CATEGORY_ID],
    );
    await db.runAsync(
      'DELETE FROM user_tips WHERE place_id IN (SELECT id FROM places WHERE category_id = ?)',
      [MEDICAL_CATEGORY_ID],
    );
    await db.runAsync('DELETE FROM places WHERE category_id = ?', [MEDICAL_CATEGORY_ID]);

    for (const p of HEALTHCARE_SEED) {
      const dbId = MEDICAL_PLACE_ID_OFFSET + p.id;
      const r = mapHealthcareToRow(p, dbId, timestamp);
      await db.runAsync(INSERT_PLACE_SQL, [
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
        r.is_emergency_24h,
        r.access_type,
      ]);
    }

    await db.runAsync('DELETE FROM healthcare_sos_numbers');
    let order = 0;
    for (const row of EMERGENCY_NUMBERS) {
      await db.runAsync(
        'INSERT INTO healthcare_sos_numbers (label_en, label_ta, phone, sort_order) VALUES (?, ?, ?, ?)',
        [row.label_en, row.label_ta, row.number, order++],
      );
    }

    await db.runAsync('INSERT OR REPLACE INTO app_config (key, value) VALUES (?, ?)', [
      SEED_FLAG_KEY,
      '1',
    ]);
  });
}
