'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useA11yPreferences, type A11yAction } from '@/hooks/useA11yPreferences';
import { useLegal } from './LegalDialogs';
import { A11yIcon } from './icons';

/* ============================================================
   תפריט הנגישות
   ------------------------------------------------------------
   🔧 כאן תוקן הבאג שהיה בגרסה הסטטית.
   שם ה-IIFE כולו הופיע פעמיים, כלומר שני מאזיני click על אותו
   כפתור: הראשון פתח את החלונית והשני סגר אותה מיד באותה לחיצה,
   והיא לא נפתחה לעולם. אומת בדפדפן: open=false גם אחרי לחיצה
   אחת וגם אחרי שתיים.

   כאן יש **מקור אמת אחד** — useState — ו-onClick יחיד. אין שום
   דרך לרשום שני נתיבי אירוע על אותו כפתור.
   ============================================================ */

interface Item {
  action: A11yAction;
  label: string;
  icon: ReactNode;
}

const ITEMS: Item[] = [
  {
    action: 'font',
    label: 'הגדלת טקסט',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d="M4 19 9.5 5l5.5 14" />
        <path d="M6 14h7" />
        <path d="M17 19h4M19 17v4" />
      </svg>
    ),
  },
  {
    action: 'contrast',
    label: 'ניגודיות גבוהה',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3a9 9 0 0 0 0 18Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    action: 'gray',
    label: 'גווני אפור',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="9" cy="12" r="6" />
        <circle cx="15" cy="12" r="6" opacity=".5" />
      </svg>
    ),
  },
  {
    action: 'links',
    label: 'הדגשת קישורים',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" />
        <path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" />
      </svg>
    ),
  },
  {
    action: 'nomotion',
    label: 'עצירת אנימציות',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M9 9h6v6H9z" fill="currentColor" />
      </svg>
    ),
  },
  {
    action: 'spacing',
    label: 'ריווח מוגדל',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d="M4 7h16M4 12h16M4 17h16" />
        <path d="m19 3-2 2 2 2" />
      </svg>
    ),
  },
  {
    action: 'readable',
    label: 'פונט קריא',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d="M4 5h16v14H4z" />
        <path d="M7 9h10M7 13h7" />
      </svg>
    ),
  },
  {
    action: 'reset',
    label: 'איפוס',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
        <path d="M3 4v4h4" />
      </svg>
    ),
  },
];

export function A11yWidget() {
  const { isPressed, apply } = useA11yPreferences();
  const { open: openLegal } = useLegal();
  const [open, setOpen] = useState(false);

  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    btnRef.current?.focus();
  }, []);

  /* מיקוד לפריט הראשון כשנפתח — כמו במקור */
  useEffect(() => {
    if (open) firstItemRef.current?.focus();
  }, [open]);

  /* Escape סוגר */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  /* לחיצה מחוץ לחלונית ומחוץ לכפתור סוגרת */
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t)) return;
      if (btnRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [open]);

  return (
    <>
      <button
        className="a11y-btn"
        id="a11yBtn"
        ref={btnRef}
        type="button"
        aria-label="פתיחת תפריט נגישות"
        aria-expanded={open}
        aria-controls="a11yPanel"
        onClick={() => setOpen((v) => !v)}
      >
        <A11yIcon />
      </button>

      <div
        className={`a11y-panel${open ? ' is-open' : ''}`}
        id="a11yPanel"
        ref={panelRef}
        role="dialog"
        aria-modal="false"
        aria-labelledby="a11yTitle"
      >
        <h2 id="a11yTitle">התאמות נגישות</h2>

        <div className="a11y-grid">
          {ITEMS.map((item, i) => (
            <button
              key={item.action}
              ref={i === 0 ? firstItemRef : undefined}
              type="button"
              data-a11y={item.action}
              aria-pressed={isPressed(item.action)}
              onClick={() => apply(item.action)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        <div className="a11y-foot">
          <button type="button" onClick={() => openLegal('docA11y')}>
            הצהרת נגישות
          </button>
          <button type="button" onClick={close}>
            סגירה
          </button>
        </div>
      </div>
    </>
  );
}
