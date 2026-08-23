import { waURL } from '@/lib/whatsapp';
import { LogoMark, WhatsAppIcon } from './icons';

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
  return (
    <header className="nav">
      <div className="wrap nav__in">
        <a className="logo" href="#top" aria-label="ARCODEMIA — לראש הדף">
          <LogoMark />
          <bdi>ARCODEMIA</bdi>
        </a>

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
    </header>
  );
}
