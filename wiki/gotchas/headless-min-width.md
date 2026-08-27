---
name: headless-min-width
description: Chrome headless אוכף רוחב חלון מינימלי, ולכן צילום ב-375px משקר ונראה כמו גלישה אופקית
type: concept
updated: 2026-08-06
---

# headless אוכף רוחב מינימלי

שלוש מלכודות בצילום אוטומטי שעלו זמן:

1. **`--screenshot` מחזיר מסך לבן על קנבס WebGL.** חייבים `toDataURL`
   בתוך הדף ואז `--dump-dom`.
2. **headless אוכף רוחב חלון מינימלי (~500px).** צילום ב-375 מרנדר ב-500
   ומקטין — וזה **נראה כמו גלישה אופקית שלא קיימת**. לבדיקת מובייל אמיתית:
   `page.setViewport` ב-puppeteer, או iframe ברוחב האמיתי.
3. **`overflow-x:hidden` מסתיר ראיות** מפרוב גלישה — לנטרל זמנית במדידה.

ראו [[verification]].
