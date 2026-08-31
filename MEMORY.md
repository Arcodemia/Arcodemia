# ARCODEMIA — זיכרון הפרויקט

> **קרא את זה ראשון, בתחילת כל סשן.** זהו האינדקס, לא התוכן — הוא נשאר
> קצר בכוונה. פותחים דף רק כשצריך אותו.
> מרקדאון רגיל; אפשר לפתוח את `wiki/` כ-vault ב-Obsidian.

- **חי:** https://arcodemia.vercel.app ⚠️ *טרם נפרס — ראו פתוחים*
- **סטאק:** Next.js 16 · App Router · TypeScript strict · React 19 · עברית RTL
- **מה זה:** סוכנות דיגיטל עם חמישה שירותים. **הופנה מחדש ב-30.8**
  מדף מכירה לדף נחיתה אחד. ראו [[agency-repositioning]]
- **מטרה עכשיו:** פריסה ל-Vercel. הטופס פותח וואטסאפ או `mailto:` אצל המבקר,
  והפנייה נרשמת ב-Supabase.

## כללים שנשברו ואסור לשבור שוב

1. 🔴 **שני הגבישים חתוכים בשוליים בכוונה.** בקשת לקוח מפורשת, פעמיים.
   אל "תתקן" — כל ניסיון להשלים אותם שינה את המראה.
   → [[crystal-visibility-rules]]
   🔴 **ותמונת ה-hero אינה רנדר ישיר** — רק `bash tools/bake-hero.sh`.
   → [[hero-image-is-a-2d-composite]]
2. 🔴 **`.hero__in::before` הוא מה שמחזיק את הטקסט קריא.** בלעדיו הכותרת
   יורדת ל-1.38:1 בנייד. → [[accessibility]]
3. 🔴 **אדום מותר במקום אחד בלבד: חלקיקי השקל.** → [[palette-single-accent]]
4. 🔴 **אין em dash בקופי.** בהערות קוד מותר. → [[no-em-dash-in-copy]]
5. 🔴 **המשפט הפותח ב-hero לא נגעים בו**, וקופי דפי הנחיתה
   ב-`/services/landing-pages` נשאר כמות שהוא. → [[agency-repositioning]]

## אינדקס

### הבסיס
- [ארכיטקטורה](wiki/architecture.md) — מבנה, סטאק, פקודות *(entity, 2026-08-30)*
- [קטלוג השירותים](wiki/services-catalog.md) — חמש הקטגוריות ועמודי המשנה *(entity, 2026-08-30)*
- [הבריף](wiki/brief.md) — מותג, קהל, מה מוכרים ומה לא מציגים *(entity, 2026-08-06)*
- [יומן](wiki/log.md) — שורה לכל החלטה ותיקון *(synthesis, 2026-08-27)*

### עיצוב וחזות
- [הקריסטלים](wiki/hero-crystals.md) — צינור הייצור ושמות ה-hash *(entity, 2026-08-27)*
- [חיפושיות הרקע](wiki/background-creatures.md) — תשע, ברצועת המשבצות *(entity, 2026-08-27)*
- [הרצף הקינטי](wiki/kinetic-sequence.md) — מפל תשעת השקלים *(entity, 2026-08-27)*
- [אייקוני התהליך](wiki/process-icons.md) — SVG ולא אמוג׳י, ולמה *(entity, 2026-08-26)*
- [היסטוריית WebGL](wiki/webgl-history.md) — ידע מגרסה שהוסרה *(synthesis, 2026-08-06)*

### תשתית
- [אבטחה](wiki/security.md) — CSP בכותרות, אפס innerHTML *(entity, 2026-08-17)*
- [שכבת Supabase](wiki/supabase-layer.md) — מעקב שלעולם לא חוסם *(entity, 2026-08-23)*
- [נגישות](wiki/accessibility.md) — חוזה הניגודיות *(entity, 2026-08-27)*
- [ביצועים](wiki/performance.md) — 869KB, פי ~4 מהגרסה הישנה *(entity, 2026-08-27)*
- [משפטי](wiki/legal.md) — שלושה מסמכים בלי מציני מקום *(entity, 2026-08-06)*
- [תשתית בדיקה](wiki/verification.md) — הכלים שמחליפים ניחוש *(entity, 2026-08-27)*

