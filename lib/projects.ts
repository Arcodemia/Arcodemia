/* ============================================================
   תיק העבודות
   ------------------------------------------------------------
   כרגע פרויקט אחד. המבנה נבנה כדי שהוספת פרויקט תהיה שורה אחת
   כאן ותמונה אחת ב-public/work.

   איך מייצרים את התמונה:
     node tools/shoot-project.cjs <url> <slug>
   הכלי מצלם את האתר החי ברוחב שולחני ושומר WebP עם hash.
   ============================================================ */

export interface Project {
  /** מזהה יציב, גם שם קובץ התמונה */
  readonly slug: string;
  /** שם הלקוח או הפרויקט */
  readonly name: string;
  /** מה נבנה, שורה אחת */
  readonly what: string;
  /** האתר החי. נפתח בלשונית חדשה */
  readonly url: string;
  /** התמונה תחת public/work, כולל hash */
  readonly image: string;
  /** יחס התמונה, למניעת קפיצת פריסה */
  readonly width: number;
  readonly height: number;
}

export const PROJECTS: readonly Project[] = [
  {
    slug: 'motors-travels',
    name: 'Motors Travels',
    what: 'אתר לסוכנות טיולים, עם דגש על פנייה מהירה מהנייד.',
    url: 'https://www.motorstravels.com/',
    image: '/work/motors-travels.62000e.webp',
    width: 1280,
    height: 800,
  },
] as const;
