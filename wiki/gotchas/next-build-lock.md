---
name: next-build-lock
description: next build נכשל עם "Build error occurred" אם שרת קודם עדיין מחזיק את .next
type: concept
updated: 2026-08-27
---

# `.next` נעול → `next build` נכשל

`npm run build` נכשל עם `Build error occurred` **בלי סיבה אמיתית** אם שרת
`npm run start` קודם עדיין מחזיק את תיקיית `.next`.

זה קרה שלוש פעמים באותו סשן ובכל פעם נראה כמו שגיאת קוד. הבנייה עצמה
תקינה לגמרי — מריצים אותה שוב לבד והיא עוברת.

`taskkill` לבדו לא מספיק: התהליך משחרר את הנעילה רגע אחרי שהוא מת.

**הפתרון:** `bash tools/serve.sh` — הורג, מחכה עד ש-`.next` באמת ניתן
למחיקה, מוחק, בונה, ומעלה שרת.
