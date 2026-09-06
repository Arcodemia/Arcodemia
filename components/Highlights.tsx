import Link from 'next/link';
import { servicePath } from '@/lib/services';
import { ServiceVisual } from './ServiceVisual';

/* ============================================================
   שלושת החתכים המורחבים בעמוד הבית
   ------------------------------------------------------------
   אוטומציות, שיווק ו-NFC מקבלים חתך משלהם ולא רק כרטיס
   בקרוסלה, כי הם החדשים בהיצע ודורשים הסבר לפני שמישהו מבין
   למה הוא צריך אותם.

   ⚠️ השיווק החברתי מתואר כשירות פנימי. אין אזכור לשותף חיצוני.

   הפריסה מתחלפת לסירוגין (התמונה ימין, שמאל, ימין) דרך
   .feat--flip, כדי שהעין לא תרד ברשימה אחידה.
   ============================================================ */

export function Automation() {
  return (
    <section id="automation" className="feat">
      <div className="wrap feat__in">
        <ServiceVisual slug="automation" className="feat__art rv" />
        <div className="feat__text rv">
          <span className="eyebrow">אוטומציות</span>
          <h2>
            הטלפון מפסיק לצלצל,
            <br />
            <em>והיומן ממשיך להתמלא.</em>
          </h2>
          <p className="lead">
            בוט וואטסאפ שעונה ללקוחות שלכם בזמן שאתם עובדים, ישנים או בחופש.
          </p>
          <ul className="feat__list">
            <li>
              <b>קביעת תורים בוואטסאפ</b>
              <span>הלקוח בוחר שעה פנויה ומקבל אישור. בלי שיחה, בלי הלוך ושוב.</span>
            </li>
            <li>
              <b>תזכורות אוטומטיות</b>
              <span>הודעה לפני התור מורידה את מספר מי שלא מגיע.</span>
            </li>
            <li>
              <b>מענה לשאלות החוזרות</b>
              <span>שעות פתיחה, מחירים, כתובת וחנייה. אותן שאלות, בלי שתקלידו.</span>
            </li>
          </ul>
          <p className="feat__more">
            אלה ההתחלה. כל תהליך שאתם חוזרים עליו ידנית אפשר להפוך לאוטומטי,
            ונשמח לשמוע מה גוזל לכם הכי הרבה זמן.
          </p>
          <Link className="btn btn--ghost" href={servicePath('automation')}>
            לפרטים על אוטומציות
          </Link>
        </div>
      </div>
    </section>
  );
}

export function NfcCards() {
  return (
    <section id="nfc" className="feat feat--flip">
      <div className="wrap feat__in">
        <ServiceVisual slug="nfc" className="feat__art rv" />
        <div className="feat__text rv">
          <span className="eyebrow">כרטיסי NFC</span>
          <h2>
            הצמדה אחת,
            <br />
            <em>וביקורת בגוגל.</em>
          </h2>
          <p className="lead">
            כרטיס פיזי על הדלפק. הלקוח מצמיד אליו טלפון ונוחת ישירות בדף
            הביקורות שלכם, בלי לחפש ובלי להקליד.
          </p>
          <ul className="feat__list">
            <li>
              <b>בלי אפליקציה ובלי הורדה</b>
              <span>עובד מהקופסה בכל טלפון מודרני, אנדרואיד ואייפון.</span>
            </li>
            <li>
              <b>ברגע הנכון</b>
              <span>מבקשים ביקורת כשהלקוח מרוצה ועדיין מולכם, לא יומיים אחרי.</span>
            </li>
            <li>
              <b>יותר ביקורות, דירוג גבוה יותר</b>
              <span>וזה בדיוק מה שמקדם אתכם בחיפוש המקומי ובמפות.</span>
            </li>
          </ul>
          <p className="feat__note">
            ⚠️ התמונה כאן היא איור זמני. תצלום המוצר האמיתי יוחלף כשיהיה.
          </p>
          <Link className="btn btn--ghost" href={servicePath('nfc')}>
            לפרטים על כרטיסי NFC
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Marketing() {
  return (
    <section id="marketing" className="feat">
      <div className="wrap feat__in">
        <ServiceVisual slug="marketing" className="feat__art rv" />
        <div className="feat__text rv">
          <span className="eyebrow">שיווק דיגיטלי</span>
          <h2>
            קמפיין שמביא פניות,
            <br />
            <em>לא רק צפיות.</em>
          </h2>
          <p className="lead">
            אנחנו מנהלים את הקמפיינים ומפיקים את התוכן בעצמנו, מהרעיון ועד
            הדוח החודשי.
          </p>
          <ul className="feat__list">
            <li>
              <b>קמפיינים ממומנים</b>
              <span>מטא וגוגל, עם מיקוד לקהל שבאמת קונה אצלכם ובאזור שלכם.</span>
            </li>
            <li>
              <b>תוכן וידאו לעסק</b>
              <span>סרטונים קצרים שנבנים לפיד ולסטורי, לא פרסומת שגוללים מעליה.</span>
            </li>
            <li>
              <b>ניהול הרשתות</b>
              <span>תכנון, צילום, כתיבה והעלאה. אצלנו בבית, בלי גורם חיצוני.</span>
            </li>
          </ul>
          <p className="feat__more">
            כל שקל מדווח. אתם רואים כמה עלתה פנייה, מאיזה קמפיין היא הגיעה,
            ומה שווה להגדיל בחודש הבא.
          </p>
          <Link className="btn btn--ghost" href={servicePath('marketing')}>
            לפרטים על שיווק דיגיטלי
          </Link>
        </div>
      </div>
    </section>
  );
}
