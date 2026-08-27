/* ============================================================
   כמה מכל גביש הדפדפן חותך — בלי לרנדר
   ------------------------------------------------------------
   ⚠️ זהו **דוח, לא מבחן.** שני הגבישים נכנסים מהשוליים וחתוכים
   שם **בכוונה** — זו הקומפוזיציה שהלקוח אישר, לא באג:
     a — השמאלי, נחתך בשוליים השמאליים
     b — הימני העליון, נחתך בשוליים הימניים
   ניסיון אחד "לתקן" את זה (27.8) הקטין את a ל-70% והזיז אותו,
   והלקוח ביקש להחזיר. ראו wiki/decisions/crystal-visibility-rules.

   למה הכלי בכל זאת שווה: הוא מראה שהחיתוך הוא **שניים** ולא אחד.
   מלבד מסגרת התמונה, object-fit:cover חותך את ההפרש בין יחס
   התמונה ליחס תיבת ה-hero — והתיבה היא תמיד 657px גובה ברוחב
   שולחני, ולכן היחס שלה נע בין 1.6 ל-2.9.
   ראו wiki/gotchas/object-fit-cover-second-crop.

   השתמש בו כשמזיזים גביש, כדי לראות מה זה עושה בכל רוחב.

   שימוש:  npm run check:crystals
   ============================================================ */

const CAM = 9.0, FOCAL = 1.55;

/* --- אותן נוסחאות כמו בשיידר (tools/render-crystals.cjs) --- */
const ax = (a) => Math.max(2.85, a * 2.86);
const ext = (L, r, z) => Math.sqrt(L * L + r * r) * FOCAL / (z + CAM);

/* [שם, L, r, z, x, y] — x/y כמכפילים של ax() כמו בשיידר */
const SPEC = {
  a: { L: 2.10, r: 0.86, z: 0.40, mx: -1.00, y: 0.75 },
  b: { L: 1.85, r: 0.75, z: -0.60, mx: 1.05, y: -0.95 },
};

function crystals(iw, ih) {
  const aspect = iw / ih;
  const halfW = 0.5 * aspect;
  const out = {};
  for (const [k, s] of Object.entries(SPEC)) {
    const e = ext(s.L, s.r, s.z);
    const ux = ax(aspect) * s.mx * FOCAL / (s.z + CAM);
    const uy = s.y * FOCAL / (s.z + CAM);
    out[k] = {
      xc: 0.5 + ux / (2 * halfW), yc: 0.5 + uy,
      ex: e / (2 * halfW), ey: e,
    };
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

console.log('כמה מכל גביש נשאר מחוץ למה שהגולש רואה');
console.log('(שניהם חתוכים בכוונה — זהו דוח, לא מבחן)\n');
console.log(' viewport     img    crop של cover      a              b');
for (const [tag, bw, bh, which] of VIEWS) {
  const [iw, ih] = IMG[which];
  const cs = crystals(iw, ih);
  const scale = Math.max(bw / iw, bh / ih);
  const dispW = iw * scale, dispH = ih * scale;
  const cropX = (dispW - bw) / 2 / dispW, cropY = (dispH - bh) / 2 / dispH;
  const cells = [];
  for (const k of ['a', 'b']) {
    const c = cs[k];
    const over = Math.max(
      cropX - (c.xc - c.ex), (c.xc + c.ex) - (1 - cropX),
      cropY - (c.yc - c.ey), (c.yc + c.ey) - (1 - cropY),
    );
    cells.push(`${k}: ${over <= 0 ? 'שלם ' : (over * 100).toFixed(0) + '% בחוץ'}`.padEnd(15));
  }
  const crop = `x ${(cropX * 100).toFixed(1)}% y ${(cropY * 100).toFixed(1)}%`;
  console.log(` ${tag.padEnd(11)} ${which.padEnd(5)}  ${crop.padEnd(18)} ${cells.join(' ')}`);
}
console.log('\nהחיתוך של cover הוא מעבר למסגרת התמונה — שני חיתוכים, לא אחד.');
