/* ============================================================
   ⚙️  כל מה שצריך לעדכן נמצא כאן ובשום מקום אחר
   ------------------------------------------------------------
   הערכים אינם סודות — הם מוצגים ממילא בדף. הם יושבים כאן
   כדי שיהיה מקום אחד לשנות בו.
   ============================================================ */

export interface SiteConfig {
  /** פורמט בינלאומי, בלי + ובלי 0 מוביל */
  readonly whatsapp: string;
  /** לתצוגה. להחלפה ל-'+972-50-867-4870' אם מעדיפים בינלאומי */
  readonly phone: string;
  /** למה שהטלפון באמת מחייג */
  readonly phoneDial: string;
  readonly email: string;
  /** Route Handler שרושם את הפנייה. ריק = בלי רישום, רק פתיחת וואטסאפ/מייל */
  readonly endpoint: string;
}

export const CONFIG: SiteConfig = {
  whatsapp: '972508674870',
  phone: '050-867-4870',
  phoneDial: '+972508674870',
  email: 'arcodemia.il@gmail.com',
  endpoint: '/api/contact',
} as const;

export const BRAND = 'ARCODEMIA' as const;

/** תאריך כתיבת המסמכים המשפטיים (גרסה ראשונה באתר). */
export const LEGAL_WRITTEN = '2026-08-06' as const;
/** תאריך עדכון המסמכים המשפטיים. מוצג בתחתית כל מסמך. */
export const LEGAL_UPDATED = '2026-08-23' as const;
