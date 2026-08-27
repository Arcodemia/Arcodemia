/* ============================================================
   סנכרון שמות תמונות ה-hero
   ------------------------------------------------------------
   שם הקובץ כולל hash של הבתים, ו-/img/* נשמר שנה כ-immutable.
   רנדר מחדש מייצר שם חדש, ואז **שני** קבצים צריכים לדעת עליו:
     components/Hero.tsx  — ה-<picture>
     app/layout.tsx       — ה-preload
   אם רק אחד מהם מתעדכן, הדפדפן מקדים לטעון תמונה אחת ומציג
   אחרת: משלם פעמיים ומאבד את ה-LCP. הכלי הזה קורא מה יש בפועל
   ב-public/img ומעדכן את שניהם.

   שימוש:  node tools/sync-hero-refs.cjs
   ============================================================ */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const IMG = path.join(ROOT, 'public', 'img');
const FILES = ['components/Hero.tsx', 'app/layout.tsx'];
const CR = String.fromCharCode(13);

/* מה קיים בפועל */
const actual = {};
for (const f of fs.readdirSync(IMG)) {
  const m = f.match(/^hero-([a-z]+)\.([a-f0-9]+)\.webp$/);
  if (m) {
    if (actual[m[1]]) throw new Error(`שתי תמונות ל-${m[1]}: ${actual[m[1]]} ו-${f}`);
    actual[m[1]] = f;
  }
}
if (!Object.keys(actual).length) throw new Error('לא נמצאו תמונות hero ב-public/img');

let changed = 0;
const seen = new Set();
for (const rel of FILES) {
  const p = path.join(ROOT, rel);
  let s = fs.readFileSync(p, 'utf8').split(CR).join('');
  const before = s;
  s = s.replace(/hero-([a-z]+)\.[a-f0-9]+\.webp/g, (whole, kind) => {
    seen.add(kind);
    if (!actual[kind]) throw new Error(`${rel} מפנה ל-hero-${kind} שלא קיים ב-public/img`);
    return actual[kind];
  });
  if (s !== before) { fs.writeFileSync(p, s); changed++; }
  console.log(`${rel.padEnd(22)} ${s === before ? 'כבר מסונכרן' : 'עודכן'}`);
}

/* אף תמונה לא נשארת יתומה */
for (const kind of Object.keys(actual)) {
  if (!seen.has(kind)) console.log(`⚠️  hero-${kind} קיים ב-public/img אבל אף אחד לא מפנה אליו`);
}
console.log('');
for (const [k, v] of Object.entries(actual)) console.log(`  ${k.padEnd(6)} ${v}`);
console.log(changed ? '\n✓ סונכרן' : '\n✓ לא היה צורך בשינוי');
