---
name: contain-paint-breaks-fixed
description: content-visibility:auto גורר contain:paint, ואב כזה הופך לבלוק המכיל של צאצאי position:fixed
type: concept
updated: 2026-08-26
---

# `contain:paint` שובר `position:fixed`

`#why` נושא `content-visibility:auto` — אופטימיזציית ציור. היא גוררת
`contain:paint`, **ואב עם `contain:paint` הופך לבלוק המכיל של כל צאצא
`position:fixed` שלו.**

התוצאה: חלקיק השקל ב-[[kinetic-sequence]], שאמור ליפול לתחתית **החלון**,
מוקם ביחס לחתך ונחת 87px מתחת לקצה המסך.

**הפתרון:** `createPortal` אל `document.body`. כל `position:fixed` בתוך
חתך עם `content-visibility` חייב portal.

## איך זה נתפס — ולמה זה לקח זמן

לא בעין ולא במספרים. `getBoundingClientRect()` החזיר ערכים שנראו מוסברים
היטב על ידי ה-`rotate(-42deg)` הסופי, ובניתי על זה הסבר שלם שלפיו "זו
בעיה חזותית בלבד". רק **צילום מסך** הראה שהחלקיק פשוט לא שם.

**הכלל:** על מיקום — לצלם, לא להסתמך על rect. ראו [[verification]].

`content-visibility` הוא לא רק אופטימיזציית ציור. הוא משנה מיקום של צאצאים.
