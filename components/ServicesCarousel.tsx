'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { SERVICES, servicePath } from '@/lib/services';
import { SERVICE_ART } from './ServiceArt';

/* ============================================================
   קרוסלת השירותים
   ------------------------------------------------------------
   🔑 הגלילה עצמה היא **גלילה מקורית** של הדפדפן עם scroll-snap,
   ולא טרנספורם שמחושב ב-JS. זה מה שנותן החלקה אמיתית באצבע
   בלי לכתוב מטפל מגע, שומר על אינרציה של המערכת, ומאפשר
   ניווט במקלדת בחינם. ה-JS כאן רק מוסיף חצים לשולחני ומסמן
   איזה כרטיס פעיל.

   ⚠️ בדף RTL הדפדפן מדווח scrollLeft שלילי. אסור להסתמך על
   הסימן שלו, ולכן כל חישוב כאן עובר דרך Math.abs.

   ⚠️ הכרטיס כולו הוא <Link> אל עמוד אמיתי, לא מודאל. זו הייתה
   דרישה מפורשת.
   ============================================================ */

export function ServicesCarousel() {
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  /* מי הכרטיס הפעיל, ואיפה אנחנו ביחס לקצוות */
  const sync = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    /* 🔑 האינדקס נגזר ממרחק הגלילה חלקי רוחב כרטיס, ולא ממי
       הכי קרוב למרכז. עם מרכז, במנוחה יצא שהכרטיס **השני**
       מסומן, כי הראשון יושב בקצה ולא במרכז.
       Math.abs מטפל ב-scrollLeft השלילי של RTL. */
    const first = rail.firstElementChild as HTMLElement | null;
    if (first) {
      const gap = parseFloat(getComputedStyle(rail).columnGap || '0') || 0;
      const stride = first.offsetWidth + gap;
      const idx = Math.round(Math.abs(rail.scrollLeft) / stride);
      setActive(Math.min(Math.max(idx, 0), rail.children.length - 1));
    }

    /* גבולות: עובד גם כש-scrollLeft שלילי ב-RTL */
    const max = rail.scrollWidth - rail.clientWidth;
    const pos = Math.abs(rail.scrollLeft);
    setAtStart(pos < 8);
    setAtEnd(pos > max - 8);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    sync();
    rail.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      rail.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [sync]);

  /* dir=+1 הוא "הכרטיס הבא" בסדר הקריאה, בלי קשר לסימן של scrollLeft */
  const step = useCallback((dir: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const first = rail.firstElementChild as HTMLElement | null;
    if (!first) return;
    const gap = parseFloat(getComputedStyle(rail).columnGap || '0') || 0;
    const by = (first.offsetWidth + gap) * dir;
    /* ב-RTL הציר האופקי הפוך, ולכן מכפילים בסימן שנגזר מהפריסה */
    const rtl = getComputedStyle(rail).direction === 'rtl';
    rail.scrollBy({ left: rtl ? -by : by, behavior: 'smooth' });
  }, []);

  const goTo = useCallback((i: number) => {
    const rail = railRef.current;
    const el = rail?.children[i] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  }, []);

  return (
    <section id="services" className="svc">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">מה אנחנו עושים</span>
          <h2>
            חמישה שירותים, מטרה אחת:
            <br />
            <em>שיגיעו אליכם יותר לקוחות.</em>
          </h2>
          <p>בחרו קטגוריה כדי לראות מה היא כוללת.</p>
        </div>
      </div>

      <div className="svc__frame">
        <button
          type="button"
          className="svc__arrow svc__arrow--prev"
          onClick={() => step(-1)}
          disabled={atStart}
          aria-label="הקטגוריה הקודמת"
        >
          <Chevron dir="prev" />
        </button>

        <div className="svc__rail" ref={railRef} role="list">
          {SERVICES.map((s, i) => {
            const Art = SERVICE_ART[s.slug];
            return (
              <div className="svc__slide" role="listitem" key={s.slug}>
                <Link
                  className={`svc__card${i === active ? ' is-active' : ''}`}
                  href={servicePath(s.slug)}
                >
                  <span className="svc__art" aria-hidden="true">
                    {Art ? <Art /> : null}
                  </span>
                  <span className="svc__num">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{s.title}</h3>
                  <p>{s.teaser}</p>
                  <span className="svc__go">
                    לפרטים
                    <Chevron dir="next" />
                  </span>
                </Link>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className="svc__arrow svc__arrow--next"
          onClick={() => step(1)}
          disabled={atEnd}
          aria-label="הקטגוריה הבאה"
        >
          <Chevron dir="next" />
        </button>
      </div>

      {/* נקודות: גם חיווי מיקום וגם ניווט, בעיקר לנייד */}
      <div className="svc__dots" role="tablist" aria-label="בחירת קטגוריה">
        {SERVICES.map((s, i) => (
          <button
            key={s.slug}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={s.title}
            className={`svc__dot${i === active ? ' is-on' : ''}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  );
}

function Chevron({ dir }: { dir: 'prev' | 'next' }) {
  /* בפריסת RTL "הבא" מצביע שמאלה. הסיבוב נעשה ב-CSS לפי הכיוון,
     כאן רק צורה אחת. */
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" data-dir={dir} aria-hidden="true">
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}
