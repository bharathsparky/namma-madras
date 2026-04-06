/** Full DDL + FTS5 (PRD §7). Executed once on fresh DB. */
export const SCHEMA_SQL = `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  label_en TEXT NOT NULL,
  label_ta TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  color_hex TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS places (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name_en TEXT NOT NULL,
  name_ta TEXT NOT NULL,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  sub_category TEXT NOT NULL,
  area TEXT NOT NULL,
  full_address TEXT NOT NULL,
  latitude REAL,
  longitude REAL,
  cost_type TEXT NOT NULL CHECK(cost_type IN ('free','subsidised','paid')),
  cost_note_en TEXT,
  cost_note_ta TEXT,
  frequency TEXT NOT NULL CHECK(frequency IN ('daily','weekly','periodic','on_call')),
  serving_days TEXT,
  timing_en TEXT,
  timing_ta TEXT,
  contact_phone TEXT,
  contact_phone2 TEXT,
  website TEXT,
  description_en TEXT,
  description_ta TEXT,
  cover_image_url TEXT,
  gender_access TEXT NOT NULL DEFAULT 'all' CHECK(gender_access IN ('all','men','women')),
  capacity_note TEXT,
  documents_required TEXT,
  is_verified INTEGER NOT NULL DEFAULT 0,
  verified_date TEXT,
  verified_by_org TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  is_emergency_24h INTEGER NOT NULL DEFAULT 0,
  access_type TEXT
);

CREATE INDEX IF NOT EXISTS idx_places_category ON places(category_id);
CREATE INDEX IF NOT EXISTS idx_places_area ON places(area);
CREATE INDEX IF NOT EXISTS idx_places_cost_type ON places(cost_type);
CREATE INDEX IF NOT EXISTS idx_places_is_active ON places(is_active);

CREATE TABLE IF NOT EXISTS emergency_contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  label_en TEXT NOT NULL,
  label_ta TEXT NOT NULL,
  phone TEXT NOT NULL,
  is_toll_free INTEGER NOT NULL DEFAULT 0,
  category TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_tips (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  place_id INTEGER NOT NULL REFERENCES places(id),
  tip_text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
  submitted_at TEXT NOT NULL DEFAULT (datetime('now')),
  moderated_at TEXT,
  moderated_by TEXT
);

CREATE TABLE IF NOT EXISTS saved_places (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  place_id INTEGER NOT NULL REFERENCES places(id),
  saved_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_saved_place_unique ON saved_places(place_id);

CREATE TABLE IF NOT EXISTS app_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS healthcare_sos_numbers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  label_en TEXT NOT NULL,
  label_ta TEXT NOT NULL,
  phone TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE VIRTUAL TABLE IF NOT EXISTS places_fts USING fts5(
  name_en,
  name_ta,
  area,
  sub_category,
  description_en,
  description_ta,
  content='places',
  content_rowid='id'
);

DROP TRIGGER IF EXISTS places_ai;
CREATE TRIGGER places_ai AFTER INSERT ON places BEGIN
  INSERT INTO places_fts(rowid, name_en, name_ta, area, sub_category, description_en, description_ta)
  VALUES (new.id, new.name_en, new.name_ta, new.area, new.sub_category, COALESCE(new.description_en,''), COALESCE(new.description_ta,''));
END;

DROP TRIGGER IF EXISTS places_au;
CREATE TRIGGER places_au AFTER UPDATE ON places BEGIN
  INSERT INTO places_fts(places_fts, rowid, name_en, name_ta, area, sub_category, description_en, description_ta)
  VALUES('delete', old.id, old.name_en, old.name_ta, old.area, old.sub_category, COALESCE(old.description_en,''), COALESCE(old.description_ta,''));
  INSERT INTO places_fts(rowid, name_en, name_ta, area, sub_category, description_en, description_ta)
  VALUES (new.id, new.name_en, new.name_ta, new.area, new.sub_category, COALESCE(new.description_en,''), COALESCE(new.description_ta,''));
END;

DROP TRIGGER IF EXISTS places_ad;
CREATE TRIGGER places_ad AFTER DELETE ON places BEGIN
  INSERT INTO places_fts(places_fts, rowid, name_en, name_ta, area, sub_category, description_en, description_ta)
  VALUES('delete', old.id, old.name_en, old.name_ta, old.area, old.sub_category, COALESCE(old.description_en,''), COALESCE(old.description_ta,''));
END;
`;
