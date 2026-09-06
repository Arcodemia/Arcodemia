/* ============================================================
   התקנת תמונת שירות
   ------------------------------------------------------------
   ממיר תמונת מקור ל-WebP, בגודל שהאתר באמת מציג, ושומר אותה
   תחת public/img/services/<slug>.<hash>.webp.

   🔑 למה hash בשם: next.config.mjs מגיש את /img/* עם
   `max-age=31536000, immutable`. קובץ שמוחלף בלי לשנות את השם
   פשוט לא יגיע לאף מבקר שכבר ביקר. אותו כלל בדיוק כמו
   בתמונות ה-hero. ראו wiki/hero-crystals.

   🔑 למה לא next/image: הפרויקט מקדד מראש בגודל הנכון ומגיש
   קובץ סטטי אחד. next/image רק היה מקודד מחדש את מה שכבר
   אופטימלי, ומוסיף שכבת ריצה. אותה החלטה כמו ב-Hero ובתיק
   העבודות.

   שימוש:
     node tools/add-service-image.cjs <קובץ מקור> <slug>
   ============================================================ */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SRC = process.argv[2];
const SLUG = process.argv[3];

if (!SRC || !SLUG) {
  console.error('שימוש: node tools/add-service-image.cjs <source> <slug>');
  process.exit(1);
}
if (!fs.existsSync(SRC)) {
  console.error('לא נמצא קובץ מקור: ' + SRC);
  process.exit(1);
}

/* הרוחב שהכרטיס מציג בפועל הוא ~700px בשולחני. 1100 נותן
   מרווח לצפיפות 1.5x בלי לשלם על 2x מלא, שהוא בזבוז על
   איור עם שטחים אחידים. */
const MAX_W = 1100;
const QUALITY = 80;

const OUT_DIR = path.resolve(__dirname, '..', 'public', 'img', 'services');

(async () => {
  const sharp = require('sharp');
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const input = fs.readFileSync(SRC);
  const meta = await sharp(input).metadata();

  const pipeline = sharp(input);
  if (meta.width && meta.width > MAX_W) {
    pipeline.resize(MAX_W, null, { fit: 'inside', withoutEnlargement: true });
  }
  const webp = await pipeline.webp({ quality: QUALITY }).toBuffer();
  const out = await sharp(webp).metadata();

  const hash = crypto.createHash('md5').update(webp).digest('hex').slice(0, 6);
  const name = `${SLUG}.${hash}.webp`;

  /* גרסה קודמת של אותו slug יורדת, אחרת public מתמלא ביתומים */
  for (const f of fs.readdirSync(OUT_DIR)) {
    if (f.startsWith(SLUG + '.') && f.endsWith('.webp') && f !== name) {
      fs.unlinkSync(path.join(OUT_DIR, f));
      console.log('  הוסר ישן: ' + f);
    }
  }

  fs.writeFileSync(path.join(OUT_DIR, name), webp);
  const kb = Math.round(webp.length / 1024);
  const srcKb = Math.round(input.length / 1024);
  console.log(
    `  ${name}  ${out.width}x${out.height}  ${kb}KB  (מקור ${meta.width}x${meta.height} ${srcKb}KB)`,
  );
  console.log(`  → { src: '/img/services/${name}', w: ${out.width}, h: ${out.height} }`);
})();
