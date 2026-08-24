/* Left vs right crystal: luminance richness + purple/pink vs blue/cyan hue. */
const path = require("path");
const sharp = require("sharp");

const BLACK_L = 0.12;
const GRAY_S = 0.12;
const CLIP = 0.92;

function lum(r, g, b) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return { h: h * 60, s, l };
}

function region(px, w, h, ch, box) {
  const { x0, y0, x1, y1 } = box;
  const vals = [];
  let clipped = 0;
  let colored = 0;
  let purple = 0;
  let blue = 0;
  let other = 0;
  let gray = 0;
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const i = (y * w + x) * ch;
      const r = px[i];
      const g = px[i + 1];
      const b = px[i + 2];
      const L = lum(r, g, b);
      if (L < BLACK_L) continue;
      vals.push(L);
      if (L >= CLIP) clipped++;
      const hsl = rgbToHsl(r, g, b);
      if (hsl.s < GRAY_S) {
        gray++;
        continue;
      }
      colored++;
      if (hsl.h >= 245 && hsl.h < 340) purple++;
      else if (hsl.h >= 165 && hsl.h < 245) blue++;
      else other++;
    }
  }
  const n = vals.length;
  const mean = n ? vals.reduce((a, c) => a + c, 0) / n : 0;
  const std = n ? Math.sqrt(vals.reduce((a, c) => a + (c - mean) ** 2, 0) / n) : 0;
  const pct = (a, d) => (d ? +((100 * a) / d).toFixed(2) : 0);
  return {
    n,
    mean: +mean.toFixed(4),
    std: +std.toFixed(4),
    clipPct: pct(clipped, n),
    colored,
    purplePctOfColored: pct(purple, colored),
    bluePctOfColored: pct(blue, colored),
    otherPctOfColored: pct(other, colored),
    grayPctOfBody: pct(gray, n),
  };
}

async function main() {
  const file = path.resolve(process.argv[2]);
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const ch = info.channels;
  const left = { x0: 0, y0: Math.floor(h * 0.08), x1: Math.floor(w * 0.32), y1: Math.floor(h * 0.78) };
  const right = { x0: Math.floor(w * 0.68), y0: Math.floor(h * 0.18), x1: w, y1: Math.floor(h * 0.92) };
  const out = {
    file,
    size: `${w}x${h}`,
    left: region(data, w, h, ch, left),
    right: region(data, w, h, ch, right),
  };
  out.stdRatio = out.right.std ? +(out.left.std / out.right.std).toFixed(3) : null;
  console.log(JSON.stringify(out, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
