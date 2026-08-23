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

function toMailSubject(d: MailtoFields): string {
  return `פנייה מדף הנחיתה של ${BRAND} — ${d.name}${d.business ? ` · ${d.business}` : ''}`;
}

function encodedMailParts(d: MailtoFields): { subject: string; body: string } {
  return {
    subject: encodeURIComponent(toMailSubject(d)),
    body: encodeURIComponent(toMailtoBody(d)),
  };
}

/** בונה קישור mailto עם נושא וגוף מוכנים. כל הערכים מקודדים. */
export function mailtoURL(d: MailtoFields): string {
  const { subject, body } = encodedMailParts(d);
  return `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;
}

/** טאב Gmail compose — אותו נושא וגוף כמו ב-mailto. לדסקטופ בלבד. */
export function gmailComposeURL(d: MailtoFields): string {
  const { subject, body } = encodedMailParts(d);
  const to = encodeURIComponent(CONFIG.email);
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`;
}

export function openMailto(d: MailtoFields): void {
  window.open(mailtoURL(d), '_blank', 'noopener');
}
