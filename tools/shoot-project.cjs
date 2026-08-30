/* ============================================================
   צילום אתר לקוח לתיק העבודות
   ------------------------------------------------------------
   שימוש:  node tools/shoot-project.cjs <url> <slug>
   דוגמה:  node tools/shoot-project.cjs https://www.motorstravels.com/ motors-travels

   שומר WebP עם hash תחת public/work ומדפיס את השורה שצריך
   להדביק ב-lib/projects.ts.

   ⚠️ מחכה ל-networkidle ועוד שתי שניות. אתרים עם אנימציית
   כניסה מצולמים אחרת אם לא ממתינים.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const [url, slug] = process.argv.slice(2);
if (!url || !slug) {
  console.error('usage: node tools/shoot-project.cjs <url> <slug>');
  process.exit(2);
}

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'work');
const W = 1280, H = 800;

(async () => {
  const puppeteer = require('puppeteer-core');
  const sharp = require('sharp');
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--use-angle=d3d11', '--no-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 2 });
  console.log('טוען ' + url);
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 90000 });
  await new Promise((r) => setTimeout(r, 2000));
  const png = await page.screenshot({ type: 'png' });
  await browser.close();

  const webp = await sharp(png).resize(W, H, { fit: 'cover', position: 'top' }).webp({ quality: 82 }).toBuffer();
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const hash = crypto.createHash('md5').update(webp).digest('hex').slice(0, 6);
  for (const f of fs.readdirSync(OUT_DIR)) {
    if (f.startsWith(slug + '.')) fs.unlinkSync(path.join(OUT_DIR, f));
  }
  const name = `${slug}.${hash}.webp`;
  fs.writeFileSync(path.join(OUT_DIR, name), webp);
  console.log(`נשמר public/work/${name}  (${Math.round(webp.length / 1024)}KB)`);
  console.log(`ב-lib/projects.ts:  image: '/work/${name}',`);
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
