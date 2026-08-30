/* ============================================================
   איורי הקטגוריות
   ------------------------------------------------------------
   SVG מוטבע ולא תמונות סטוק, משלוש סיבות:
     1. אפס בקשות רשת ואפס משקל, כמו כל שאר הגרפיקה באתר.
     2. אין שאלת רישוי. תמונת סטוק בפורטפוליו של סוכנות היא
        בדיוק הדבר שנראה גנרי.
     3. אפשר לצבוע אותם מהפלטה, כך שכל חמשת הכרטיסים נראים
        כמו משפחה אחת ולא כמו חמש תמונות שנאספו מהאינטרנט.

   כולם ציור קווי על שקוף, ב-currentColor, ומקבלים את הצבע
   מהכרטיס שמכיל אותם.

   ⚠️ NfcArt הוא **מציין מקום מסומן.** הלקוח ביקש תצלום מוצר
   אמיתי של הכרטיס הפיזי. עד שיהיה, זה איור גנרי בלי שום מיתוג
   מומצא. ראו wiki/gotchas אם מחליפים.
   ============================================================ */

const S = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/** בוט וואטסאפ: בועות שיחה שמחוברות לצומת אוטומציה */
export function AutomationArt() {
  return (
    <svg viewBox="0 0 200 140" {...S} aria-hidden="true">
      {/* בועה נכנסת */}
      <path d="M18 30h58a8 8 0 0 1 8 8v22a8 8 0 0 1-8 8H36l-12 10V68h-6a8 8 0 0 1-8-8V38a8 8 0 0 1 8-8Z" />
      <path d="M30 44h34M30 54h22" opacity=".55" />
      {/* צומת האוטומציה */}
      <circle cx="118" cy="70" r="17" />
      <path d="M118 62v8l6 4" />
      <path d="M118 45v-8M118 95v8M141 70h8M87 70h8" opacity=".5" />
      {/* בועה יוצאת, אוטומטית */}
      <path d="M150 76h32a8 8 0 0 1 8 8v18a8 8 0 0 1-8 8h-24l-10 8v-8a8 8 0 0 1-6-8V84a8 8 0 0 1 8-8Z" />
      <path d="M158 88h18" opacity=".55" />
      {/* וי קטן: המשימה בוצעה */}
      <path d="M160 98l4 4 8-8" strokeWidth="2" />
    </svg>
  );
}

/** ⚠️ מציין מקום. להחליף בתצלום מוצר אמיתי של הכרטיס. */
export function NfcArt() {
  return (
    <svg viewBox="0 0 200 140" {...S} aria-hidden="true">
      {/* כרטיס */}
      <rect x="24" y="34" width="112" height="72" rx="10" />
      <path d="M24 54h112" opacity=".4" />
      <rect x="36" y="66" width="26" height="20" rx="4" opacity=".6" />
      <path d="M36 96h44" opacity=".45" />
      {/* גלי NFC */}
      <path d="M148 54a30 30 0 0 1 0 32" />
      <path d="M158 46a44 44 0 0 1 0 48" opacity=".7" />
      <path d="M168 38a58 58 0 0 1 0 64" opacity=".4" />
      {/* כוכב הביקורת */}
      <path d="M104 74l4.6 9.3 10.3 1.5-7.4 7.3 1.7 10.2-9.2-4.8-9.2 4.8 1.7-10.2-7.4-7.3 10.3-1.5Z" strokeWidth="1.4" />
    </svg>
  );
}

/** מוקאפ אתר בלי טקסט ובלי לוגו, כפי שהתבקש */
export function WebsiteArt() {
  return (
    <svg viewBox="0 0 200 140" {...S} aria-hidden="true">
      {/* חלון דפדפן */}
      <rect x="14" y="20" width="126" height="100" rx="8" />
      <path d="M14 36h126" opacity=".5" />
      <circle cx="26" cy="28" r="2.4" opacity=".6" />
      <circle cx="35" cy="28" r="2.4" opacity=".6" />
      <circle cx="44" cy="28" r="2.4" opacity=".6" />
      {/* גוש hero, בלי אות אחת */}
      <rect x="26" y="48" width="60" height="8" rx="4" opacity=".75" />
      <rect x="26" y="62" width="42" height="6" rx="3" opacity=".45" />
      <rect x="26" y="78" width="34" height="12" rx="6" />
      {/* שלושה כרטיסים */}
      <rect x="98" y="48" width="30" height="26" rx="5" opacity=".45" />
      <rect x="98" y="80" width="30" height="26" rx="5" opacity=".3" />
      {/* נייד לצד המחשב */}
      <rect x="152" y="44" width="34" height="62" rx="7" />
      <rect x="158" y="56" width="22" height="5" rx="2.5" opacity=".7" />
      <rect x="158" y="66" width="14" height="4" rx="2" opacity=".45" />
      <rect x="158" y="82" width="22" height="9" rx="4.5" opacity=".8" />
    </svg>
  );
}

/** שיווק: מסך וידאו וגרף עולה */
export function MarketingArt() {
  return (
    <svg viewBox="0 0 200 140" {...S} aria-hidden="true">
      {/* מסך הווידאו */}
      <rect x="16" y="30" width="94" height="66" rx="8" />
      <path d="M54 50l24 13-24 13Z" strokeWidth="1.5" />
      <path d="M40 108h46" opacity=".5" />
      <path d="M63 96v12" opacity=".5" />
      {/* גרף שעולה */}
      <path d="M126 100V56M148 100V40M170 100V66M126 100h58" opacity=".85" />
      <path d="M120 78l18-14 16 10 18-22" strokeWidth="2" />
      <circle cx="172" cy="52" r="3.2" />
      {/* חיווי הגעה */}
      <path d="M186 46l-4-6-6 2" opacity=".6" />
    </svg>
  );
}

/** פרופיל גוגל: סיכת מפה, כוכבים וכרטיס עסק */
export function GoogleBusinessArt() {
  return (
    <svg viewBox="0 0 200 140" {...S} aria-hidden="true">
      {/* סיכת מפה */}
      <path d="M62 26c-15 0-27 12-27 27 0 20 27 45 27 45s27-25 27-45c0-15-12-27-27-27Z" />
      <circle cx="62" cy="53" r="10" />
      {/* כרטיס העסק */}
      <rect x="104" y="38" width="82" height="58" rx="8" />
      <rect x="114" y="48" width="24" height="18" rx="4" opacity=".55" />
      <path d="M146 52h30M146 60h20" opacity=".5" />
      {/* כוכבים */}
      <g strokeWidth="1.3">
        <path d="M116 78l2.4 4.8 5.3.8-3.8 3.7.9 5.3-4.8-2.5-4.8 2.5.9-5.3-3.8-3.7 5.3-.8Z" />
        <path d="M136 78l2.4 4.8 5.3.8-3.8 3.7.9 5.3-4.8-2.5-4.8 2.5.9-5.3-3.8-3.7 5.3-.8Z" />
        <path d="M156 78l2.4 4.8 5.3.8-3.8 3.7.9 5.3-4.8-2.5-4.8 2.5.9-5.3-3.8-3.7 5.3-.8Z" opacity=".5" />
      </g>
    </svg>
  );
}

/** מיפוי slug לאיור. אחד לכל שירות ב-lib/services.ts */
export const SERVICE_ART: Record<string, () => React.JSX.Element> = {
  automation: AutomationArt,
  nfc: NfcArt,
  'landing-pages': WebsiteArt,
  marketing: MarketingArt,
  'google-business': GoogleBusinessArt,
};
