import type { Metadata } from 'next';
import { SubpageShell } from '@/components/SubpageShell';
import { getService } from '@/lib/services';

const SERVICE = getService('automation')!;

export const metadata: Metadata = {
  title: 'אוטומציות לעסקים | ARCODEMIA',
  description: 'בוט וואטסאפ שקובע תורים, שולח תזכורות ועונה ללקוחות במקומכם.',
};

export default function Page() {
  return (
    <SubpageShell service={SERVICE}>
      <section className="sub__body">
        <div className="wrap">
          <h2 className="rv">מה זה עושה בפועל</h2>
          <p className="rv">
            רוב העסקים מפסידים לקוחות בשעות שבהן אף אחד לא ליד הטלפון. בוט
            וואטסאפ עונה במקומכם, קובע את התור ומעדכן אתכם ביומן.
          </p>

          <ul className="sub__cards rv">
            <li>
              <b>קביעת תורים</b>
              <span>
                הלקוח מקבל את השעות הפנויות, בוחר אחת ומקבל אישור מיידי.
                היומן מתעדכן לבד.
              </span>
            </li>
            <li>
              <b>תזכורות לפני התור</b>
              <span>
                הודעה יום לפני ושעה לפני. זה מוריד משמעותית את מספר הלקוחות
                שלא מגיעים.
              </span>
            </li>
            <li>
              <b>מענה לשאלות חוזרות</b>
              <span>
                שעות פתיחה, מחירון, כתובת, חנייה. הבוט עונה, ואתם לא מקלידים
                את אותה תשובה בפעם המאה.
              </span>
            </li>
            <li>
              <b>איסוף פרטים לפני שיחה</b>
              <span>
                הבוט שואל מה צריך ומעביר לכם פנייה מסודרת, כדי שתחזרו מוכנים.
              </span>
            </li>
          </ul>

          <h2 className="rv">איך מתחילים</h2>
          <p className="rv">
            בשיחה קצרה נבין מה התהליך שגוזל לכם הכי הרבה זמן, נבנה אותו,
            ונריץ אותו על מספר הוואטסאפ העסקי שלכם. אתם רואים כל הודעה
            שהבוט שולח ויכולים להתערב בכל רגע.
          </p>
          <p className="rv">
            שתי האוטומציות למעלה הן ההתחלה הנפוצה. כמעט כל תהליך חוזר בעסק
            אפשר להפוך לאוטומטי, ונשמח לשמוע מה שלכם.
          </p>
        </div>
      </section>
    </SubpageShell>
  );
}
