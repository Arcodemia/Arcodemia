---
name: background-creatures
description: החיפושיות ברקע: תשע, ממבט על, בתוך רצועת המשבצות בלבד
type: entity
updated: 2026-08-27
---

# חיפושיות הרקע

`components/Bugs.tsx`. ההחלטה על המיקום: [[bugs-only-in-the-grid-band]].

תשע, ממבט על, עם ספירלה על הגב, בסגול (`--neon-hi`). SVG מוטבע — אפס
בקשות רשת, אפס משקל נוסף. דקורטיביות לחלוטין: `aria-hidden`,
`pointer-events:none`, `z-index` מתחת לכל טקסט וכרטיס.

## הכללים שמחזיקים אותן

🔑 **`left:0` פיזי.** ראו [[rtl-physical-anchor]] — זו מלכודת שכבר עלתה
פעם ביוקר.

🔑 **הרגליים בשתי קבוצות בפאזה הפוכה** (`bug__legs--r` / `--l`). קבוצה
אחת שמסתובבת יחד נראית כרעידה, לא כזחילה. `transform-box:fill-box`
נדרש כדי ש-`transform-origin` יימדד ביחס לקבוצה ולא ל-SVG.

🔑 **מי שהולכת שמאלה מקבלת `scaleX(-1)` על הגוף וגם
`animation-direction:reverse`.** אחד בלי השני = צועדת אחורנית.

לכל אחת `animation-delay` ומהירות רגליים משלה — אחרת הן צועדות במקהלה
וזה מסגיר לולאה אחת שהועתקה.

⚠️ **`prefers-reduced-motion`:** קופאות פרושות לרוחב, לא נעלמות.
