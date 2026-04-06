/**
 * Maps better-sqlite3 (Node) to the async subset of expo-sqlite used by initDatabase + seeds.
 * Used only by scripts/generate-bundled-db.ts (not shipped in the app bundle).
 */
import type { SQLiteDatabase } from 'expo-sqlite';
import type Database from 'better-sqlite3';

function normalizeRunArgs(args: unknown[]): unknown[] {
  if (args.length === 1 && Array.isArray(args[0])) {
    return args[0] as unknown[];
  }
  return args;
}

export function createBundledAdapter(db: Database.Database): SQLiteDatabase {
  const api = {
    async execAsync(source: string): Promise<void> {
      db.exec(source);
    },

    async runAsync(source: string, ...params: unknown[]): Promise<{
      lastInsertRowId: number;
      changes: number;
    }> {
      const flat = normalizeRunArgs(params);
      const stmt = db.prepare(source);
      const r = stmt.run(...flat);
      return {
        lastInsertRowId: Number(r.lastInsertRowid),
        changes: r.changes,
      };
    },

    async getFirstAsync<T>(source: string, ...params: unknown[]): Promise<T | null> {
      const flat = normalizeRunArgs(params);
      const stmt = db.prepare(source);
      const row = stmt.get(...flat) as T | undefined;
      return row ?? null;
    },

    async getAllAsync<T>(source: string, ...params: unknown[]): Promise<T[]> {
      const flat = normalizeRunArgs(params);
      const stmt = db.prepare(source);
      return stmt.all(...flat) as T[];
    },

    async withTransactionAsync(fn: () => Promise<void>): Promise<void> {
      await fn();
    },
  };

  return api as unknown as SQLiteDatabase;
}
