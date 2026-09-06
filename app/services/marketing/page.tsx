import type { Metadata } from 'next';
import { SubpageShell } from '@/components/SubpageShell';
import { ServiceFeature } from '@/components/ServiceFeature';
import { getService } from '@/lib/services';

const SERVICE = getService('marketing')!;

export const metadata: Metadata = {
  title: 'שיווק דיגיטלי | ARCODEMIA',
  description: 'קמפיינים ממומנים ותוכן וידאו שמביאים פניות אמיתיות.',
};

export default function Page() {
  return (
    <SubpageShell service={SERVICE} heroArt={false}>
      <ServiceFeature
        slug="marketing"
        eyebrow="שיווק דיגיטלי"
        title="קמפיין שמביא פניות,"
        emphasis="לא רק צפיות."
        lead="אנחנו מנהלים את הקמפיינים ומפיקים את התוכן בעצמנו, מהרעיון ועד הדוח החודשי."
        closing="כל שקל מדווח. אתם רואים כמה עלתה פנייה, מאיזה קמפיין היא הגיעה, ומה שווה להגדיל בחודש הבא."
      />

      <section className="sub__body">
        <div className="wrap">
          <h2 className="rv">קמפיינים ממומנים</h2>
          <p className="rv">
            אנחנו בונים ומנהלים קמפיינים במטא ובגוגל, עם מיקוד לקהל שבאמת
            קונה אצלכם ובאזור שאתם משרתים. המטרה היא פנייה, לא חשיפה.
          </p>

          <h2 className="rv">תוכן וידאו</h2>
          <p className="rv">
            מפיקים סרטונים קצרים שנבנים מראש לפיד ולסטורי: אנכיים, מובנים
            לצפייה בלי קול, ועם המסר בשלוש השניות הראשונות. זה ההבדל בין
            סרטון שנצפה לבין פרסומת שגוללים מעליה.
          </p>

          <h2 className="rv">ניהול הרשתות</h2>
          <p className="rv">
            תכנון תוכן, צילום, כתיבה, עריכה והעלאה. הכל אצלנו בבית, כך
            שהקמפיין והתוכן מדברים באותה שפה.
          </p>

          <ul className="sub__cards rv">
            <li>
              <b>דוח חודשי ברור</b>
              <span>כמה פניות הגיעו, מאיזה קמפיין, וכמה עלתה כל אחת.</span>
            </li>
            <li>
              <b>בלי התחייבות ארוכה</b>
              <span>עובדים חודש בחודשו. אם זה לא עובד, עוצרים.</span>
            </li>
            <li>
              <b>התקציב שלכם, בשליטתכם</b>
              <span>החשבון הפרסומי נשאר על שמכם ואתם רואים כל שקל.</span>
            </li>
          </ul>
        </div>
      </section>
    </SubpageShell>
  );
}
