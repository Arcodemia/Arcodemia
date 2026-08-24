/* ============================================================
   קומפוזיט 2D: פיקסלי הגביש הימני (pB) מודבקים במיקום השמאלי (pA)
   ------------------------------------------------------------
   למה הצעד הזה קיים בצינור שהוא אחרת תלת-ממדי לגמרי:

   שני הגבישים חולקים שיידר, IOR, שדה סדקים ו-env-map — אבל דגימת
   ה-env תלויה בזווית הראייה. pA יושב בשמאל המסך, pB בימין, ולכן
   אותה נקודה על המשטח דוגמת כיוון אחר במפת הסביבה. כוונון פרמטרי
   3D (סיבוב, hue, gain) יכול להתקרב, לא להגיע לזהות פיקסלים.
   זה גבול של הגישה, לא באג במימוש.

   אחרי הרנדר מעתיקים את פיקסלי pB האמיתיים למיקום המסך של pA.
   זהות בפנים האטום מובטחת בבנייה — לא בקירוב.

   קלט: שלוש שכבות PNG שרונדרו ב-tools/render-crystals.cjs
     base.png       הסצנה בלי pA
     right-only.png רק pB על שחור
     left-only.png  רק pA על שחור (למיקום בלבד)
   ============================================================ */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const LUM_THRESH = 6; /* 0–255; מתעלם מרעש anti-alias על השחור */
const ALPHA_SOFT = 18; /* טווח ה-smoothstep מהסף עד אטום מלא */

function luminance(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function clamp01(x) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  return x;
}

/* smoothstep קלאסי — קצה רך לפי צורת הגביש, לא מלבן. */
function smoothstep(edge0, edge1, x) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function pixelIndex(x, y, width, channels) {
  return (y * width + x) * channels;
}

async function loadRgba(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  if (info.channels !== 4) {
    throw new Error(file + ": expected 4 channels, got " + info.channels);
  }
  return { data: Buffer.from(data), width: info.width, height: info.height };
}

function assertSameSize(a, b, nameA, nameB) {
  if (a.width !== b.width || a.height !== b.height) {
    throw new Error(
      "size mismatch: " +
        nameA +
        " " +
        a.width +
        "x" +
        a.height +
        " vs " +
        nameB +
        " " +
        b.width +
        "x" +
        b.height,
    );
  }
}

function warnIfClipped(box, img, label) {
  const hits = [];
  if (box.minX <= 0) hits.push("left");
  if (box.minY <= 0) hits.push("top");
  if (box.maxX >= img.width - 1) hits.push("right");
  if (box.maxY >= img.height - 1) hits.push("bottom");
  if (hits.length) {
    throw new Error(
      label +
        " BODY is clipped on the " +
        hits.join("/") +
        " edge (" +
        img.width +
        "x" +
        img.height +
        ", box " +
        box.minX +
        ".." +
        box.maxX +
        " x " +
        box.minY +
        ".." +
        box.maxY +
        "). Re-render with extra canvas on that side — pasting a canvas-clipped sprite puts a hard cut in the frame.",
    );
  }
}

/* תיבת גבול + מרכז מסה של פיקסלים מעל סף הבהירות. */
function foregroundBox(img, threshold) {
  const { data, width, height } = img;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  let sumX = 0;
  let sumY = 0;
  let n = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = pixelIndex(x, y, width, 4);
      if (luminance(data[i], data[i + 1], data[i + 2]) <= threshold) continue;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
      sumX += x;
      sumY += y;
      n++;
    }
  }

  if (n === 0) return null;
  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
    count: n,
    cx: sumX / n,
    cy: sumY / n,
  };
}

function requireBox(box, label, file) {
  if (box) return box;
  throw new Error(
    "empty bounding box for " +
      label +
      " (" +
      file +
      "). Nothing above brightness threshold " +
      LUM_THRESH +
      " — the isolated render likely failed. Stopping rather than compositing with garbage coordinates.",
  );
}

function softAlpha(lum) {
  return smoothstep(LUM_THRESH, LUM_THRESH + ALPHA_SOFT, lum);
}

/* Source-over ל-premultiplied: right-only רונדר על שחור, אז RGB כבר
   מכיל כיסוי. Interior עם alpha=1 מועתק מילה במילה. */
function premulOver(src, dst, a) {
  const inv = 1 - a;
  return src + dst * inv;
}

