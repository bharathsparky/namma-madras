import type { TFunction } from 'i18next';
import type { WorkPlace } from '@/data/seeds/work';
import { FOOD_PLACE_ID_OFFSET } from '@/db/seed';
import { MEDICAL_PLACE_ID_OFFSET } from '@/db/seedHealthcare';
import { STAY_PLACE_ID_OFFSET } from '@/db/seedStay';
import { LEARN_PLACE_ID_OFFSET } from '@/db/seedLearn';
import { HYGIENE_PLACE_ID_OFFSET } from '@/db/seedHygiene';
import type { Lang, PlaceRow } from '@/db/types';

/** i18n namespace + SQLite id offset for bundled seed rows (matches `locales/hi/*.json`). */
export type SeedNamespace = 'places' | 'healthcare' | 'stay' | 'learn' | 'hygiene';

const CATEGORY_SEED: Partial<Record<number, { ns: SeedNamespace; offset: number }>> = {
  1: { ns: 'places', offset: FOOD_PLACE_ID_OFFSET },
  2: { ns: 'stay', offset: STAY_PLACE_ID_OFFSET },
  3: { ns: 'healthcare', offset: MEDICAL_PLACE_ID_OFFSET },
  7: { ns: 'learn', offset: LEARN_PLACE_ID_OFFSET },
  9: { ns: 'hygiene', offset: HYGIENE_PLACE_ID_OFFSET },
};

export function seedMetaForPlace(place: PlaceRow): { ns: SeedNamespace; seedId: number } | null {
  const m = CATEGORY_SEED[place.category_id];
  if (!m) return null;
  const seedId = place.id - m.offset;
  if (seedId < 1) return null;
  return { ns: m.ns, seedId };
}

/** Display name: TA/EN from DB; HI from `locales/hi/{ns}.json` with English fallback. */
export function placeDisplayName(place: PlaceRow, lang: Lang, t: TFunction): string {
  if (lang === 'ta') return place.name_ta;
  if (lang === 'en') return place.name_en;
  const meta = seedMetaForPlace(place);
  if (!meta) return place.name_en;
  return t(`${meta.ns}.${meta.seedId}.name`, { defaultValue: place.name_en });
}

/** Timing / OPD / check-in line for list & detail. */
export function placeDisplayTiming(place: PlaceRow, lang: Lang, t: TFunction): string | null {
  const rawEn = place.timing_en?.trim();
  const rawTa = place.timing_ta?.trim();
  if (lang === 'ta') return rawTa || rawEn || null;
  if (lang === 'en') return rawEn || null;
  const meta = seedMetaForPlace(place);
  if (!meta || !rawEn) return rawEn || null;
  return t(`${meta.ns}.${meta.seedId}.timing`, { defaultValue: rawEn });
}

/** Work hub rows are not in SQLite — seed id matches `WORK_SEED[].id`. */
export function workDisplayName(place: WorkPlace, lang: Lang, t: TFunction): string {
  if (lang === 'ta') return place.name_ta;
  if (lang === 'en') return place.name_en;
  return t(`work.${place.id}.name`, { defaultValue: place.name_en });
}

export function workDisplayTiming(place: WorkPlace, lang: Lang, t: TFunction): string {
  if (lang === 'ta') return place.timing_ta;
  if (lang === 'en') return place.timing_en;
  return t(`work.${place.id}.timing`, { defaultValue: place.timing_en });
}

export function workDisplayNote(place: WorkPlace, lang: Lang, t: TFunction): string {
  if (lang === 'ta') return place.note_ta;
  if (lang === 'en') return place.note_en;
  return t(`work.${place.id}.note`, { defaultValue: place.note_en });
}

export function workDisplayDailyWage(place: WorkPlace, lang: Lang, t: TFunction): string {
  if (lang === 'ta') return place.daily_wage_ta;
  if (lang === 'en') return place.daily_wage_en;
  return t(`work.${place.id}.wage`, { defaultValue: place.daily_wage_en });
}