### החלטות — ה"למה" שהקוד לא מתעד
- [פלטה: דגש אחד](wiki/decisions/palette-single-accent.md) — וחריג השקלים *(2026-08-26)*
- [חריג התמחור](wiki/decisions/pricing-exception.md) — מחיר במקום אחד *(2026-08-25)*
- [קריסטלים אפויים](wiki/decisions/crystals-baked-not-realtime.md) — לא WebGL, לא SVG *(2026-08-17)*
- [כללי הגבישים](wiki/decisions/crystal-visibility-rules.md) — a ו-b חתוכים בכוונה · c כבוי *(2026-08-27)*
- [בלי דיוור חיצוני](wiki/decisions/no-external-mailer.md) — mailto אצל המבקר *(2026-08-23)*
- [חיפושיות ברצועה](wiki/decisions/bugs-only-in-the-grid-band.md) — מהכרטיסים ומטה *(2026-08-27)*
- [מיצוב מחדש כסוכנות](wiki/decisions/agency-repositioning.md) — מה זז לאן *(2026-08-30)*
- [גוגל: לפני/אחרי](wiki/decisions/gbp-before-after.md) — להראות במקום להסביר *(2026-08-30)*

### מלכודות — כל אחת עלתה שעה
- [contain:paint שובר fixed](wiki/gotchas/contain-paint-breaks-fixed.md) *(2026-08-26)*
- [עוגן פיזי ב-RTL](wiki/gotchas/rtl-physical-anchor.md) *(2026-08-26)*
- [cover הוא חיתוך שני](wiki/gotchas/object-fit-cover-second-crop.md) *(2026-08-27)*
- [ניגודיות: הפיקסל הגרוע](wiki/gotchas/contrast-worst-pixel.md) *(2026-08-27)*
- [תמונת ה-hero היא קומפוזיט](wiki/gotchas/hero-image-is-a-2d-composite.md) *(2026-08-27)*
- [שלישיית הפטיש](wiki/gotchas/hammer-trio.md) *(2026-08-26)*
- [אנימציה לא מגלה תוכן](wiki/gotchas/entrance-animation-must-not-gate-content.md) *(2026-08-17)*
- [בתי בקרה ב-clean()](wiki/gotchas/raw-control-bytes-in-clean.md) *(2026-08-17)*
- [CSP לפי phase](wiki/gotchas/csp-phase-not-node-env.md) *(2026-08-17)*
- [חלקיקים fixed שורדים](wiki/gotchas/coins-are-fixed-and-outlive-the-section.md) *(2026-08-27)*
- [.next נעול](wiki/gotchas/next-build-lock.md) *(2026-08-27)*
- [headless משקר על רוחב](wiki/gotchas/headless-min-width.md) *(2026-08-06)*
- [בלי em dash בקופי](wiki/gotchas/no-em-dash-in-copy.md) *(2026-08-30)*
- [insets לוגיים הפוכים ב-RTL](wiki/gotchas/rtl-logical-insets-are-mirrored.md) *(2026-08-30)*
- [ביקורות לדוגמה וגילוי](wiki/gotchas/sample-reviews-disclosure.md) *(2026-08-30)*
- [text-anchor מתהפך ב-RTL](wiki/gotchas/svg-text-anchor-flips-in-rtl.md) *(2026-08-30)*

## פתוחים

- [ ] 🔴 **תצלום מוצר אמיתי של כרטיס ה-NFC.** כרגע איור זמני
      ב-`ServiceArt.tsx` (`NfcArt`), מסומן בקוד ובדף.
- [ ] **ביקורות אמיתיות** במקום הדוגמאות → [[sample-reviews-disclosure]]
- [ ] פרויקטים נוספים לתיק העבודות. `node tools/shoot-project.cjs <url> <slug>`

- [ ] 🔴 **הלקוח: להריץ `npx vercel --prod`.** ראו [DEPLOY.md](DEPLOY.md).
      עד אז ה-URL למעלה אינו חי.
- [ ] 🔴 **לפתוח עוסק פטור לפני התשלום הראשון.** האתר עצמו חוקי —
      הוא לא גובה תשלום ואין בו סליקה → [[legal]]
- [ ] 🔴 **עורך דין שיעבור על שלושת המסמכים.**
- [ ] **משקל הדף: 869KB ב-20 בקשות** מול 194KB בגרסת הקובץ היחיד.
      שני chunks של 224KB ו-175KB. שווה בדיקה → [[performance]]
- [ ] לאשר את נוסח הסרת הסיכון ("לא אהבתם? נפרדים כידידים")
- [ ] לוגו אמיתי (כרגע משולש SVG עם קו סגול)
- [ ] דומיין משלו — ואז לעדכן את שורת ה-Sitemap ב-`robots.txt`
- [ ] לצלם את הדף במכשיר אמיתי → [[headless-min-width]]
- [ ] לא נבנה: דשבורד ניהול · תצוגת portfolio ציבורית → [[supabase-layer]]

## מסמכים נוספים

- [DEPLOY.md](DEPLOY.md) — ההוראות ללקוח, שלב אחר שלב
- [PROJECT_BRAIN.md](PROJECT_BRAIN.md) · [TECHNICAL-SUMMARY.md](TECHNICAL-SUMMARY.md)
  — מסמכים ארוכים מתקופת ה-`index.html`. ⚠️ **חלקם מיושן** — הסמכות היא
  ה-`wiki/`.
