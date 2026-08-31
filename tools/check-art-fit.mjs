/* ============================================================
   בדיקת התאמה של איורי הקטגוריות
   ------------------------------------------------------------
   מודד לכל <text> באיור את ה-bbox מול ה-viewBox, ומדווח על
   גלישה החוצה או חפיפה בין שני טקסטים.

   🔑 למה זה קיים: הדף dir="rtl" וה-SVG יורש את זה. תחת
   direction:rtl המשמעות של text-anchor מתהפכת, ולכן טקסט
   שנראה נכון בקוד יוצא מחוץ למסגרת בפועל. הבדיקה הזו תפסה
   שם עסק שדרס אווטאר וכתובת שנחתכה מחוץ לכרטיס — שתיהן לא
   נראו בקריאת הקוד. ראו wiki/gotchas/svg-text-anchor-rtl.

   שימוש: npm run check:art  (דורש שרת על 3000)
   ============================================================ */
import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe', headless:'new', args:['--use-angle=d3d11','--no-sandbox'] });
const p = await b.newPage();
await p.setViewport({width:1440,height:900});
await p.goto('http://localhost:3000/',{waitUntil:'networkidle0'});
await new Promise(r=>setTimeout(r,3200));

const res = await p.evaluate(()=>{
  const VW=420, VH=280, PAD=1.5;
  const out=[];
  document.querySelectorAll('.svc__slide').forEach((slide,si)=>{
    const name = slide.querySelector('.svc__name span')?.textContent || '?';
    const svg = slide.querySelector('.svc__art svg');
    if(!svg) return;
    const bad=[];
    svg.querySelectorAll('text').forEach(t=>{
      let bb; try{ bb=t.getBBox(); }catch{ return; }
      const over=[];
      if(bb.x < -PAD) over.push(`שמאל ${Math.round(bb.x)}`);
      if(bb.x+bb.width > VW+PAD) over.push(`ימין ${Math.round(bb.x+bb.width)}`);
      if(bb.y < -PAD) over.push(`מעל ${Math.round(bb.y)}`);
      if(bb.y+bb.height > VH+PAD) over.push(`מתחת ${Math.round(bb.y+bb.height)}`);
      if(over.length) bad.push(`"${t.textContent.trim().slice(0,22)}" → ${over.join(', ')}`);
    });
    // חפיפה בין טקסטים באותו איור
    const ts=[...svg.querySelectorAll('text')].map(t=>{try{return {t,bb:t.getBBox()}}catch{return null}}).filter(Boolean);
    for(let i=0;i<ts.length;i++)for(let j=i+1;j<ts.length;j++){
      const a=ts[i].bb,c=ts[j].bb;
      const ox=Math.min(a.x+a.width,c.x+c.width)-Math.max(a.x,c.x);
      const oy=Math.min(a.y+a.height,c.y+c.height)-Math.max(a.y,c.y);
      if(ox>2&&oy>2) bad.push(`חפיפה: "${ts[i].t.textContent.trim().slice(0,14)}" ↔ "${ts[j].t.textContent.trim().slice(0,14)}"`);
    }
    out.push({si:si+1,name,bad});
  });
  return out;
});
let fail=0;
for(const r of res){
  if(r.bad.length){ fail++; console.log(`  ✗ ${r.si}. ${r.name}`); r.bad.forEach(x=>console.log('      '+x)); }
  else console.log(`  ✓ ${r.si}. ${r.name}`);
}
console.log(fail? `\n${fail} איורים עם בעיה` : '\nכל האיורים נכנסים במסגרת, בלי חפיפות');
await b.close();
process.exit(fail?1:0);
