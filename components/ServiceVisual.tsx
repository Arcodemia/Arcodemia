import { SERVICE_ART } from './ServiceArt';
import { SERVICE_IMAGES } from '@/lib/serviceImages';

/* ============================================================
   הוויזואל של שירות — תצלום אם יש, אחרת האיור המוטבע
   ------------------------------------------------------------
   נקודה אחת שמחליטה, במקום שלוש. הקרוסלה, חתכי עמוד הבית
   ועמוד השירות כולם עוברים דרך כאן, ולכן החלפת תמונה במקום
   אחד מגיעה לכל האתר.

   🔑 **ה-aria נגזר ממה שמוצג.** האיורים המוטבעים דקורטיביים
   (הכותרת לצדם אומרת את אותו דבר), אבל התצלומים החדשים
   **נושאים מידע** — תרשים הזרימה של הבוט מסביר מה הוא עושה.
   ולכן תמונה מקבלת alt אמיתי, ו-SVG מקבל aria-hidden.

   ⚠️ למה <img> ולא next/image: הקבצים כבר מקודדים ל-WebP
   בגודל הנכון ועם hash בשם. next/image רק היה מקודד מחדש את
   מה שכבר אופטימלי. אותה החלטה כמו ב-Hero ובתיק העבודות.
   ============================================================ */

export function ServiceVisual({
  slug,
  className,
  /** ⚠️ eager רק למה שמעל הקיפול. בקרוסלה הכל עצל. */
  eager = false,
}: {
  slug: string;
  className: string;
  eager?: boolean;
}) {
  const img = SERVICE_IMAGES[slug];

  if (img) {
    return (
      <span className={className}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img.src}
          width={img.w}
          height={img.h}
          alt={img.alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
        />
      </span>
    );
  }

  const Art = SERVICE_ART[slug];
  if (!Art) return null;
  return (
    <span className={className} aria-hidden="true">
      <Art />
    </span>
  );
}
