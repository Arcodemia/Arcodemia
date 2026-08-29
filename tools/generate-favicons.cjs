/* Rasterize public/favicon.svg into the PNG sizes professional sites ship.
   Source geometry is the existing LogoMark/favicon (black rounded square,
   white triangle, purple bar) — do not invent a new mark here. */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const SVG = path.join(ROOT, "public", "favicon.svg");

const TARGETS = [
  { file: path.join(ROOT, "public", "icons", "icon-48.png"), size: 48 },
  { file: path.join(ROOT, "public", "apple-touch-icon.png"), size: 180 },
  { file: path.join(ROOT, "public", "icons", "icon-192.png"), size: 192 },
  { file: path.join(ROOT, "public", "icons", "icon-512.png"), size: 512 },
];

async function main() {
  if (!fs.existsSync(SVG)) throw new Error("missing " + SVG);
  fs.mkdirSync(path.join(ROOT, "public", "icons"), { recursive: true });
  const svg = fs.readFileSync(SVG);
  for (const t of TARGETS) {
    await sharp(svg, { density: 384 })
      .resize(t.size, t.size, { fit: "fill" })
      .png({ compressionLevel: 9 })
      .toFile(t.file);
    const meta = await sharp(t.file).metadata();
    console.log(path.relative(ROOT, t.file), meta.width + "x" + meta.height, fs.statSync(t.file).size, "bytes");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
