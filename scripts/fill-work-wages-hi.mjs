/**
 * Adds `wage` (Hindi) to each entry in locales/hi/work.json from WORK_SEED daily_wage_en via gtx.
 * Run: node scripts/fill-work-wages-hi.mjs
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

function extractWages(src) {
  const out = {};
  const re = /id:\s*(\d+),[\s\S]*?daily_wage_en:\s*'((?:[^'\\]|\\.)*)'/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    out[m[1]] = m[2].replace(/\\'/g, "'").replace(/\\\\/g, '\\');
  }
  return out;
}

async function main() {
  const workTs = fs.readFileSync(path.join(root, 'data/seeds/work.ts'), 'utf8');
  const wages = extractWages(workTs);
  const workJsonPath = path.join(root, 'locales/hi/work.json');
  const data = JSON.parse(fs.readFileSync(workJsonPath, 'utf8'));

  for (const id of Object.keys(data)) {
    const en = wages[id];
    if (!en) {
      console.warn('No wage for id', id);
      continue;
    }
    if (data[id].wage) {
      console.log('skip', id, '(already has wage)');
      continue;
    }
    const hi = await translateChunk(en);
    data[id].wage = hi;
    console.log('ok', id);
    await new Promise((r) => setTimeout(r, 120));
  }

  fs.writeFileSync(workJsonPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log('Wrote', workJsonPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
