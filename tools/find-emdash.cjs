/* ============================================================
   איתור em dash בטקסט שהמשתמש רואה
   ------------------------------------------------------------
   כלל גלובלי מהבריף: אין em dash בקופי. הוא נקרא כמו טקסט
   שנכתב במחולל. הכלי מפריד בין קופי להערות קוד — בהערות הוא
   מותר ואפילו רצוי, שם הוא לא נקרא על ידי אף מבקר.

   שימוש:  node tools/find-emdash.cjs
   יוצא עם 1 אם נמצא em dash בקופי.
   ============================================================ */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKIP = new Set(['node_modules', '.next', '.git', 'wiki', 'tools', 'public']);
const CR = String.fromCharCode(13);
const EM = '—';

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(tsx|ts)$/.test(e.name)) files.push(p);
  }
})(ROOT);

let total = 0;
for (const f of files) {
  const lines = fs.readFileSync(f, 'utf8').split(CR).join('').split('\n');
  let inBlock = false;
  const hits = [];
  lines.forEach((line, i) => {
    const t = line.trim();
    const opens = t.startsWith('/*') || t.startsWith('{/*');
    const wasInBlock = inBlock;
    if (opens) inBlock = true;
    const isComment = wasInBlock || opens || t.startsWith('*') || t.startsWith('//');
    if (t.includes('*/')) inBlock = false;
    if (!isComment && line.includes(EM)) hits.push(`${i + 1}: ${t.slice(0, 88)}`);
  });
  if (hits.length) {
    console.log(path.relative(ROOT, f).split(path.sep).join('/'));
    for (const h of hits) console.log('   ' + h);
    total += hits.length;
  }
}

console.log('');
if (!total) {
  console.log('✓ אין em dash בקופי');
  process.exit(0);
}
console.log(`✗ ${total} שורות קופי עם em dash`);
process.exit(1);
