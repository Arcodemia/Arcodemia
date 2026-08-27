---
name: supabase-layer
description: שכבת המעקב: נרשמת כל פנייה, ולעולם לא חוסמת מבקר
type: entity
updated: 2026-08-23
---

# שכבת Supabase

`lib/supabase.ts` · `lib/env.ts` · `lib/database.types.ts` ·
`supabase/migrations/`.

🔑 **Supabase הוא שכבת מעקב, לעולם לא חוסם מבקר.** אם הרישום נכשל —
מעבירים הלאה. ראו [[no-external-mailer]].

🔴 **מפתח ה-service-role עוקף RLS לחלוטין.** הוא לא צריך להגיע ללקוח
לעולם — `server-only` שומר על זה.

RLS מופעל עם **אפס policies** על טבלת הפניות: רק service-role נוגע בה.

⚠️ **כל טיפוסי הסכמה הם `type` ולא `interface`.** `postgrest-js` דורש
index signature משתמע, ו-`interface` לא מספק אותו — התוצאה היא
`never[]` בכל שאילתה.

## מה לא נבנה

- **דשבורד ניהול** לצפייה בפניות ולעדכון `status`
- **תצוגת portfolio ציבורית** — הטבלה וה-policy קיימות, אין UI

`RESEND_API_KEY` הוא שריד — לא בשימוש.
