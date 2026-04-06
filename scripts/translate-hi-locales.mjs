/**
 * Fills locales/hi/*.json with Hindi (Devanagari) using Google Translate's public gtx endpoint.
 * Run from repo root: node scripts/translate-hi-locales.mjs
 * Adds a small delay between requests to reduce rate limiting.
 */
import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const HI_DIR = path.join(root, 'locales', 'hi');

const FILES = ['places.json', 'healthcare.json', 'stay.json', 'work.json', 'learn.json', 'hygiene.json'];

function translateChunk(text) {
  const q = encodeURIComponent(text);
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${q}`;
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let d = '';
        res.on('data', (c) => {
          d += c;
        });
        res.on('end', () => {
          try {
            const j = JSON.parse(d);
            const out = j[0].map((x) => x[0]).join('');
            resolve(out);
          } catch (e) {
            reject(e);
          }
        });
      })
      .on('error', reject);
  });
}

/** URL length safe: split long strings on sentence boundaries. */
async function translateText(raw) {
  const s = (raw ?? '').trim();
  if (!s) return '';
  const max = 1800;
  if (s.length <= max) return translateChunk(s);
  const parts = s.split(/(?<=[.!?\n])\s+/);
  const chunks = [];
  let buf = '';
  for (const p of parts) {
    const next = buf ? `${buf} ${p}` : p;
    if (next.length > max && buf) {
      chunks.push(await translateChunk(buf.trim()));
      buf = p;
    } else {
      buf = next;
    }
  }
  if (buf.trim()) chunks.push(await translateChunk(buf.trim()));
  return chunks.join(' ');
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function processFile(file) {
  const fp = path.join(HI_DIR, file);
  const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
  const out = {};
  const ids = Object.keys(data).sort((a, b) => Number(a) - Number(b));
  let i = 0;
  for (const id of ids) {
    const row = data[id];
    i += 1;
    process.stdout.write(`\r${file} ${i}/${ids.length} id=${id}   `);
    out[id] = {
      name: await translateText(row.name),
      timing: await translateText(row.timing),
      note: await translateText(row.note),
    };
    await delay(120);
  }
  fs.writeFileSync(fp, JSON.stringify(out, null, 2), 'utf8');
  console.log(`\nWrote ${fp}`);
}

async function main() {
  for (const f of FILES) {
    await processFile(f);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
