import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { CONFIG } from '@/lib/config';
import './globals.css';

/* ============================================================
   פונטים — מתארחים אצלנו, לא אצל Google
   ------------------------------------------------------------
   מבטל בקשה לצד שלישי (פרטיות), מוריד round-trip (מהירות),
   ומאפשר ל-CSP לחסום כל מקור חיצוני.

   ⚠️ הערכים ב-declarations חייבים להיות literal ולא הפניה
   לקבוע. next/font הוא מאקרו שנקרא בזמן קומפילציה, ומשתנה
   נזרק בשקט — הבנייה נופלת על "missing field `value`".

   ⚠️ שתי קריאות נפרדות ולא אחת, כי next/font מחיל את
   `declarations` על כל ה-@font-face שהוא מייצר. עם קריאה אחת
   כל עשרת הקבצים היו מקבלים את אותו unicode-range, ושני קבצים
   באותו משקל היו דורסים זה את זה. שתי משפחות עם טווחים נפרדים
   משחזרות בדיוק את ההתנהגות המקורית: הדפדפן בוחר לפי התו.
   ============================================================ */
const heeboHe = localFont({
  src: [
    { path: './fonts/heebo-hebrew-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/heebo-hebrew-500.woff2', weight: '500', style: 'normal' },
    { path: './fonts/heebo-hebrew-700.woff2', weight: '700', style: 'normal' },
    { path: './fonts/heebo-hebrew-800.woff2', weight: '800', style: 'normal' },
    { path: './fonts/heebo-hebrew-900.woff2', weight: '900', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-heebo-he',
  declarations: [{ prop: 'unicode-range', value: 'U+0307-0308, U+0590-05FF, U+200C-2010, U+20AA, U+25CC, U+FB1D-FB4F' }],
});

const heeboLatin = localFont({
  src: [
    { path: './fonts/heebo-latin-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/heebo-latin-500.woff2', weight: '500', style: 'normal' },
    { path: './fonts/heebo-latin-700.woff2', weight: '700', style: 'normal' },
    { path: './fonts/heebo-latin-800.woff2', weight: '800', style: 'normal' },
    { path: './fonts/heebo-latin-900.woff2', weight: '900', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-heebo-latin',
  declarations: [{ prop: 'unicode-range', value: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD' }],
});

const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%23000'/%3E%3Cpath d='M16 4 27 28H5z' fill='none' stroke='%23fff' stroke-width='2.2' stroke-linejoin='round'/%3E%3Cpath d='M11.4 21h9.2' stroke='%23B14BFF' stroke-width='2.2' stroke-linecap='round'/%3E%3C/svg%3E";

const DESCRIPTION =
  'הלקוחות שלך כבר מחפשים אותך באינטרנט. אנחנו בונים לעסקים מקומיים דף נחיתה אחד שנטען מהר, נראה מצוין בנייד, וגורם ללקוח ליצור קשר. רואים את העיצוב לפני שמשלמים שקל.';
const OG_DESCRIPTION = 'דף אחד שהופך גולשים ללקוחות. רואים את העיצוב לפני שמשלמים שקל.';
const TITLE = 'ARCODEMIA — דפי נחיתה לעסקים מקומיים';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  authors: [{ name: 'ARCODEMIA' }],
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  icons: { icon: FAVICON },
  openGraph: {
    type: 'website',
    title: TITLE,
    description: OG_DESCRIPTION,
    locale: 'he_IL',
    siteName: 'ARCODEMIA',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: OG_DESCRIPTION,
  },
};

/* viewport-fit=cover נדרש כדי שהרקע יימשך אל מתחת למגרעת
   ולסרגל הבית. themeColor הועבר לכאן — ב-metadata הוא הוצא
   משימוש מ-Next 14. */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#000000',
};

/* נתונים מובנים — ProfessionalService + FAQPage */
const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfessionalService',
      name: 'ARCODEMIA',
      description:
        'בניית דפי נחיתה לעסקים מקומיים. דף אחד שנטען מהר, מותאם לנייד, ומוביל את הגולש ליצור קשר.',
      email: CONFIG.email,
      telephone: CONFIG.phoneDial,
      areaServed: { '@type': 'Country', name: 'IL' },
      availableLanguage: ['he'],
      knowsAbout: ['דפי נחיתה', 'בניית אתרים', 'שיווק דיגיטלי לעסקים מקומיים'],
      makesOffer: {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'בניית דף נחיתה לעסק מקומי',
          description:
            'דף נחיתה יחיד, מותאם לנייד, מחובר לוואטסאפ. רואים את העיצוב לפני תשלום.',
        },
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'כמה זה עולה?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'המחיר משתנה לפי מה שהדף צריך לעשות — דף בסיסי, דף עם חיבור לידים, או דף שכולל גם כתיבת תוכן. שולחים הודעה עם הפרטים ומקבלים הצעת מחיר מדויקת, בלי התחייבות.',
          },
        },
        {
          '@type': 'Question',
          name: 'כמה זמן זה לוקח?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'תלוי בהיקף ובקצב שבו מגיע החומר — תמונות, טקסטים ולוגו. בשיחה הראשונה נמסר לוח זמנים ריאלי לפרויקט הספציפי.',
          },
        },
        {
          '@type': 'Question',
          name: 'מה קורה אם העיצוב לא מוצא חן בעיניי?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'אז לא משלמים ולא ממשיכים. העיצוב הראשוני מוצג לפני כל תשלום בדיוק בשביל זה. אם הוא לא מדבר אליכם — נפרדים בטוב, בלי דמי ביטול.',
          },
        },
        {
          '@type': 'Question',
          name: 'מי מחזיק את הדומיין ואת הדף?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'הלקוח. הכל נרשם על שמו ועל החשבון שלו. הבעלות נשארת אצלו מהיום הראשון.',
          },
        },
        {
          '@type': 'Question',
          name: 'יש לי כבר אתר. למה אני צריך דף נחיתה?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'אתר תדמית מספר על העסק. דף נחיתה עושה דבר אחד: לוקח מישהו שהתעניין ומביא אותו ליצור קשר. הרבה עסקים מריצים דף נחיתה לצד האתר, במיוחד לקמפיין או למבצע.',
          },
        },
      ],
    },
  ],
};

