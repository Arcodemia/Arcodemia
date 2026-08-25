/* ============================================================
   ⚙️  כל מה שצריך לעדכן נמצא כאן ובשום מקום אחר
   ------------------------------------------------------------
   הערכים אינם סודות — הם מוצגים ממילא בדף. הם יושבים כאן
   כדי שיהיה מקום אחד לשנות בו.
   ============================================================ */

export interface SiteConfig {
  /** פורמט בינלאומי, בלי + ובלי 0 מוביל */
  readonly whatsapp: string;
  /** לתצוגה. להחלפה ל-'+972-52-382-2083' אם מעדיפים בינלאומי */
  readonly phone: string;
  /** למה שהטלפון באמת מחייג */
  readonly phoneDial: string;
  readonly email: string;
  /** Route Handler שרושם את הפנייה. ריק = בלי רישום, רק פתיחת וואטסאפ/מייל */
  readonly endpoint: string;
  /** כתובת הייצור הקנונית — metadata, OG, ושיתוף. מקור אחד. */
  readonly siteUrl: string;
}

export const CONFIG: SiteConfig = {
  whatsapp: '972523822083',
  phone: '052-382-2083',
  phoneDial: '+972523822083',
  email: 'arcodemia.il@gmail.com',
  endpoint: '/api/contact',
  siteUrl: 'https://arcodemia.com',
} as const;

export const BRAND = 'ARCODEMIA' as const;

/** תאריך כתיבת המסמכים המשפטיים (גרסה ראשונה באתר). */
export const LEGAL_WRITTEN = '2026-08-06' as const;
/** תאריך עדכון המסמכים המשפטיים. מוצג בתחתית כל מסמך. */
export const LEGAL_UPDATED = '2026-08-23' as const;
