import type { SQLiteDatabase } from 'expo-sqlite';

/** AC / Wi‑Fi flags for Learn hub place cards. */
export async function migrateLearnPlaceColumns(db: SQLiteDatabase): Promise<void> {
  const cols = await db.getAllAsync<{ name: string }>('PRAGMA table_info(places)');
  if (!cols.some((c) => c.name === 'has_ac')) {
    await db.execAsync('ALTER TABLE places ADD COLUMN has_ac INTEGER NOT NULL DEFAULT 0');
  }
  if (!cols.some((c) => c.name === 'has_wifi')) {
    await db.execAsync('ALTER TABLE places ADD COLUMN has_wifi INTEGER NOT NULL DEFAULT 0');
  }
}
