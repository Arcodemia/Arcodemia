/* ============================================================
   lint לזיכרון הפרויקט — פעולת LINT של fabius-archivum
   ------------------------------------------------------------
   בודק את מה שנשבר בשקט כשמוסיפים דפים:
     • frontmatter קיים ותקין (name / description / type / updated)
     • name תואם לשם הקובץ — הקישורים [[slug]] מסתמכים על זה
     • תאריכים אבסולוטיים בלבד
     • [[wikilinks]] שמצביעים לדף שלא קיים
     • קישורי מרקדאון ב-MEMORY.md שמצביעים לקובץ שלא קיים
     • דפים יתומים — קיימים ואף אחד לא מקשר אליהם

   שימוש:  node tools/lint-memory.cjs   (או npm run lint:memory)
   יוצא עם קוד 1 אם נמצאה בעיה, כדי שאפשר יהיה לשרשר אותו.
   ============================================================ */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const WIKI = path.join(ROOT, 'wiki');
const CR = String.fromCharCode(13);

const problems = [];
const note = (kind, msg) => problems.push(`${kind.padEnd(9)} ${msg}`);

/* ---------- איסוף כל הדפים ---------- */
const pages = new Map(); // slug -> {file, rel, body, fm}
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.md')) {
      const rel = path.relative(ROOT, p).split(path.sep).join('/');
      const raw = fs.readFileSync(p, 'utf8').split(CR).join('');
      const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      if (!m) { note('FRONTMAT', `${rel} — אין frontmatter`); continue; }
      const fm = {};
      for (const line of m[1].split('\n')) {
        const kv = line.match(/^(\w+):\s*(.*)$/);
        if (kv) fm[kv[1]] = kv[2].trim();
      }
      const slug = path.basename(e.name, '.md');
      pages.set(slug, { rel, body: m[2], fm });
    }
  }
}
if (!fs.existsSync(WIKI)) { console.error('אין תיקיית wiki/'); process.exit(1); }
walk(WIKI);

/* ---------- בדיקת frontmatter ---------- */
for (const [slug, p] of pages) {
  for (const key of ['name', 'description', 'type', 'updated']) {
    if (!p.fm[key]) note('FRONTMAT', `${p.rel} — חסר \`${key}\``);
  }
  if (p.fm.name && p.fm.name !== slug) {
    note('SLUG', `${p.rel} — name="${p.fm.name}" אבל הקובץ הוא "${slug}"`);
  }
  if (p.fm.updated && !/^\d{4}-\d{2}-\d{2}$/.test(p.fm.updated)) {
    note('DATE', `${p.rel} — updated="${p.fm.updated}" אינו תאריך אבסולוטי`);
  }
  if (p.fm.type && !['entity', 'concept', 'comparison', 'synthesis'].includes(p.fm.type)) {
    note('TYPE', `${p.rel} — type="${p.fm.type}" אינו מהסכמה`);
  }
  if (p.fm.description && p.fm.description.length > 130) {
    note('DESC', `${p.rel} — description באורך ${p.fm.description.length}; האינדקס מציג אותו, כדאי לקצר`);
  }
}

/* ---------- wikilinks ---------- */
const linkedTo = new Set();
const scanLinks = (text, from) => {
  for (const m of text.matchAll(/\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g)) {
    const target = m[1].trim();
    linkedTo.add(target);
    if (!pages.has(target) && target !== 'MEMORY') {
      note('DANGLING', `${from} → [[${target}]] — אין דף כזה`);
    }
  }
};
for (const [, p] of pages) scanLinks(p.body, p.rel);

const memRaw = fs.readFileSync(path.join(ROOT, 'MEMORY.md'), 'utf8').split(CR).join('');
scanLinks(memRaw, 'MEMORY.md');

/* ---------- קישורי מרקדאון ב-MEMORY.md ---------- */
for (const m of memRaw.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
  const target = m[1];
  if (/^https?:/.test(target)) continue;
  const abs = path.join(ROOT, target);
  if (!fs.existsSync(abs)) note('BROKEN', `MEMORY.md → ${target} — הקובץ לא קיים`);
  else if (target.startsWith('wiki/')) linkedTo.add(path.basename(target, '.md'));
}

/* ---------- יתומים ---------- */
for (const [slug, p] of pages) {
  if (!linkedTo.has(slug)) note('ORPHAN', `${p.rel} — אף אחד לא מקשר אליו`);
}

/* ---------- דוח ---------- */
console.log(`נסרקו ${pages.size} דפים תחת wiki/`);
const byType = {};
for (const [, p] of pages) byType[p.fm.type] = (byType[p.fm.type] || 0) + 1;
console.log('  ' + Object.entries(byType).map(([k, v]) => `${k}: ${v}`).join(' · '));
console.log('');
if (!problems.length) {
  console.log('✓ הזיכרון נקי — אין קישורים שבורים, יתומים או frontmatter חסר');
  process.exit(0);
}
console.log(`✗ ${problems.length} בעיות:\n`);
for (const p of problems) console.log('  ' + p);
process.exit(1);