/* ============================================================
   מדליק את אנימציות הכניסה. רץ לפני הציור הראשון כדי שלא
   ייווצר הבזק.
   🔴 שתי מחלקות נפרדות, בכוונה:
     intro  — כניסת הכותרת. מוסרת אחרי 3.2 שניות.
     rv-on  — חשיפה בגלילה. נוספת רק אם IntersectionObserver
              קיים, אחרת התוכן מוצג מיד ולא מסתתר לעולם.
   ברירת המחדל ב-CSS היא **נראה**. בלי הסקריפט הזה שום דבר
   לא מסתתר — אנימציית כניסה לא יכולה להיות מה שהופך תוכן לנראה.
   ============================================================ */
const INTRO_SCRIPT = `(function(){var h=document.documentElement;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;h.classList.add('intro');if('IntersectionObserver' in window)h.classList.add('rv-on');})();`;

/* suppressHydrationWarning: INTRO_SCRIPT מוסיף intro/rv-on ל-<html>
   לפני שה-hydration רץ, ולכן ה-className בלקוח שונה מזה שהשרת שלח.
   זה מכוון — הסקריפט חייב לרוץ לפני הציור הראשון כדי שלא ייווצר הבזק. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${heeboHe.variable} ${heeboLatin.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* ⚠️ אין כאן <head> ידני. Next מרכיב אותו מה-Metadata API,
            ו-<head> מפורש מונע ממנו להוסיף חלק מהתגים — בפועל
            viewport-fit=cover נעלם בלי שום שגיאה.
            React מרים <link> ו-<script> להאד לבד. */}
        <link
          rel="preload"
          as="image"
          href="/img/hero-wide.webp"
          media="(min-width:834px)"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/img/hero-tall.webp"
          media="(max-width:833px)"
          fetchPriority="high"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        {/* חייב לרוץ לפני הציור הראשון — ולכן ראשון ב-body */}
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
        {children}
      </body>
    </html>
  );
}
