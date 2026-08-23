'use client';

import { useEffect } from 'react';

/* ============================================================
   חשיפה בגלילה + רשתות ביטחון
   ------------------------------------------------------------
   🔴 הכלל שאסור לשבור:
   אנימציית כניסה לא יכולה להיות מה שהופך תוכן לנראה.
   ברירת המחדל ב-CSS היא **נראה**. ההסתרה תלויה במחלקות
   `intro` ו-`rv-on` שנוספות על <html> בסקריפט שרץ לפני הציור
   הראשון — ומוסרות ברשת ביטחון. אם JS לא רץ בכלל, שום דבר
   לא מסתתר.

   שתי רשתות ביטחון:
     1. .intro מוסרת אחרי 3.2 שניות (1.2 השהיה + 1.5 משך
        האנימציה הארוכה ביותר, בתוספת מרווח).
     2. sweep() חושף בכוח כל .rv שכבר בחלון אבל לא נחשף,
        למקרה שה-observer לא ירה.
   ============================================================ */

const INTRO_MS = 3200;
const SWEEP_DELAY_MS = 900;

export function useReveal(): void {
  useEffect(() => {
    const root = document.documentElement;

    /* רשת ביטחון 1 — מרגע זה שום כלל CSS לא מסתיר את הכותרת */
    const introTimer = window.setTimeout(() => {
      root.classList.remove('intro');
    }, INTRO_MS);

    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.rv'));

    /* בלי IntersectionObserver המחלקה rv-on לא נוספה מלכתחילה,
       ולכן התוכן גלוי ואין מה לעשות. */
    if (!('IntersectionObserver' in window)) {
      return () => window.clearTimeout(introTimer);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) {
            en.target.classList.add('is-in');
            io.unobserve(en.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    nodes.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i % 4, 3) * 70}ms`;
      io.observe(el);
    });

    /* רשת ביטחון 2 */
    const sweep = () => {
      document.querySelectorAll<HTMLElement>('.rv:not(.is-in)').forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add('is-in');
        }
      });
    };

    let sweepTimer = 0;
    const onLoad = () => {
      sweepTimer = window.setTimeout(sweep, SWEEP_DELAY_MS);
    };

    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad);

    return () => {
      window.clearTimeout(introTimer);
      window.clearTimeout(sweepTimer);
      window.removeEventListener('load', onLoad);
      io.disconnect();
    };
  }, []);
}
