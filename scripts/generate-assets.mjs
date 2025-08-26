/*
  Generate app icon, adaptive icon foreground, splash icon, and favicon
  Outputs to assets/images:
    - icon.png               (1024x1024, opaque)
    - adaptive-icon.png      (1024x1024, transparent)
    - splash-icon.png        (2048x2048, transparent)
    - favicon.png            (256x256)
*/
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(process.cwd());
const outDir = path.join(root, 'assets', 'images');

// Brand colors: black background with white text
const BRAND_BG = '#000000';
const BRAND_FG = '#ffffff';

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

function makeLogoSVG({ size, fg = BRAND_FG }) {
  const fontSize = Math.round(size * 0.22); // relatively small text
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <text x="50%" y="52%" text-anchor="middle" dominant-baseline="middle"
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        font-weight="700" font-size="${fontSize}" fill="${fg}">
    Noturi
  </text>
</svg>`;
}

function makeRoundedRectSVG({ size, bg }) {
  const r = Math.round(size * 0.18);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="${size}" height="${size}" rx="${r}" ry="${r}" fill="${bg}"/>
</svg>`;
}

async function generateIcon() {
  const size = 1024;
  const bg = Buffer.from(makeRoundedRectSVG({ size, bg: BRAND_BG }));
  const logo = Buffer.from(makeLogoSVG({ size }));
  const out = await sharp(bg)
    .composite([{ input: logo }])
    .png({ compressionLevel: 9 })
    .toBuffer();
  await sharp(out).toFile(path.join(outDir, 'icon.png'));
}

async function generateAdaptiveForeground() {
  const size = 1024;
  const logo = Buffer.from(makeLogoSVG({ size }));
  await sharp({
    create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .png()
    .composite([{ input: logo }])
    .toFile(path.join(outDir, 'adaptive-icon.png'));
}

async function generateSplashIcon() {
  const size = 2048; // large for high DPI
  const logo = Buffer.from(makeLogoSVG({ size }));
  await sharp({
    create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .png()
    .composite([{ input: logo }])
    .toFile(path.join(outDir, 'splash-icon.png'));
}

async function generateFavicon() {
  const size = 256;
  const bg = Buffer.from(makeRoundedRectSVG({ size, bg: BRAND_BG }));
  const logo = Buffer.from(makeLogoSVG({ size }));
  await sharp(bg)
    .composite([{ input: logo }])
    .png()
    .toFile(path.join(outDir, 'favicon.png'));
}

async function main() {
  await ensureDir(outDir);
  await Promise.all([
    generateIcon(),
    generateAdaptiveForeground(),
    generateSplashIcon(),
    generateFavicon(),
  ]);
  console.log('✅ Generated assets in', outDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
