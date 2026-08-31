/* ============================================================
   ההשוואה של פרופיל גוגל — לפני ואחרי
   ------------------------------------------------------------
   עמוד השירות הזה היה טקסט ורשימה, ונקרא חלש לעומת שאר האתר.
   ההשוואה הזו מסבירה את הערך **בלי משפט אחד של שכנוע**:
   שני כרטיסים זה לצד זה, אחד חסר ואחד מלא. הצופה מסיק לבד.

   ⚠️ כל טקסט כאן ממורכז (text-anchor="middle"). הדף dir="rtl"
   וה-SVG יורש את זה; תחת direction:rtl המשמעות של start/end
   מתהפכת. ראו האזהרה בראש ServiceArt.tsx.
   ============================================================ */

const VB = '0 0 340 250';

function T({
  x,
  y,
  size,
  weight = 600,
  fill,
  children,
  ltr,
}: {
  x: number;
  y: number;
  size: number;
  weight?: number;
  fill: string;
  children: React.ReactNode;
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
    >
      {children}
    </text>
  );
}

/** הכרטיס החסר: מה שגולש רואה כשאף אחד לא סידר את הפרופיל. */
function ProfileBefore() {
  return (
    <svg viewBox={VB} fill="none" aria-hidden="true">
      <rect x="14" y="14" width="312" height="222" rx="14" fill="#F4F4F6" />

      {/* אווטאר ריק */}
      <circle cx="276" cy="56" r="24" fill="#DADCE0" />
      <circle cx="276" cy="48" r="8.5" fill="#EFEFF1" />
      <path d="M262 72a14 14 0 0 1 28 0Z" fill="#EFEFF1" />

      <T x={200} y={52} size={19} weight={800} fill="#5F6368">
        שם העסק
      </T>
      <T x={196} y={74} size={12} weight={600} fill="#BDC1C6">
        לא נבחרה קטגוריה
      </T>

      {/* כוכבים ריקים */}
      <g>
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M${232 - i * 16} 96l3 6.1 6.8.9-4.9 4.8 1.2 6.8-6.1-3.2-6 3.2 1.1-6.8-4.9-4.8 6.8-.9Z`}
            fill="#DADCE0"
          />
        ))}
        <T x={130} y={110} size={12} weight={600} fill="#9AA0A6">
          אין ביקורות
        </T>
      </g>

      <path d="M34 130h272" stroke="#E4E5E8" strokeWidth="1.2" />

      {/* שורות חסרות */}
      {[
        { y: 158, label: 'לא הוזנה כתובת' },
        { y: 190, label: 'לא צוינו שעות' },
      ].map(({ y, label }, i) => (
        <g key={i}>
          <circle cx="290" cy={y - 5} r="9" fill="none" stroke="#DADCE0" strokeWidth="1.5" />
          <path d={`M286 ${y - 9}l8 8M294 ${y - 9}l-8 8`} stroke="#DADCE0" strokeWidth="1.5" strokeLinecap="round" />
          <T x={228} y={y} size={12.5} weight={600} fill="#9AA0A6">
            {label}
          </T>
        </g>
      ))}

      {/* בלי כפתורי פעולה */}
      <rect x="34" y="196" width="150" height="26" rx="13" fill="none" stroke="#E4E5E8" strokeWidth="1.4" strokeDasharray="5 4" />
      <T x={109} y={214} size={11.5} weight={600} fill="#BDC1C6">
        אין פעולות
      </T>
    </svg>
  );
}

/** הכרטיס המלא. אותה שפה כמו האיור בקרוסלה. */
function ProfileAfter() {
  return (
    <svg viewBox={VB} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="gba-card" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#F1F1F4" />
        </linearGradient>
      </defs>
      <rect x="14" y="14" width="312" height="222" rx="14" fill="url(#gba-card)" />

      <g>
        <circle cx="276" cy="56" r="24" fill="#BDC1C6" />
        <circle cx="276" cy="48" r="8.5" fill="#E8EAED" />
        <path d="M262 72a14 14 0 0 1 28 0Z" fill="#E8EAED" />
      </g>

      <T x={200} y={52} size={19} weight={800} fill="#202124">
        שם העסק
      </T>
      <T x={202} y={74} size={12} weight={600} fill="#5F6368">
        קטגוריית העסק
      </T>

      <g>
        <T x={230} y={110} size={15} weight={800} fill="#202124" ltr>
          4.9
        </T>
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M${208 - i * 16} 96l3 6.1 6.8.9-4.9 4.8 1.2 6.8-6.1-3.2-6 3.2 1.1-6.8-4.9-4.8 6.8-.9Z`}
            fill="var(--art-gold)"
            opacity={i === 4 ? '.5' : '1'}
          />
        ))}
        <T x={116} y={110} size={12} weight={600} fill="#5F6368" ltr>
          (127)
        </T>
      </g>

      <path d="M34 130h272" stroke="#DADCE0" strokeWidth="1.2" />

      <g>
        <path d="M290 148c-4.5 0-8 3.5-8 8 0 6 8 13 8 13s8-7 8-13c0-4.5-3.5-8-8-8Z" fill="#EA4335" />
        <circle cx="290" cy="156" r="2.8" fill="#fff" />
        <T x={216} y={162} size={12.5} weight={600} fill="#3C4043">
          רחוב הדוגמה 12, תל אביב
        </T>
      </g>

      <g>
        <circle cx="290" cy="186" r="8" fill="none" stroke="#5F6368" strokeWidth="1.5" />
        <path d="M290 182v4.5l3 2" stroke="#5F6368" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <T x={246} y={190} size={12.5} weight={700} fill="#188038">
          פתוח עכשיו
        </T>
      </g>

      <g>
        <rect x="240" y="202" width="64" height="26" rx="13" fill="#1A73E8" />
        <T x={272} y={219} size={11.5} weight={700} fill="#fff">
          ניווט
        </T>
        <rect x="160" y="202" width="70" height="26" rx="13" fill="none" stroke="#DADCE0" strokeWidth="1.4" />
        <T x={195} y={219} size={11.5} weight={700} fill="#1A73E8">
          התקשרו
        </T>
        <rect x="86" y="202" width="64" height="26" rx="13" fill="none" stroke="#DADCE0" strokeWidth="1.4" />
        <T x={118} y={219} size={11.5} weight={700} fill="#1A73E8">
          ביקורת
        </T>
      </g>
    </svg>
  );
}

export function GbpShowcase() {
  return (
    <section className="gbp">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">אותו עסק, שני כרטיסים</span>
          <h2>
            זה מה שהלקוח רואה
            <br />
            <em>עוד לפני שהוא נכנס לאתר.</em>
          </h2>
        </div>

        <div className="gbp__pair">
          <figure className="gbp__side gbp__side--before rv">
            <span className="gbp__tag gbp__tag--before">לפני</span>
            <div className="gbp__art">
              <ProfileBefore />
            </div>
            <figcaption>
              כרטיס חסר נראה כמו עסק שנסגר. אין דירוג, אין שעות, ואין למה
              ללחוץ.
            </figcaption>
          </figure>

          <figure className="gbp__side gbp__side--after rv">
            <span className="gbp__tag gbp__tag--after">אחרי</span>
            <div className="gbp__art">
              <ProfileAfter />
            </div>
            <figcaption>
              כרטיס מסודר עונה על הכל במבט אחד, ונותן ללקוח שלוש דרכים
              לפנות אליכם מיד.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
