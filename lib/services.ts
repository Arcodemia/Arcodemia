/* ============================================================
   קטלוג השירותים — מקור אמת אחד
   ------------------------------------------------------------
   מזין שלושה מקומות בבת אחת: ניווט הקטגוריות בראש הדף,
   הקרוסלה בעמוד הבית, ועמודי המשנה תחת /services.
   הוספת שירות = שורה כאן + עמוד תחת app/services/<slug>.

   ⚠️ הסדר כאן הוא הסדר שהלקוח ביקש. לא לשנות אותו.
   ============================================================ */

export interface Service {
  /** מזהה יציב. גם הנתיב: /services/<slug> */
  readonly slug: string;
  /** השם המלא, לכותרות ולעמוד המשנה */
  readonly title: string;
  /** שם קצר לניווט, כשאין מקום לכותרת מלאה */
  readonly navLabel: string;
  /** שורה אחת לכרטיס בקרוסלה */
  readonly teaser: string;
  /** ההודעה שנפתחת בוואטסאפ מהעמוד הזה */
  readonly waMessage: string;
}

export const SERVICES: readonly Service[] = [
  {
    slug: 'automation',
    title: 'אוטומציות לעסקים',
    navLabel: 'אוטומציות',
    teaser: 'בוט וואטסאפ שקובע תורים, שולח תזכורות ועונה ללקוחות במקומכם.',
    waMessage: 'שלום, הגעתי מהאתר של ARCODEMIA ואשמח לשמוע על אוטומציות לעסק שלי.',
  },
  {
    slug: 'nfc',
    title: 'כרטיסי NFC',
    navLabel: 'כרטיסי NFC',
    teaser: 'הצמדה אחת של הטלפון, והלקוח כבר בדף הביקורות שלכם בגוגל.',
    waMessage: 'שלום, הגעתי מהאתר של ARCODEMIA ואשמח לשמוע על כרטיסי NFC.',
  },
  {
    slug: 'landing-pages',
    title: 'דפי נחיתה ואתרים לעסקים',
    navLabel: 'דפי נחיתה ואתרים',
    teaser: 'דף אחד שנטען מהר, נראה מצוין בנייד ומוביל לפעולה אחת.',
    waMessage: 'שלום, הגעתי מהאתר של ARCODEMIA ואשמח לקבל הצעת מחיר לדף נחיתה.',
  },
  {
    slug: 'marketing',
    title: 'שיווק דיגיטלי',
    navLabel: 'שיווק דיגיטלי',
    teaser: 'קמפיינים ממומנים ותוכן וידאו שמביאים פניות, לא רק צפיות.',
    waMessage: 'שלום, הגעתי מהאתר של ARCODEMIA ואשמח לשמוע על שיווק דיגיטלי.',
  },
  {
    slug: 'google-business',
    title: 'הקמת פרופיל עסקי בגוגל',
    navLabel: 'פרופיל גוגל',
    teaser: 'שהעסק יופיע במפות ובחיפוש עם כל הפרטים, התמונות והביקורות.',
    waMessage: 'שלום, הגעתי מהאתר של ARCODEMIA ואשמח לשמוע על פרופיל עסקי בגוגל.',
  },
] as const;

/** מחזיר שירות לפי ה-slug, או undefined אם אין כזה. */
export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

/** הנתיב לעמוד המשנה של שירות. */
export function servicePath(slug: string): string {
  return `/services/${slug}`;
}
