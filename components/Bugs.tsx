/* ============================================================
   חיפושיות ברקע — חלקו האחרון של הדף
   ------------------------------------------------------------
   אותו עיקרון כמו [[Spiders]]: SVG מוטבע, אפס בקשות רשת, אפס
   משקל נוסף. דקורטיבי לחלוטין — aria-hidden, pointer-events:none,
   z-index מתחת לכל טקסט.

   🔑 החיפושית מצוירת **ממבט על**, ולכן הראש שלה מצביע למעלה
   בתוך ה-viewBox. הזחילה היא אופקית, ולכן יש עטיפה פנימית
   (.bug__b) שמסובבת את הגוף לכיוון ההליכה. בלי הסיבוב הן היו
   נראות כמו חיפושיות שמחליקות הצידה.

   🔑 הרגליים בשתי קבוצות בפאזה הפוכה, בדיוק כמו בעכבישים.
   קבוצה אחת שמסתובבת יחד נראית כרעידה ולא כזחילה.

   ⚠️ prefers-reduced-motion: קופאות פרושות לרוחב, לא נעלמות.
   ============================================================ */

function BugGlyph() {
  return (
    <svg viewBox="0 0 40 52" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {/* מחושים — ארוכים וסוחפים. זה מה שמבדיל חיפושית מכתם. */}
      <path d="M17 11 C13 5 9 2.5 4.5 1" opacity=".75" />
      <path d="M23 11 C27 5 31 2.5 35.5 1" opacity=".75" />

      {/* רגליים ימין — כל אחת עם מפרק, אחרת אלה קווים ולא רגליים */}
      <g className="bug__legs bug__legs--r">
        <path d="M27.5 26 L36 22.5 L38.8 26.5" />
        <path d="M29.5 34 L38.5 34.5 L39.5 40" />
        <path d="M28 42 L35.5 47 L37 51" />
      </g>
      {/* רגליים שמאל */}
      <g className="bug__legs bug__legs--l">
        <path d="M12.5 26 L4 22.5 L1.2 26.5" />
        <path d="M10.5 34 L1.5 34.5 L0.5 40" />
        <path d="M12 42 L4.5 47 L3 51" />
      </g>

      {/* ראש */}
      <ellipse cx="20" cy="12" rx="4.2" ry="3.4" fill="currentColor" stroke="none" opacity=".55" />
      {/* מגן הצוואר */}
      <path d="M13.6 16.4 Q20 14 26.4 16.4 L28 22.5 Q20 20 12 22.5 Z" fill="currentColor" stroke="none" opacity=".4" />
      {/* כנפיים קשות */}
      <path
        d="M20 21 C29 21 32.5 28 32.5 36 C32.5 45.6 26.8 50.5 20 50.5 C13.2 50.5 7.5 45.6 7.5 36 C7.5 28 11 21 20 21 Z"
        fill="currentColor"
        stroke="none"
        opacity=".3"
      />
      <path d="M20 21 C29 21 32.5 28 32.5 36 C32.5 45.6 26.8 50.5 20 50.5 C13.2 50.5 7.5 45.6 7.5 36 C7.5 28 11 21 20 21 Z" />
      {/* התפר שבין שתי הכנפיים */}
      <path d="M20 24 L20 47" opacity=".6" />
    </svg>
  );
}

/** מספר החיפושיות. גודל, גובה, כיוון וקצב לכל אחת ב-CSS. */
const COUNT = 7;

export function Bugs() {
  return (
    <div className="bugs" aria-hidden="true">
      {Array.from({ length: COUNT }, (_, i) => (
        <div className={`bug bug--${i + 1}`} key={i}>
          <div className="bug__b">
            <BugGlyph />
          </div>
        </div>
      ))}
    </div>
  );
}
