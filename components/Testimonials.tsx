/* ============================================================
   ביקורות לקוחות
   ------------------------------------------------------------
   ⚠️ הביקורת של בן היא **מילה במילה** כפי שנמסרה, כולל הניסוח
   שלו. אין לערוך אותה, גם לא לתקן פיסוק.

   ⚠️ שאר הביקורות הן דוגמאות עם שמות בדויים, לבקשת הלקוח, עד
   שיצטברו ביקורות אמיתיות. מסומנות ב-`sample: true` וגם בהערה
   גלויה בתחתית החתך, כדי שלא ייראו כעדות אמיתית.
   ============================================================ */

interface Review {
  readonly name: string;
  readonly text: string;
  readonly stars: 4 | 5;
  /** דוגמה ולא ביקורת אמיתית */
  readonly sample?: true;
}

const REVIEWS: readonly Review[] = [
  {
    name: 'בן',
    stars: 5,
    text: 'צוות ארקודמיה מקצועיים ביותר, בנו לי דף נחיתה לסוכנות טיולים שלי ועכשיו יותר לקוחות מגיעים אליי, הדיוק והעזרה שקיבלתי לא מובנת מאליו בכלל מעריך מאוד.',
  },
  { name: 'נועה ל.', stars: 5, text: 'הבוט קובע תורים במקומי. חסך לי שעה ביום.', sample: true },
  { name: 'איתי מ.', stars: 5, text: 'כרטיס אחד על הדלפק, והביקורות בגוגל התחילו לזרום.', sample: true },
  { name: 'שירה כ.', stars: 5, text: 'זמינים, סבלניים, ומסבירים כל שלב בלי מילים גדולות.', sample: true },
  { name: 'רון א.', stars: 4, text: 'הקמפיין החזיר את עצמו כבר בחודש הראשון.', sample: true },
  { name: 'דנה פ.', stars: 5, text: 'הפרופיל בגוגל סוף סוף נראה כמו עסק אמיתי.', sample: true },
];

function Stars({ n }: { n: number }) {
  return (
    <span className="rev__stars" role="img" aria-label={`${n} מתוך 5 כוכבים`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={i <= n ? 'is-on' : undefined}
          aria-hidden="true"
        >
          <path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4-5.8-3-5.8 3 1.1-6.4L2.6 9.4l6.5-.9Z" />
        </svg>
      ))}
    </span>
  );
}

export function Testimonials() {
  return (
    <section id="reviews" className="rev">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">לקוחות מספרים</span>
          <h2>
            מה אומרים עלינו
            <br />
            <em>אחרי שהעבודה נגמרה.</em>
          </h2>
        </div>

        <ul className="rev__grid">
          {REVIEWS.map((r) => (
            <li className="rev__card rv" key={r.name + r.text.slice(0, 12)}>
              <Stars n={r.stars} />
              <blockquote>{r.text}</blockquote>
              <cite>
                <span className="rev__avatar" aria-hidden="true">
                  {r.name.charAt(0)}
                </span>
                <bdi>{r.name}</bdi>
              </cite>
            </li>
          ))}
        </ul>

        <p className="rev__note">
          חלק מהביקורות המוצגות כאן הן דוגמאות, עד שיצטברו מספיק ביקורות
          אמיתיות מלקוחות. הביקורת של בן היא אמיתית ומופיעה כלשונה.
        </p>
      </div>
    </section>
  );
}
