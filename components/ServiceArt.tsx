/* ============================================================
   איורי הקטגוריות
   ------------------------------------------------------------
   SVG מוטבע ולא תמונות סטוק, משלוש סיבות:
     1. אפס בקשות רשת ואפס משקל, כמו כל שאר הגרפיקה באתר.
     2. אין שאלת רישוי. תמונת סטוק בפורטפוליו של סוכנות היא
        בדיוק הדבר שנראה גנרי.
     3. אפשר לצבוע אותם מהפלטה, כך שהם נראים כמו משפחה אחת
        ולא כמו תמונות שנאספו מהאינטרנט.

   כולם על אותו viewBox של 420x280, כדי שהכרטיסים בקרוסלה
   יהיו זהים בגובה בלי לכפות block-size.

   🔴 חריג פלטה מתועד. האיורים משתמשים בצבעים שאינם הסגול:
   צהוב בכוכבי גוגל, כחול בכפתור גוגל, ירוק וואטסאפ.
   אלה **תוכן של איור** ולא כרום ממשק —
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
/** מיפוי slug לאיור.
 *
 *  ⚠️ שלושה שירותים (אוטומציות, NFC, שיווק) עברו לתצלום אמיתי
 *  ב-lib/serviceImages, ולכן האיורים שלהם הוסרו: ServiceVisual
 *  מעדיף תמונה, ומה שנשאר כאן היה קוד שאין לו דרך לרוץ.
 *  להחזרה — ראו את ההיסטוריה של הקובץ הזה. */
export const SERVICE_ART: Record<string, () => React.JSX.Element> = {
  'landing-pages': WebsiteArt,
  'google-business': GoogleBusinessArt,
};
