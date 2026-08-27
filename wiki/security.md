---
name: security
description: CSP בכותרות ולא ב-meta, אפס innerHTML, ניקוי תווי בקרה, ומלכודת ספאם
type: entity
updated: 2026-08-17
---

# אבטחה

⚠️ **ה-CSP יושב ב-`next.config.mjs` ולא ב-`<meta>`.** שתי סיבות:
header יכול לאכוף `frame-ancestors` ש-meta מתעלם ממנו; ומעשית — תחת
`file://` המקור אטום, `'self'` לא תואם, וה-meta **חסם את הפונטים
המקומיים בכל פתיחה של הקובץ לבדיקה**.

כותרות שנאכפות: CSP · HSTS (preload) · X-Content-Type-Options ·
X-Frame-Options · Referrer-Policy · COOP · CORP · Permissions-Policy
(הכל מושבת).

## הכללים

- כל הקישורים החיצוניים: `rel="noopener noreferrer"`
- **אין `innerHTML` בשום מקום** — הכל `textContent` / `createElement`
- מלכודת ספאם `_gotcha`, מוסתרת ב-`clip-path`. **לא במיקום שלילי** —
  `-9999px` בלי הורה ממוקם מותח את רוחב הדף וגורם לגלישה בנייד
- האימייל מוזרק ב-JS מ-`lib/config.ts` → לא ב-HTML הסטטי
- אין בקשה לאף שרת חיצוני. הפונטים אצלנו, אין אנליטיקה, אין cookies
- `app/api/contact/route.ts`: ולידציה, בריחת HTML, ניקוי תווי בקרה
  מכותרות, הגבלת קצב, `_gotcha` שמחזיר "הצליח" כדי שהבוט לא ילמד

## שתי מלכודות

🔴 [[raw-control-bytes-in-clean]] — הרגקס שאסור לשכתב לפי המראה
⚠️ [[csp-phase-not-node-env]] — איך `'unsafe-eval'` דלף לייצור