function compositeTranslated(base, right, dx, dy) {
  const out = Buffer.from(base.data);
  const dw = base.width;
  const dh = base.height;
  const sw = right.width;
  const sh = right.height;

  for (let sy = 0; sy < sh; sy++) {
    const dyPix = sy + dy;
    if (dyPix < 0 || dyPix >= dh) continue;
    for (let sx = 0; sx < sw; sx++) {
      const dxPix = sx + dx;
      if (dxPix < 0 || dxPix >= dw) continue;
      const si = pixelIndex(sx, sy, sw, 4);
      const lum = luminance(right.data[si], right.data[si + 1], right.data[si + 2]);
      const a = softAlpha(lum);
      if (a <= 0) continue;
      const di = pixelIndex(dxPix, dyPix, dw, 4);
      out[di] = Math.round(premulOver(right.data[si], out[di], a));
      out[di + 1] = Math.round(premulOver(right.data[si + 1], out[di + 1], a));
      out[di + 2] = Math.round(premulOver(right.data[si + 2], out[di + 2], a));
      out[di + 3] = 255;
    }
  }
  return out;
}

function channelDiff(a, b) {
  return Math.abs(a - b);
}

function measurePasteIdentity(composite, compW, compH, right, dx, dy, minAlpha) {
  const sw = right.width;
  const sh = right.height;
  let n = 0;
  let sumR = 0;
  let sumG = 0;
  let sumB = 0;
  let maxR = 0;
  let maxG = 0;
  let maxB = 0;

  for (let sy = 0; sy < sh; sy++) {
    const dyPix = sy + dy;
    if (dyPix < 0 || dyPix >= compH) continue;
    for (let sx = 0; sx < sw; sx++) {
      const dxPix = sx + dx;
      if (dxPix < 0 || dxPix >= compW) continue;
      const si = pixelIndex(sx, sy, sw, 4);
      const a = softAlpha(luminance(right.data[si], right.data[si + 1], right.data[si + 2]));
      if (a < minAlpha) continue;
      const di = pixelIndex(dxPix, dyPix, compW, 4);
      const dR = channelDiff(composite[di], right.data[si]);
      const dG = channelDiff(composite[di + 1], right.data[si + 1]);
      const dB = channelDiff(composite[di + 2], right.data[si + 2]);
      n++;
      sumR += dR;
      sumG += dG;
      sumB += dB;
      if (dR > maxR) maxR = dR;
      if (dG > maxG) maxG = dG;
      if (dB > maxB) maxB = dB;
    }
  }

  const mean = (s) => (n ? +(s / n).toFixed(6) : 0);
  return {
    pixels: n,
    meanAbs: { r: mean(sumR), g: mean(sumG), b: mean(sumB) },
    maxAbs: { r: maxR, g: maxG, b: maxB },
  };
}

function measureBuffers(a, b) {
  if (a.length !== b.length) {
    throw new Error("buffer length mismatch: " + a.length + " vs " + b.length);
  }
  let n = 0;
  let sumR = 0;
  let sumG = 0;
  let sumB = 0;
  let maxR = 0;
  let maxG = 0;
  let maxB = 0;
  for (let i = 0; i < a.length; i += 4) {
    const dR = channelDiff(a[i], b[i]);
    const dG = channelDiff(a[i + 1], b[i + 1]);
    const dB = channelDiff(a[i + 2], b[i + 2]);
    n++;
    sumR += dR;
    sumG += dG;
    sumB += dB;
    if (dR > maxR) maxR = dR;
    if (dG > maxG) maxG = dG;
    if (dB > maxB) maxB = dB;
  }
  const mean = (s) => +(s / n).toFixed(6);
  return {
    pixels: n,
    meanAbs: { r: mean(sumR), g: mean(sumG), b: mean(sumB) },
    maxAbs: { r: maxR, g: maxG, b: maxB },
  };
}

function expandBox(box, pad, width, height) {
  return {
    left: Math.max(0, box.minX - pad),
    top: Math.max(0, box.minY - pad),
    width: Math.min(width, box.maxX + pad + 1) - Math.max(0, box.minX - pad),
    height: Math.min(height, box.maxY + pad + 1) - Math.max(0, box.minY - pad),
  };
}

function cropRgba(data, srcW, box) {
  const out = Buffer.alloc(box.width * box.height * 4);
  for (let y = 0; y < box.height; y++) {
    const srcStart = pixelIndex(box.left, box.top + y, srcW, 4);
    data.copy(out, y * box.width * 4, srcStart, srcStart + box.width * 4);
  }
  return out;
}

