/**
 * Builds i18n/hi-ui.json — Hindi UI strings mirroring en.json + locales/en/translation.json.
 * Run: node scripts/build-hi-ui.mjs
 */
import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

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

async function translateDeep(obj, pathStr = '') {
  if (typeof obj === 'string') {
    process.stdout.write(`\r${pathStr.slice(0, 60).padEnd(60)}`);
    const out = await translateText(obj);
    await delay(100);
    return out;
  }
  if (Array.isArray(obj)) {
    const out = [];
    for (let i = 0; i < obj.length; i++) {
      out.push(await translateDeep(obj[i], `${pathStr}[${i}]`));
    }
    return out;
  }
  if (obj && typeof obj === 'object') {
    const out = {};
    const keys = Object.keys(obj);
    let k = 0;
    for (const key of keys) {
      k += 1;
      process.stdout.write(`\r${pathStr}.${key} (${k}/${keys.length})`.padEnd(70));
      out[key] = await translateDeep(obj[key], `${pathStr}.${key}`);
    }
    return out;
  }
  return obj;
}

function deepMerge(a, b) {
  const out = { ...a };
  for (const k of Object.keys(b)) {
    if (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k]) && a[k] && typeof a[k] === 'object' && !Array.isArray(a[k])) {
      out[k] = deepMerge(a[k], b[k]);
    } else {
      out[k] = b[k];
    }
  }
  return out;
}

async function main() {
  const en = JSON.parse(fs.readFileSync(path.join(root, 'i18n', 'en.json'), 'utf8'));
  const brand = JSON.parse(fs.readFileSync(path.join(root, 'locales', 'en', 'translation.json'), 'utf8'));
  const merged = deepMerge(en, brand);
  console.log('Translating UI strings to Hindi (this may take several minutes)…');
  const hi = await translateDeep(merged, 'root');
  const outPath = path.join(root, 'i18n', 'hi-ui.json');
  fs.writeFileSync(outPath, `${JSON.stringify(hi, null, 2)}\n`, 'utf8');
  console.log(`\nWrote ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
