'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { useTapSpotlight } from '@/hooks/useTapSpotlight';
import { waURL } from '@/lib/whatsapp';
import { SERVICES, servicePath, type Service } from '@/lib/services';
import { CategoryNav } from './CategoryNav';
import { LogoMark, WhatsAppIcon } from './icons';
import { ServiceVisual } from './ServiceVisual';

/* ============================================================
   המעטפת של עמוד קטגוריה
   ------------------------------------------------------------
   כל עמוד משנה מקבל שני מסלולי חזרה, כפי שהתבקש:
     1. כפתור "חזרה" מפורש
     2. הלוגו, שמוביל לעמוד הבית

   🔑 כפתור החזרה מנסה קודם את היסטוריית הדפדפן, כי זו ההתנהגות
   שגולש מצפה לה כשהגיע מהקרוסלה. אם אין היסטוריה (כניסה ישירה
   לקישור, פתיחה בלשונית חדשה, רענון) הוא נופל לעמוד הבית —
   אחרת הכפתור לא היה עושה כלום.

   ⚠️ אסור להשתמש ב-document.referrer לבדיקה הזו: הוא ריק גם
   בניווט פנימי כשמדיניות ה-referrer מהודקת, וזה בדיוק המצב כאן.
   ============================================================ */

export function SubpageShell({
  service,
  children,
  heroArt = true,
}: {
  service: Service;
  children: ReactNode;
  /** ⚠️ כבו רק כשהעמוד מציג גרסה **טובה יותר** של אותו איור
      בהמשך. בעמוד פרופיל גוגל ההשוואה לפני/אחרי מכילה את
      אותו כרטיס בדיוק, ושתי הופעות באותו מסך נקראו כטעות. */
  heroArt?: boolean;
}) {
  const router = useRouter();
  /* אותן אנימציות חשיפה כמו בעמוד הבית, אחרת התוכן כאן
     היה מופיע בלי המעבר הרך שיש בכל שאר האתר. */
  useReveal();
  useTapSpotlight();

  const goBack = useCallback(() => {
    if (window.history.length > 1) router.back();
    else router.push('/');
  }, [router]);

  const others = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <>
      <a className="skip" href="#main">
        דילוג לתוכן הראשי
      </a>
      <div className="grain" aria-hidden="true" />

      <header className="nav nav--sub">
        <div className="wrap nav__in">
          <Link className="logo" href="/" aria-label="ARCODEMIA, לעמוד הבית">
            <LogoMark />
            <bdi>ARCODEMIA</bdi>
          </Link>

          <button type="button" className="subback" onClick={goBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
            חזרה
          </button>

          <a
            className="btn btn--wa btn--sm nav__cta"
            href={waURL(service.waMessage)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon />
            וואטסאפ
          </a>
        </div>
        <CategoryNav current={service.slug} />
      </header>

      <main id="main" className="sub">
        <section className="sub__hero">
          <div className="wrap sub__hero-in">
            <span className="eyebrow">שירות</span>
            <h1>{service.title}</h1>
            <p className="lead">{service.teaser}</p>
            {heroArt ? (
              <ServiceVisual slug={service.slug} className="sub__art" eager />
            ) : null}
          </div>
        </section>

        {children}

        <section className="sub__cta">
          <div className="wrap">
            <h2>נשמע מתאים לעסק שלכם?</h2>
            <p>הודעה אחת ונחזור אליכם עם תשובה, בלי התחייבות.</p>
            <div className="sub__cta-row">
              <a
                className="btn btn--hero-wa"
                href={waURL(service.waMessage)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon />
                דברו איתנו בוואטסאפ
              </a>
              <Link className="btn btn--ghost" href="/#contact">
                השאירו פרטים
              </Link>
            </div>
          </div>
        </section>

        <nav className="sub__more" aria-label="שירותים נוספים">
          <div className="wrap">
            <h2 className="sub__more-h">שירותים נוספים</h2>
            <ul>
              {others.map((s) => (
                <li key={s.slug}>
                  <Link href={servicePath(s.slug)}>
                    <b>{s.title}</b>
                    <span>{s.teaser}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </main>
    </>
  );
}
