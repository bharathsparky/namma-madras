/**
 * Extract name/timing/note from seed TS files (English source for HI locale).
 * Run: node scripts/extract-seed-english.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function pick(block, key) {
  const dq = block.match(new RegExp(key + ':\\s*"([\\s\\S]*?)"\\s*,', 'm'));
  if (dq) return dq[1].replace(/\\n/g, '\n');
  const sq = block.match(new RegExp(key + ":\\s*'([\\s\\S]*?)'\\s*,", 'm'));
  if (sq) return sq[1].replace(/\\n/g, '\n');
  return null;
}

function splitObjects(content) {
  const out = [];
  let depth = 0;
  let start = -1;
  for (let i = 0; i < content.length; i++) {
    const c = content[i];
    if (c === '{') {
      if (depth === 0) start = i;
      depth++;
    } else if (c === '}') {
      depth--;
      if (depth === 0 && start >= 0) {
        out.push(content.slice(start, i + 1));
        start = -1;
      }
    }
  }
  return out;
}

function places(content) {
  const rows = {};
  for (const b of splitObjects(content)) {
    const id = (b.match(/id:\s*(\d+)/) || [])[1];
    if (!id) continue;
    const name_en = pick(b, 'name_en');
    const timing_en = pick(b, 'timing_en');
    const note_en = pick(b, 'note_en');
    if (name_en) rows[id] = { name: name_en, timing: timing_en ?? '', note: note_en ?? '' };
  }
  return rows;
}

function healthcare(content) {
  const rows = {};
  for (const b of splitObjects(content)) {
    const id = (b.match(/id:\s*(\d+)/) || [])[1];
    if (!id) continue;
    const name_en = pick(b, 'name_en');
    const timing_en = pick(b, 'opd_timing_en');
    const note_en = pick(b, 'note_en');
    if (name_en) rows[id] = { name: name_en, timing: timing_en ?? '', note: note_en ?? '' };
  }
  return rows;
}

function stay(content) {
  const rows = {};
  for (const b of splitObjects(content)) {
    const id = (b.match(/id:\s*(\d+)/) || [])[1];
    if (!id) continue;
    const name_en = pick(b, 'name_en');
    const timing_en = pick(b, 'check_in_en');
    const note_en = pick(b, 'note_en');
    if (name_en) rows[id] = { name: name_en, timing: timing_en ?? '', note: note_en ?? '' };
  }
  return rows;
}

function work(content) {
  const rows = {};
  for (const b of splitObjects(content)) {
    const id = (b.match(/id:\s*(\d+)/) || [])[1];
    if (!id) continue;
    const name_en = pick(b, 'name_en');
    const timing_en = pick(b, 'timing_en');
    const note_en = pick(b, 'note_en');
    if (name_en) rows[id] = { name: name_en, timing: timing_en ?? '', note: note_en ?? '' };
  }
  return rows;
}

function learn(content) {
  const rows = {};
  for (const b of splitObjects(content)) {
    const id = (b.match(/id:\s*(\d+)/) || [])[1];
    if (!id) continue;
    const name_en = pick(b, 'name_en');
    const timing_en = pick(b, 'timing_en');
    const note_en = pick(b, 'note_en');
    if (name_en) rows[id] = { name: name_en, timing: timing_en ?? '', note: note_en ?? '' };
  }
  return rows;
}

function hygiene(content) {
  const rows = {};
  for (const b of splitObjects(content)) {
    const id = (b.match(/id:\s*(\d+)/) || [])[1];
    if (!id) continue;
    const name_en = pick(b, 'name_en');
    const timing_en = pick(b, 'timing_en');
    const note_en = pick(b, 'note_en');
    if (name_en) rows[id] = { name: name_en, timing: timing_en ?? '', note: note_en ?? '' };
  }
  return rows;
}

const outDir = path.join(root, 'locales', 'hi');
fs.mkdirSync(outDir, { recursive: true });

const map = {
  'places.json': [path.join(root, 'data/seeds/places.ts'), places],
  'healthcare.json': [path.join(root, 'data/seeds/healthcare.ts'), healthcare],
  'stay.json': [path.join(root, 'data/seeds/stay.ts'), stay],
  'work.json': [path.join(root, 'data/seeds/work.ts'), work],
  'learn.json': [path.join(root, 'data/seeds/learn.ts'), learn],
  'hygiene.json': [path.join(root, 'data/seeds/hygiene.ts'), hygiene],
};

for (const [name, [file, fn]] of Object.entries(map)) {
  const content = fs.readFileSync(file, 'utf8');
  const data = fn(content);
  fs.writeFileSync(path.join(outDir, name), JSON.stringify(data, null, 2), 'utf8');
  console.log(name, Object.keys(data).length);
}
