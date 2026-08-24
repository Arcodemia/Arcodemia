/* Local-detail metric for the two main hero crystals.
   Luminance stddev among non-black pixels in each region.
   A blown-out white face has high mean + low variance; facets have high variance. */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const BLACK = 0.12; /* crystal body only — skip empty background */

function lum(r, g, b) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function stats(px, w, h, ch, box) {
  const { x0, y0, x1, y1 } = box;
  const vals = [];
  let clipped = 0;
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const i = (y * w + x) * ch;
      const L = lum(px[i], px[i + 1], px[i + 2]);
      if (L < BLACK) continue;
      vals.push(L);
      if (L >= 0.92) clipped++;
    }
  }
  const n = vals.length;
  if (!n) return { n: 0, mean: 0, std: 0, clipPct: 0 };
  const mean = vals.reduce((a, b) => a + b, 0) / n;
  const varr = vals.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
  return {
    n,
    mean: +mean.toFixed(4),
    std: +Math.sqrt(varr).toFixed(4),
    clipPct: +((100 * clipped) / n).toFixed(2),
  };
}

async function main() {
  const file = path.resolve(process.argv[2]);
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const ch = info.channels;
  /* Composition: left crystal sits in the left ~32% / mid band;
     right crystal in the right ~32% / slightly lower band.
     Boxes avoid the dark center copy area. */
  const left = { x0: 0, y0: Math.floor(h * 0.08), x1: Math.floor(w * 0.32), y1: Math.floor(h * 0.78) };
  const right = { x0: Math.floor(w * 0.68), y0: Math.floor(h * 0.18), x1: w, y1: Math.floor(h * 0.92) };
  const out = {
    file,
    size: `${w}x${h}`,
    left: { box: left, ...stats(data, w, h, ch, left) },
    right: { box: right, ...stats(data, w, h, ch, right) },
  };
  out.stdRatio = out.right.std ? +(out.left.std / out.right.std).toFixed(3) : null;
  console.log(JSON.stringify(out, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
