/* ============================================================
   צלליות עכביש ברקע
   ------------------------------------------------------------
   SVG מוטבע ולא תמונות — כדי לא להוסיף בקשה או משקל לדף.
   דקורטיבי לחלוטין: aria-hidden, pointer-events:none, z-index
   מתחת לכל טקסט וכרטיס.

   🔑 הרגליים: שתי קבוצות נפרדות, שמאל וימין, שנעות ב**פאזה
   הפוכה**. זה מה שקורא כהליכה. בגרסה הקודמת כל הרגליים היו
   קבוצה אחת שהסתובבה יחד — מה שנראה כמו רעידה, לא כמו צעידה.
   ה-transform-origin יושב על הגוף, כך שהרגל מסתובבת סביב חיבורה
   ולא סביב מרכז ה-SVG.

   ⚠️ prefers-reduced-motion: קופאים בתנוחה סטטית, לא נעלמים.
   ============================================================ */

function SpiderGlyph() {
  return (
    <svg viewBox="0 0 64 40" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      {/* רגליים ימין — כל אחת עם ברך, אחרת זה נראה כמו קווים */}
      <g className="spider__legs spider__legs--r">
        <path d="M38 20 L48 12 L54 5" />
        <path d="M38 21 L50 19 L58 16" />
        <path d="M38 23 L50 26 L57 32" />
        <path d="M37 25 L46 31 L50 38" />
      </g>
      {/* רגליים שמאל */}
      <g className="spider__legs spider__legs--l">
        <path d="M26 20 L16 12 L10 5" />
        <path d="M26 21 L14 19 L6 16" />
        <path d="M26 23 L14 26 L7 32" />
        <path d="M27 25 L18 31 L14 38" />
      </g>
      {/* גוף */}
      <ellipse cx="32" cy="23" rx="7" ry="5.5" fill="currentColor" stroke="none" opacity=".6" />
      <circle cx="32" cy="15.5" r="3.6" fill="currentColor" stroke="none" opacity=".6" />
    </svg>
  );
}

/** מספר העכבישים. כל אחד מקבל גודל, גובה, קצב והשהיה משלו ב-CSS. */
const COUNT = 9;

export function Spiders() {
  return (
    <div className="spiders" aria-hidden="true">
      {Array.from({ length: COUNT }, (_, i) => (
        <div className={`spider spider--${i + 1}`} key={i}>
          <SpiderGlyph />
        </div>
      ))}
    </div>
  );
}
