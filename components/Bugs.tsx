'use client';

import { useEffect, useRef } from 'react';

/* ============================================================
   חיפושיות ברקע
   ------------------------------------------------------------
   יושבות בתוך .techbg, אבל **לא** מתחילות בראש שלו: הן מתחילות
   בדיוק בשורת ארבעת הכרטיסים הראשונים. מעליהן, באזור הכותרת
   "אם אחד מהמשפטים האלה מוכר לך", אין חיפושיות בכלל.

   🔑 למה JS ולא אחוזים קשיחים: המרחק מראש .techbg ועד לכרטיסים
   הוא גובה גוש הכותרת, והוא משתנה עם רוחב החלון — הכותרת
   נשברת לשתי שורות או לשלוש, הפסקה מתקפלת, וה-padding של
   החתך משתנה בין ברייקפוינטים. כל אחוז קבוע היה נכון ברוחב
   אחד ושגוי בכל השאר. ResizeObserver נותן את המספר המדויק
   ומעדכן אותו כשהפריסה זזה.

   ⚠️ אין כאן setState. הערך נכתב ישירות כ-custom property על
   האלמנט, ולכן אין רינדור נוסף ואין הפרה של הכלל נגד setState
   בתוך effect.

   ⚠️ ערך הנפילה ב-CSS (34%) הוא מה שרואים אם ה-JS לא רץ. הוא
   מקורב בכוונה — עדיף חיפושיות שמתחילות בערך נכון מאשר
   חיפושיות שממלאות את כל הרצועה.

   SVG מוטבע ולא תמונות — אפס בקשות רשת, אפס משקל נוסף.
   דקורטיבי לחלוטין: aria-hidden, pointer-events:none, z-index
   מתחת לכל טקסט וכרטיס.

   🔑 החיפושית מצוירת **פונה ימינה**, וזה גם כיוון ההליכה
   כברירת מחדל. מי שהולכת שמאלה מקבלת scaleX(-1) על הגוף
   ו-animation-direction:reverse על התנועה — שניהם יחד, אחרת
   היא צועדת אחורנית.

   🔑 הרגליים בשתי קבוצות בפאזה הפוכה. קבוצה אחת שמסתובבת יחד
   נראית כרעידה ולא כזחילה.

   ⚠️ prefers-reduced-motion: קופאות פרושות לרוחב, לא נעלמות.
   ============================================================ */

function BugGlyph() {
  return (
    <svg viewBox="0 0 68 52" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {/* רגליים עליונות */}
      <g className="bug__legs bug__legs--r">
        <path d="M15 14 L10 7 L5 3" />
        <path d="M26 12.5 L24 5 L20 2" />
        <path d="M38 15 L39 7 L36 3" />
      </g>
      {/* רגליים תחתונות */}
      <g className="bug__legs bug__legs--l">
        <path d="M15 38 L10 45 L5 49" />
        <path d="M26 39.5 L24 47 L20 50" />
        <path d="M38 37 L39 45 L36 49" />
      </g>

      {/* גוף */}
      <ellipse cx="25" cy="26" rx="19" ry="13.5" fill="currentColor" stroke="none" opacity=".32" />
      <ellipse cx="25" cy="26" rx="19" ry="13.5" />
      {/* הקו שחוצה את הגוף */}
      <path d="M8 26 L42 26" strokeWidth="1.9" />
      {/* הספירלה — הסימן שעל הגב */}
      <path
        d="M24 26 L24 23.5 L26.5 23.5 L26.5 28.5 L21.5 28.5 L21.5 21 L29 21 L29 31 L19 31 L19 18.5 L31.5 18.5 L31.5 33.5"
        strokeWidth="1.9"
      />

      {/* מגן הצוואר */}
      <path d="M44 20 Q49 19 51 22 L51 30 Q49 33 44 32 Z" fill="currentColor" stroke="none" opacity=".32" />
      <path d="M44 20 Q49 19 51 22 L51 30 Q49 33 44 32 Z" />
      {/* ראש */}
      <circle cx="57" cy="26" r="5.5" fill="currentColor" stroke="none" opacity=".32" />
      <circle cx="57" cy="26" r="5.5" />
      {/* מחושים */}
      <path d="M60 22.5 C63 19 65 16 66.5 13" />
      <path d="M60 29.5 C63 33 65 36 66.5 39" />
    </svg>
  );
}

/** כמה חיפושיות. גודל, גובה וקצב לכל אחת ב-CSS. */
const COUNT = 9;

/** אלה שהולכות שמאלה. עדר שכולו לכיוון אחד מסגיר לולאה אחת שהועתקה. */
const LEFTWARD = new Set([2, 4, 7]);

/** ממה מתחילה הרצועה. הכרטיסים הם הסימן שהמשבצות התחילו. */
const ANCHOR = '.pain .grid';

export function Bugs() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const band = el.parentElement;
    const anchor = band?.querySelector(ANCHOR);
    if (!band || !anchor) return;

    const measure = () => {
      const top = anchor.getBoundingClientRect().top - band.getBoundingClientRect().top;
      el.style.setProperty('--bugs-top', `${Math.max(0, Math.round(top))}px`);
    };

    measure();
    /* גם הרצועה וגם העוגן: הראשונה משתנה כשהחלון משתנה, השני
       כשהכותרת שמעליו נשברת לשורה נוספת. */
    const ro = new ResizeObserver(measure);
    ro.observe(band);
    ro.observe(anchor);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="bugs" aria-hidden="true" ref={ref}>
      {Array.from({ length: COUNT }, (_, i) => {
        const n = i + 1;
        return (
          <div className={`bug bug--${n}${LEFTWARD.has(n) ? ' is-rtl' : ''}`} key={i}>
            <div className="bug__b">
              <BugGlyph />
            </div>
          </div>
        );
      })}
    </div>
  );
}
