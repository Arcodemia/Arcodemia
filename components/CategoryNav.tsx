import Link from 'next/link';
import { SERVICES, servicePath } from '@/lib/services';

/* ============================================================
   רצועת הקטגוריות
   ------------------------------------------------------------
   מופיעה בכל דף באתר: עמוד הבית וכל עמודי המשנה. לכן היא רכיב
   אחד ולא הודבקה פעמיים, אחרת היא הייתה נפרדת בין הדפים
   ברגע שמישהו מוסיף שירות.

   הקטגוריות מגיעות מ-lib/services, כך שהוספת שירות מופיעה כאן,
   בקרוסלה ובעמודי המשנה בבת אחת.

   ⚠️ נגללת אופקית בנייד ולא נשברת לשתי שורות. שבירה דחפה את
   ה-hero מטה בכל מכשיר צר.
   ============================================================ */
export function CategoryNav({ current }: { current?: string }) {
  return (
    <nav className="catnav" aria-label="קטגוריות שירות">
      <div className="wrap catnav__in">
        {SERVICES.map((s) => (
          <Link
            key={s.slug}
            href={servicePath(s.slug)}
            className={`catnav__item${s.slug === current ? ' is-current' : ''}`}
            aria-current={s.slug === current ? 'page' : undefined}
          >
            {s.navLabel}
          </Link>
        ))}
      </div>
    </nav>
  );
}
