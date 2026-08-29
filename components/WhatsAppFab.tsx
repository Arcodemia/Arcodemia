'use client';

import { useCallback, useEffect, useState } from 'react';
import { FAB_SHOW_AFTER_PX, useScrolledPast } from '@/hooks/useScrolledPast';
import { DEFAULT_MSG, waURL } from '@/lib/whatsapp';
import { WhatsAppIcon } from './icons';

/* הסף משותף עם כפתור השיתוף הצף ולכן יושב ב-useScrolledPast.
   קודם היה כאן קבוע מקומי בשם SHOW_AFTER_PX באותו ערך (460). */
const TIP_DELAY_MS = 4000;

/* ⚠️ חריג מדיניות מאושר ומתוחם:
   זהו **המקום היחיד** בכל האתר שבו מוצג מחיר. מדיניות התמחור
   הכללית (MEMORY.md) נותרה בעינה — אין מחירים ב-CTA, בחתכים
   או בשאלות הנפוצות. אין להעתיק את המחיר הזה לשום מקום אחר. */
const TIP_TEXT = 'שלחו הודעה עכשיו בכדי לקבל דף נחיתה החל מ-850 ₪ !';

export function WhatsAppFab() {
  const visible = useScrolledPast(FAB_SHOW_AFTER_PX);
  const [elapsed, setElapsed] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [closing, setClosing] = useState(false);

  /* הטיימר מתחיל בטעינת הדף. */
  useEffect(() => {
    const t = window.setTimeout(() => setElapsed(true), TIP_DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  /* החלטה: הטולטיפ ממתין ל**מאוחר מבין השניים** — 4 שניות מהטעינה,
     וגם שהכפתור עצמו כבר גלוי. לא כופים על הכפתור להופיע מוקדם:
     ההסתרה עד 460px היא החלטה מכוונת שלא להתחרות ב-CTA של ה-hero,
     וטולטיפ שמצביע על כפתור בלתי נראה הוא ממילא חסר משמעות. */
  const mountTip = elapsed && visible && !dismissed;

  /* סגירה בשני שלבים כדי שתהיה דעיכה ולא היעלמות פתאומית:
     is-closing מריץ את אנימציית היציאה, ורק אחריה יורד מה-DOM. */
  const close = useCallback(() => {
    setClosing(true);
    window.setTimeout(() => setDismissed(true), 300);
  }, []);

  useEffect(() => {
    if (!mountTip) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mountTip, close]);

  return (
    <>
      {/* role="status" מכריז בלי לגנוב מיקוד, ואין כאן מלכודת מיקוד */}
      {mountTip && (
        <div className={`fabtip${closing ? ' is-closing' : ''}`} role="status">
          <span>{TIP_TEXT}</span>
          <button
            type="button"
            className="fabtip__x"
            onClick={close}
            aria-label="סגירת ההודעה"
          >
            ✕
          </button>
        </div>
      )}

      <a
        className={`fab${visible ? ' is-on' : ''}`}
        href={waURL(DEFAULT_MSG)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="פתחו שיחת וואטסאפ"
        aria-hidden={!visible}
        tabIndex={visible ? undefined : -1}
      >
        <WhatsAppIcon />
      </a>
    </>
  );
}
