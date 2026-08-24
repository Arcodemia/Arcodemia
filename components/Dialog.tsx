'use client';

import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';

interface DialogProps {
  id: string;
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** נוסף על `.doc` — למשל פאנל הניווט, בלי לשנות את המסמכים המשפטיים. */
  className?: string;
}

/* ============================================================
   עטיפה ל-<dialog> נייטיבי
   ------------------------------------------------------------
   נייטיבי ולא מימוש עצמי: מקבלים לכידת מיקוד, ה-top layer,
   ו-Escape מהדפדפן בחינם.

   ⚠️ סגירה בלחיצה על הרקע נבדקת לפי **מיקום הלחיצה** ולא לפי
   היעד שלה. ה-backdrop הוא חלק מאלמנט ה-dialog עצמו ולא צומת
   נפרד, ולכן e.target הוא ה-dialog גם כשלוחצים מחוץ לתיבה
   ובדיקה רגילה של target הייתה סוגרת תמיד.
   ============================================================ */
export function Dialog({ id, title, open, onClose, children, className }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    else if (!open && dlg.open) dlg.close();
  }, [open]);

  /* Escape סוגר את ה-dialog ברמת הדפדפן ומשגר close —
     צריך לסנכרן חזרה ל-state של React אחרת הוא ייתקע על true. */
  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    const sync = () => onClose();
    dlg.addEventListener('close', sync);
    return () => dlg.removeEventListener('close', sync);
  }, [onClose]);

  const onBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
    const dlg = ref.current;
    if (!dlg || e.target !== dlg) return;
    const r = dlg.getBoundingClientRect();
    const inside =
      e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inside) onClose();
  };

  return (
    <dialog
      className={className ? `doc ${className}` : 'doc'}
      id={id}
      ref={ref}
      aria-labelledby={`${id}T`}
      onClick={onBackdropClick}
    >
      <div className="doc__bar">
        <h2 id={`${id}T`}>{title}</h2>
        <button type="button" className="doc__x" onClick={onClose} aria-label="סגירה">
          ✕
        </button>
      </div>
      <div className="doc__body">{children}</div>
    </dialog>
  );
}
