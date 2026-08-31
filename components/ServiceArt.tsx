/* ============================================================
   איורי הקטגוריות
   ------------------------------------------------------------
   SVG מוטבע ולא תמונות סטוק, משלוש סיבות:
     1. אפס בקשות רשת ואפס משקל, כמו כל שאר הגרפיקה באתר.
     2. אין שאלת רישוי. תמונת סטוק בפורטפוליו של סוכנות היא
        בדיוק הדבר שנראה גנרי.
     3. אפשר לצבוע אותם מהפלטה, כך שכל חמשת האיורים נראים
        כמו משפחה אחת ולא כמו חמש תמונות שנאספו מהאינטרנט.

   כולם על אותו viewBox של 420x280, כדי שהכרטיסים בקרוסלה
   יהיו זהים בגובה בלי לכפות block-size.

   🔴 חריג פלטה מתועד. חמשת האיורים משתמשים בצבעים שאינם
   הסגול: אדום וירוק בגרף, צהוב בכוכבי גוגל, כחול בכפתור
   גוגל, ירוק וואטסאפ. אלה **תוכן של איור** ולא כרום ממשק —
   הם מתארים דברים שקיימים בעולם ולצופה יש עליהם ציפייה.
   הם מוגדרים כטוקנים תחת --art-* על .svc__art / .sub__art
   בלבד, ולכן אינם יכולים לדלוף לממשק.
   ראו wiki/decisions/palette-single-accent.

   ⚠️ **כל טקסט כאן עובר דרך <T> ומיושר במרכז.** הדף כולו
   dir="rtl", ו-SVG יורש את זה. תחת direction:rtl המשמעות של
   text-anchor מתהפכת: "start" הוא הקצה **הימני** והטקסט נמתח
   שמאלה. זה מה שגרם לשם העסק לדרוס את האווטאר ולכתובת
   להיחתך מחוץ לכרטיס. text-anchor="middle" הוא היחיד שאינו
   תלוי כיוון, ולכן כל מיקום כאן הוא **מרכז** ולא קצה.

   ⚠️ מזהי gradient ו-filter חייבים להיות ייחודיים לכל איור.
   שני SVG באותו דף עם אותו id = השני יורש את ההגדרה של
   הראשון, וזה נראה כמו באג צבע אקראי.
   ============================================================ */

const VB = '0 0 420 280';

/* ⚠️ אובייקטים ולא טאפלים: תחת noUncheckedIndexedAccess פירוק
   של [x, y] מחזיר `number | undefined` וכל שימוש נופל. */
const AVATARS = [
  { cx: 348, cy: 66 },
  { cx: 348, cy: 118 },
  { cx: 348, cy: 170 },
] as const;

const CHIPS = [
  { label: 'אישור תור', cx: 86 },
  { label: 'בקשת ביקורת', cx: 210 },
  { label: 'תזכורת מעקב', cx: 334 },
] as const;

/** טקסט ממורכז. ראו האזהרה למעלה — זו הדרך היחידה שלא נשברת ב-RTL. */
function T({
  x,
  y,
  size,
  weight = 600,
  fill,
  children,
  opacity,
  ltr,
}: {
  x: number;
  y: number;
  size: number;
  weight?: number;
  fill: string;
  children: React.ReactNode;
  opacity?: number;
  ltr?: boolean;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      direction={ltr ? 'ltr' : 'rtl'}
      fill={fill}
      fontSize={size}
      fontWeight={weight}
      opacity={opacity}
    >
      {children}
    </text>
  );
}

/* ---------- אוטומציות ----------
   וואטסאפ, בועת בוט שמקלידה, וחצים אל שלושה לקוחות.
   מתחת: שלוש אוטומציות נוספות, כדי שלא ייראה שזה בוט אחד
   ותו לא. */
