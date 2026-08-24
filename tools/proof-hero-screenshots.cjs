/* One-off screenshots of the live hero (rest + forced :hover, desktop + mobile).
   Uses Chrome DevTools Protocol. Output goes to tools/_proof/. */
const fs = require("fs");
const http = require("http");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

const CHROME =
  process.env.CHROME ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PAGE = process.env.PROOF_URL || "http://127.0.0.1:3002/";
const PORT = 9334;
const OUT = path.resolve("tools/_proof");

fs.mkdirSync(OUT, { recursive: true });

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => {
          try {
            resolve(JSON.parse(d));
          } catch (e) {
            reject(new Error("bad json from " + url + ": " + d.slice(0, 200)));
          }
        });
      })
      .on("error", reject);
  });
}

class Cdp {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 0;
    this.pending = new Map();
    this.ws = null;
  }
  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.addEventListener("open", () => resolve());
      this.ws.addEventListener("error", (e) => reject(e));
      this.ws.addEventListener("message", (ev) => {
        const msg = JSON.parse(String(ev.data));
        if (msg.id && this.pending.has(msg.id)) {
          const { resolve: ok, reject: fail } = this.pending.get(msg.id);
          this.pending.delete(msg.id);
          if (msg.error) fail(new Error(JSON.stringify(msg.error)));
          else ok(msg.result);
        }
      });
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  close() {
    try {
      this.ws.close();
    } catch {
      /* already closed */
    }
  }
}

async function screenshot(cdp, file, clip) {
  const params = { format: "png", fromSurface: true };
  if (clip) params.clip = clip;
  const { data } = await cdp.send("Page.captureScreenshot", params);
  fs.writeFileSync(file, Buffer.from(data, "base64"));
  console.log("wrote", file, fs.statSync(file).size, "bytes");
}

async function waitForHeroVisible(cdp) {
  for (let i = 0; i < 50; i++) {
    const { result } = await cdp.send("Runtime.evaluate", {
      expression: `(() => {
        const img = document.querySelector(".hero__art img");
        if (!img) return { s: "no-img" };
        const loaded = img.complete && img.naturalWidth > 0;
        if (!loaded) return { s: "loading", src: img.currentSrc || img.src };
        document.documentElement.classList.remove("intro");
        img.classList.add("is-on");
        img.style.transition = "none";
        img.style.opacity = "1";
        return {
          s: "ready",
          src: img.currentSrc,
          opacity: getComputedStyle(img).opacity,
          w: img.naturalWidth,
          h: img.naturalHeight
        };
      })()`,
      returnByValue: true,
    });
    const v = result.value;
    console.log("hero wait", JSON.stringify(v));
    if (v && v.s === "ready") {
      await sleep(2000);
      return;
    }
    await sleep(200);
  }
  throw new Error("hero image never loaded");
}

async function btnClip(cdp) {
  const { result } = await cdp.send("Runtime.evaluate", {
    expression: `(() => {
      const el = document.querySelector(".btn--hero-wa");
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    })()`,
    returnByValue: true,
  });
  if (!result.value) throw new Error("no .btn--hero-wa");
  const pad = 16;
  return {
    x: Math.max(0, result.value.x - pad),
    y: Math.max(0, result.value.y - pad),
    width: result.value.width + pad * 2,
    height: result.value.height + pad * 2,
    scale: 1,
  };
}

async function forceHover(cdp) {
  await cdp.send("DOM.enable");
  await cdp.send("CSS.enable");
  const doc = await cdp.send("DOM.getDocument", { depth: 0 });
  const { nodeId } = await cdp.send("DOM.querySelector", {
    nodeId: doc.root.nodeId,
    selector: ".btn--hero-wa",
  });
  if (!nodeId) throw new Error("DOM.querySelector missed .btn--hero-wa");
  await cdp.send("CSS.forcePseudoState", {
    nodeId,
    forcedPseudoClasses: ["hover"],
  });
}

async function captureViewport(cdp, width, height, prefix) {
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 800,
  });
  await cdp.send("Page.navigate", { url: PAGE });
  await sleep(1500);
  await waitForHeroVisible(cdp);
  await sleep(500);

  await screenshot(cdp, path.join(OUT, `${prefix}.png`), {
    x: 0,
    y: 0,
    width,
    height: Math.min(height, 900),
    scale: 1,
  });

  const clip = await btnClip(cdp);
  await screenshot(cdp, path.join(OUT, `${prefix}-btn-rest.png`), clip);
  await forceHover(cdp);
  await sleep(350);
  await screenshot(cdp, path.join(OUT, `${prefix}-btn-hover.png`), clip);
}

async function main() {
  const chrome = spawn(
    CHROME,
    [
      `--remote-debugging-port=${PORT}`,
      "--headless=new",
      "--hide-scrollbars",
      "--disable-gpu",
      "--user-data-dir=" + path.join(os.tmpdir(), "arcodemia-proof-chrome-" + Date.now()),
      "about:blank",
    ],
    { stdio: "ignore" },
  );
  try {
    let ver;
    for (let i = 0; i < 40; i++) {
      try {
        ver = await getJson(`http://127.0.0.1:${PORT}/json/version`);
        break;
      } catch {
        await sleep(150);
      }
    }
    if (!ver) throw new Error("chrome debug port never came up");
    const targets = await getJson(`http://127.0.0.1:${PORT}/json/list`);
    const pageTarget = targets.find((t) => t.type === "page") || targets[0];
    if (!pageTarget || !pageTarget.webSocketDebuggerUrl) {
      throw new Error("no page target: " + JSON.stringify(targets));
    }
    const cdp = new Cdp(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await captureViewport(cdp, 1280, 800, "hero-desktop");
    await captureViewport(cdp, 390, 844, "hero-mobile");
    cdp.close();
  } finally {
    chrome.kill();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
