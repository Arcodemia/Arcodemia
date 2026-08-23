import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

/* ============================================================
   לקוח Supabase — צד שרת בלבד
   ------------------------------------------------------------
   🔴 מפתח ה-service-role עוקף RLS לחלוטין. הוא לא צריך להגיע
   לדפדפן בשום מצב, ולכן:
     · הקובץ מייבא 'server-only'. כל ייבוא שלו מרכיב לקוח
       ישבור את הבנייה במקום לדלוף בשקט.
     · שם המשתנה בלי קידומת NEXT_PUBLIC_, כך ש-Next לא יטמיע
       אותו ב-bundle גם בטעות.

   טבלאות leads ו-rate_limits בלי אף policy: רק הלקוח הזה ניגש אליהן.
   ============================================================ */

let cached: SupabaseClient<Database> | null = null;

/** מחזיר את הלקוח, או null אם הסביבה עוד לא הוגדרה. */
export function getSupabase(): SupabaseClient<Database> | null {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  cached = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { 'x-application-name': 'arcodemia-site' } },
  });
  return cached;
}

/** true כשאפשר לכתוב למסד. */
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
