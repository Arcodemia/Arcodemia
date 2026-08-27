#!/bin/bash
# ============================================================
# הצינור המלא של תמונות ה-hero — כולל הקומפוזיט
# ------------------------------------------------------------
# ⚠️ **אל תרנדר את התמונות האלה עם render-crystals.cjs לבד.**
# הגביש השמאלי בתמונה האפויה אינו רנדר ישיר: הוא הדבקה 2D של
# פיקסלי הגביש הימני במיקום השמאלי. כוונון 3D לא יכול להגיע
# לזהות כי דגימת ה-env-map תלויה בזווית הראייה.
# סקריפט קודם (render-hero.sh) דילג על הצעד הזה, והתוצאה הייתה
# גביש שמאלי אחר — הלקוח שם לב מיד.
# ראו wiki/hero-crystals.md ו-tools/composite-left-from-right.cjs
#
# שימוש:  bash tools/bake-hero.sh
# ============================================================
set -e
cd "$(dirname "$0")/.."

echo "=== רנדר שלוש שכבות לכל גודל, ואז קומפוזיט ==="
node tools/bake-hero-2d-swap.cjs both

echo ""
echo "=== אימות lossless ==="
node -e '
const fs=require("fs");
let bad=0;
for (const n of ["wide","tall"]) {
  const r=JSON.parse(fs.readFileSync("tools/_layers/"+n+"-report.json","utf8"));
  const o=r.losslessVsRightOnly.opaqueBodyShouldBeZero;
  const zero=Object.values(o.maxAbs).every(v=>v===0);
  console.log("  "+n+"  גוף אטום max "+JSON.stringify(o.maxAbs)+(zero?"  ✓":"  ✗ ההעתקה אינה זהה"));
  if(!zero) bad++;
}
if(bad) process.exit(1);
'

echo ""
echo "=== התקנה עם hash חדש ==="
node -e '
const fs=require("fs"),crypto=require("crypto");
for (const n of ["wide","tall"]) {
  const buf=fs.readFileSync("tools/_layers/"+n+"-composite.webp");
  const h=crypto.createHash("md5").update(buf).digest("hex").slice(0,6);
  for(const f of fs.readdirSync("public/img")) if(f.startsWith("hero-"+n+".")) fs.unlinkSync("public/img/"+f);
  fs.writeFileSync("public/img/hero-"+n+"."+h+".webp", buf);
  console.log("  hero-"+n+"."+h+".webp  "+buf.length+" bytes");
}
'

node tools/sync-hero-refs.cjs
rm -rf tools/_layers tools/_render.html
echo ""
echo "✓ הושלם. הרץ npm run check:contrast — הגבישים זזו מאחורי הטקסט."
