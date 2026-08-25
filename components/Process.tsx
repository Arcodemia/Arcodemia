import type { ReactNode } from 'react';

/* ============================================================
   כל אמוג׳י הוא יחידה שלמה — אין פירוק פנימי של גליף.
   האנימציות עצמן ב-globals.css, ומופעלות מ-:hover בדסקטופ
   ומ-.is-tapped בנייד (useTapSpotlight).
   דקורטיבי בלבד: aria-hidden. המשמעות נמצאת בטקסט של השלב.
   ============================================================ */

interface Step {
  title: string;
  body: string;
  fx: ReactNode;
}

const STEPS: Step[] = [
  {
    title: 'שיחה קצרה',
    body: 'מספרים לנו על העסק, מי הלקוחות ומה הייתם רוצים שיקרה כשמישהו נוחת על הדף.',
    fx: <span className="fx-ring">📞</span>,
  },
  {
    title: 'רואים את העיצוב',
    body: 'אנחנו מעצבים, ואתם רואים בדיוק איך הדף ייראה — לפני שמשלמים. אין התחייבות בשלב הזה.',
    fx: <span className="fx-eyes">👀</span>,
  },
  {
    title: 'תיקונים ואישור',
    /* שלושה אלמנטים נפרדים: הפטיש מכה, האבן מגיבה, ואז שניהם
       נמוגים והווי נכנס במקומם. */
    body: 'משנים צבעים, טקסטים, תמונות — עד שזה מרגיש כמו העסק שלכם.',
    fx: (
      <>
        <span className="fx-hammer">🔨</span>
        <span className="fx-rock">🪨</span>
        <span className="fx-check">✔️</span>
      </>
    ),
  },
  {
    title: 'עולה לאוויר',
    body: 'מחברים דומיין, מחברים את הוואטסאפ, ומוודאים שהכל עובד בנייד.',
    fx: <span className="fx-plane">✈️</span>,
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
