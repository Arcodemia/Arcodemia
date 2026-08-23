'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';

/* ============================================================
   נגישות — מצב ההעדפות
   ------------------------------------------------------------
   כל התאמה היא מחלקה על <html> (או data-fs להגדלת טקסט),
   ונשמרת ב-localStorage כדי שהבחירה תשרוד רענון.
   זה אחסון פונקציונלי בלבד — לא מעקב, ומוזכר במדיניות הפרטיות.

   🔧 תיקון באג שהיה בגרסה הסטטית:
   ה-IIFE כולו הופיע פעמיים בקוד, כלומר שני מאזיני click על
   אותו כפתור. הראשון פתח את החלונית והשני סגר אותה מיד באותה
   לחיצה — והיא לא נפתחה לעולם. כאן יש hook יחיד ומקור אמת אחד.

   למה useSyncExternalStore ולא useState+useEffect:
   localStorage הוא external store. קריאה ממנו ב-useEffect
   ואז setState גורמת לרינדור מדורג, ו-React מסמן את זה כשגיאה
   (react-hooks/set-state-in-effect). ה-hook הזה בנוי בדיוק
   למקרה הזה, כולל snapshot נפרד לשרת — ולכן הוא גם SSR-safe
   בלי אי-התאמת hydration.
   ============================================================ */

const KEY = 'arcodemia:a11y';

export const A11Y_TOGGLES = [
  'contrast',
  'gray',
  'links',
  'nomotion',
  'spacing',
  'readable',
] as const;

export type A11yToggle = (typeof A11Y_TOGGLES)[number];

/** מזהי הכפתורים בחלונית: הטוגלים + הגדלת טקסט + איפוס */
export type A11yAction = A11yToggle | 'font' | 'reset';

export interface A11yState {
  /** מדרגת הגדלת הטקסט: 0 = כבוי, 1–3 = מוגדל */
  fs: 0 | 1 | 2 | 3;
  contrast: boolean;
  gray: boolean;
  links: boolean;
  nomotion: boolean;
  spacing: boolean;
  readable: boolean;
}

const INITIAL: Readonly<A11yState> = Object.freeze({
  fs: 0,
  contrast: false,
  gray: false,
  links: false,
  nomotion: false,
  spacing: false,
  readable: false,
});

function parse(raw: string | null): A11yState {
  if (!raw) return { ...INITIAL };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return { ...INITIAL };

    const o = parsed as Record<string, unknown>;
    const fsRaw = typeof o.fs === 'number' ? o.fs : 0;
    const fs = ([0, 1, 2, 3] as const).find((n) => n === fsRaw) ?? 0;

    const next: A11yState = { ...INITIAL, fs };
    for (const k of A11Y_TOGGLES) next[k] = o[k] === true;
    return next;
  } catch {
    return { ...INITIAL };
  }
}

/* ---- חנות זעירה מעל localStorage ----
   ⚠️ getSnapshot חייב להחזיר הפניה יציבה, אחרת React נכנס
   ללולאת רינדור אינסופית. לכן ה-snapshot מוחזק במטמון ומחושב
   מחדש רק כשהמחרוזת הגולמית באמת השתנתה. */
let cachedRaw: string | null = null;
let cachedState: A11yState = { ...INITIAL };
let primed = false;

const listeners = new Set<() => void>();

function getSnapshot(): A11yState {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    /* מצב פרטי — נשארים עם ברירת המחדל */
  }
  if (!primed || raw !== cachedRaw) {
    cachedRaw = raw;
    cachedState = parse(raw);
    primed = true;
  }
  return cachedState;
}

function getServerSnapshot(): A11yState {
  return INITIAL as A11yState;
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  /* storage משתגר כשלשונית אחרת משנה את ההעדפה */
  window.addEventListener('storage', cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener('storage', cb);
  };
}

function write(next: A11yState): void {
  cachedState = next;
  cachedRaw = JSON.stringify(next);
  try {
    localStorage.setItem(KEY, cachedRaw);
  } catch {
    /* מצב פרטי או אחסון מלא — ההעדפה פשוט לא תישמר */
  }
  primed = true;
  for (const l of listeners) l();
}

export interface UseA11yPreferences {
  state: A11yState;
  /** האם הכפתור אמור להיראות לחוץ */
  isPressed: (action: A11yAction) => boolean;
  apply: (action: A11yAction) => void;
}

export function useA11yPreferences(): UseA11yPreferences {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  /* מחיל את המצב על <html>. סנכרון למערכת חיצונית (ה-DOM),
     בלי setState — בדיוק מה ש-useEffect נועד לו. */
  useEffect(() => {
    const root = document.documentElement;
    for (const k of A11Y_TOGGLES) root.classList.toggle(`a11y-${k}`, state[k]);
    if (state.fs) root.dataset.fs = String(state.fs);
    else delete root.dataset.fs;
  }, [state]);

  const apply = useCallback((action: A11yAction) => {
    const prev = getSnapshot();
    if (action === 'reset') {
      write({ ...INITIAL });
      return;
    }
    if (action === 'font') {
      write({ ...prev, fs: ((prev.fs + 1) % 4) as 0 | 1 | 2 | 3 });
      return;
    }
    write({ ...prev, [action]: !prev[action] });
  }, []);

  const isPressed = useCallback(
    (action: A11yAction): boolean => {
      if (action === 'reset') return false;
      if (action === 'font') return state.fs > 0;
      return state[action];
    },
    [state],
  );

  return { state, isPressed, apply };
}
