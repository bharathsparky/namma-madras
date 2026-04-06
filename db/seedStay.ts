import type { SQLiteDatabase } from 'expo-sqlite';
import { STAY_SEED, type StayPlace } from '@/data/seeds/stay';
import type { CostType, Frequency, GenderAccess } from '@/db/types';

export const STAY_PLACE_ID_OFFSET = 30_000;
const STAY_CATEGORY_ID = 2;
/** Bump when stay INSERT shape changes so failed / partial seeds re-run. */
const SEED_FLAG_KEY = 'stay_places_seed_v4';

function normalizePhone(raw: string | null): string | null {
  const p = raw?.trim();
  if (!p) return null;
  return p.replace(/\s+/g, ' ').trim();
}

function mapCostType(costEn: string): CostType {
  const s = costEn.toLowerCase();
  if (s.startsWith('free')) return 'free';
  if (s.includes('subsidis') || /₹\s*265|₹\s*210|ac dormitory|irctc/i.test(costEn)) return 'subsidised';
  if (/₹|rs\.|paid|fee|charge|\/night|\/12h/i.test(costEn)) return 'paid';
  return 'free';
}

function mapGenderAccess(g: StayPlace['gender']): GenderAccess {
  switch (g) {
    case 'men':
    case 'boys':
    case 'psychosocial_men':
    case 'developmental_disability_men':
      return 'men';
    case 'women':
    case 'girls':
    case 'psychosocial_women':
    case 'disability_women':
      return 'women';
    default:
      return 'all';
  }
}

export type StayPlaceInsertRow = {
  id: number;
  name_en: string;
  name_ta: string;
  category_id: number;
  sub_category: string;
  area: string;
  full_address: string;
  latitude: number | null;
  longitude: number | null;
  cost_type: CostType;
  cost_note_en: string | null;
  cost_note_ta: string | null;
  frequency: Frequency;
  serving_days: string | null;
  timing_en: string;
  timing_ta: string;
  contact_phone: string | null;
  contact_phone2: string | null;
  website: string | null;
  description_en: string | null;
  description_ta: string | null;
  cover_image_url: string | null;
  gender_access: GenderAccess;
  capacity_note: string | null;
  documents_required: string | null;
  is_verified: number;
  verified_date: string | null;
  verified_by_org: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
  is_emergency_24h: number;
  access_type: string | null;
  stay_kind: string;
  stay_gender_raw: string;
  requires_valid_ticket: number;
  includes_food: number;
  hospital_guest_only: number;
  ngo_name: string | null;
};

/** Single source of truth — column order, placeholders, and bind array must stay aligned. */
const STAY_INSERT_COLUMNS = [
  'id',
  'name_en',
  'name_ta',
  'category_id',
  'sub_category',
  'area',
  'full_address',
  'latitude',
  'longitude',
  'cost_type',
  'cost_note_en',
  'cost_note_ta',
  'frequency',
  'serving_days',
  'timing_en',
  'timing_ta',
  'contact_phone',
  'contact_phone2',
  'website',
  'description_en',
  'description_ta',
  'cover_image_url',
  'gender_access',
  'capacity_note',
  'documents_required',
  'is_verified',
  'verified_date',
  'verified_by_org',
  'is_active',
  'created_at',
  'updated_at',
  'is_emergency_24h',
  'access_type',
  'stay_kind',
  'stay_gender_raw',
  'requires_valid_ticket',
  'includes_food',
  'hospital_guest_only',
  'ngo_name',
] as const satisfies readonly (keyof StayPlaceInsertRow)[];

const INSERT_STAY_SQL = `INSERT OR REPLACE INTO places (${STAY_INSERT_COLUMNS.join(', ')}) VALUES (${STAY_INSERT_COLUMNS.map(() => '?').join(', ')})`;

function mapStayToRow(p: StayPlace, dbId: number, timestamp: string): StayPlaceInsertRow {
  const costType = mapCostType(p.cost_en);
  const costNoteEn = costType === 'free' ? null : p.cost_en;
  const costNoteTa = costType === 'free' ? null : p.cost_ta;
  const cap = p.capacity != null ? `${p.capacity} beds` : null;
  const descEn = [p.note_en.trim(), p.check_in_en.trim()].filter(Boolean).join('\n\n');
  const descTa = [p.note_ta.trim(), p.check_in_ta.trim()].filter(Boolean).join('\n\n');

  return {
    id: dbId,
    name_en: p.name_en,
    name_ta: p.name_ta,
    category_id: STAY_CATEGORY_ID,
    sub_category: p.category,
    area: p.area,
    full_address: p.full_address,
    latitude: p.latitude,
    longitude: p.longitude,
    cost_type: costType,
    cost_note_en: costNoteEn,
    cost_note_ta: costNoteTa,
    frequency: 'daily',
    serving_days: null,
    timing_en: p.check_in_en,
    timing_ta: p.check_in_ta,
    contact_phone: normalizePhone(p.phone),
    contact_phone2: normalizePhone(p.phone2),
    website: null,
    description_en: descEn || null,
    description_ta: descTa || null,
    cover_image_url: null,
    gender_access: mapGenderAccess(p.gender),
    capacity_note: cap,
    documents_required: null,
    is_verified: p.is_verified ? 1 : 0,
    verified_date: null,
    verified_by_org: null,
    is_active: 1,
    created_at: timestamp,
    updated_at: timestamp,
    is_emergency_24h: 0,
    access_type: null,
    stay_kind: p.category,
    stay_gender_raw: p.gender,
    requires_valid_ticket: p.requires_valid_ticket ? 1 : 0,
    includes_food: p.includes_food ? 1 : 0,
    hospital_guest_only: p.category === 'hospital_shelter' ? 1 : 0,
    ngo_name: p.ngo_name,
  };
}

function stayRowToBindArray(r: StayPlaceInsertRow): (string | number | null)[] {
  return STAY_INSERT_COLUMNS.map((col) => r[col]);
}

/**
 * Replaces all Stay category rows with bundled GCC / hospital / railway / etc. data.
 */
export async function seedStayDatabase(db: SQLiteDatabase): Promise<void> {
  const flag = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_config WHERE key = ?',
    [SEED_FLAG_KEY],
  );
  if (flag?.value === '1') return;

  const timestamp = new Date().toISOString();

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      'DELETE FROM saved_places WHERE place_id IN (SELECT id FROM places WHERE category_id = ?)',
      [STAY_CATEGORY_ID],
    );
    await db.runAsync(
      'DELETE FROM user_tips WHERE place_id IN (SELECT id FROM places WHERE category_id = ?)',
      [STAY_CATEGORY_ID],
    );
    await db.runAsync('DELETE FROM places WHERE category_id = ?', [STAY_CATEGORY_ID]);

    for (const p of STAY_SEED) {
      const dbId = STAY_PLACE_ID_OFFSET + p.id;
      const r = mapStayToRow(p, dbId, timestamp);
      const values = stayRowToBindArray(r);
      if (values.length !== STAY_INSERT_COLUMNS.length) {
        throw new Error(
          `Stay seed bind mismatch: ${values.length} values for ${STAY_INSERT_COLUMNS.length} columns`,
        );
      }
      await db.runAsync(INSERT_STAY_SQL, values);
    }

    await db.runAsync('INSERT OR REPLACE INTO app_config (key, value) VALUES (?, ?)', [
      SEED_FLAG_KEY,
      '1',
    ]);
  });
}
