/* ============================================================
   צלליות עכביש ברקע
   ------------------------------------------------------------
   SVG מוטבע ולא תמונות — כדי לא להוסיף בקשה או משקל לדף.
   דקורטיבי לחלוטין: aria-hidden, pointer-events:none, z-index
   מתחת לכל טקסט וכרטיס.

   כל עכביש הוא אלמנט נפרד עם animation-delay משלו, כך שהם לא
   צועדים בשורה. הרגליים הן קבוצה נפרדת עם אנימציה משלה.

   ⚠️ prefers-reduced-motion: קופאים בתנוחה סטטית, לא נעלמים —
   ההנחיה היא לספק חלופה סטטית ולא לבטל את האלמנט.
   ============================================================ */

function SpiderGlyph() {
  return (
    <svg viewBox="0 0 48 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      {/* הרגליים — קבוצה נפרדת כדי שינועו בלי הגוף */}
      <g className="spider__legs">
        <path d="M20 16 L10 8 M20 17 L8 15 M20 19 L9 24 M20 21 L13 29" />
        <path d="M28 16 L38 8 M28 17 L40 15 M28 19 L39 24 M28 21 L35 29" />
      </g>
      {/* גוף */}
      <ellipse cx="24" cy="18" rx="6.5" ry="5" fill="currentColor" stroke="none" opacity=".55" />
      <circle cx="24" cy="12" r="3.2" fill="currentColor" stroke="none" opacity=".55" />
    </svg>
  );
}

export function Spiders() {
  return (
    <div className="spiders" aria-hidden="true">
      {[1, 2, 3, 4].map((n) => (
        <div className={`spider spider--${n}`} key={n}>
          <SpiderGlyph />
        </div>
      ))}
    </div>
  );
}
