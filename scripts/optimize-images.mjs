#!/usr/bin/env node
/**
 * Bundle image optimization using Sharp (https://github.com/lovell/sharp) —
 * same stack used by Next.js, Gatsby, and many CDNs.
 *
 * - Most PNGs under assets/images + assets/places → WebP (quality ~82) for smaller
 *   decode + download from the Metro bundle.
 * - Expo app icons / favicon / splash stay PNG; we only recompress PNG in place.
 *
 * Usage: npm run optimize:images
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

/** Keep PNG for Expo config + stores; only losslessly tighten PNG bytes. */
const PNG_ONLY_BASENAMES = new Set([
  'icon.png',
  'adaptive-icon.png',
  'favicon.png',
]);

const ASSET_DIRS = [path.join(ROOT, 'assets', 'images'), path.join(ROOT, 'assets', 'places')];

function walkPngJpg(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walkPngJpg(full, out);
    else if (/\.(png|jpe?g)$/i.test(name)) out.push(full);
  }
  return out;
}

function replaceInSourceFiles(replacements) {
  if (replacements.length === 0) return;
  const exts = ['.ts', '.tsx', '.js', '.mjs', '.json'];
  const skipDirs = new Set([
    'node_modules',
    '.git',
    '.cursor',
    'android/build',
    'ios/build',
    'dist',
  ]);

  function walkCode(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      if (skipDirs.has(e.name)) continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walkCode(p);
      else if (exts.some((ext) => e.name.endsWith(ext))) patchFile(p);
    }
  }

  function patchFile(file) {
    let s = fs.readFileSync(file, 'utf8');
    let n = s;
    for (const { from, to } of replacements) {
      n = n.split(from).join(to);
    }
    if (n !== s) {
      fs.writeFileSync(file, n, 'utf8');
      console.log(`  updated: ${path.relative(ROOT, file)}`);
    }
  }

  walkCode(ROOT);
}

async function main() {
  const files = ASSET_DIRS.flatMap((d) => walkPngJpg(d));
  const replacements = [];

  for (const abs of files) {
    const base = path.basename(abs);
    const rel = path.relative(ROOT, abs);

    if (PNG_ONLY_BASENAMES.has(base)) {
      const before = fs.statSync(abs).size;
      const buf = await sharp(abs)
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .toBuffer();
      if (buf.length < before) {
        fs.writeFileSync(abs, buf);
        console.log(`PNG recompress: ${rel} (${before} → ${buf.length} bytes)`);
      } else {
        console.log(`PNG skip (no win): ${rel}`);
      }
      continue;
    }

    const webpPath = abs.replace(/\.(png|jpe?g)$/i, '.webp');
    const before = fs.statSync(abs).size;

    await sharp(abs)
      .webp({ quality: 82, effort: 6, smartSubsample: true })
      .toFile(webpPath);

    const after = fs.statSync(webpPath).size;
    fs.unlinkSync(abs);

    const fromName = path.basename(abs);
    const toName = path.basename(webpPath);
    replacements.push({ from: fromName, to: toName });

    console.log(`WebP: ${rel} → ${path.basename(webpPath)} (${before} → ${after} bytes, ${Math.round((1 - after / before) * 100)}% smaller)`);
  }

  if (replacements.length) {
    console.log('\nUpdating imports…');
    replaceInSourceFiles(replacements);
  }

  console.log('\nDone. Run `npm run typecheck` and test in app.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
