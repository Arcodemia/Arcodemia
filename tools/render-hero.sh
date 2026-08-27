#!/bin/bash
# ============================================================
# רנדר תמונת hero אחת והתקנתה עם hash חדש
# ------------------------------------------------------------
#   bash tools/render-hero.sh wide 1800 1120
#   bash tools/render-hero.sh tall  900 1150
# הסקריפט מוחק את הגרסה הישנה של אותה תמונה, שומר את החדשה
# עם hash של הבתים, ונופל אם הרנדר החזיר פריים שחור.
# אחרי זה חובה:  node tools/sync-hero-refs.cjs
# ============================================================
set -e
N=$1; W=$2; H=$3
SP="C:/Users/hezie/AppData/Local/Temp/claude/c--Users-hezie-OneDrive-Desktop-Projects-Personal-site-1/bdb04827-c2c6-43c7-b718-322bc8ee3399/scratchpad"
node tools/render-crystals.cjs "$W" "$H" 450 >/dev/null
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --use-angle=d3d11 \
  --disable-gpu-sandbox --virtual-time-budget=150000 --dump-dom \
  "file:///c:/Users/hezie/OneDrive/Desktop/Projects/Personal/site-1/tools/_render.html" > "$SP/$N.txt" 2>/dev/null
node -e "
const fs=require('fs'),crypto=require('crypto');
const [SP,N]=process.argv.slice(1);
const m=fs.readFileSync(SP+'/'+N+'.txt','utf8').match(/data:image\/(webp|png);base64,([A-Za-z0-9+/=]+)/);
if(!m){console.error(N+': NO DATA URI — render failed');process.exit(1);}
const b=Buffer.from(m[2],'base64');
if(b.length<8000){console.error(N+': suspiciously small ('+b.length+') — probably a black frame');process.exit(1);}
const h=crypto.createHash('md5').update(b).digest('hex').slice(0,6);
for(const f of fs.readdirSync('public/img')) if(f.startsWith('hero-'+N+'.')) fs.unlinkSync('public/img/'+f);
fs.writeFileSync('public/img/hero-'+N+'.'+h+'.webp',b);
fs.writeFileSync(SP+'/preview-'+N+'.webp',b);
console.log(N+' -> hero-'+N+'.'+h+'.webp  '+b.length+' bytes');
" "$SP" "$N"
