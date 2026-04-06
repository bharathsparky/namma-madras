/**
 * Restores i18n interpolation keys ({{name}}) in hi-ui.json from en.json — translate API corrupts them.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function fixString(enStr, hiStr) {
  const fromEn = enStr.match(/\{\{[^}]+\}\}/g);
  if (!fromEn?.length) return hiStr;
  let i = 0;
  return hiStr.replace(/\{\{[^}]+\}\}/g, () => fromEn[i++] ?? '');
}

function walk(en, hi) {
  if (typeof en === 'string' && typeof hi === 'string') {
    return fixString(en, hi);
  }
  if (Array.isArray(en) && Array.isArray(hi)) {
    return en.map((e, i) => walk(e, hi[i]));
  }
  if (en && hi && typeof en === 'object' && typeof hi === 'object' && !Array.isArray(en)) {
    const o = {};
    for (const k of Object.keys(hi)) {
      o[k] = k in en ? walk(en[k], hi[k]) : hi[k];
    }
    return o;
  }
  return hi;
}

const en = JSON.parse(fs.readFileSync(path.join(root, 'i18n', 'en.json'), 'utf8'));
const brand = JSON.parse(fs.readFileSync(path.join(root, 'locales', 'en', 'translation.json'), 'utf8'));
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
const enMerged = deepMerge(en, brand);
const hi = JSON.parse(fs.readFileSync(path.join(root, 'i18n', 'hi-ui.json'), 'utf8'));
const fixed = walk(enMerged, hi);
fs.writeFileSync(path.join(root, 'i18n', 'hi-ui.json'), `${JSON.stringify(fixed, null, 2)}\n`, 'utf8');
console.log('Fixed placeholders in hi-ui.json');
