/* טיפוסים משותפים לטופס יצירת הקשר — צד לקוח וצד שרת */

import type { ContactMethod } from './database.types';

/** באיזה ערוץ המבקר בחר ליצור קשר. */
export type ContactMode = ContactMethod;

/** מה שהטופס שולח ל-POST /api/contact */
export interface ContactPayload {
  name: string;
  phone: string;
  business: string;
  message: string;
  /** חסר או לא תקין → 'email', ההתנהגות שהייתה עד היום. */
  mode: ContactMode;
  /** מלכודת ספאם. בני אדם לא רואים אותה ולכן היא תמיד ריקה. */
  _gotcha: string;
  /** חייב להיות true — נאכף גם בשרת, לא רק ב-required בדפדפן. */
  consent: boolean;
}

/** קודי השגיאה שהשרת מחזיר. */
export type ContactErrorCode =
  | 'bad_json'
  | 'bad_body'
  | 'name'
  | 'phone'
  | 'consent'
  | 'method_not_allowed'
  | 'too_many';

export type ContactResponse =
  | { ok: true; mode: ContactMode }
  | { ok: false; error: ContactErrorCode };
