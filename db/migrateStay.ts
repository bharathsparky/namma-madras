import type { SQLiteDatabase } from 'expo-sqlite';

/** Extra columns for stay / shelter listings (seeded from `data/seeds/stay.ts`). */
export async function migrateStayPlaceColumns(db: SQLiteDatabase): Promise<void> {
  const cols = await db.getAllAsync<{ name: string }>('PRAGMA table_info(places)');
  const names = new Set(cols.map((c) => c.name));

  if (!names.has('stay_kind')) {
    await db.execAsync('ALTER TABLE places ADD COLUMN stay_kind TEXT');
  }
  if (!names.has('stay_gender_raw')) {
    await db.execAsync('ALTER TABLE places ADD COLUMN stay_gender_raw TEXT');
  }
  if (!names.has('requires_valid_ticket')) {
    await db.execAsync('ALTER TABLE places ADD COLUMN requires_valid_ticket INTEGER NOT NULL DEFAULT 0');
  }
  if (!names.has('includes_food')) {
    await db.execAsync('ALTER TABLE places ADD COLUMN includes_food INTEGER NOT NULL DEFAULT 0');
  }
  if (!names.has('hospital_guest_only')) {
    await db.execAsync('ALTER TABLE places ADD COLUMN hospital_guest_only INTEGER NOT NULL DEFAULT 0');
  }
  if (!names.has('ngo_name')) {
    await db.execAsync('ALTER TABLE places ADD COLUMN ngo_name TEXT');
  }
}
