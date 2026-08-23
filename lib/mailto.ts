import { CONFIG, BRAND } from './config';
import type { ContactPayload } from './types';

type MailtoFields = Pick<ContactPayload, 'name' | 'phone' | 'business' | 'message'>;

/** גוף ההודעה — אותה תבנית כמו בוואטסאפ, כדי שהפרטים יגיעו זהים. */
export function toMailtoBody(d: MailtoFields): string {
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

/** בונה קישור mailto עם נושא וגוף מוכנים. כל הערכים מקודדים. */
export function mailtoURL(d: MailtoFields): string {
  const subject = encodeURIComponent(
    `פנייה מדף הנחיתה של ${BRAND} — ${d.name}${d.business ? ` · ${d.business}` : ''}`,
  );
  const body = encodeURIComponent(toMailtoBody(d));
  return `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;
}

export function openMailto(d: MailtoFields): void {
  window.open(mailtoURL(d), '_blank', 'noopener');
}
