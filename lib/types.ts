/* טיפוסים משותפים לטופס יצירת הקשר — צד לקוח וצד שרת */

/** מה שהטופס שולח ל-POST /api/contact */
export interface ContactPayload {
  name: string;
  phone: string;
  business: string;
  message: string;
  /** מלכודת ספאם. בני אדם לא רואים אותה ולכן היא תמיד ריקה. */
  _gotcha: string;
}

/** קודי השגיאה שהשרת מחזיר. זהים למה שהיה ב-api/contact.js. */
export type ContactErrorCode =
  | 'bad_json'
  | 'bad_body'
  | 'name'
  | 'phone'
  | 'method_not_allowed'
  | 'too_many'
  | 'not_configured'
  | 'send_failed';

export type ContactResponse =
  | { ok: true }
  | { ok: false; error: ContactErrorCode };
