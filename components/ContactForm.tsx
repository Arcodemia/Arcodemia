'use client';

import { useRef, useState, type FormEvent } from 'react';
import { CONFIG } from '@/lib/config';
import { isMobile } from '@/lib/device';
import { gmailComposeURL, openMailto } from '@/lib/mailto';
import { openWhatsApp } from '@/lib/whatsapp';
import type { ContactMode, ContactPayload } from '@/lib/types';
import { useLegal } from './LegalDialogs';
import { MailIcon, WhatsAppIcon } from './icons';

interface Status {
  text: string;
  isError: boolean;
}

const SUBMIT_LABEL = 'שלחו — ונחזור אליכם';

export function ContactForm() {
  const { open } = useLegal();
  const formRef = useRef<HTMLFormElement>(null);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);
  /* ברירת המחדל היא מייל — אותה התנהגות שהייתה עד היום. */
  const [mode, setMode] = useState<ContactMode>('email');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = formRef.current;
    if (!form || sending) return;
    if (!form.reportValidity()) return;

    const fd = new FormData(form);
    const d: ContactPayload = {
      name: String(fd.get('name') ?? ''),
      phone: String(fd.get('phone') ?? ''),
      business: String(fd.get('business') ?? ''),
      message: String(fd.get('message') ?? ''),
      mode,
      _gotcha: String(fd.get('_gotcha') ?? ''),
    };

    /* ⚠️ פותחים את הקישור **מיד**, בתוך אותו tick של אירוע הלחיצה.
       window.open אחרי await נחשב לא-מגובה-במחווה וחוסמי חלונות
       קופצים יבלעו אותו. הרישום ב-API רץ במקביל ולא משנה אם
       הוואטסאפ או תוכנת המייל נפתחו. */
    if (mode === 'whatsapp') openWhatsApp(d);
    else if (isMobile()) openMailto(d);
    else window.open(gmailComposeURL(d), '_blank', 'noopener');

    const openedCopy =
      mode === 'whatsapp'
        ? 'פתחנו לכם וואטסאפ עם הפרטים.'
        : 'פתחנו לכם את תוכנת המייל עם הפרטים.';

    /* אין endpoint מוגדר → הקישור כבר נפתח למעלה. אין מה לרשום. */
    if (!CONFIG.endpoint) {
      setStatus({ text: openedCopy, isError: false });
      return;
    }

    setSending(true);
    try {
      const res = await fetch(CONFIG.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(d),
      });

      if (res.ok) {
        form.reset();
        setStatus({ text: openedCopy, isError: false });
      } else if (res.status === 429) {
        setStatus({ text: 'שלחתם הודעה ממש עכשיו. חכו רגע ונסו שוב.', isError: true });
      } else {
        throw new Error(String(res.status));
      }
    } catch {
      /* הרישום נכשל — היישום כבר נפתח, וזה מה שהמבקר צריך לראות. */
      setStatus({ text: openedCopy, isError: false });
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="form rv" ref={formRef} onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="f-name">שם מלא</label>
        <input id="f-name" name="name" type="text" autoComplete="name" placeholder="דנה כהן" required />
      </div>

      <div className="field">
        <label htmlFor="f-phone">טלפון</label>
        <input
          id="f-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          dir="ltr"
          placeholder="050-000-0000"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="f-biz">סוג העסק</label>
        <input
          id="f-biz"
          name="business"
          type="text"
          autoComplete="organization"
          placeholder="למשל: מספרה, מוסך, קליניקה, מסעדה…"
        />
      </div>

      <div className="field">
        <label htmlFor="f-msg">
          מה תרצו שהדף יעשה? <span className="opt">(לא חובה)</span>
        </label>
        <textarea id="f-msg" name="message" placeholder="למשל: שאנשים יקבעו תור בלי להתקשר" />
      </div>

      {/* בחירת ערוץ. ברירת המחדל היא מייל — ההתנהגות שהייתה עד היום. */}
      <fieldset className="method">
        <legend>איך נוח לכם שנמשיך?</legend>
        <div className="method__opts">
          <button
            type="button"
            className="method__btn"
            aria-pressed={mode === 'whatsapp'}
            onClick={() => setMode('whatsapp')}
          >
            <WhatsAppIcon />
            שלח לי וואטסאפ
          </button>
          <button
            type="button"
            className="method__btn"
            aria-pressed={mode === 'email'}
            onClick={() => setMode('email')}
          >
            <MailIcon />
            שלח לי במייל
          </button>
        </div>
      </fieldset>

      <label className="consent">
        <input type="checkbox" id="f-ok" name="consent" required />
        <span>
          קראתי ואני מאשר/ת את{' '}
          <button type="button" className="linklike" onClick={() => open('docPrivacy')}>
            מדיניות הפרטיות
          </button>
          , ומסכים/ה שתיצרו איתי קשר בנוגע לפנייה הזו.
        </span>
      </label>

      {/* מלכודת ספאם: בוטים ממלאים אותה, בני אדם לא רואים אותה.
          ⚠️ מוסתרת ב-clip-path ולא במיקום שלילי — מיקום ב--9999px
          ללא הורה ממוקם מותח את רוחב הדף וגורם לגלישה אופקית בנייד. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="f-company">אל תמלאו שדה זה</label>
        <input id="f-company" name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" className="btn btn--primary btn--block" disabled={sending}>
        {sending ? 'שולח…' : SUBMIT_LABEL}
      </button>

      <p className="form__note">
        לא שולחים ספאם ולא מעבירים פרטים לאף אחד. הפרטים משמשים אך ורק כדי לחזור אליכם.
      </p>

      <p
        className={`form__ok${status?.isError ? ' is-err' : ''}`}
        role="status"
        style={status ? { display: 'block' } : undefined}
      >
        {status?.text ?? ''}
      </p>
    </form>
  );
}
