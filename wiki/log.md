---
name: log
description: יומן הפרויקט — שורה לכל החלטה, תיקון או בנייה
type: synthesis
updated: 2026-08-27
---

# יומן — ARCODEMIA

> שורה אחת לכל אירוע, לפי סכמת `fabius-archivum`. **append-only.**
> `grep` ו-`tail` מספיקים כדי לשחזר מה קרה ומתי.
>
> קידומות: `BUILD` נבנה · `DECIDE` הוחלט · `FIX` תוקן ·
> `DROP` הוסר · `NOTE` נמדד או נצפה · `LINT` תחזוקת זיכרון
>
> הפרוזה המפורטת מלפני 2026-08-27: [[log-archive-2026-07-08]]

```
2026-07-29 BUILD  נפתחה התיקייה. הוגדר: דף נחיתה לסוכנות שמוכרת דפי נחיתה לעסקים מקומיים
2026-07-30 BUILD  גרסה 1 (מותג Aristocraft) נבנתה כ-index.html יחיד, בלי תלויות
2026-07-30 DECIDE מחירים לא מוצגים ולא מתחייבים לזמן אספקה — שניהם נסגרים בשיחה → [[brief]]
2026-07-30 FIX    באג ב-refresh(): "abc".replace("", "X") מחזיר "Xabc" — כל בחירה חלקית הזריקה <b></b>
2026-07-30 BUILD  סקירת אבטחה: CSP, noopener, מלכודת _gotcha → [[security]]
2026-07-30 DROP   גרסה 1 נפסלה כ"AI גנרי". האבחנה הייתה בפלטה ולא במבנה → [[palette-single-accent]]
2026-07-30 BUILD  גרסה 2: שחור פחם + סגול ניאון + זהב, Frank Ruhl Libre, אפקט פריצה
2026-08-06 DECIDE המותג שונה ל-ARCODEMIA. פרטי קשר אמיתיים לראשונה → [[brief]]
2026-08-06 DROP   גרסה 2 נזרקה. "עיצוב חדש לגמרי" + "בלי זהב" → [[palette-single-accent]]
2026-08-06 BUILD  גרסה 3 מאפס לפי רפרנס: שחור טהור, לבן, סגול ניאון כדגש היחיד
2026-08-06 DROP   בורר השירותים הוסר. "סוג העסק" הפך לטקסט חופשי → [[architecture]]
2026-08-06 BUILD  שלושה מסמכים משפטיים כ-<dialog> נייטיבי → [[legal]]
2026-08-06 DROP   שתי גרסאות SVG נדחו — SVG לא מסוגל לשבירת אור → [[crystals-baked-not-realtime]]
2026-08-06 BUILD  קריסטלים ב-WebGL: raymarching של SDF, שלוש שבירות נפרדות → [[webgl-history]]
2026-08-06 DECIDE הלקוח: "התלת-ממד מעמיס". מעבר לתמונה אפויה → [[crystals-baked-not-realtime]]
2026-08-06 FIX    headless מרנדר מסך לבן על קנבס WebGL ואוכף רוחב מינימלי → [[headless-min-width]]
2026-08-17 NOTE   הלקוח ביקש להשתמש בקריסטלים מהצילום עצמו. נדחה — יצירה נגזרת מתמונה מוגנת
2026-08-17 BUILD  התלקחויות עדשה החליפו את ברקי החשמל. ברפרנס זה lens flare ולא ברק
2026-08-17 BUILD  מעבר ל-Next.js 16 App Router + TypeScript strict. המרה 1:1 → [[architecture]]
2026-08-17 FIX    באג ה-a11y() הכפול תוקן במעבר — הסטייה המכוונת היחידה מהמרה 1:1
2026-08-17 FIX    'unsafe-eval' דלף לייצור דרך NODE_ENV → [[csp-phase-not-node-env]]
2026-08-17 NOTE   clean() מכיל בתי בקרה גולמיים — אסור לשכתב לפי המראה → [[raw-control-bytes-in-clean]]
2026-08-17 FIX    אנימציית כניסה הסתירה תוכן → [[entrance-animation-must-not-gate-content]]
2026-08-23 BUILD  תשתית Supabase: סכמה, לקוח service-role, RLS בלי policies → [[supabase-layer]]
2026-08-23 BUILD  בחירת אמצעי קשר בטופס: mode 'email' | 'whatsapp'
2026-08-23 DECIDE הוסר דיוור חיצוני. המייל הוא mailto: אצל המבקר → [[no-external-mailer]]
2026-08-24 FIX    קומפוזיט 2D: פיקסלי הגביש הימני הודבקו במיקום השמאלי אחרי שכיול 3D נכשל
2026-08-25 BUILD  Phase 3: רשת המשבצות, blooms, עכבישים, רצף קינטי, טולטיפ הוואטסאפ
2026-08-25 DECIDE חריג תמחור מאושר: מחיר בטולטיפ אחד בלבד → [[pricing-exception]]
2026-08-25 DECIDE הוכנס --danger-red כדגש שני לכל הקשרי האובדן
2026-08-26 FIX    חלקיק השקל נחת מחוץ למסך — contain:paint → [[contain-paint-breaks-fixed]]
2026-08-26 FIX    0–1 מתוך 9 עכבישים היו על המסך — עוגן RTL → [[rtl-physical-anchor]]
2026-08-26 BUILD  ששת אמוג׳י התהליך הוחלפו ב-SVG מוטבע → [[process-icons]]
2026-08-26 DECIDE הלקוח: הכל חוזר לסגול. --danger-red נמחק → [[palette-single-accent]]
2026-08-26 BUILD  העכבישים הוחלפו בחיפושיות לפי תמונה שהלקוח שלח → [[background-creatures]]
2026-08-26 DECIDE השקלים בלבד חוזרים לאדום. נוצר --coin-red המצומצם
2026-08-26 FIX    מפל השקלים נראה זול — תנועה וסיבוב חלקו transform → [[kinetic-sequence]]
2026-08-27 DECIDE החיפושיות רק ברצועת המשבצות, מהכרטיסים ומטה → [[bugs-only-in-the-grid-band]]
2026-08-27 DROP   האיקסים בכרטיסי הכאב הוסרו. הדגש עבר לכותרת הכרטיס
2026-08-27 FIX    קריאה שגויה: הורדתי את הגביש השמאלי במקום להשלים אותו. הוחזר
2026-08-27 DECIDE a שלם · b נשאר חתוך בכוונה · c כבוי → [[crystal-visibility-rules]]
2026-08-27 NOTE   הבסיס נכשל ב-9 מדידות ניגודיות — 1.38:1 בנייד → [[accessibility]]
2026-08-27 FIX    נוסף .hero__in::before, סקרים מתחת לטקסט בלבד → [[contrast-worst-pixel]]
2026-08-27 FIX    חלקיקים fixed שרדו את החתך שלהם → [[coins-are-fixed-and-outlive-the-section]]
2026-08-27 BUILD  נוספו check:crystals, check:contrast, sync-hero-refs → [[verification]]
2026-08-27 NOTE   משקל הדף נמדד: 869KB ב-20 בקשות, פי ~4 מגרסת הקובץ היחיד → [[performance]]
2026-08-27 LINT   הזיכרון סודר לפי סכמת fabius-archivum 2.2.0: MEMORY.md הפך לאינדקס, 30 דפים נוצרו, היומן קופל לשורות, 6 טענות מיושנות תוקנו
2026-08-27 FIX    הגביש השמאלי הוחזר למיקום ולגודל המקוריים — "השלמתו" שינתה את מראהו → [[crystal-visibility-rules]]
2026-08-27 NOTE   התגלה שהתמונה אינה רנדר ישיר: השמאלי הוא הדבקה 2D של הימני → [[hero-image-is-a-2d-composite]]
2026-08-27 DROP   render-hero.sh נמחק — הוא דילג על הקומפוזיט. הוחלף ב-bake-hero.sh
2026-08-27 NOTE   כיבוי גביש אחד משנה את השניים האחרים דרך תחומי ה-raymarch
```
