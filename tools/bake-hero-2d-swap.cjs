/* מרנדר שלוש שכבות מבודדות ואז מדביק את הגביש הימני במיקום השמאלי.
   ראו את כותרת tools/composite-left-from-right.cjs לסיבת הקומפוזיט ה-2D. */
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const LAYERS_DIR = path.join(ROOT, "tools", "_layers");
const NODE = process.execPath;

const SIZES = {
  wide: { w: 1800, h: 1120, tile: 450, budget: "180000", extraRight: 800 },
  tall: { w: 900, h: 1150, tile: 450, budget: "180000", extraRight: 1000 },
};

function run(args, extra = {}) {
  const r = spawnSync(NODE, args, {
    cwd: ROOT,
    stdio: "inherit",
    ...extra,
  });
  if (r.status !== 0) {
    throw new Error("command failed (" + r.status + "): node " + args.join(" "));
  }
}

function renderLayer(size, layer, dest, extraRight) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  console.log("\n=== render", size.w + "x" + size.h, layer, extraRight ? "extraRight=" + extraRight : "", "→", dest, "===\n");
  const args = ["tools/render-crystals.cjs", String(size.w), String(size.h), String(size.tile), layer];
  if (extraRight) args.push(String(extraRight));
  run(args);
  run(["tools/extract-crystal-render.cjs", dest, size.budget]);
  if (!fs.existsSync(dest) || fs.statSync(dest).size < 1000) {
    throw new Error("render produced nothing usable: " + dest);
  }
}

function bake(name, onlyB) {
  const size = SIZES[name];
  if (!size) throw new Error("unknown size " + name);
  const prefix = path.join(LAYERS_DIR, name);
  if (!onlyB) {
    renderLayer(size, "noA", prefix + "-base.png");
    renderLayer(size, "onlyA", prefix + "-left-only.png");
  }
  renderLayer(size, "onlyB", prefix + "-right-only.png", size.extraRight);
  run(["tools/composite-left-from-right.cjs", prefix]);
}

function main() {
  const which = process.argv[2] || "both";
  const onlyB = which === "onlyB";
  const names = which === "both" || onlyB ? ["wide", "tall"] : [which];
  if (!names.every((n) => SIZES[n])) {
    console.error("usage: node tools/bake-hero-2d-swap.cjs [wide|tall|both|onlyB]");
    process.exit(2);
  }
  fs.mkdirSync(LAYERS_DIR, { recursive: true });
  for (const name of names) bake(name, onlyB);
  console.log("\ndone. composites in", LAYERS_DIR);
}

main();
