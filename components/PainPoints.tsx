import type { ReactNode } from 'react';

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

export function PainPoints() {
  return (
    <section id="why" className="pain">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">למה בכלל צריך דף נחיתה</span>
          <h2>אם אחד מהמשפטים האלה מוכר לך — אתה מפסיד לקוחות עכשיו</h2>
          <p>לא בגלל שהעסק לא טוב. בגלל שאין לאן לשלוח את מי שכבר מתעניין.</p>
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
    </section>
  );
}
