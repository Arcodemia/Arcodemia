import type { Metadata } from 'next';
import { SubpageShell } from '@/components/SubpageShell';
import { getService } from '@/lib/services';
import { GbpShowcase } from '@/components/GbpShowcase';

const SERVICE = getService('google-business')!;

export const metadata: Metadata = {
  title: 'הקמת פרופיל עסקי בגוגל | ARCODEMIA',
  description: 'שהעסק יופיע בחיפוש ובמפות עם כל הפרטים, התמונות והביקורות.',
};

export default function Page() {
  return (
    <SubpageShell service={SERVICE} heroArt={false}>
      <GbpShowcase />

      <section className="sub__body">
        <div className="wrap">
          <h2 className="rv">למה זה הדבר הראשון שצריך לסדר</h2>
          <p className="rv">
            כשמחפשים עסק מקומי, התוצאה הראשונה היא לרוב כרטיס גוגל ולא אתר.
            שם מופיעים השעות, הטלפון, הניווט והביקורות. אם הכרטיס חסר או לא
            מעודכן, הלקוח עובר לעסק הבא.
          </p>

          <ul className="sub__cards rv">
            <li>
              <b>הקמה ואימות</b>
              <span>פותחים את הפרופיל, מאמתים את הבעלות ומסדרים את הקטגוריות.</span>
            </li>
            <li>
              <b>פרטים מלאים</b>
              <span>שעות פעילות, אזורי שירות, טלפון, אתר וקישור לוואטסאפ.</span>
            </li>
            <li>
              <b>תמונות שנראות טוב</b>
              <span>העלאה מסודרת של תמונות העסק, כי כרטיס בלי תמונות נראה נטוש.</span>
            </li>
            <li>
              <b>מוכן לביקורות</b>
              <span>
                מחברים את הכרטיס לקישור ביקורת ישיר, שאפשר להטמיע גם בכרטיס NFC.
              </span>
            </li>
          </ul>

          <p className="rv">
            הפרופיל נשאר בבעלותכם המלאה. אנחנו מקימים ומסדרים, והגישה נשארת
            אצלכם.
          </p>
        </div>
      </section>
    </SubpageShell>
  );
}
