---
name: rtl-logical-insets-are-mirrored
description: inset-inline-start הוא ימין בדף RTL, ולכן חצי קרוסלה שנראים נכון בקוד יוצאים הפוכים
type: concept
updated: 2026-08-30
---

# `inset-inline-start` הוא **ימין** ב-RTL

חצי הקרוסלה מוקמו עם `inset-inline-end` ל"קודם" ו-`inset-inline-start`
ל"הבא". בקוד זה נקרא נכון. במסך זה יצא הפוך: החץ "קודם" הופיע
משמאל וה"בא" מימין, ושניהם הצביעו לכיוון השגוי.

**הכלל:** בדף RTL,
`inset-inline-start` = **ימין** · `inset-inline-end` = **שמאל**.

הקרוסלה מתחילה מהכרטיס הימני, ולכן:
- "קודם" יושב **מימין** (`inset-inline-start`) ומצביע ימינה
- "הבא" יושב **משמאל** (`inset-inline-end`) ומצביע שמאלה

הצ׳ברון מצויר פעם אחת ומצביע שמאלה, ולכן דווקא **"קודם"** הוא זה
שמקבל `rotate(180deg)`.

## מלכודת אחות: `scrollLeft` שלילי

בגלילה אופקית ב-RTL הדפדפן מדווח `scrollLeft` **שלילי**. כל חישוב
בקרוסלה עובר דרך `Math.abs`, וה-`scrollBy` מכפיל בסימן שנגזר מ-
`getComputedStyle(rail).direction`.

ראו גם [[rtl-physical-anchor]], אותה משפחה של באגים.
