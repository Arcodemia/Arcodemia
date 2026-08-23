const STEPS = [
  {
    title: 'שיחה קצרה',
    body: 'מספרים לנו על העסק, מי הלקוחות ומה הייתם רוצים שיקרה כשמישהו נוחת על הדף.',
  },
  {
    title: 'רואים את העיצוב',
    body: 'אנחנו מעצבים, ואתם רואים בדיוק איך הדף ייראה — לפני שמשלמים. אין התחייבות בשלב הזה.',
  },
  {
    title: 'תיקונים ואישור',
    body: 'משנים צבעים, טקסטים, תמונות — עד שזה מרגיש כמו העסק שלכם.',
  },
  {
    title: 'עולה לאוויר',
    body: 'מחברים דומיין, מחברים את הוואטסאפ, ומוודאים שהכל עובד בנייד.',
  },
] as const;

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
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