export function AutomationArt() {
  return (
    <svg viewBox={VB} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="au-bub" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(177,75,255,.32)" />
          <stop offset="1" stopColor="rgba(177,75,255,.09)" />
        </linearGradient>
        <filter id="au-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* מקור: וואטסאפ */}
      <g filter="url(#au-glow)">
        <rect x="26" y="80" width="72" height="72" rx="20" fill="var(--art-wa)" opacity=".16" />
      </g>
      <rect x="26" y="80" width="72" height="72" rx="20" fill="none" stroke="var(--art-wa)" strokeWidth="1.6" opacity=".7" />
      <path
        d="M47 127c-3-5-3-11 0-16 4-6 12-8 18-4 6 3 8 11 5 17-3 5-9 7-14 6l-8 2 2-5Z"
        fill="var(--art-wa)"
        opacity=".9"
      />

      {/* בועת הבוט, עם שלוש נקודות הקלדה */}
      <g>
        <rect x="134" y="88" width="118" height="58" rx="18" fill="url(#au-bub)" stroke="var(--neon)" strokeWidth="1.5" />
        <path d="M152 146l-2 14 16-14Z" fill="url(#au-bub)" stroke="var(--neon)" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="170" cy="117" r="6" fill="var(--neon-hi)" className="au-dot au-dot--1" />
        <circle cx="193" cy="117" r="6" fill="var(--neon-hi)" className="au-dot au-dot--2" />
        <circle cx="216" cy="117" r="6" fill="var(--neon-hi)" className="au-dot au-dot--3" />
      </g>

      {/* חצים אל הלקוחות */}
      <g stroke="var(--neon)" strokeWidth="1.7" opacity=".6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M260 104c24-8 40-14 58-30" />
        <path d="M262 118h56" />
        <path d="M260 132c24 8 40 14 58 30" />
        <path d="M311 70l9 4-4 8M312 114l8 4-8 4M311 166l9-4-4-8" />
      </g>

      {/* שלושה לקוחות */}
      <g>
        {AVATARS.map(({ cx, cy }, i) => (
          <g key={i} className={`au-av au-av--${i + 1}`} style={{ transformOrigin: `${cx}px ${cy}px` }}>
            <circle cx={cx} cy={cy} r="20" fill="rgba(255,255,255,.07)" stroke="rgba(255,255,255,.3)" strokeWidth="1.3" />
            <circle cx={cx} cy={cy - 5} r="6.5" fill="rgba(255,255,255,.6)" />
            <path d={`M${cx - 10} ${cy + 14}a10 10 0 0 1 20 0Z`} fill="rgba(255,255,255,.45)" />
          </g>
        ))}
      </g>

      {/* אוטומציות נוספות, כדי שלא ייראה שזה בוט אחד ותו לא */}
      <g className="au-chips">
        {CHIPS.map(({ label, cx }, i) => (
          <g key={i} className={`au-chip au-chip--${i + 1}`}>
            <rect x={cx - 58} y="214" width="116" height="34" rx="17" fill="rgba(255,255,255,.045)" stroke="rgba(177,75,255,.34)" strokeWidth="1.2" />
            {/* הווי בקצה השמאלי, כלומר **סוף** השורה בעברית */}
            <path
              d={`M${cx - 48} 231l5 5 9-10`}
              stroke="var(--neon-hi)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <T x={cx + 12} y={236} size={13} weight={600} fill="rgba(255,255,255,.74)">
              {label}
            </T>
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ---------- כרטיס NFC ----------
   ⚠️ עדיין מציין מקום עד שיגיע תצלום מוצר אמיתי, אבל זה כבר
   לא ציור קווי: כרטיס בזווית עם גרדיאנט גוף, נצנוץ ספקולרי,
   אור שוליים וצל רך, כדי שייקרא כמוצר פיזי. */
export function NfcArt() {
  return (
    <svg viewBox={VB} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="nfc-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2E1E45" />
          <stop offset="0.45" stopColor="#160F24" />
          <stop offset="1" stopColor="#0A0710" />
        </linearGradient>
        <linearGradient id="nfc-sheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0)" />
          <stop offset="0.4" stopColor="rgba(255,255,255,.17)" />
          <stop offset="0.54" stopColor="rgba(255,255,255,.03)" />
          <stop offset="1" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <linearGradient id="nfc-rim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="rgba(177,75,255,.9)" />
          <stop offset="0.5" stopColor="rgba(255,255,255,.55)" />
          <stop offset="1" stopColor="rgba(177,75,255,.25)" />
        </linearGradient>
        <filter id="nfc-shadow" x="-40%" y="-40%" width="180%" height="200%">
          <feGaussianBlur stdDeviation="13" />
        </filter>
        <filter id="nfc-wave" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* צל מתחת לכרטיס */}
      <ellipse cx="196" cy="240" rx="126" ry="15" fill="#000" opacity=".55" filter="url(#nfc-shadow)" />

      {/* כרטיס אחורי, לעומק */}
      <g transform="rotate(-9 200 140)" opacity=".4">
        <rect x="78" y="58" width="248" height="150" rx="16" fill="url(#nfc-body)" stroke="rgba(255,255,255,.10)" />
      </g>

      {/* הכרטיס הקדמי */}
      <g transform="rotate(-4 200 140)">
        <rect x="66" y="72" width="260" height="156" rx="17" fill="url(#nfc-body)" />
        {/* אור שוליים עליון */}
        <path d="M83 72h226a17 17 0 0 1 17 17v3H66v-3a17 17 0 0 1 17-17Z" fill="url(#nfc-rim)" opacity=".55" />
        <rect x="66" y="72" width="260" height="156" rx="17" fill="none" stroke="rgba(255,255,255,.17)" strokeWidth="1.2" />
        {/* נצנוץ ספקולרי */}
        <rect x="66" y="72" width="260" height="156" rx="17" fill="url(#nfc-sheen)" />

        {/* שבב */}
        <rect x="92" y="106" width="42" height="32" rx="6" fill="rgba(255,255,255,.15)" stroke="rgba(255,255,255,.32)" strokeWidth="1" />
        <path d="M92 116h42M92 128h42M106 106v32M120 106v32" stroke="rgba(255,255,255,.24)" strokeWidth=".9" />

        {/* גלי NFC */}
        <g filter="url(#nfc-wave)" stroke="var(--neon-hi)" strokeWidth="2.4" strokeLinecap="round" fill="none">
          <path d="M246 124a26 26 0 0 1 0 36" opacity=".95" />
          <path d="M260 112a44 44 0 0 1 0 60" opacity=".6" />
          <path d="M274 100a62 62 0 0 1 0 84" opacity=".3" />
        </g>

        {/* המותג, בלי להמציא לוגו. ltr כי המחרוזת לטינית. */}
        <T x={152} y={180} size={15} weight={800} fill="rgba(255,255,255,.66)" ltr>
          ARCODEMIA
        </T>
        <T x={152} y={202} size={11} weight={600} fill="rgba(255,255,255,.36)" ltr>
          TAP FOR REVIEW
        </T>
      </g>

      {/* כוכב הביקורת, מרחף מעל הכרטיס */}
      <g className="nfc-star">
        <circle cx="332" cy="68" r="27" fill="rgba(10,7,16,.92)" stroke="rgba(255,255,255,.18)" />
        <path
          d="M332 53l4.7 9.6 10.6 1.5-7.7 7.5 1.8 10.5-9.4-4.9-9.4 4.9 1.8-10.5-7.7-7.5 10.6-1.5Z"
          fill="var(--art-gold)"
        />
      </g>
    </svg>
  );
}

/* ---------- דפי נחיתה ----------
   מוקאפ גנרי בלי לוגו ובלי שם לקוח, עם החלקים שבאמת
   מופיעים בדף נחיתה: hero, אודות, ביקורות, צור קשר,
   וכפתור וואטסאפ צף. */
export function WebsiteArt() {
  return (
    <svg viewBox={VB} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="wb-scr" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,.06)" />
          <stop offset="1" stopColor="rgba(255,255,255,.015)" />
        </linearGradient>
        <linearGradient id="wb-hero" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgba(177,75,255,.36)" />
          <stop offset="1" stopColor="rgba(177,75,255,.08)" />
        </linearGradient>
      </defs>

      {/* חלון דפדפן */}
      <rect x="34" y="28" width="266" height="224" rx="12" fill="url(#wb-scr)" stroke="rgba(255,255,255,.17)" />
      <path d="M34 52h266" stroke="rgba(255,255,255,.14)" />
      <circle cx="49" cy="40" r="3.2" fill="rgba(255,255,255,.28)" />
      <circle cx="60" cy="40" r="3.2" fill="rgba(255,255,255,.2)" />
      <circle cx="71" cy="40" r="3.2" fill="rgba(255,255,255,.14)" />

      {/* hero */}
      <rect x="50" y="66" width="234" height="56" rx="8" fill="url(#wb-hero)" />
      <rect x="180" y="80" width="94" height="9" rx="4.5" fill="rgba(255,255,255,.72)" />
      <rect x="212" y="95" width="62" height="7" rx="3.5" fill="rgba(255,255,255,.4)" />
      <rect x="60" y="84" width="46" height="18" rx="9" fill="var(--neon)" opacity=".85" />

      {/* אודות */}
      <SectionBlock x={50} y={132} w={110} label="אודות" />

      {/* ביקורות, עם כוכבים */}
      <g>
        <rect x="174" y="132" width="110" height="46" rx="8" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.12)" />
        <T x={229} y={150} size={11} weight={700} fill="rgba(255,255,255,.66)">
          ביקורות
        </T>
        <g>
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M${199 + i * 15} 159l2.2 4.4 4.9.7-3.5 3.4.8 4.8-4.4-2.3-4.3 2.3.8-4.8-3.5-3.4 4.9-.7Z`}
              fill="var(--art-gold)"
              opacity={i === 4 ? '.45' : '1'}
            />
          ))}
        </g>
      </g>

      {/* צור קשר */}
      <g>
        <rect x="50" y="190" width="234" height="46" rx="8" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.12)" />
        <T x={252} y={208} size={11} weight={700} fill="rgba(255,255,255,.66)">
          צרו קשר
        </T>
        <rect x="140" y="200" width="94" height="10" rx="5" fill="rgba(255,255,255,.16)" />
        <rect x="140" y="216" width="60" height="10" rx="5" fill="rgba(255,255,255,.16)" />
        <rect x="62" y="214" width="52" height="14" rx="7" fill="var(--neon)" opacity=".75" />
      </g>

      {/* כפתור וואטסאפ צף, כמו באתר אמיתי */}
      <g className="wb-fab">
        <circle cx="66" cy="232" r="16" fill="var(--art-wa)" />
        <path
          d="M60 236c-2-3-2-6 0-9 2-3 6-4 9-2 3 2 4 6 2 9-2 3-4 3-7 3l-5 1 1-2Z"
          fill="#08120C"
          opacity=".85"
        />
      </g>

      {/* נייד לצד המחשב */}
      <g>
        <rect x="322" y="76" width="62" height="126" rx="12" fill="url(#wb-scr)" stroke="rgba(255,255,255,.18)" />
        <rect x="343" y="82" width="20" height="4" rx="2" fill="rgba(255,255,255,.2)" />
        <rect x="332" y="98" width="42" height="28" rx="6" fill="url(#wb-hero)" />
        <rect x="346" y="134" width="28" height="6" rx="3" fill="rgba(255,255,255,.32)" />
        <rect x="332" y="146" width="42" height="6" rx="3" fill="rgba(255,255,255,.16)" />
        <rect x="332" y="160" width="42" height="6" rx="3" fill="rgba(255,255,255,.16)" />
        <rect x="332" y="178" width="42" height="14" rx="7" fill="var(--neon)" opacity=".7" />
      </g>
    </svg>
  );
}

function SectionBlock({ x, y, w, label }: { x: number; y: number; w: number; label: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height="46" rx="8" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.12)" />
      <T x={x + w - 26} y={y + 18} size={11} weight={700} fill="rgba(255,255,255,.66)">
        {label}
      </T>
      <rect x={x + 14} y={y + 28} width={w - 28} height="6" rx="3" fill="rgba(255,255,255,.14)" />
    </g>
  );
}

/* ---------- שיווק ממומן ----------
   הגרף שהתבקש: קו אדום שיורד אל "לפני", מתהפך לירוק ומטפס
   בחדות אל "אחרי" בלבן זוהר, עם חץ סגול גדול על העלייה. */
export function MarketingArt() {
  return (
    <svg viewBox={VB} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="mk-up" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="var(--art-green)" />
          <stop offset="1" stopColor="#8CFFC0" />
        </linearGradient>
        <linearGradient id="mk-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(52,232,140,.32)" />
          <stop offset="1" stopColor="rgba(52,232,140,0)" />
        </linearGradient>
        <filter id="mk-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="mk-txt" x="-90%" y="-90%" width="280%" height="280%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* רשת עדינה */}
      <g stroke="rgba(255,255,255,.07)" strokeWidth="1">
        <path d="M44 62h336M44 108h336M44 154h336M44 200h336" />
      </g>
      <path d="M44 46v190h340" stroke="rgba(255,255,255,.18)" strokeWidth="1.4" strokeLinecap="round" />

      {/* שטח מתחת לעלייה */}
      <path d="M192 200L252 154l50 20 60-96v158H192Z" fill="url(#mk-fill)" opacity=".5" />

      {/* הירידה, אדומה */}
      <path
        d="M62 92c22 16 44 36 62 54 24 24 44 42 68 54"
        stroke="var(--art-red)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        className="mk-down"
      />

      {/* העלייה, ירוקה */}
      <path
        d="M192 200c22-8 40-26 60-46 18 12 32 20 50 20 22 0 38-36 60-96"
        stroke="url(#mk-up)"
        strokeWidth="4.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#mk-glow)"
        className="mk-up"
      />

      {/* נקודת השפל */}
      <circle cx="192" cy="200" r="7" fill="var(--art-red)" />
      <circle cx="192" cy="200" r="13" fill="none" stroke="var(--art-red)" strokeWidth="1.4" opacity=".45" />
      <T x={192} y={230} size={16} weight={800} fill="var(--art-red)">
        לפני
      </T>

      {/* חץ סגול גדול על העלייה */}
      <g className="mk-arrow" stroke="var(--neon)" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M238 216L330 100" strokeWidth="9" opacity=".9" />
        <path d="M300 100h34v34" strokeWidth="9" opacity=".9" />
      </g>

      {/* הפסגה */}
      <circle cx="362" cy="78" r="7.5" fill="#fff" />
      <circle cx="362" cy="78" r="15" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="1.5" />
      <g filter="url(#mk-txt)">
        <T x={360} y={52} size={19} weight={900} fill="#fff">
          אחרי
        </T>
      </g>
    </svg>
  );
}

/* ---------- פרופיל עסקי בגוגל ----------
   כרטיס בהיר על הרקע הכהה, כי כרטיס גוגל אמיתי לבן — וזה
   מה שהופך אותו למוכר מיד. אווטאר חסר פנים בדיוק כמו
   מציין המקום של גוגל: עיגול אפור בהיר על רקע אפור כהה.

   ⚠️ הפריסה כאן ימין-לשמאל: התווית מימין, הערך משמאל. כל
   מיקום הוא **מרכז** של הטקסט. ראו האזהרה בראש הקובץ. */
export function GoogleBusinessArt() {
  return (
    <svg viewBox={VB} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="gb-card" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#F1F1F4" />
        </linearGradient>
        <filter id="gb-shadow" x="-30%" y="-30%" width="160%" height="170%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>

      {/* צל */}
      <rect x="48" y="30" width="332" height="244" rx="18" fill="#000" opacity=".6" filter="url(#gb-shadow)" />

      {/* הכרטיס */}
      <rect x="44" y="18" width="332" height="244" rx="16" fill="url(#gb-card)" />

      {/* אווטאר חסר פנים, מציין המקום של גוגל */}
      <g>
        <circle cx="326" cy="62" r="26" fill="#BDC1C6" />
        <circle cx="326" cy="53" r="9.5" fill="#E8EAED" />
        <path d="M310 80a16 16 0 0 1 32 0Z" fill="#E8EAED" />
      </g>

      {/* שם העסק, מציין מקום */}
      <T x={240} y={58} size={22} weight={800} fill="#202124">
        שם העסק
      </T>
      <T x={245} y={82} size={13} weight={600} fill="#5F6368">
        קטגוריית העסק
      </T>

      {/* דירוג */}
      <g>
        <T x={274} y={120} size={17} weight={800} fill="#202124" ltr>
          4.9
        </T>
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M${250 - i * 17} 106l3.2 6.5 7.2 1-5.2 5.1 1.2 7.2-6.4-3.4-6.4 3.4 1.2-7.2-5.2-5.1 7.2-1Z`}
            fill="var(--art-gold)"
            opacity={i === 4 ? '.5' : '1'}
          />
        ))}
        <T x={150} y={120} size={13} weight={600} fill="#5F6368" ltr>
          (127)
        </T>
      </g>

      <path d="M64 140h292" stroke="#DADCE0" strokeWidth="1.2" />

      {/* כתובת */}
      <g>
        <path d="M340 158c-5 0-9 4-9 9 0 7 9 15 9 15s9-8 9-15c0-5-4-9-9-9Z" fill="#EA4335" />
        <circle cx="340" cy="167" r="3.2" fill="#fff" />
        <T x={248} y={172} size={13} weight={600} fill="#3C4043">
          רחוב הדוגמה 12, תל אביב
        </T>
      </g>

      {/* שעות */}
      <g>
        <circle cx="340" cy="198" r="9" fill="none" stroke="#5F6368" strokeWidth="1.6" />
        <path d="M340 193v5l3.5 2.5" stroke="#5F6368" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        <T x={288} y={203} size={13} weight={700} fill="#188038">
          פתוח עכשיו
        </T>
        <T x={205} y={203} size={13} weight={600} fill="#5F6368">
          סוגר ב-18:00
        </T>
      </g>

      {/* כפתורי הפעולה של גוגל */}
      <g>
        <rect x="286" y="218" width="70" height="30" rx="15" fill="#1A73E8" />
        <T x={321} y={238} size={12} weight={700} fill="#fff">
          ניווט
        </T>
        <rect x="196" y="218" width="80" height="30" rx="15" fill="none" stroke="#DADCE0" strokeWidth="1.4" />
        <T x={236} y={238} size={12} weight={700} fill="#1A73E8">
          התקשרו
        </T>
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
