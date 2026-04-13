/**
 * One-off: generates assets/textures/grain-neutral.png (seamless-tile-friendly noise).
 * Run: node scripts/generate-grain-texture.mjs
 */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const out = join(root, 'assets/textures/grain-neutral.png');

const W = 128;
const H = 128;
const channels = 4;
const buf = Buffer.alloc(W * H * channels);

/** Subtle neutral grain: slight luminance jitter (paper / film feel). */
for (let i = 0; i < buf.length; i += 4) {
  const j = (Math.random() + Math.random() + Math.random()) / 3;
  const n = Math.floor(210 + j * 45);
  buf[i] = n;
  buf[i + 1] = n;
  buf[i + 2] = n;
  buf[i + 3] = 255;
}

const png = await sharp(buf, {
  raw: { width: W, height: H, channels: 4 },
})
  .png({ compressionLevel: 9 })
  .toBuffer();

writeFileSync(out, png);
console.log('Wrote', out, `(${png.length} bytes)`);
