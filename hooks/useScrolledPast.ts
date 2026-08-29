'use client';

import { useEffect, useState } from 'react';

/** מופיע אחרי גלילה מה-hero, כדי לא להתחרות ב-CTA הראשי */
export const FAB_SHOW_AFTER_PX = 460;

/** true אחרי שגללו מעבר ל-threshold. משמש את כפתורי הוואטסאפ והשיתוף הצפים. */
export function useScrolledPast(threshold: number): boolean {
  const [past, setPast] = useState(false);

  useEffect(() => {
    const check = () => setPast(window.scrollY > threshold);
    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, [threshold]);

  return past;
}
