---
name: hero-crystals
description: צינור הייצור של תמונות הקריסטלים: raymarcher offline, רנדר בטיילים, ושמות עם hash
type: entity
updated: 2026-08-27
---

# הקריסטלים — צינור הייצור

ההחלטה למה אפייה ולא רנדר חי: [[crystals-baked-not-realtime]].
מי מהם נראה ואיך: [[crystal-visibility-rules]].

## הקבצים

`public/img/hero-wide.<hash>.webp` (1800×1120, שולחני) ·
`public/img/hero-tall.<hash>.webp` (900×1150, נייד).

בדף: `<picture>` עם `media` — רק החיתוך המתאים נטען.

⚠️ **השם כולל hash של הבתים ו-`/img/*` נשמר שנה כ-immutable.** רנדר
מחדש **חייב** לייצר שם חדש, אחרת הדפדפן ישאיר את הישנה.

⚠️ שני קבצים חייבים להסכים על השם: ה-`<picture>` ב-`Hero.tsx` וה-preload
ב-`layout.tsx`. אם הם מתפצלים הדפדפן מקדים לטעון תמונה אחת ומציג אחרת —
משלם פעמיים ומאבד את ה-LCP.
**`node tools/sync-hero-refs.cjs` מסנכרן את שניהם מ-`public/img`.**

## איך מייצרים חדשות

```bash
bash tools/render-hero.sh wide 1800 1120
bash tools/render-hero.sh tall  900 1150
node tools/sync-hero-refs.cjs
npm run check:crystals
npm run check:contrast
```

המנוע הוא `tools/render-crystals.cjs` — raymarcher שמורץ **פעם אחת
offline** באיכות בלתי אפשרית בזמן אמת: פיזור ספקטרלי ב-8 אורכי גל,
3 החזרות פנימיות, 4 דגימות AA, 200 צעדים.

🔑 **`--use-angle=d3d11` נותן GPU אמיתי ב-headless.** בלעדיו רץ
SwiftShader והרנדר לא מעשי.
🔑 **חובה לרנדר בטיילים** (~450px) — שיידר שרץ יותר משתי שניות ברצף
מפעיל TDR reset של הדרייבר וההקשר נופל.

## המצלמה וההיטל

מצלמה ב-`z=-9`, אורך מוקד `1.55`. נקודה בעולם ממופה ל-uv לפי:

```
uv = xy * 1.55 / (z + 9)
```

חצי-המסגרת ב-x הוא `halfW() = 0.5 * aspect`, וב-y תמיד `0.5`.
זה מה שמאפשר לגזור מיקום שמבטיח שהגביש נכנס — במקום לנחש קבועים.

⚠️ `b` עדיין משתמש ב-`ax()` הישן. `a` **לא**.

## הקריאות מעל התמונה

`.hero__art::after` — החשכה מדורגת מעל התמונה.
`.hero__in::before` — הסקרים שמתחת לגוש הטקסט. ראו [[accessibility]].
