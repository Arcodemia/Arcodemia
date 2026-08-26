'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface Pain {
  icon: ReactNode;
  title: string;
  body: string;
}

const PAINS: Pain[] = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.6-3.6" />
      </svg>
    ),
    title: 'מחפשים אותך בגוגל ולא מוצאים',
    body: 'הלקוח מקליד את שם העסק, מקבל דף עסק חצי-ריק ועובר למתחרה שכן מופיע.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17" cy="7" r="1.2" fill="currentColor" />
      </svg>
    ),
    title: 'יש אינסטגרם — אבל אין לאן לשלוח',
    body: 'הפרופיל עובד קשה, והלינק בביו מוביל לכלום. כל הגולשים האלה מתאדים.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
        <rect x="6" y="2" width="12" height="20" rx="3" />
        <path d="M11 18.5h2" />
        <path d="m9 8 6 6M15 8l-6 6" />
      </svg>
    ),
    title: 'האתר הישן שבור בנייד',
    body: 'במחשב זה נראה סביר. בטלפון — טקסט זעיר וכפתורים שלא נלחצים. שם רוב הלקוחות.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
        <path d="M3 12h5l2-6 4 12 2-6h5" />
      </svg>
    ),
    title: 'מתעניינים — ואז נעלמים',
    body: 'אין קריאה ברורה לפעולה, אז אף אחד לא מרים טלפון. עניין בלי פעולה שווה אפס.',
  },
];

const DANGER_DELAY_MS = 400;
/* הארוך מבין החלקיקים: 1.15s השהיה + 2.7s נפילה + מנוחה + 0.6s דעיכה */
const COIN_LIFE_MS = 6800;

/* ============================================================
   מפל השקלים
   ------------------------------------------------------------
   תשעה חלקיקים. כל שורה היא חלקיק:
     ox    — הסטת נקודת הזינוק לרוחב המילה "לקוחות", בפיקסלים.
             בלי זה כולם יוצאים מנקודה אחת ונראים כחלקיק עבה.
     dx    — לאן הוא נסחף עד הנחיתה.
     spin  — כמה מעלות הוא מסתחרר בדרך. שלילי = לכיוון הנגדי.
     sc    — גודל יחסי.
     d     — השהיה. זה מה שהופך מטח אחד למפל.

   הערכים ידניים ולא אקראיים: אקראי בכל רינדור שובר hydration,
   ואקראי פעם אחת עדיין נותן צבירים מכוערים.

   ⚠️ ה-CSS מצפה לשני אלמנטים: .coin נושא את התנועה ו-.coin__g
   את הסיבוב. אל תשטח אותם לאחד — זה בדיוק מה שגרם לנפילה
   להיראות זולה. ראו את ההערה ב-globals.css.
   ============================================================ */
const COINS = [
  { ox:   0, dx: -30, spin:  430, sc: 1.15, d: 0 },
  { ox: -22, dx:  44, spin: -365, sc: 0.9,  d: 0.13 },
  { ox:  19, dx: -64, spin:  520, sc: 1.0,  d: 0.29 },
  { ox: -40, dx:  20, spin: -455, sc: 0.8,  d: 0.44 },
  { ox:  36, dx: -16, spin:  340, sc: 1.05, d: 0.58 },
  { ox: -12, dx:  58, spin: -600, sc: 0.72, d: 0.71 },
  { ox:  46, dx: -42, spin:  395, sc: 0.95, d: 0.85 },
  { ox: -52, dx: -22, spin: -480, sc: 0.85, d: 0.99 },
  { ox:   9, dx:  32, spin:  555, sc: 1.1,  d: 1.15 },
];

