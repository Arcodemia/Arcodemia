---
name: architecture
description: המבנה, הסטאק והפקודות — Next.js 16 App Router, TypeScript strict, RTL
type: entity
updated: 2026-08-27
---

# ארכיטקטורה

Next.js 16 · App Router · TypeScript strict · React 19 · עברית RTL.
**עבר מ-`index.html` יחיד ב-2026-08-17.**

```
app/layout.tsx            metadata, JSON-LD, next/font, preload לתמונות ה-hero
app/page.tsx              עמוד הבית של הסוכנות
app/services/<slug>/      חמישה עמודי קטגוריה, ראו [[services-catalog]]
app/globals.css           כל ה-CSS. תכונות לוגיות ל-RTL
app/api/contact/route.ts  Route Handler שרושם את הפנייה ב-Supabase
app/fonts/                Heebo מתארח אצלנו — אין Google Fonts
components/               רכיב לכל חתך + SubpageShell + CategoryNav + Dialog
public/work/              צילומי אתרי לקוחות לתיק העבודות
hooks/                    useA11yPreferences · useReveal · useScrolledPast
lib/                      config · services · projects · whatsapp · mailto · env · supabase
public/img/               תמונות הקריסטלים (רחב + לאורך), שם עם hash
supabase/migrations/      סכמה
tools/                    רנדר הקריסטלים + בדיקות — ראו [[verification]]
next.config.mjs           כותרות אבטחה + מטמון (החליף את vercel.json)
DEPLOY.md                 ההוראות ללקוח, שלב אחר שלב
```

## פקודות

```
npm run dev             פיתוח
npm run build           בנייה
npm run typecheck       tsc --noEmit
npm run lint            eslint
npm run check:crystals  האם כל גביש נכנס למסגרת — בלי לרנדר
npm run check:contrast  ניגודיות מתחת לאותיות בשבעה רוחבים
bash tools/serve.sh     בנייה + שרת, עוקף את [[next-build-lock]]
```

## תצורה

פרטי הקשר האמיתיים יושבים ב-**`lib/config.ts`** (לא ב-`<script>` — זה
שריד מגרסת ה-HTML היחיד).
טלפון/וואטסאפ `052-382-2083` · אימייל `arcodemia.il@gmail.com`

כלים מותקנים במחשב: Node 24 · npm 11 · git · Vercel CLI 58 ·
Python+fonttools (לחיתוך פונטים) · Chrome (לרנדר headless).

> **המותג היה "Aristocraft" עד 2026-08-06.** אם צצה המילה — שריד, למחוק.

## מבנה הדף

עמוד הבית: nav + `components/CategoryNav.tsx` → hero → תיק עבודות → קרוסלת
השירותים → אוטומציות → NFC → שיווק → מי אנחנו → ביקורות → צור קשר
→ footer + dialogs משפטיים + כפתורי וואטסאפ ושיתוף צפים.

עמוד קטגוריה: אותו nav + חזרה → hero של השירות → גוף → CTA →
שירותים נוספים. ראו [[services-catalog]].

⚠️ הקופי של דפי הנחיתה עבר ל-`/services/landing-pages` כמות שהוא.
ראו [[agency-repositioning]].

**"בורר השירותים" הוסר** (2026-08-06). שדה "סוג העסק" הוא טקסט חופשי,
לא `<select>`, לבקשת הלקוח.
