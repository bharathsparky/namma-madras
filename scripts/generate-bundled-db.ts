/**
 * Builds assets/db/csg.db with the same schema + seeds as runtime initDatabase.
 * Run after changing seeds/schema: `npm run generate:db`
 * Commit csg.db so release APKs ship with data pre-filled (instant first open).
 */
import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { initDatabase } from '../db/initDatabase';
import { createBundledAdapter } from './bundled-sqlite-adapter';

async function main() {
  const out = path.join(process.cwd(), 'assets/db/csg.db');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  if (fs.existsSync(out)) {
    fs.unlinkSync(out);
  }

  const raw = new Database(out);
  const adapter = createBundledAdapter(raw);

  try {
    await initDatabase(adapter);
  } finally {
    raw.close();
  }

  const stat = fs.statSync(out);
  console.log(`Bundled DB written: ${out} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
