'use client';

import { useLegal, type LegalDocId } from './LegalDialogs';

const DOCS: ReadonlyArray<{ id: LegalDocId; label: string }> = [
  { id: 'docPrivacy', label: 'מדיניות פרטיות' },
  { id: 'docTerms', label: 'תנאי שימוש' },
  { id: 'docA11y', label: 'הצהרת נגישות' },
];

export function Footer() {
  const { open } = useLegal();

  /* השנה מחושבת בזמן הרינדור בשרת. אין כאן אי-התאמת hydration
     כי הערך יציב, ואין טעם לשלם על effect בשביל מספר אחד. */
  const year = new Date().getFullYear();

  return (
    <footer className="foot">
      <div className="wrap foot__in">
        <span>
          © <span>{year}</span> <bdi>ARCODEMIA</bdi> — דפי נחיתה לעסקים מקומיים
        </span>
        <nav className="foot__legal" aria-label="מסמכים משפטיים">
          {DOCS.map((d) => (
            <button key={d.id} type="button" onClick={() => open(d.id)}>
              {d.label}
            </button>
          ))}
        </nav>
      </div>
    </footer>
  );
}
