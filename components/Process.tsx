import type { ReactNode } from 'react';

/* ============================================================
   אייקוני השלבים
   ------------------------------------------------------------
   SVG מוטבע ולא אמוג׳י, משתי סיבות:
     1. חסרי צבע לגמרי — currentColor, בדיוק כמו אייקוני
        כרטיסי הכאב. אמוג׳י תמיד מגיע צבוע ואי אפשר לשלוט בו.
     2. ⚠️ אמוג׳י נראה שונה בכל מערכת: אפל, אנדרואיד, ווינדוס
        וסמסונג מציירים אותו אחרת. אין דרך לכפות סגנון אחד —
        גופן האמוג׳י של אפל הוא קנייני ואסור להטמיע אותו.
        SVG פותר את זה מהשורש: נראה זהה בכל מכשיר.

   דקורטיבי בלבד: aria-hidden. המשמעות נמצאת בטקסט של השלב.
   האנימציות ב-globals.css — :hover בדסקטופ, .is-tapped בנייד.
   ============================================================ */

const SVG = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function PhoneIcon() {
  return (
    <svg viewBox="0 0 32 32" {...SVG}>
      <path d="M11 4.5 8 3 5 6c0 9.4 7.6 17 17 17l3-3-1.5-3-4 1-4.5-4.5 1-4z" />
      {/* גלי צלצול */}
      <path d="M20 6.5a7 7 0 0 1 5.5 5.5M19.5 2a11.5 11.5 0 0 1 10.5 10.5" />
    </svg>
  );
}

/* שתי עיניים מלאות וזהות. הגרסה הקודמת ציירה עין אחת ועוד שתי
   קשתות תלושות בקצה הימני — הן נקראו כשבר, לא כעין שנייה.
   האישונים מוסטים מעט שמאלה: זה כיוון המבט בפריסת RTL. */
function EyesIcon() {
  return (
    <svg viewBox="0 0 32 32" {...SVG}>
      <path d="M1 16 Q8 9.2 15 16 Q8 22.8 1 16 Z" />
      <circle cx="7.2" cy="16" r="2.4" fill="currentColor" stroke="none" />
      <path d="M17 16 Q24 9.2 31 16 Q24 22.8 17 16 Z" />
      <circle cx="23.2" cy="16" r="2.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ⚠️ הראש חייב להצביע אל האבן, והאבן יושבת משמאל לפטיש.
   קודם הראש הצביע ימינה — כלומר הפטיש הכה לכיוון ההפוך.
   השיקוף כאן הולך יד ביד עם היפוך הסימנים ב-@keyframes fx-hammer
   ועם transform-origin שעבר לקצה הידית. אל תשנה אחד בלי השניים.
   scale(-1 1) ולא כתיבה מחדש של הנתיבים: שיקוף ידני של עקומות
   בזיה זו הזמנה לטעות שקשה לראות. */
function HammerIcon() {
  return (
    <svg viewBox="0 0 32 32" {...SVG}>
      <g transform="translate(32 0) scale(-1 1)">
        <path d="M17 6.5 24 13" />
        <path d="M20.5 3 29 11.5l-3.5 3.5L17 6.5z" />
        <path d="m15.5 8-11 11a2.5 2.5 0 0 0 3.5 3.5l11-11" />
      </g>
    </svg>
  );
}

function RockIcon() {
  return (
    <svg viewBox="0 0 32 32" {...SVG}>
      <path d="M4 24 8 13l8-4 10 5 2 10z" />
      <path d="m8 13 8 5 10-4M16 18v6" opacity=".5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 32 32" {...SVG} strokeWidth={2.4}>
      <path d="M5 17.5 12 24 27 8" />
    </svg>
  );
}

/* מטוס נייר — לא מטוס נוסעים. הקיפול האמצעי הוא מה שקורא אותו
   כנייר מקופל ולא כמשולש.
   ⚠️ משוקף. fx-plane מזיז אותו שמאלה, אבל החוד הצביע ימינה
   למעלה — כלומר הוא טס אחורה. עכשיו החוד והתנועה מסכימים,
   ושמאלה הוא גם כיוון ההמשך הנכון בפריסת RTL. */
function PaperPlaneIcon() {
  return (
    <svg viewBox="0 0 32 32" {...SVG}>
      <g transform="translate(32 0) scale(-1 1)">
        <path d="M29 3 2 13.5l9.5 4.2z" />
        <path d="m29 3-17.5 14.7L14 29l4.6-7.2z" />
        <path d="m11.5 17.7 7.1 4.1" opacity=".55" />
      </g>
    </svg>
  );
}

interface Step {
  title: string;
  body: string;
  fx: ReactNode;
}

const STEPS: Step[] = [
  {
    title: 'שיחה קצרה',
    body: 'מספרים לנו על העסק, מי הלקוחות ומה הייתם רוצים שיקרה כשמישהו נוחת על הדף.',
    fx: (
      <span className="fx-ring">
        <PhoneIcon />
      </span>
    ),
  },
  {
    title: 'רואים את העיצוב',
    body: 'אנחנו מעצבים, ואתם רואים בדיוק איך הדף ייראה — לפני שמשלמים. אין התחייבות בשלב הזה.',
    fx: (
      <span className="fx-eyes">
        <EyesIcon />
      </span>
    ),
  },
  {
    title: 'תיקונים ואישור',
    /* שלושה אלמנטים נפרדים: הפטיש מכה, האבן מגיבה, ואז שניהם
       נמוגים והווי נכנס במקומם. */
    body: 'משנים צבעים, טקסטים, תמונות — עד שזה מרגיש כמו העסק שלכם.',
    fx: (
      <>
        <span className="fx-hammer">
          <HammerIcon />
        </span>
        <span className="fx-rock">
          <RockIcon />
        </span>
        <span className="fx-check">
          <CheckIcon />
        </span>
      </>
    ),
  },
  {
    title: 'עולה לאוויר',
    body: 'מחברים דומיין, מחברים את הוואטסאפ, ומוודאים שהכל עובד בנייד.',
    fx: (
      <span className="fx-plane">
        <PaperPlaneIcon />
      </span>
    ),
  },
];

export function Process() {
  return (
    <section id="process">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">התהליך</span>
          <h2>ארבעה שלבים, בלי הפתעות</h2>
          <p>אתם לא צריכים להבין שום דבר טכני. זה התפקיד שלנו.</p>
        </div>
        {/* המספור מגיע מ-CSS counters ולכן הסדר בקוד הוא המספר */}
        <div className="steps">
          {STEPS.map((s) => (
            <div className="stepc rv" key={s.title}>
              <div className="stepc__fx" aria-hidden="true">
                {s.fx}
              </div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
