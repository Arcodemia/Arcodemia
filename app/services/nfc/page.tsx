import type { Metadata } from 'next';
import { SubpageShell } from '@/components/SubpageShell';
import { getService } from '@/lib/services';

const SERVICE = getService('nfc')!;

export const metadata: Metadata = {
  title: 'כרטיסי NFC | ARCODEMIA',
  description: 'כרטיס שמוביל את הלקוח ישירות לדף הביקורות שלכם בגוגל.',
};

export default function Page() {
  return (
    <SubpageShell service={SERVICE}>
      <section className="sub__body">
        <div className="wrap">
          <h2 className="rv">למה ביקורות בגוגל חשובות</h2>
          <p className="rv">
            כשמישהו מחפש עסק כמו שלכם באזור, גוגל מדרג לפי כמות הביקורות
            ואיכותן. עסק עם ארבעים ביקורות טובות יופיע לפני עסק עם שלוש,
            גם אם השירות זהה.
          </p>

          <h2 className="rv">איפה הכרטיס נכנס</h2>
          <p className="rv">
            הבעיה היא לא שלקוחות לא מרוצים. הבעיה היא שביקורת דורשת מהם
            לפתוח גוגל, לחפש את השם המדויק ולגלול עד הכפתור. רובם לא יעשו
            את זה. הכרטיס מוחק את כל השלבים האלה.
          </p>

          <ul className="sub__cards rv">
            <li>
              <b>הצמדה אחת</b>
              <span>הלקוח מקרב טלפון לכרטיס ונוחת ישירות בדף הביקורות שלכם.</span>
            </li>
            <li>
              <b>בלי אפליקציה</b>
              <span>עובד מהקופסה בכל טלפון מודרני, אנדרואיד ואייפון.</span>
            </li>
            <li>
              <b>ברגע הנכון</b>
              <span>
                מבקשים ביקורת כשהלקוח מרוצה ועדיין מולכם, לא יומיים אחרי
                כשהוא כבר שכח.
              </span>
            </li>
            <li>
              <b>עובד גם בלי חשמל</b>
              <span>הכרטיס פסיבי. אין בו סוללה ואין מה לטעון.</span>
            </li>
          </ul>

          <p className="rv sub__flag">
            ⚠️ תצלום המוצר האמיתי יעלה בקרוב. האיור בעמוד הוא זמני.
          </p>
        </div>
      </section>
    </SubpageShell>
  );
}
