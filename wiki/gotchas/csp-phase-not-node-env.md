---
name: csp-phase-not-node-env
description: 'unsafe-eval' נדרש ל-React בפיתוח בלבד, וההבחנה חייבת להיות לפי phase ולא לפי NODE_ENV
type: concept
updated: 2026-08-17
---

# CSP: `phase` ולא `NODE_ENV`

`'unsafe-eval'` נדרש ל-React **בפיתוח בלבד**. ההבחנה ב-`next.config.mjs`
חייבת להיות לפי `phase === PHASE_DEVELOPMENT_SERVER`.

עם `process.env.NODE_ENV` זה **דלף לייצור** — הערך לא אמין בהקשר של
`next.config`.

⚠️ **לבדוק עם `curl -sI` ולא בעין.** הכותרת נראית נכון בקוד ושגויה
בתגובה.

ראו [[security]].
