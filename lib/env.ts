import 'server-only';

/* ============================================================
   גישה מטופסת למשתני הסביבה
   ------------------------------------------------------------
   שני מצבי גישה, בכוונה:

     requireEnv()  — זורק EnvError שנוקב בשם המשתנה החסר.
                     לשימוש כשבלי הערך אי אפשר להמשיך.

     optionalEnv() — מחזיר null בשקט.
                     לשימוש ב-Supabase, שהוא שכבת מעקב בלבד
                     ואסור לו לחסום פנייה של מבקר.

   'REPLACE_ME' נחשב חסר. אחרת קובץ סביבה שלא מולא היה נראה
   תקין עד לכשל הראשון מול Supabase.
   ============================================================ */

export const ENV_KEYS = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_PROJECT_REF',
] as const;

export type EnvKey = (typeof ENV_KEYS)[number];

export class EnvError extends Error {
  readonly key: EnvKey;
  constructor(key: EnvKey) {
    super(
      `משתנה הסביבה ${key} חסר או עדיין מכיל REPLACE_ME. ` +
        `להשלים אותו ב-.env.local לפיתוח, ובהגדרות הפרויקט ב-Vercel לייצור.`,
    );
    this.name = 'EnvError';
    this.key = key;
  }
}

function read(key: EnvKey): string | null {
  /* Next משבץ רק גישה סטטית ל-process.env.NAME. process.env[key]
     נזרק מה-bundle, ובייצור המשתנים נראו חסרים למרות שהוגדרו. */
  let raw: string | undefined;
  switch (key) {
    case 'SUPABASE_URL':
      raw = process.env.SUPABASE_URL;
      break;
    case 'SUPABASE_SERVICE_ROLE_KEY':
      raw = process.env.SUPABASE_SERVICE_ROLE_KEY;
      break;
    case 'SUPABASE_PROJECT_REF':
      raw = process.env.SUPABASE_PROJECT_REF;
      break;
    default: {
      const _exhaustive: never = key;
      throw new Error(`unhandled env key: ${_exhaustive}`);
    }
  }
  if (raw === undefined) return null;
  const v = raw.trim();
  if (v === '' || v === 'REPLACE_ME') return null;
  return v;
}

/** מחזיר את הערך, או זורק EnvError שנוקב בשם המשתנה החסר. */
export function requireEnv(key: EnvKey): string {
  const v = read(key);
  if (v === null) throw new EnvError(key);
  return v;
}

/** מחזיר את הערך או null. לא זורק. */
export function optionalEnv(key: EnvKey): string | null {
  return read(key);
}

/** רשימת המשתנים שעדיין חסרים. שימושי לבדיקת מוכנות. */
export function missingEnvKeys(): EnvKey[] {
  return ENV_KEYS.filter((k) => read(k) === null);
}
