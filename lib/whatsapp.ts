import { CONFIG, BRAND } from './config';
import type { ContactPayload } from './types';

/** בונה קישור wa.me עם הודעה מוכנה. הטקסט תמיד מקודד. */
export function waURL(text: string): string {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
}

export const DEFAULT_MSG =
  `שלום, הגעתי מהאתר של ${BRAND} ואשמח לקבל הצעת מחיר לדף נחיתה.`;

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
