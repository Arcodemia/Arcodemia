/* GPU-render tools/_render.html via Chrome and extract the WebP data-URI. */
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const CHROME =
  process.env.CHROME ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const htmlSrc = path.resolve("tools/_render.html");
const tmpHtml = path.join(os.tmpdir(), "arcodemia-render.html");
const tmpDom = path.join(os.tmpdir(), "arcodemia-render-dom.html");
const ud = path.join(os.tmpdir(), "arcodemia-chrome-render-" + Date.now());
const dest = path.resolve(process.argv[2] || path.join(os.tmpdir(), "arcodemia-hero.webp"));
const budget = process.argv[3] || "180000";

fs.copyFileSync(htmlSrc, tmpHtml);
const uri = "file:///" + tmpHtml.replace(/\\/g, "/");

const r = spawnSync(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu-sandbox",
    "--use-angle=d3d11",
    "--enable-gpu",
    "--ignore-gpu-blocklist",
    `--virtual-time-budget=${budget}`,
    "--no-first-run",
    "--user-data-dir=" + ud,
    "--dump-dom",
    uri,
  ],
  { encoding: "utf8", maxBuffer: 80 * 1024 * 1024, timeout: Number(budget) + 60000 },
);

fs.writeFileSync(tmpDom, r.stdout || "");
const title = ((r.stdout || "").match(/<title>([^<]*)/) || [])[1];
const m = (r.stdout || "").match(/data:image\/webp;base64,([A-Za-z0-9+/=]+)/);
console.log("title", title, "status", r.status, "stdoutBytes", (r.stdout || "").length);
if (!m) {
  const head = (r.stdout || "").slice(0, 300);
  console.error("no webp. head:", head, "stderr:", (r.stderr || "").slice(0, 400));
  process.exit(1);
}
const buf = Buffer.from(m[1], "base64");
fs.writeFileSync(dest, buf);
console.log("wrote", dest, buf.length, "bytes");
