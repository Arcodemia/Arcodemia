'use client';

import { useEffect } from 'react';

const SELECTOR = '.card, .stepc, .faq details, .dline';
const TAP_MS = 500;
/* רצף הפטיש/אבן/וי נמשך ~2.2 שניות. עם 500ms המחלקה הייתה יורדת
   באמצע והאנימציה נקטעת, ולכן לכרטיסי התהליך יש חלון ארוך יותר. */
const TAP_MS_STEP = 2600;

/** משוב מיידי בלחיצה בנייד. הזרקור בגלילה נשאר CSS בלבד. */
export function useTapSpotlight(): void {
  useEffect(() => {
    let current: Element | null = null;
    let timer = 0;

    const clear = () => {
      window.clearTimeout(timer);
      current?.classList.remove('is-tapped');
      current = null;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (document.documentElement.classList.contains('a11y-nomotion')) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const next = (e.target as Element | null)?.closest(SELECTOR);
      clear();
      if (!next) return;
      current = next;
      next.classList.add('is-tapped');
      timer = window.setTimeout(clear, next.classList.contains('stepc') ? TAP_MS_STEP : TAP_MS);
    };

    document.addEventListener('touchstart', onTouchStart, { passive: true });
    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      clear();
    };
  }, []);
}
