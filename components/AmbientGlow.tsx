/* שכבת הילה קבועה מאחורי כל התוכן. בלי JS — רק markup.
   שתי קומפוזיציות נפרדות (רחב / גבוה), כמו hero-wide ו-hero-tall.
   display:none על הקומפוזיציה שלא בשימוש, כדי שלא תרוץ האנימציה
   שלה ברקע ותבזבז סוללה. */

export function AmbientGlow() {
  return (
    <>
      <div className="glow glow--wide" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="glow glow--tall" aria-hidden="true">
        <span />
        <span />
      </div>
    </>
  );
}
