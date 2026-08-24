'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { waURL } from '@/lib/whatsapp';
import { Dialog } from './Dialog';
import { LogoMark, MenuIcon, WhatsAppIcon } from './icons';

const NAV_CTA_MSG =
  'שלום, הגעתי מהאתר של ARCODEMIA ואשמח לשמוע פרטים על דף נחיתה לעסק שלי.';

const LINKS = [
  { href: '#why', label: 'למה דף נחיתה' },
  { href: '#process', label: 'התהליך' },
  { href: '#risk', label: 'בלי סיכון' },
  { href: '#faq', label: 'שאלות' },
  { href: '#contact', label: 'יצירת קשר' },
] as const;

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const btnRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  /* אחרי שה-<dialog> נסגר (אפקט הילד רץ קודם) — מחזירים מיקוד לכפתור. */
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
        <a className="logo" href="#top" aria-label="ARCODEMIA — לראש הדף">
          <LogoMark />
          <bdi>ARCODEMIA</bdi>
        </a>

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

      <Dialog id="navMenu" title="ניווט" open={menuOpen} onClose={closeMenu} className="nav-dialog">
        <nav aria-label="ניווט ראשי">
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
