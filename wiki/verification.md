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
| `npm run check:crystals` | **דוח** כמה מכל גביש נחתך בכל רוחב — בלי לרנדר |
| `npm run check:contrast` | ניגודיות מתחת לאותיות בשבעה רוחבים |
| `node tools/sync-hero-refs.cjs` | מסנכרן שמות תמונות בין `Hero.tsx` ל-preload |
| `bash tools/bake-hero.sh` | **הדרך היחידה** לייצר את תמונות ה-hero — כולל הקומפוזיט |
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

🔑 **אחרי רנדר מחדש — להשוות מול התמונה הקודמת.** מפת הפרשים
מוגברת מראה בשנייה מה זז ומה לא. ככה התגלה ש-[[hero-image-is-a-2d-composite]]
נשכח, וגם שכיבוי גביש אחד משנה את השניים האחרים.

⚠️ [[headless-min-width]] — צילום headless משקר על רוחב.
