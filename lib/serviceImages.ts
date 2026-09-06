/* ============================================================
   תמונות השירותים — מקור אמת אחד
   ------------------------------------------------------------
   שלושה שירותים קיבלו תמונה אמיתית במקום האיור המוטבע.
   השניים שנותרו (דפי נחיתה, פרופיל גוגל) עדיין SVG.

   🔑 **ה-hash בשם הקובץ אינו קישוט.** next.config.mjs מגיש את
   /img/* עם `max-age=31536000, immutable`. החלפת תמונה בלי
   לשנות את השם לא תגיע לאף מבקר שכבר ביקר באתר.
   להוספה או להחלפה:
     node tools/add-service-image.cjs <קובץ> <slug>
   ואז לעדכן כאן את ה-src ואת המידות.

   ⚠️ **המידות חייבות להיות המידות האמיתיות של הקובץ.** הן
   נכתבות כ-width/height על ה-<img> כדי לשריין מקום מראש; מספר
   שגוי גורר קפיצת פריסה בזמן הטעינה.
   ============================================================ */

export interface ServiceImage {
  readonly src: string;
  readonly w: number;
  readonly h: number;
  /** ⚠️ התמונות האלה נושאות מידע, לא קישוט. alt אמיתי, לא ריק. */
  readonly alt: string;
}

export const SERVICE_IMAGES: Readonly<Record<string, ServiceImage>> = {
  automation: {
    src: '/img/services/whatsapp-bot-automation.222c08.webp',
    w: 1100,
    h: 1100,
    alt: 'תרשים זרימה: בוט וואטסאפ עונה ללקוחות על שעות פעילות ועל קביעת תור, ומעביר פנייה על מצב זיכוי לנציגה אנושית.',
  },
  nfc: {
    src: '/img/services/nfc-card.301cf5.webp',
    w: 1100,
    h: 1100,
    alt: 'כרטיס NFC כחול-לבן עם חמישה כוכבים, לוגו גוגל והכיתוב "Tap אחד ושימו דירוג", עם איור של הצמדת טלפון לכרטיס.',
  },
  marketing: {
    src: '/img/services/marketing-graph.656f9f.webp',
    w: 1100,
    h: 733,
    alt: 'גרף פניות לקמפיין: קו אדום יורד עד לנקודה המסומנת "לפני", ומשם קו ירוק שמטפס בחדות עד לנקודה "אחרי".',
  },
};

/** האם לשירות הזה יש תצלום, או שהוא עדיין על האיור המוטבע. */
export function hasServiceImage(slug: string): boolean {
  return slug in SERVICE_IMAGES;
}
