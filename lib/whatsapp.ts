import { CONFIG, BRAND } from './config';
import type { ContactPayload } from './types';

/** בונה קישור wa.me עם הודעה מוכנה. הטקסט תמיד מקודד. */
export function waURL(text: string): string {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
}

/* ⚠️ הנוסח הזה נמסר מילה במילה על ידי הלקוח, כולל האיות
   "בוואצאפ" והקוד ARMEDIA10. זו הודעת המבצע שנפתחת מכפתור
   הוואטסאפ הצף. אין לנסח אותה מחדש בלי אישור.
   ⚠️ שימו לב שההודעה נשלחת **מהמבקר אליכם**, ולכן הקוד הוא
   למעשה תגית מקור שמזהה מאיפה הפנייה הגיעה. */
export const DEFAULT_MSG =
  'קבלו 10% הנחה לחודש הקרוב עם הקוד ARMEDIA10 בוואצאפ!';

/* נפילה לוואטסאפ — כך שהטופס לעולם לא מוביל למבוי סתום,
   גם אם השרת לא מוגדר עדיין או שהשליחה נכשלה. */
export function toWhatsAppMessage(d: Pick<ContactPayload, 'name' | 'phone' | 'business' | 'message'>): string {
  return [
    `שלום, השארתי פרטים באתר של ${BRAND}.`,
    `שם: ${d.name}`,
    `טלפון: ${d.phone}`,
    d.business ? `סוג עסק: ${d.business}` : '',
    d.message ? `מה שאני צריך: ${d.message}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

export function openWhatsApp(d: Pick<ContactPayload, 'name' | 'phone' | 'business' | 'message'>): void {
  window.open(waURL(toWhatsAppMessage(d)), '_blank', 'noopener');
}
