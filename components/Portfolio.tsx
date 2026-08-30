import { PROJECTS } from '@/lib/projects';

/* ============================================================
   תיק העבודות
   ------------------------------------------------------------
   יושב גבוה בדף בכוונה: לסוכנות, עבודה שכבר רצה באוויר היא
   ההוכחה החזקה ביותר, וחזקה בהרבה מהבטחה בטקסט.

   הכרטיס כולו הוא קישור לאתר החי, נפתח בלשונית חדשה.
   ⚠️ target="_blank" מחייב rel="noopener noreferrer" — בלעדיו
   הדף שנפתח מקבל גישה ל-window.opener.

   התמונה היא צילום אמיתי של האתר, לא מוקאפ. נוצרת עם
   tools/shoot-project.cjs ונשמרת עם hash בשם.
   ============================================================ */
export function Portfolio() {
  return (
    <section id="work" className="work">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">עבודות</span>
          <h2>
            לא נספר לכם כמה אנחנו טובים.
            <br />
            <em>תראו בעצמכם.</em>
          </h2>
          <p>לחיצה על הפרויקט פותחת את האתר החי.</p>
        </div>

        <div className="work__grid">
          {PROJECTS.map((p) => (
            <a
              className="work__card rv"
              key={p.slug}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="work__shot">
                {/* אותו שיקול כמו ב-Hero: הקובץ כבר WebP בדיוק במידות
                    הנדרשות ועם hash בשם, ולכן next/image רק היה מקודד
                    אותו מחדש בלי שום רווח. הוא גם lazy ומתחת לקיפול,
                    כלומר לא מועמד ל-LCP. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={`צילום מסך של האתר ${p.name}`}
                  width={p.width}
                  height={p.height}
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <span className="work__meta">
                <span className="work__name">
                  <bdi>{p.name}</bdi>
                </span>
                <span className="work__what">{p.what}</span>
                <span className="work__live">
                  לצפייה באתר
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
                  </svg>
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
