#!/bin/bash
# ============================================================
# בנייה והרצה של שרת הייצור, בסדר שלא נופל.
# ------------------------------------------------------------
# ⚠️ next build נכשל עם "Build error occurred" אם שרת קודם עדיין
# מחזיק את .next. taskkill לבדו לא מספיק — התהליך משחרר את
# הנעילה רגע אחרי שהוא מת. לכן: להרוג, לחכות, למחוק .next,
# ורק אז לבנות.
# שימוש:  bash tools/_serve.sh
# ============================================================
set -e
cd "$(dirname "$0")/.."

taskkill //F //IM node.exe //T >/dev/null 2>&1 || true
# מחכים עד ש-.next באמת ניתן למחיקה
for i in $(seq 1 15); do
  if rm -rf .next 2>/dev/null; then break; fi
  sleep 1
done

npm run build 2>&1 | grep -E "Compiled|error|Error" | head -5

npm run start > /tmp/arcodemia-server.log 2>&1 &
for i in $(seq 1 60); do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ 2>/dev/null || true)
  [ "$code" = "200" ] && break
  sleep 1
done

code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ 2>/dev/null || true)
if [ "$code" != "200" ]; then
  echo "✗ השרת לא עלה. הלוג:"
  tail -20 /tmp/arcodemia-server.log
  exit 1
fi
echo "✓ localhost:3000 מוכן"
