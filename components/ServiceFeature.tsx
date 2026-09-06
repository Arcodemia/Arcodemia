import type { ReactNode } from 'react';
import { ServiceVisual } from './ServiceVisual';

/* ============================================================
   פתיח מורחב לעמוד שירות
   ------------------------------------------------------------
   הבלוק הזה חי קודם בעמוד הבית (Highlights.tsx) כשלושה חתכים
   מתחת לקרוסלה. הלקוח ביקש שלא יהיה פירוט על השירותים בעמוד
   הבית, ושכל הפירוט יעבור לעמודי המשנה — ולכן הפריסה עברה
   לכאן, לראש גוף עמוד השירות.

   ⚠️ **בלי רשימת נקודות.** עמודי המשנה כבר מפרטים את אותם
   סעיפים ב-.sub__cards, ובהרחבה. מה שעבר לכאן הוא רק מה
   שהיה **ייחודי** לעמוד הבית: הכותרת החדה, המשפט הפותח,
   ומשפט הסיום. שכפול של הרשימה היה נותן את אותו תוכן פעמיים
   באותו עמוד.

   ⚠️ **העמודים שמשתמשים בזה מעבירים `heroArt={false}`.**
   SubpageShell מציג את תמונת השירות בראש העמוד, והבלוק הזה
   מציג אותה שוב. שתי הופעות באותו מסך נקראו כטעות.
   ============================================================ */

export function ServiceFeature({
  slug,
  eyebrow,
  title,
  emphasis,
  lead,
  closing,
  flip = false,
}: {
  slug: string;
  eyebrow: string;
  /** השורה הראשונה של הכותרת */
  title: string;
  /** השורה השנייה, המודגשת */
  emphasis: string;
  lead: string;
  closing: ReactNode;
  /** הופך את צדי הפריסה, כדי שלא כל עמוד ייראה זהה */
  flip?: boolean;
}) {
  return (
    <section className={`feat${flip ? ' feat--flip' : ''}`}>
      <div className="wrap feat__in">
        <ServiceVisual slug={slug} className="feat__art rv" eager />
        <div className="feat__text rv">
          <span className="eyebrow">{eyebrow}</span>
          <h2>
            {title}
            <br />
            <em>{emphasis}</em>
          </h2>
          <p className="lead">{lead}</p>
          <p className="feat__more">{closing}</p>
        </div>
      </div>
    </section>
  );
}
