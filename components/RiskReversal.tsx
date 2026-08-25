import { waURL } from '@/lib/whatsapp';
import { CheckIcon } from './icons';

const RISK_CTA_MSG =
  'שלום, ראיתי באתר שאפשר לראות עיצוב ראשוני בלי התחייבות ואשמח לשמוע עוד.';

const POINTS = [
  {
    lead: 'קודם כל אתם רואים את העיצוב.',
    body: 'אנחנו מעצבים לכם את הדף ומראים לכם בדיוק איך הוא ייראה. עוד לפני שדיברנו על כסף.',
  },
  {
    lead: 'לא אהבתם? נפרדים כידידים.',
    body: 'אם העיצוב לא מדבר אליכם — אומרים תודה, לוחצים ידיים וממשיכים הלאה. בלי דמי ביטול, בלי אותיות קטנות, ובלי שתשלמו שקל.',
  },
  {
    lead: 'הדומיין והחשבונות על שמכם.',
    body: 'הדף הוא שלכם, לא שלנו. גם אם יום אחד תרצו להמשיך עם מישהו אחר.',
  },
] as const;

export function RiskReversal() {
  return (
    <section id="risk">
      <div className="wrap">
        <div className="risk rv">
          <span className="eyebrow">בלי סיכון</span>
          <h2 className="risk__h2">
            <strong>קודם רואים.</strong> רק אחר כך משלמים.
          </h2>
          <p className="lead">
            אנחנו צוות צעיר ונחוש שמבין את עולם הדיגיטל, ומקדם כל עסק כאילו הוא שלנו.
            אנחנו יודעים שזה אומר שצריך להוכיח את עצמנו — אז הורדנו לכם את הסיכון לאפס.
          </p>
          <ul className="risk__list">
            {POINTS.map((p) => (
              <li key={p.lead}>
                <CheckIcon />
                <div>
                  <b>{p.lead}</b>
                  <span>{p.body}</span>
                </div>
              </li>
            ))}
          </ul>
          <a
            className="btn btn--primary"
            href={waURL(RISK_CTA_MSG)}
            target="_blank"
            rel="noopener noreferrer"
          >
            רוצה לראות עיצוב בלי התחייבות
          </a>
        </div>
      </div>
    </section>
  );
}
