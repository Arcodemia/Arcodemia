/* Pixel hue / warm-vs-cool analysis for the two hero WebPs.
   Classification runs inside headless Chrome (canvas decode, no extra npm deps).
   Dump is stats JSON only — not the raw pixel buffer. */
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const CHROME =
  process.env.CHROME ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

function dataUri(filePath) {
  return `data:image/webp;base64,${fs.readFileSync(filePath).toString("base64")}`;
}

function dumpStats(images) {
  const html = `<!doctype html><meta charset="utf-8">
<pre id="out">pending</pre>
<script>
const BLACK = 18;
const GRAY_S = 0.12;
const WARM = (h) => h <= 45 || h >= 350;
const COOL = (h) => h >= 200 && h <= 295;
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
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
function load(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("img fail"));
    img.src = src;
  });
}
function pixelsOf(img) {
  const c = document.createElement("canvas");
  c.width = img.naturalWidth;
  c.height = img.naturalHeight;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, c.width, c.height);
}
function classify(im, step) {
  const { data, width, height } = im;
  let total = 0, black = 0, gray = 0, warm = 0, cool = 0, other = 0;
  const buckets = new Array(36).fill(0);
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const i = (y * width + x) * 4;
      const r = data[i], g = data[i+1], b = data[i+2];
      total++;
      if (r + g + b < BLACK) { black++; continue; }
      const hsl = rgbToHsl(r, g, b);
      if (hsl.s < GRAY_S) { gray++; continue; }
      buckets[Math.min(35, Math.floor(hsl.h / 10))]++;
      if (WARM(hsl.h)) warm++;
      else if (COOL(hsl.h)) cool++;
      else other++;
    }
  }
  const nonBlack = total - black;
  const colored = nonBlack - gray;
  const pct = (n, d) => d ? ((100 * n) / d).toFixed(2) + "%" : "n/a";
  const peak = buckets.reduce((best, n, i) => n > best.n ? { n, i } : best, { n: 0, i: 0 });
  return {
    width, height, samples: total, black, nonBlack, gray, warm, cool, other, colored,
    ofNonBlack: { warm: pct(warm, nonBlack), cool: pct(cool, nonBlack), other: pct(other, nonBlack), gray: pct(gray, nonBlack) },
    ofColored: { warm: pct(warm, colored), cool: pct(cool, colored), other: pct(other, colored) },
    peakHueBucket: (peak.i * 10) + "–" + (peak.i * 10 + 10) + "° (n=" + peak.n + ")"
  };
}
function meanAbsDiff(a, b) {
  if (a.width !== b.width || a.height !== b.height) {
    return { error: "size mismatch " + a.width + "x" + a.height + " vs " + b.width + "x" + b.height };
  }
  const n = a.data.length;
  let changed = 0, sum = 0, max = 0;
  const px = n / 4;
  for (let i = 0; i < n; i += 4) {
    const dr = Math.abs(a.data[i] - b.data[i]);
    const dg = Math.abs(a.data[i+1] - b.data[i+1]);
    const db = Math.abs(a.data[i+2] - b.data[i+2]);
    if (dr + dg + db > 0) changed++;
    sum += dr + dg + db;
    max = Math.max(max, dr, dg, db);
  }
  return {
    pixelChangedPct: ((100 * changed) / px).toFixed(3) + "%",
    meanAbsPerChannel: (sum / n).toFixed(3),
    maxChannel: max,
    byteIdentical: changed === 0
  };
}
const IMAGES = ${JSON.stringify(images)};
(async () => {
  try {
    const out = {};
    const decoded = {};
    for (const [name, src] of Object.entries(IMAGES)) {
      const img = await load(src);
      decoded[name] = pixelsOf(img);
      out[name] = classify(decoded[name], 2);
    }
    if (decoded.committedWide && decoded.freshWide) {
      out.b1Diff = meanAbsDiff(decoded.committedWide, decoded.freshWide);
    }
    document.getElementById("out").textContent = JSON.stringify(out);
  } catch (e) {
    document.getElementById("out").textContent = "ERROR " + e.message;
  }
})();
</script>`;
  const htmlPath = path.join(os.tmpdir(), "arcodemia-analyze-hero.html");
  fs.writeFileSync(htmlPath, html);
  const dumped = spawnSync(
    CHROME,
    [
      "--headless=new",
      "--disable-gpu",
      "--allow-file-access-from-files",
      "--virtual-time-budget=20000",
      "--dump-dom",
      htmlPath,
    ],
    { encoding: "utf8", maxBuffer: 16 * 1024 * 1024, timeout: 90000 },
  );
  if (dumped.status !== 0) {
    throw new Error(`chrome dump failed (${dumped.status}): ${dumped.stderr || dumped.stdout}`);
  }
  const m = dumped.stdout.match(/<pre id="out">([\s\S]*?)<\/pre>/);
  if (!m) throw new Error("no #out in dump\n" + dumped.stdout.slice(0, 500));
  const raw = m[1]
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
  if (raw.startsWith("ERROR") || raw === "pending") {
    throw new Error(`decode did not finish: ${raw}`);
  }
  return JSON.parse(raw);
}

const imgDir = path.resolve("public/img");
const images = {};
for (const name of fs.readdirSync(imgDir).filter((f) => f.endsWith(".webp"))) {
  const key = name.replace(/\.webp$/, "").replace(/[^a-zA-Z0-9]+/g, "_");
  images[key] = dataUri(path.join(imgDir, name));
}

const stats = dumpStats(images);
console.log(JSON.stringify(stats, null, 2));
