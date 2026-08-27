/* ============================================================
   בדיקת חיתוך גבישים — בלי לרנדר
   ------------------------------------------------------------
   מחשבת, מתוך אותם פרמטרים שבשיידר, האם כל גביש נכנס במלואו
   למה שהגולש רואה בפועל. "בפועל" = מסגרת התמונה **ועוד**
   החיתוך ש-object-fit:cover מוסיף, שתלוי ביחס תיבת ה-hero.

   ⚠️ תיבת ה-hero היא 657px גובה בכל רוחב שולחני, ולכן היחס שלה
   נע בין 1.6 ל-2.9 — וזה מקור החיתוך האנכי. הערכים כאן נמדדו
   מהדף בפועל, לא נוחשו.

   שימוש:  node tools/check-crystal-fit.cjs
   ============================================================ */

const CAM = 9.0, FOCAL = 1.55;

/* --- אותם נוסחאות כמו בשיידר --- */
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const halfW = (a) => 0.5 * a;
const kA = (a) => clamp(0.30 + 0.25 * a, 0.42, 0.70);
const szA = (a) => [2.10 * kA(a), 0.86 * kA(a)];
const ext = (L, r, z) => Math.sqrt(L * L + r * r) * FOCAL / (z + CAM);
const mgA = () => 0.15;
/* במסגרת צרה הגביש יורד מתחת לגוש הטקסט — ראו את ההערה בשיידר */
const uyA = (a) => 0.55 * clamp(1.2 - a, 0, 1);

/* b לא נגעו בו — המיקום המקורי מבוסס ax() */
const ax = (a) => Math.max(2.85, a * 2.86);

function crystals(iw, ih) {
  const a = iw / ih;
  const out = {};

  const eA = ext(szA(a)[0], szA(a)[1], 0.40);
  const uxA = -(halfW(a) - eA - mgA());
  out.A = { ux: uxA, uy: uyA(a), e: eA };

  const eB = ext(1.85, 0.75, -0.60);
  out.B = { ux: ax(a) * 1.05 * FOCAL / 8.4, uy: -0.95 * FOCAL / 8.4, e: eB };

  /* לקואורדינטות תמונה מנורמלות 0..1 */
  for (const k of Object.keys(out)) {
    const c = out[k];
    c.xc = 0.5 + c.ux / (2 * halfW(a));
    c.yc = 0.5 + c.uy;
    c.ex = c.e / (2 * halfW(a));
    c.ey = c.e;
  }
  return out;
}

/* תיבת ה-hero בפועל, כפי שנמדדה בדפדפן */
const VIEWS = [
  ['1920x1080', 1920, 657, 'wide'],
  ['1600x900', 1600, 657, 'wide'],
  ['1440x900', 1440, 657, 'wide'],
  ['1366x768', 1366, 657, 'wide'],
  ['1280x800', 1280, 657, 'wide'],
  ['1024x768', 1024, 638, 'wide'],
  ['834x1112', 834, 607, 'wide'],
  ['390x844', 390, 688, 'tall'],
  ['360x780', 360, 667, 'tall'],
];
const IMG = { wide: [1800, 1120], tall: [900, 1150] };

console.log(' viewport     img    A            B (left as-is, cut on purpose)');
let bad = 0;
for (const [tag, bw, bh, which] of VIEWS) {
  const [iw, ih] = IMG[which];
  const cs = crystals(iw, ih);
  const scale = Math.max(bw / iw, bh / ih);
  const dispW = iw * scale, dispH = ih * scale;
  const cropX = (dispW - bw) / 2 / dispW, cropY = (dispH - bh) / 2 / dispH;
  const cells = [];
  for (const k of ['A', 'B']) {
    const c = cs[k];
    const over = Math.max(
      cropX - (c.xc - c.ex), (c.xc + c.ex) - (1 - cropX),
      cropY - (c.yc - c.ey), (c.yc + c.ey) - (1 - cropY),
    );
    const ok = over <= 0;
    if (k === 'A' && !ok) bad++;
    cells.push(`${k}:${ok ? 'whole' : 'cut ' + (over * 100).toFixed(1) + '%'}`.padEnd(13));
  }
  console.log(` ${tag.padEnd(11)} ${which.padEnd(5)}  ${cells.join(' ')}`);
}
console.log('');
console.log(bad === 0
  ? '✓ A נכנס במלואו בכל הרוחבים שנבדקו'
  : `✗ A נחתך ב-${bad} רוחבים — לתקן לפני רנדר`);
