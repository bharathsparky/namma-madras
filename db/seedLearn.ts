import type { SQLiteDatabase } from 'expo-sqlite';
import {
  LEARN_SEED,
  type LearnCategory,
  type LearnPlace,
} from '@/data/seeds/learn';
import type { CostType, Frequency, GenderAccess } from '@/db/types';

export const LEARN_PLACE_ID_OFFSET = 50_000;
const LEARN_CATEGORY_ID = 7;
const SEED_FLAG_KEY = 'learn_places_seed_v2';

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

function mapLearnCost(costEn: string): CostType {
  const s = costEn.toLowerCase();
  if (
    s.includes('completely free') ||
    s.includes('free entry') ||
    s.includes('free for walk-in') ||
    s.includes('free for researchers') ||
    (s.startsWith('free') && !/₹/i.test(costEn))
  ) {
    return 'free';
  }
  if (s.includes('subsidis') || s.includes('mostly free') || s.includes('highly subsidis')) return 'subsidised';
  if (/\b₹\s*5\b|\b₹\s*10\b|nominal fee|token|very low fee/i.test(costEn)) return 'subsidised';
  if (/₹|rs\.|paid|fee|\/year|\/month|membership from/i.test(costEn)) return 'paid';
  return 'free';
}

function mapLearnSubCategory(cat: LearnCategory): string {
  switch (cat) {
    case 'major_library':
    case 'branch_library':
    case 'reading_room':
      return 'library';
    case 'padaippagam':
    case 'community_learn':
      return 'study_space';
    case 'free_coaching':
      return 'exam_coaching';
    case 'skill_centre':
      return 'skill_training';
    case 'digital_library':
      return 'digital_access';
    default:
      return 'study_space';
  }
}

function flagsFromFacilities(facilitiesEn: string): { has_ac: number; has_wifi: number } {
  const hasWifi = /\bwi-?fi\b/i.test(facilitiesEn);
  const hasAc =
    /\bac\b/i.test(facilitiesEn) ||
    /air conditioning/i.test(facilitiesEn) ||
    /\bA\/C\b/i.test(facilitiesEn);
  return { has_ac: hasAc ? 1 : 0, has_wifi: hasWifi ? 1 : 0 };
}

/** Govt / reservation-priority coaching & skill rows. */
function mapLearnAccessType(id: number): string | null {
  if ([20, 21, 22, 26].includes(id)) return 'sc_st_obc_ews';
  return null;
}

function mapLearnGender(id: number): GenderAccess {
  if (id === 23) return 'women';
  return 'all';
}

function mapFrequency(p: LearnPlace): Frequency {
  if (p.category === 'free_coaching' || p.category === 'skill_centre') return 'periodic';
  return 'daily';
}

export type LearnPlaceInsertRow = {
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
  stay_kind: string | null;
  stay_gender_raw: string | null;
  requires_valid_ticket: number;
  includes_food: number;
  hospital_guest_only: number;
  ngo_name: string | null;
  has_ac: number;
  has_wifi: number;
};

export const LEARN_INSERT_COLUMNS = [
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
  'has_ac',
  'has_wifi',
] as const satisfies readonly (keyof LearnPlaceInsertRow)[];

export const INSERT_LEARN_SQL = `INSERT OR REPLACE INTO places (${LEARN_INSERT_COLUMNS.join(', ')}) VALUES (${LEARN_INSERT_COLUMNS.map(() => '?').join(', ')})`;

function mapLearnToRow(p: LearnPlace, dbId: number, timestamp: string): LearnPlaceInsertRow {
  const costType = mapLearnCost(p.cost_en);
  const costNoteEn = costType === 'free' ? null : p.cost_en;
  const costNoteTa = costType === 'free' ? null : p.cost_ta;
  const flags = flagsFromFacilities(p.facilities_en);
  const descEn = [p.note_en.trim(), p.who_can_use_en.trim(), p.facilities_en.trim()].filter(Boolean).join('\n\n');
  const descTa = [p.note_ta.trim(), p.who_can_use_ta.trim(), p.facilities_ta.trim()].filter(Boolean).join('\n\n');
  const bookingNote =
    p.requires_booking && p.booking_url
      ? `\n\nBooking: ${p.booking_url}`
      : p.requires_booking
        ? '\n\nBooking required — check website or call.'
        : '';

  return {
    id: dbId,
    name_en: p.name_en,
    name_ta: p.name_ta,
    category_id: LEARN_CATEGORY_ID,
    sub_category: mapLearnSubCategory(p.category),
    area: p.area,
    full_address: p.full_address,
    latitude: p.latitude,
    longitude: p.longitude,
    cost_type: costType,
    cost_note_en: costNoteEn,
    cost_note_ta: costNoteTa,
    frequency: mapFrequency(p),
    serving_days: null,
    timing_en: p.timing_en,
    timing_ta: p.timing_ta,
    contact_phone: normalizePhone(p.phone),
    contact_phone2: null,
    website: normalizeWebsite(p.website),
    description_en: (descEn + bookingNote).trim() || null,
    description_ta: descTa.trim() || null,
    cover_image_url: null,
    gender_access: mapLearnGender(p.id),
    capacity_note: null,
    documents_required: null,
    is_verified: p.is_verified ? 1 : 0,
    verified_date: null,
    verified_by_org: null,
    is_active: 1,
    created_at: timestamp,
    updated_at: timestamp,
    is_emergency_24h: 0,
    access_type: mapLearnAccessType(p.id),
    stay_kind: null,
    stay_gender_raw: null,
    requires_valid_ticket: 0,
    includes_food: 0,
    hospital_guest_only: 0,
    ngo_name: null,
    has_ac: flags.has_ac,
    has_wifi: flags.has_wifi,
  };
}

export function learnRowToBindArray(r: LearnPlaceInsertRow): (string | number | null)[] {
  return LEARN_INSERT_COLUMNS.map((col) => r[col]);
}

/**
 * Replaces all Learn category rows with bundled LEARN_SEED (libraries, padaippagam, coaching, …).
 */
export async function seedLearnDatabase(db: SQLiteDatabase): Promise<void> {
  const flag = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_config WHERE key = ?',
    [SEED_FLAG_KEY],
  );
  if (flag?.value === '1') return;

  const timestamp = new Date().toISOString();

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      'DELETE FROM saved_places WHERE place_id IN (SELECT id FROM places WHERE category_id = ?)',
      [LEARN_CATEGORY_ID],
    );
    await db.runAsync(
      'DELETE FROM user_tips WHERE place_id IN (SELECT id FROM places WHERE category_id = ?)',
      [LEARN_CATEGORY_ID],
    );
    await db.runAsync('DELETE FROM places WHERE category_id = ?', [LEARN_CATEGORY_ID]);

    for (const p of LEARN_SEED) {
      const dbId = LEARN_PLACE_ID_OFFSET + p.id;
      const r = mapLearnToRow(p, dbId, timestamp);
      const values = learnRowToBindArray(r);
      if (values.length !== LEARN_INSERT_COLUMNS.length) {
        throw new Error(
          `Learn seed bind mismatch: ${values.length} values for ${LEARN_INSERT_COLUMNS.length} columns`,
        );
      }
      await db.runAsync(INSERT_LEARN_SQL, values);
    }

    await db.runAsync('INSERT OR REPLACE INTO app_config (key, value) VALUES (?, ?)', [
      SEED_FLAG_KEY,
      '1',
    ]);
  });
}
