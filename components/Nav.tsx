'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { waURL } from '@/lib/whatsapp';
import { SERVICES, servicePath } from '@/lib/services';
import { CategoryNav } from './CategoryNav';
import { Dialog } from './Dialog';
import { LogoMark, MenuIcon, WhatsAppIcon } from './icons';

const NAV_CTA_MSG =
  'שלום, הגעתי מהאתר של ARCODEMIA ואשמח לשמוע פרטים על השירותים שלכם.';

/* קישורי העמוד עצמו. הקטגוריות מגיעות מ-lib/services ולכן אינן
   משוכפלות כאן. */
const LINKS = [
  { href: '/#work', label: 'עבודות' },
  { href: '/#about', label: 'מי אנחנו' },
  { href: '/#reviews', label: 'ביקורות' },
  { href: '/#contact', label: 'יצירת קשר' },
] as const;

/* ============================================================
   ניווט
   ------------------------------------------------------------
   שתי שורות בשולחני: העליונה היא הזהות והפעולה, התחתונה היא
   רצועת הקטגוריות. הקטגוריות נגזרות מ-lib/services, כך
   שהוספת שירות מופיעה בניווט, בקרוסלה ובעמודי המשנה בבת אחת.

   ⚠️ הקישורים הם /#anchor ולא #anchor. בעמוד משנה עוגן יחסי
   היה מחפש את החתך בעמוד הנוכחי ולא מוצא כלום.

   ⚠️ רצועת הקטגוריות נגללת אופקית בנייד במקום להישבר לשתי
   שורות. שבירה דחפה את ה-hero מטה בכל מכשיר צר.
   ============================================================ */
export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const btnRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  /* אחרי שה-<dialog> נסגר (אפקט הילד רץ קודם) מחזירים מיקוד לכפתור. */
  useEffect(() => {
    if (menuOpen) {
      wasOpen.current = true;
      return;
    }
    if (!wasOpen.current) return;
    wasOpen.current = false;
    btnRef.current?.focus();
  }, [menuOpen]);

  return (
    <header className="nav">
      <div className="wrap nav__in">
        <Link className="logo" href="/" aria-label="ARCODEMIA, לעמוד הבית">
          <LogoMark />
          <bdi>ARCODEMIA</bdi>
        </Link>

        <button
          type="button"
          className="nav__menu-btn"
          ref={btnRef}
          aria-label="תפריט ניווט"
          aria-expanded={menuOpen}
          aria-controls="navMenu"
          onClick={() => setMenuOpen(true)}
        >
          <MenuIcon />
        </button>

        <nav className="nav__links" aria-label="ניווט ראשי">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <a
          className="btn btn--wa btn--sm nav__cta"
          href={waURL(NAV_CTA_MSG)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon />
          וואטסאפ
        </a>
      </div>

      {/* רצועת הקטגוריות, אותו רכיב בדיוק כמו בעמודי המשנה */}
      <CategoryNav />

      <Dialog id="navMenu" title="ניווט" open={menuOpen} onClose={closeMenu} className="nav-dialog">
        <nav aria-label="ניווט ראשי">
          <p className="nav-menu__h">שירותים</p>
          <ul className="nav-menu">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link href={servicePath(s.slug)} onClick={closeMenu}>
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
          <p className="nav-menu__h">האתר</p>
          <ul className="nav-menu">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={closeMenu}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Dialog>
    </header>
  );
}
