import type { Metadata } from 'next';
import { SubpageShell } from '@/components/SubpageShell';
import { getService } from '@/lib/services';
import { Bugs } from '@/components/Bugs';
import { PainPoints } from '@/components/PainPoints';
import { Process } from '@/components/Process';
import { RiskReversal } from '@/components/RiskReversal';
import { FAQ } from '@/components/FAQ';

const SERVICE = getService('landing-pages')!;

export const metadata: Metadata = {
  title: 'דפי נחיתה ואתרים לעסקים | ARCODEMIA',
  description:
    'דף אחד שנטען מהר, נראה מצוין בנייד ומוביל לפעולה אחת: ליצור איתכם קשר.',
};

/* ============================================================
   עמוד דפי הנחיתה
   ------------------------------------------------------------
   ⚠️ **הקופי כאן לא נכתב מחדש, לפי הנחיה מפורשת.**
   אלה בדיוק אותם רכיבים שהיו בעמוד הבית לפני המעבר לפוזיציית
   סוכנות: כרטיסי הכאב, ארבעת השלבים, הסרת הסיכון והשאלות
   הנפוצות. השינוי היחיד שנגע בהם הוא הסרת ה-em dash, שהוא
   כלל גלובלי על כל הקופי באתר.

   זו גם הסיבה ש-[[Bugs]] נמצא כאן: החיפושיות והרשת שייכות
   לרצועה שעוטפת את שני החתכים האלה, ובלעדיהן הרקע היה משתנה.
   ============================================================ */
export default function Page() {
  return (
    <SubpageShell service={SERVICE}>
      <div className="techbg">
        <Bugs />
        <PainPoints />
        <Process />
      </div>
      <RiskReversal />
      <FAQ />
    </SubpageShell>
  );
}
