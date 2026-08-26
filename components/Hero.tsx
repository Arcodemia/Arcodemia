'use client';

import { useEffect, useRef, useState } from 'react';
import { waURL } from '@/lib/whatsapp';
import { WhatsAppIcon } from './icons';

const HERO_CTA_MSG =
  'שלום, הגעתי מהאתר של ARCODEMIA ואשמח לקבל הצעת מחיר לדף נחיתה.';

/* ============================================================
   הקריסטלים — תמונה סטטית שרונדרה מראש
   ------------------------------------------------------------
   למה <picture> ידני ולא next/image:
     1. זו art direction אמיתית — שני חיתוכים שונים (1800×1120
        לרוחב, 900×1150 לאורך), לא אותה תמונה בגדלים שונים.
        <Image> לא יודע לבטא <source media>, והדרך המקובלת
        לעקוף (שני <Image> עם הסתרה ב-CSS) גורמת לדפדפן להוריד
        את שניהם או לשבור את ה-preload.
     2. הקבצים כבר WebP בדיוק במידות הנדרשות. האופטימיזציה של
        next/image הייתה מקודדת אותם מחדש בלי שום רווח.
     3. preload עם media + fetchpriority="high" נשמר מדויק
        (מוגדר ב-app/layout.tsx), וזה מה שקובע את ה-LCP.
   ============================================================ */
export function Hero() {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  /* הקריסטלים נכנסים בדעיכה רכה ברגע שהתמונה מפוענחת.
     complete נבדק גם ידנית — התמונה עלולה להיות במטמון
     ולסיים להיטען עוד לפני שה-effect רץ. */
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete) {
      setLoaded(true);
      return;
    }
    const on = () => setLoaded(true);
    img.addEventListener('load', on);
    img.addEventListener('error', on);
    return () => {
      img.removeEventListener('load', on);
      img.removeEventListener('error', on);
    };
  }, []);

  return (
    <section className="hero">
      {/* שם הקובץ כולל hash של הבתים. /img/* נשמר שנה כ-immutable —
         רנדר מחדש חייב לייצר שם חדש, אחרת הדפדפן ישאיר את התמונה הישנה.
         הגביש השמאלי בתמונה האפויה הוא העתק 2D של הימני — ראו log.md. */}
      {/* ⚠️ שלושה מקורות ולא שניים.
         תיבת ה-hero היא תמיד 657px גובה ברוחב שולחני, ולכן היחס
         שלה נע בין 1.6 ל-2.9 — ו-object-fit:cover חותך את ההפרש.
         עם מקור אחד ל-834px ומעלה הגבישים נחתכו 13.5% ב-1920x1080.
         כל מקור מרונדר ביחס שקרוב לטווח שהוא משרת, וכך החיתוך
         הנוסף של הדפדפן נשאר בתוך השוליים שנבנו לתוך התמונה.
         המדידה: tools/check-crystal-clipping.cjs. */}
      <picture className="hero__art">
        <source media="(min-width:1280px)" srcSet="/img/hero-ultra.e6fae8.webp" width={1800} height={760} />
        <source media="(max-width:833px)" srcSet="/img/hero-tall.023934.webp" width={900} height={1150} />
        <img
          ref={imgRef}
          className={loaded ? 'is-on' : undefined}
          src="/img/hero-wide.fdb2c1.webp"
          alt=""
          aria-hidden="true"
          width={1800}
          height={1120}
          fetchPriority="high"
          decoding="async"
        />
      </picture>

      <div className="wrap hero__in">
        <span className="eyebrow">דפי נחיתה לעסקים מקומיים</span>
        <h1>
          הלקוחות שלך כבר מחפשים אותך.
          <br />
          <em>השאלה היא מה הם מוצאים.</em>
        </h1>
        <p className="lead">
          אנחנו בונים לעסקים מקומיים דף נחיתה אחד — שנטען מהר, נראה מצוין בנייד,
          ומוביל את הגולש לפעולה אחת: ליצור איתך קשר.
        </p>
        <div className="hero__cta">
          <a
            className="btn btn--hero-wa"
            href={waURL(HERO_CTA_MSG)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon />
            דברו איתנו בוואטסאפ
          </a>
          <a className="btn btn--ghost" href="#contact">
            השאירו פרטים →
          </a>
        </div>
        <div className="hero__trust">
          <span>מותאם קודם כל לנייד</span>
          <span>נטען במהירות</span>
          <span>מחובר ישירות לוואטסאפ שלך</span>
        </div>
      </div>
    </section>
  );
}
