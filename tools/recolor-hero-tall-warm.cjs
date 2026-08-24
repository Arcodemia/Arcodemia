/* Recolor warm (orange/red) pixels in the mobile hero WebP toward the
   site's cool-purple peak. Same thresholds as tools/analyze-hero-hues.cjs.
   Cool / gray / black pixels are written back unchanged (no HSL round-trip). */
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const BLACK = 18;
const GRAY_S = 0.12;
const TARGET_H = 255; /* mid of the 250–260° peak measured on hero-wide */
const FEATHER = 12; /* degrees past 45° / 350° so the cutoff isn't a hard edge */

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

function hue2rgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

function hslToRgb(h, s, l) {
  h = (((h % 360) + 360) % 360) / 360;
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, h) * 255),
    Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  ];
}

/* 1 inside the warm range, 0 well outside, linear blend across FEATHER°. */
function warmWeight(h) {
  if (h <= 45) return 1;
  if (h < 45 + FEATHER) return 1 - (h - 45) / FEATHER;
  if (h >= 350) return 1;
  if (h > 350 - FEATHER) return (h - (350 - FEATHER)) / FEATHER;
  return 0;
}

function shortestHueDelta(from, to) {
  return ((((to - from) + 540) % 360) - 180);
}

async function main() {
  const srcArg = process.argv[2];
  const src = srcArg
    ? path.resolve(srcArg)
    : (() => {
        const dir = path.resolve("public/img");
        const hit = fs.readdirSync(dir).find((f) => /^hero-tall\./.test(f) && f.endsWith(".webp"));
        if (!hit) throw new Error("no hero-tall.*.webp in public/img");
        return path.join(dir, hit);
      })();
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const px = data;
  let shifted = 0;
  let feathered = 0;

  for (let i = 0; i < px.length; i += info.channels) {
    const r = px[i];
    const g = px[i + 1];
    const b = px[i + 2];
    if (r + g + b < BLACK) continue;
    const hsl = rgbToHsl(r, g, b);
    if (hsl.s < GRAY_S) continue;
    const w = warmWeight(hsl.h);
    if (w <= 0) continue;
    const nh = hsl.h + shortestHueDelta(hsl.h, TARGET_H) * w;
    const [nr, ng, nb] = hslToRgb(nh, hsl.s, hsl.l);
    px[i] = nr;
    px[i + 1] = ng;
    px[i + 2] = nb;
    if (w >= 1) shifted++;
    else feathered++;
  }

  const webp = await sharp(px, {
    raw: { width: info.width, height: info.height, channels: info.channels },
  })
    .webp({ quality: 90, effort: 6, alphaQuality: 100 })
    .toBuffer();

  const hash = crypto.createHash("sha256").update(webp).digest("hex").slice(0, 6);
  const dest = path.resolve("public/img", `hero-tall.${hash}.webp`);
  fs.writeFileSync(dest, webp);
  console.log(
    JSON.stringify(
      {
        src,
        dest,
        size: webp.length,
        hash,
        width: info.width,
        height: info.height,
        fullyShifted: shifted,
        feathered,
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
