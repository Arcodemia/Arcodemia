---
name: verification
description: הכלים שמחליפים ניחוש במדידה — ומה כל אחד מהם תופס
type: entity
updated: 2026-08-27
---

# תשתית בדיקה

**זו הדרך היחידה בפרויקט לראות תוצאה במקום לנחש. להשתמש בה לפני
שמכריזים שמשהו נראה טוב.**

## כלים קבועים

| כלי | מה הוא עונה |
|---|---|
| `npm run check:crystals` | האם כל גביש נכנס למסגרת בכל רוחב — **בלי לרנדר** |
| `npm run check:contrast` | ניגודיות מתחת לאותיות בשבעה רוחבים |
| `node tools/sync-hero-refs.cjs` | מסנכרן שמות תמונות בין `Hero.tsx` ל-preload |
| `bash tools/render-hero.sh` | רנדר תמונת hero והתקנה עם hash חדש |
| `bash tools/serve.sh` | בנייה + שרת, עוקף את [[next-build-lock]] |
| `npm run lint:memory` | קישורים שבורים, יתומים ו-frontmatter חסר ב-`wiki/` |

`puppeteer-core` ו-`pngjs` הם devDependencies — בדיקת הניגודיות תלויה
בהם. הם לא נשלחים ללקוח.

## לקחים על מדידה

🔑 **על מיקום — לצלם, לא להסתמך על `getBoundingClientRect`.**
ראו [[contain-paint-breaks-fixed]].

🔑 **על ניגודיות — הפיקסל הגרוע, ומתחת לאותיות.**
ראו [[contrast-worst-pixel]].

🔑 **לפני שמתקנים "חיתוך" — לכבות את שכבות ההחשכה.**
ראו [[object-fit-cover-second-crop]].

🔑 **לסרוק את כל הדף, לא רק את מה ששינית.**
[[coins-are-fixed-and-outlive-the-section]] נתפס ככה.

⚠️ [[headless-min-width]] — צילום headless משקר על רוחב.
