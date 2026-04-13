import type { SQLiteDatabase } from 'expo-sqlite';
import { SEED_SQL } from '@/data/seedSQL';
import { SCHEMA_SQL } from '@/db/schema';
import { migrateLearnPlaceColumns } from '@/db/migrateLearn';
import { migrateStayPlaceColumns } from '@/db/migrateStay';
import { seedDatabase } from '@/db/seed';
import { seedHealthcareDatabase } from '@/db/seedHealthcare';
import { seedLearnDatabase } from '@/db/seedLearn';
import { seedHygieneDatabase } from '@/db/seedHygiene';
import { seedStayDatabase } from '@/db/seedStay';

async function migratePlacesCoverColumn(db: SQLiteDatabase): Promise<void> {
  const cols = await db.getAllAsync<{ name: string }>('PRAGMA table_info(places)');
  if (!cols.some((c) => c.name === 'cover_image_url')) {
    await db.execAsync('ALTER TABLE places ADD COLUMN cover_image_url TEXT');
  }
}

async function migratePlacesHealthcareColumns(db: SQLiteDatabase): Promise<void> {
  const cols = await db.getAllAsync<{ name: string }>('PRAGMA table_info(places)');
  if (!cols.some((c) => c.name === 'is_emergency_24h')) {
    await db.execAsync('ALTER TABLE places ADD COLUMN is_emergency_24h INTEGER NOT NULL DEFAULT 0');
  }
  if (!cols.some((c) => c.name === 'access_type')) {
    await db.execAsync('ALTER TABLE places ADD COLUMN access_type TEXT');
  }
}

async function migrateHealthcareSosTable(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS healthcare_sos_numbers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label_en TEXT NOT NULL,
      label_ta TEXT NOT NULL,
      phone TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );
  `);
}

/** Remove Transport category + sample places (screen removed — see PRD). Runs once per install. */
async function migrateRemoveTransportCategory(db: SQLiteDatabase): Promise<void> {
  const row = await db.getFirstAsync<{ value: string }>(
    "SELECT value FROM app_config WHERE key = 'migrate_remove_transport_v1'",
  );
  if (row?.value === '1') return;

  await db.execAsync(`
    DELETE FROM saved_places WHERE place_id IN (SELECT id FROM places WHERE category_id = 4);
    DELETE FROM user_tips WHERE place_id IN (SELECT id FROM places WHERE category_id = 4);
    DELETE FROM places WHERE category_id = 4;
    DELETE FROM categories WHERE id = 4 OR slug = 'transport';
  `);

  await db.runAsync(
    "INSERT OR REPLACE INTO app_config (key, value) VALUES ('migrate_remove_transport_v1', '1')",
  );
}

/** Remove Rights & Welfare category + places. Runs once per install. */
/** Remove deprecated local-only food status table (feedback is email-only now). */
async function migrateDropPlaceStatusReportsTable(db: SQLiteDatabase): Promise<void> {
  const row = await db.getFirstAsync<{ value: string }>(
    "SELECT value FROM app_config WHERE key = 'migrate_drop_place_status_reports_v1'",
  );
  if (row?.value === '1') return;
  await db.execAsync('DROP TABLE IF EXISTS place_status_reports');
  await db.runAsync(
    "INSERT OR REPLACE INTO app_config (key, value) VALUES ('migrate_drop_place_status_reports_v1', '1')",
  );
}

async function migrateRemoveRightsCategory(db: SQLiteDatabase): Promise<void> {
  const row = await db.getFirstAsync<{ value: string }>(
    "SELECT value FROM app_config WHERE key = 'migrate_remove_rights_v1'",
  );
  if (row?.value === '1') return;

  await db.execAsync(`
    DELETE FROM saved_places WHERE place_id IN (SELECT id FROM places WHERE category_id = 6);
    DELETE FROM user_tips WHERE place_id IN (SELECT id FROM places WHERE category_id = 6);
    DELETE FROM places WHERE category_id = 6;
    DELETE FROM categories WHERE id = 6 OR slug = 'rights';
  `);

  await db.runAsync(
    "INSERT OR REPLACE INTO app_config (key, value) VALUES ('migrate_remove_rights_v1', '1')",
  );
}

/** First launch can be slow; if native/sql work hangs, fail so Suspense can surface ErrorBoundary + Retry instead of an infinite spinner. */
const INIT_TIMEOUT_MS = 120_000;

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error(`${label} timed out after ${ms / 1000}s`)), ms);
    promise.then(
      (v) => {
        clearTimeout(id);
        resolve(v);
      },
      (e) => {
        clearTimeout(id);
        reject(e);
      },
    );
  });
}

/**
 * Schema + core SQL seed (categories, emergency, non-food places). Food rows come from
 * `seedDatabase()` (`PLACES_SEED`). Invoked from `SQLiteProvider` `onInit` in `app/_layout.tsx`.
 */
async function runInitDatabase(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(SCHEMA_SQL);
  await migratePlacesCoverColumn(db);
  await migratePlacesHealthcareColumns(db);
  await migrateHealthcareSosTable(db);
  await migrateStayPlaceColumns(db);
  await migrateLearnPlaceColumns(db);
  await migrateRemoveTransportCategory(db);
  await migrateRemoveRightsCategory(db);
  await migrateDropPlaceStatusReportsTable(db);
  const row = await db.getFirstAsync<{ c: number }>('SELECT COUNT(*) as c FROM places');
  if (row && row.c === 0) {
    await db.execAsync(SEED_SQL);
  }
  await seedDatabase(db);
  await seedHealthcareDatabase(db);
  await seedStayDatabase(db);
  await seedLearnDatabase(db);
  await seedHygieneDatabase(db);
}

export async function initDatabase(db: SQLiteDatabase): Promise<void> {
  await withTimeout(runInitDatabase(db), INIT_TIMEOUT_MS, 'Database initialization');
}