function amplifyDiff(a, b) {
  const out = Buffer.alloc(a.length);
  for (let i = 0; i < a.length; i += 4) {
    out[i] = Math.min(255, channelDiff(a[i], b[i]) * 12);
    out[i + 1] = Math.min(255, channelDiff(a[i + 1], b[i + 1]) * 12);
    out[i + 2] = Math.min(255, channelDiff(a[i + 2], b[i + 2]) * 12);
    out[i + 3] = 255;
  }
  return out;
}

async function writePng(file, data, width, height) {
  await sharp(data, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(file);
}

async function encodeWebp(data, width, height) {
  return sharp(data, { raw: { width, height, channels: 4 } })
    .webp({ quality: 93, effort: 6, alphaQuality: 100 })
    .toBuffer();
}

async function decodeToRgba(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data: Buffer.from(data), width: info.width, height: info.height };
}

async function main() {
  const prefix = process.argv[2];
  if (!prefix) {
    console.error("usage: node tools/composite-left-from-right.cjs <prefix>");
    console.error("  expects <prefix>-base.png, -right-only.png, -left-only.png");
    process.exit(2);
  }

  const dir = path.dirname(path.resolve(prefix));
  const stem = path.basename(prefix);
  const baseFile = path.join(dir, stem + "-base.png");
  const rightFile = path.join(dir, stem + "-right-only.png");
  const leftFile = path.join(dir, stem + "-left-only.png");

  const [base, right, left] = await Promise.all([
    loadRgba(baseFile),
    loadRgba(rightFile),
    loadRgba(leftFile),
  ]);
  assertSameSize(base, left, "base", "left-only");

  const leftBox = requireBox(foregroundBox(left, LUM_THRESH), "left crystal", leftFile);
  const rightBox = requireBox(foregroundBox(right, LUM_THRESH), "right crystal", rightFile);
  /* Glow/flare can touch the canvas; a clipped BODY would paste as a hard cut. */
  const rightBody = requireBox(foregroundBox(right, 80), "right crystal body", rightFile);
  warnIfClipped(rightBody, right, "right-only");

  /* עיגול לשלם — העתקת פיקסל בלי resampling, אחרת אין זהות. */
  const dx = Math.round(leftBox.cx - rightBox.cx);
  const dy = Math.round(leftBox.cy - rightBox.cy);

  const composited = compositeTranslated(base, right, dx, dy);

  const opaque = measurePasteIdentity(composited, base.width, base.height, right, dx, dy, 0.995);
  const body = measurePasteIdentity(composited, base.width, base.height, right, dx, dy, 0.5);
  const anyGlow = measurePasteIdentity(composited, base.width, base.height, right, dx, dy, 0.001);

  const pngPath = path.join(dir, stem + "-composite.png");
  await writePng(pngPath, composited, base.width, base.height);

  const webpBuf = await encodeWebp(composited, base.width, base.height);
  const webpPath = path.join(dir, stem + "-composite.webp");
  fs.writeFileSync(webpPath, webpBuf);

  const webpRgba = await decodeToRgba(webpBuf);
  const webpVsPng = measureBuffers(webpRgba.data, composited);
  const webpPasteOpaque = measurePasteIdentity(
    webpRgba.data,
    base.width,
    base.height,
    right,
    dx,
    dy,
    0.995,
  );

  const pastedBox = {
    minX: rightBox.minX + dx,
    minY: rightBox.minY + dy,
    maxX: rightBox.maxX + dx,
    maxY: rightBox.maxY + dy,
  };
  const seam = expandBox(pastedBox, 36, base.width, base.height);
  const seamComposite = cropRgba(composited, base.width, seam);
  const seamBase = cropRgba(base.data, base.width, seam);
  const seamDiff = amplifyDiff(seamComposite, seamBase);
  await writePng(path.join(dir, stem + "-boundary-crop.png"), seamComposite, seam.width, seam.height);
  await writePng(path.join(dir, stem + "-boundary-diff.png"), seamDiff, seam.width, seam.height);

  const report = {
    size: { width: base.width, height: base.height },
    leftBox,
    rightBox,
    rightBody,
    offset: { dx, dy, rawDx: leftBox.cx - rightBox.cx, rawDy: leftBox.cy - rightBox.cy },
    losslessVsRightOnly: {
      opaqueBodyShouldBeZero: opaque,
      midBody: body,
      includingSoftGlow: anyGlow,
    },
    webpEncodeVsLossless: webpVsPng,
    webpPasteOpaqueVsRightOnly: webpPasteOpaque,
    outputs: { pngPath, webpPath },
  };
  const reportPath = path.join(dir, stem + "-report.json");
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
