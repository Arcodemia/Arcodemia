'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface Pain {
  icon: ReactNode;
  title: string;
  body: string;
}

/* ✕ כ-SVG מוטבע ולא אמוג׳י — כדי שהצבע יישלט מ-var(--danger-red)
   ושהוא ייראה זהה בכל מערכת הפעלה. */
function CrossIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6 18 18M18 6 6 18" />
    </svg>
  );
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
/* 1.15s קשת + מנוחה + 0.55s דעיכה. אחרי זה יורד מה-DOM. */
const COIN_LIFE_MS = 4200;

export function PainPoints() {
  const headRef = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(false);
  const [danger, setDanger] = useState(false);
  const [coin, setCoin] = useState(false);

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
          setCoin(true);
          timers.push(window.setTimeout(() => setCoin(false), COIN_LIFE_MS));
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
              <span className="kin__anchor">
                לקוחות
                {/* החלקיק ננעץ בתוך העוגן, שנמצא בתוך החתך — ולכן הוא
                    נח בתוך הסקשן ולא בתחתית החלון, איפה שיושבים
                    כפתור הוואטסאפ והטולטיפ שלו. */}
                {coin && (
                  <span className="coin" aria-hidden="true">
                    − ₪
                  </span>
                )}
              </span>{' '}
              עכשיו
            </span>
          </h2>
          <p>לא בגלל שהעסק לא טוב. בגלל שאין לאן לשלוח את מי שכבר מתעניין.</p>
        </div>
        <div className="grid grid--4">
          {PAINS.map((p) => (
            <article className="card rv" key={p.title}>
              <span className="card__x" aria-hidden="true">
                <CrossIcon />
              </span>
              <div className="card__icon">{p.icon}</div>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