export function PainPoints() {
  const headRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [lit, setLit] = useState(false);
  const [danger, setDanger] = useState(false);
  /* מערך ריק = אין חלקיקים. אחרת: סגנון מוטבע לכל אחד מהם. */
  const [coins, setCoins] = useState<CSSProperties[]>([]);

  /* ============================================================
     רצף קינטי — פעם אחת בלבד לכל צפייה בדף.
     ⚠️ unobserve מיד עם ההצתה. בלי זה הרצף היה חוזר בכל פעם
     שהחתך נכנס ויוצא מהמסך, וזה קורה הרבה בגלילה רגילה.
     ============================================================ */
  useEffect(() => {
    const el = headRef.current;
    if (!el) return;

    const reduce =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.classList.contains('a11y-nomotion');

    const timers: number[] = [];

    const fire = () => {
      setLit(true);
      timers.push(
        window.setTimeout(() => {
          setDanger(true);
          /* בתנועה מופחתת מבצעים אך ורק את מעבר הצבע —
             בלי חלקיק ובלי קשת. */
          if (reduce) return;

          /* המיקום נמדד ברגע הזינוק, מהמילה "לקוחות" עצמה.
             ה-CSS לא יכול לדעת אותו — הוא תלוי בגלילה, בגודל
             החלון ובגלישת השורות של הכותרת. */
          const a = anchorRef.current;
          if (!a) return;
          const r = a.getBoundingClientRect();
          const midX = r.left + r.width / 2;
          const startY = r.top + r.height / 2;
          /* מרחק הנפילה מחושב ב-CSS מתוך --y, ולא כאן.
             ראו את ההערה ב-globals.css: חישוב ב-JS נעל ערך שהתיישן
             תוך כדי גלילה חלקה, והחלקיק נחת מתחת לקצה המסך. */
          setCoins(
            COINS.map((c) => ({
              ['--x' as string]: `${Math.round(midX + c.ox)}px`,
              ['--y' as string]: `${Math.round(startY)}px`,
              ['--dx' as string]: `${c.dx}px`,
              ['--spin' as string]: `${c.spin}deg`,
              ['--sc' as string]: String(c.sc),
              ['--d' as string]: `${c.d}s`,
            })),
          );
          timers.push(window.setTimeout(() => setCoins([]), COIN_LIFE_MS));
        }, DANGER_DELAY_MS),
      );
    };

    if (!('IntersectionObserver' in window)) {
      fire();
      return () => timers.forEach(window.clearTimeout);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) {
            io.unobserve(en.target);
            io.disconnect();
            fire();
          }
        }
      },
      /* ⚠️ הסף חייב להיות מחמיר.
         עם threshold 0.4 בלבד הרצף הוצת כבר בטעינת הדף — הכותרת
         נמצאת 734px מתחת לקיפול, אבל במסך גבוה זה מספיק כדי
         לעבור 40%. התוצאה: המשתמש אף פעם לא ראה את האנימציה,
         כי עד שהגיע לחתך היא כבר הסתיימה והחלקיק ירד מה-DOM.
         rootMargin שלילי מקטין את אזור הבדיקה לחלק העליון של
         החלון, כך שההצתה קורית רק כשבאמת גללו לכאן. */
      { threshold: 0.6, rootMargin: '0px 0px -22% 0px' },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      timers.forEach(window.clearTimeout);
    };
  }, []);

  const kinClass = ['kin', lit ? 'is-lit' : '', danger ? 'is-danger' : ''].filter(Boolean).join(' ');

  return (
    <section id="why" className="pain">
      <div className="wrap">
        <div className="sec-head rv" ref={headRef}>
          <span className="eyebrow">למה בכלל צריך דף נחיתה</span>
          <h2 className={kinClass}>
            אם אחד מהמשפטים האלה מוכר לך —{' '}
            <span className="kin__danger">
              אתה מפסיד{' '}
              <span className="kin__anchor" ref={anchorRef}>
                לקוחות
              </span>{' '}
              עכשיו
            </span>
          </h2>
          <p>לא בגלל שהעסק לא טוב. בגלל שאין לאן לשלוח את מי שכבר מתעניין.</p>
          {/* ⚠️ החלקיק מרונדר ב-portal אל <body>, לא כאן.
              #why נושא content-visibility:auto, שגורר contain:paint,
              ואב עם contain:paint הופך לבלוק המכיל של צאצאים
              position:fixed. התוצאה: החלקיק מוקם ביחס לחתך במקום
              ביחס לחלון, ונחת מחוץ למסך. הפורטל מוציא אותו מההכלה. */}
        </div>
        <div className="grid grid--4">
          {PAINS.map((p) => (
            <article className="card rv" key={p.title}>
              <div className="card__icon">{p.icon}</div>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </article>
          ))}
        </div>
      </div>

      {/* coins נקבע אך ורק בתוך effect, ולכן כשהוא לא ריק אנחנו
          בוודאות בלקוח ו-document קיים. אין צורך בדגל mounted. */}
      {coins.length > 0 &&
        createPortal(
          <>
            {coins.map((style, i) => (
              <span className="coin" style={style} aria-hidden="true" key={i}>
                {/* השכבה הפנימית נושאת את הסיבוב, החיצונית את
                    הנפילה. הפרדה זו היא מה שנותן סחרור בקצב
                    קבוע מעל נפילה שמאיצה. */}
                <span className="coin__g">− ₪</span>
              </span>
            ))}
          </>,
          document.body,
        )}
    </section>
  );
}
