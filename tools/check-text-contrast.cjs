/* ============================================================
   ניגודיות טקסט — נמדדת רק מתחת לאותיות עצמן
   ------------------------------------------------------------
   ⚠️ הגרסה הראשונה של הבדיקה הזו מדדה את **תיבת** האלמנט, ולכן
   דיווחה על הפינות הריקות שלו. בכותרת ממורכזת עם text-wrap:balance
   הפינות ריקות כמעט תמיד, והמספר שיצא היה פסימי בכמה רמות —
   1.5:1 במקום שבו אין אף אות.

   השיטה כאן: שני צילומים של אותו אזור, אחד עם הטקסט ואחד בלעדיו.
   ההפרש ביניהם הוא בדיוק כיסוי האותיות. בודקים את הרקע אך ורק
   בפיקסלים שבהם האות מכסה מעל 60%, ולוקחים את הגרוע שבהם.

   ⚠️ עדיין הפיקסל הגרוע ולא הממוצע. ממוצע מסתיר בדיוק את המקרה
   שחשוב — אות בודדת שיושבת על נצנוץ בהיר.

   שימוש:  node tools/check-text-contrast.cjs
   (דורש שרת מקומי על 3000 ו-puppeteer-core + pngjs מותקנים)
   ============================================================ */
const fs = require('fs');
const path = require('path');
const os = require('os');

const TMP = path.join(os.tmpdir(), 'arcodemia-contrast');
fs.mkdirSync(TMP, { recursive: true });

const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const L = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

/* אלמנטים לבדיקה: [סלקטור, תיאור, סף AA] */
const TARGETS = [
  ['.hero h1', 'כותרת ראשית', 3.0],
  ['.hero__in > p', 'פסקת פתיחה', 4.5],
  ['.hero .eyebrow', 'תווית עליונה', 4.5],
  ['.hero__trust', 'שורת האמון', 4.5],
  ['.btn--ghost', 'כפתור משני', 4.5],
];
const VIEWS = [[1920, 1080], [1440, 900], [1280, 800], [1024, 768], [834, 1112], [390, 844], [360, 780]];

(async () => {
  const puppeteer = require('puppeteer-core');
  const { PNG } = require('pngjs');
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new', args: ['--use-angle=d3d11', '--no-sandbox'],
  });

  let failures = 0;
  const rows = [];

  for (const [w, h] of VIEWS) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    if (process.env.EXTRA_CSS) { await page.addStyleTag({ content: process.env.EXTRA_CSS }); }
    await new Promise((r) => setTimeout(r, 3400));

    for (const [sel, label, need] of TARGETS) {
      const box = await page.evaluate((s) => {
        const e = document.querySelector(s);
        if (!e) return null;
        const r = e.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) return null;
        return { x: Math.round(r.left), y: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height), col: getComputedStyle(e).color };
      }, sel);
      if (!box) { rows.push(`  ${String(w).padStart(4)}  ${label.padEnd(12)} —`); continue; }

      const withText = path.join(TMP, 'a.png');
      const noText = path.join(TMP, 'b.png');
      await page.screenshot({ path: withText, clip: { x: box.x, y: box.y, width: box.width, height: box.height } });
      await page.evaluate((s) => { document.querySelector(s).style.visibility = 'hidden'; }, sel);
      await new Promise((r) => setTimeout(r, 130));
      await page.screenshot({ path: noText, clip: { x: box.x, y: box.y, width: box.width, height: box.height } });
      await page.evaluate((s) => { document.querySelector(s).style.visibility = ''; }, sel);

      const A = PNG.sync.read(fs.readFileSync(withText));
      const B = PNG.sync.read(fs.readFileSync(noText));
      const m = box.col.match(/(\d+),\s*(\d+),\s*(\d+)/);
      const tL = L(+m[1], +m[2], +m[3]);

      let worst = Infinity, count = 0;
      for (let i = 0; i < A.data.length; i += 4) {
        /* כיסוי האות: כמה הפיקסל השתנה ביחס לצבע הטקסט */
        const dr = Math.abs(A.data[i] - B.data[i]);
        const dg = Math.abs(A.data[i + 1] - B.data[i + 1]);
        const db = Math.abs(A.data[i + 2] - B.data[i + 2]);
        const diff = Math.max(dr, dg, db);
        const bg = L(B.data[i], B.data[i + 1], B.data[i + 2]);
        /* אות אטומה: הפיקסל אחרי הציור קרוב מאוד לצבע הטקסט,
           וגם שונה מספיק מהרקע כדי שזו לא תהיה סתם הזזה */
        const nearText = Math.abs(A.data[i] - +m[1]) < 26 && Math.abs(A.data[i + 1] - +m[2]) < 26 && Math.abs(A.data[i + 2] - +m[3]) < 26;
        if (diff > 34 && nearText) { count++; worst = Math.min(worst, ratio(tL, bg)); }
      }
      if (!count) { rows.push(`  ${String(w).padStart(4)}  ${label.padEnd(12)} (לא נמצאו פיקסלי אות)`); continue; }
      const ok = worst >= need;
      if (!ok) failures++;
      rows.push(`  ${String(w).padStart(4)}  ${label.padEnd(12)} ${worst.toFixed(2).padStart(6)}:1  (צריך ${need})  ${ok ? '✓' : '✗'}   ${count} פיקסלי אות`);
    }
    await page.close();
  }

  console.log('ניגודיות מתחת לאותיות — הפיקסל הגרוע');
  console.log(rows.join('\n'));
  console.log('');
  console.log(failures ? `✗ ${failures} כשלים` : '✓ הכל עובר AA');
  await browser.close();
  process.exit(failures ? 1 : 0);
})();
