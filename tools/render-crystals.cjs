/* ============================================================
   מחולל תמונות הקריסטלים
   ------------------------------------------------------------
   מייצר את img/hero-wide.webp ו-img/hero-tall.webp.
   הרנדר נעשה פעם אחת ונאפה לתמונה, כך שעלות הריצה בדף היא אפס.

   שימוש:
     node tools/render-crystals.cjs 1800 1120 450          # סצנה מלאה (webp)
     node tools/render-crystals.cjs 1800 1120 450 noA      # בלי הגביש השמאלי (png)
     node tools/render-crystals.cjs 1800 1120 450 onlyB 800  # הימני + עמודות ימינה בלי לחתוך את הגוף
     node tools/render-crystals.cjs 1800 1120 450 onlyA    # רק השמאלי על שחור (png)
   argv[5] wide|tall נשמרים ככינוי ל-full, כדי לא לשבור פקודות ישנות.
   ואז:
     chrome --headless=new --use-angle=d3d11 --virtual-time-budget=90000 \
            --dump-dom tools/_render.html > out.txt

   ⚠️ --use-angle=d3d11 נותן GPU אמיתי. בלעדיו רץ SwiftShader
      והרנדר לוקח פי כמה.
   ⚠️ הרנדר מפוצל לטיילים. שיידר שרץ יותר מ-2 שניות ברצף
      מפעיל TDR reset של הדרייבר וההקשר נופל.
   ============================================================ */
const fs   = require('fs');
const path = require('path');

const W    = Number(process.argv[2] || 1800);
const H    = Number(process.argv[3] || 1120);
const TILE = Number(process.argv[4] || 450);
/* full (ברירת מחדל) = הסצנה הרגילה. שכבות לקומפוזיט 2D בלבד:
   noA = בלי הגביש השמאלי, onlyB = רק הימני, onlyA = רק השמאלי. */
/* ⚠️ full היא הסצנה שנשלחת לדף, ובה c=0 בכוונה.
   c הוא הגביש הקטן בפינה הימנית-התחתונה. הוא לא נכנס למסגרת —
   מרכזו יושב מתחת לקצה — ולכן הוא נראה כמו "גביש שמתחיל
   להיווצר" כשגוללים מעט למטה. הלקוח ביקש להוריד אותו (27.8).
   noA היא שכבת הבסיס של הקומפוזיט הדו-ממדי — גם בה c=0,
   אחרת הגביש הקטן היה חוזר דרך הדלת האחורית. */
const LAYERS = {
  full:  { a: 1, b: 1, c: 0 },
  noA:   { a: 0, b: 1, c: 0 },
  onlyB: { a: 0, b: 1, c: 0 },
  onlyA: { a: 1, b: 0, c: 0 },
};
const LAYER_ARG = process.argv[5] || 'full';
const LAYER = LAYER_ARG === 'wide' || LAYER_ARG === 'tall' ? 'full' : LAYER_ARG;
if (!LAYERS[LAYER]) {
  throw new Error('unknown layer "' + LAYER_ARG + '" (full|noA|onlyB|onlyA)');
}
const SHOW = LAYERS[LAYER];
const ARG6 = process.argv[6];
const EXTRA_RIGHT = Number(ARG6) > 0 ? Number(ARG6) : 0;
const OUT_PNG = LAYER !== 'full' || ARG6 === 'png';
/* uFull נשאר בגודל ה-hero המקורי — עמודות נוספות ממשיכות את אותה
   מצלמה ימינה בלי למרכז מחדש. בלי זה onlyB נחתך בקצה הקנבס, והחיתוך
   הופך לקו אנכי חד אחרי ההדבקה בתוך הפריים. */
const VIEW_W = W;
const CANVAS_W = W + EXTRA_RIGHT;

const VERT = `attribute vec2 aP; void main(){ gl_Position = vec4(aP,0.,1.); }`;

const FRAG = `
precision highp float;
uniform vec2  uFull;
uniform vec2  uOff;
uniform float uTime;
/* דגלים לרנדר שכבות מבודדות. ברירת המחדל (full) לא משתנה.
   למה זה קיים: התאמת פרמטרי 3D בין pA ל-pB לא יכולה להגיע לזהות
   פיקסלים — דגימת ה-env-map תלויה בזווית הראייה. קומפוזיט 2D
   אחרי הרנדר מעתיק את פיקסלי pB למיקום pA; הדגלים האלה מייצרים
   את שלוש השכבות לכלי tools/composite-left-from-right.cjs. */
const float SHOW_A=${SHOW.a}.0;
const float SHOW_B=${SHOW.b}.0;
const float SHOW_C=${SHOW.c}.0;

mat3 rotY(float a){ float s=sin(a),c=cos(a); return mat3(c,0.,s, 0.,1.,0., -s,0.,c); }
mat3 rotZ(float a){ float s=sin(a),c=cos(a); return mat3(c,-s,0., s,c,0., 0.,0.,1.); }

float hash(vec3 p){ return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453); }
float noise(vec3 p){
  vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(mix(hash(i+vec3(0,0,0)),hash(i+vec3(1,0,0)),f.x),
                 mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),
                 mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
}

/* ---------- גיאומטריה: פריזמה משושה עם שני קודקודים ---------- */
float sdHex(vec3 p, vec2 h){
  const vec3 k=vec3(-0.8660254,0.5,0.57735);
  p=abs(p); p.xy-=2.0*min(dot(k.xy,p.xy),0.0)*k.xy;
  vec2 d=vec2(length(p.xy-vec2(clamp(p.x,-k.z*h.x,k.z*h.x),h.x))*sign(p.y-h.x), p.z-h.y);
  return min(max(d.x,d.y),0.0)+length(max(d,0.0));
}
float sdCrystal(vec3 p, float h, float r){
  float d=sdHex(p,vec2(r,h));
  float t=-1000.0;
  for(int i=0;i<3;i++){
    float a=1.0471976*float(i);
    vec2 n=vec2(cos(a),sin(a));
    t=max(t, abs(dot(p.xy,n))*0.78 + abs(p.z) - h - r*0.95);
  }
  return max(d,t);
}

/* המיקום האופקי נגזר מיחס התמונה — אותו שיידר משרת רחב ולאורך */
float ax(){ float a=uFull.x/uFull.y; return max(2.85, a*2.86); }

/* ============================================================
   הגביש השמאלי (a) — חזר למיקום ולגודל המקוריים
   ------------------------------------------------------------
   ⚠️ אל תיגע בזה בלי בקשה מפורשת.

   היסטוריה, כדי שלא ננסה שוב: ב-27.8 הלקוח ביקש "להשלים" אותו
   כי הקצה המחודד שלו נחתך בשוליים. הפתרון שנבנה גזר את המיקום
   מההיטל והכניס אותו במלואו — אבל כדי לעשות את זה הוא **הקטין
   אותו ל-70% והזיז אותו פנימה**, וזה שינה את המראה שלו.
   הלקוח ראה את התוצאה ואמר "הקריסטל היה שונה, תחזיר אותו".

   המסקנה: **המראה חשוב יותר מהשלמות.** גביש שנכנס מהשוליים
   וחתוך שם הוא חלק מהקומפוזיציה, לא באג. אותו דין כמו b.

   מה שנשאר מהאפיזודה הזו הוא הידע ב-gotchas/object-fit-cover-
   second-crop — שהדפדפן מוסיף חיתוך משלו — ו-.hero__in::before,
   הסקרים שמחזיק את הטקסט קריא מעל הגביש. **את הסקרים כן להשאיר:**
   בלעדיו הכותרת יורדת ל-1.38:1 בנייד, וזה היה נכון גם לפני
   השינוי.
   ============================================================ */
vec3 pA(){ return vec3(-ax()*1.00,  0.75,  0.40); }

/* ⚠️ b נשאר בדיוק כפי שהיה — הלקוח ביקש במפורש לא לגעת בו.
   הוא נחתך בקצה הימני, וזו החלטה שלו. */
vec3 pB(){ return vec3( ax()*1.05, -0.95, -0.60); }
vec3 pC(){ return vec3( ax()*0.66,  2.30, -3.10); }

mat3 mA(){ return rotZ(-0.60)*rotY( 1.30)*rotZ(0.28); } /* 0.55 pointed the end-cap at the key softbox and blew the face out */
mat3 mB(){ return rotZ( 0.46)*rotY(-1.22)*rotZ(0.72); }
mat3 mC(){ return rotZ(-1.15)*rotY( 0.95)*rotZ(2.05); }

float map(vec3 p){
  float a=SHOW_A>0.5 ? sdCrystal((p-pA())*mA(), 2.10, 0.86) : 1e5;
  float b=SHOW_B>0.5 ? sdCrystal((p-pB())*mB(), 1.85, 0.75) : 1e5;
  float c=SHOW_C>0.5 ? sdCrystal((p-pC())*mC(), 0.78, 0.30) : 1e5;
  return min(min(a,b),c);
}
vec3 nrm(vec3 p){
  vec2 e=vec2(0.0009,0.0);
  return normalize(vec3(map(p+e.xyy)-map(p-e.xyy),
                        map(p+e.yxy)-map(p-e.yxy),
                        map(p+e.yyx)-map(p-e.yyx)));
}

/* ============================================================
   תאורה — סופטבוקסים מלבניים של סטודיו
   ------------------------------------------------------------
   זה ההבדל בין זכוכית מלוטשת לפלסטיק. פאה שטוחה שמשקפת מלבן
   נותנת כתם בהיר עם גבול חד, ובגבול הזה הפיזור מפריד את הצבעים.
   מקורות נקודתיים נותנים כתמים רכים ומרוחים — מראה זול.

   ⚠️ אור מלבני מכסה זווית מרחבית גדולה בהרבה ממקור נקודתי.
      עוצמות של מקור נקודתי ישרפו את התמונה ללבן.
   ⚠️ הסופטבוקסים קטנים והאמביינט כמעט אפס בכוונה: קרן שבורה
      שלא פוגעת באור מחזירה שחור, ולכן רואים דרך הגביש.
      אמביינט גבוה הופך אותו לחלבי ואטום.
   ============================================================ */
float rectLight(vec3 d, vec3 fwd, vec3 upv, float w, float h, float soft){
  float z=dot(d,fwd);
  if(z<=0.002) return 0.0;
  vec3 r=normalize(cross(upv,fwd));
  vec3 u=cross(fwd,r);
  vec2 q=vec2(dot(d,r),dot(d,u))/z;
  vec2 a=1.0-smoothstep(vec2(w,h)*(1.0-soft), vec2(w,h), abs(q));
  return a.x*a.y;
}

vec3 env(vec3 d){
  vec3 c=vec3(0.0004,0.0004,0.0011);
  c += mix(vec3(0.0010,0.0010,0.0026), vec3(0.0065,0.0055,0.0130), smoothstep(-1.0,1.0,d.y));

  c += vec3(1.00,1.00,1.00)*rectLight(d,normalize(vec3(-0.42, 0.78, 0.42)), vec3(0,0,1), 0.360,0.098,0.14)*30.0;
  c += vec3(0.95,0.97,1.00)*rectLight(d,normalize(vec3( 0.58, 0.42,-0.68)), vec3(0,1,0), 0.175,0.410,0.18)*24.0;
  c += vec3(1.00,0.96,0.90)*rectLight(d,normalize(vec3( 0.08,-0.86, 0.28)), vec3(1,0,0), 0.360,0.130,0.20)*17.0;
  c += vec3(0.82,0.90,1.00)*rectLight(d,normalize(vec3(-0.78,-0.18,-0.58)), vec3(0,1,0), 0.110,0.240,0.22)*15.0;
  c += vec3(1.00,1.00,1.00)*rectLight(d,normalize(vec3( 0.30, 0.10, 0.92)), vec3(0,1,0), 0.065,0.065,0.28)*26.0;
  c += vec3(0.98,0.98,1.00)*rectLight(d,normalize(vec3( 0.72,-0.30, 0.62)), vec3(0,1,0), 0.225,0.185,0.24)*19.0;

  /* מקורות צבע צרים ורוויים — מהם מגיעים הגוונים */
  c += vec3(1.00,0.08,0.42)*pow(max(0.0,dot(d,normalize(vec3( 0.86, 0.06, 0.48)))),30.0)*28.0;
  c += vec3(0.08,0.52,1.00)*pow(max(0.0,dot(d,normalize(vec3(-0.52,-0.44, 0.72)))),26.0)*24.0;
  c += vec3(0.55,0.10,1.00)*pow(max(0.0,dot(d,normalize(vec3( 0.20,-0.62,-0.74)))),22.0)*18.0;
  c += vec3(1.00,0.55,0.05)*pow(max(0.0,dot(d,normalize(vec3(-0.30, 0.55,-0.76)))),44.0)*11.0;
  return c;
}

/* אורך גל → RGB, לפיזור בשמונה דגימות */
vec3 wl(float t){
  return clamp(vec3(
    smoothstep(0.52,0.72,t) + 0.42*smoothstep(0.16,0.00,t),
    smoothstep(0.14,0.42,t) - smoothstep(0.72,1.00,t),
    smoothstep(0.52,0.22,t)
  ), 0.0, 1.0);
}

/* ---------- רשת שברים פנימית ----------
   מינימום של שלושה מישורי סינוס מעוותים ברעש. הערך קרוב לאפס
   על פני שבר. ⚠️ הסף חייב להישאר צר (~0.011) — סף רחב הופך
   את הרשת לקורי עכביש. */
float crackField(vec3 p){
  float a=sin(dot(p,vec3( 3.10, 1.70, 2.30))+noise(p*1.6      )*6.0);
  float b=sin(dot(p,vec3(-1.90, 2.70, 1.30))+noise(p*2.1+11.0 )*6.0);
  float c=sin(dot(p,vec3( 2.20,-1.10,-3.30))+noise(p*1.3+23.0 )*6.0);
  return min(min(abs(a),abs(b)),abs(c));
}
float crackGlow(vec3 a, vec3 b){
  float s=0.0;
  for(int i=0;i<10;i++){
    vec3 p=mix(a,b,(float(i)+0.5)/10.0);
    s+=smoothstep(0.011,0.0,crackField(p));
  }
  return s*0.1;
}

float marchIn(vec3 ro, vec3 rd){
  float t=0.015;
  for(int i=0;i<44;i++){
    float d=-map(ro+rd*t);
    if(d<0.0012) break;
    t+=max(d,0.010);
    if(t>10.0) break;
  }
  return t;
}

vec3 envDir(vec3 d, bool a){
  vec3 c=env(d);
  /* אותו כיוון כמו אור הציאן שהשמאלי כבר רואה — סגול במקום לבהיר את הסופטבוקס */
  if(a) c+=vec3(0.95,0.12,1.00)*pow(max(0.0,dot(d,normalize(vec3(-0.52,-0.44,0.72)))),22.0)*22.0;
  return c;
}

/* מסלול קרן בזכוכית עבור מקדם שבירה אחד, עד שלוש החזרות פנימיות */
vec3 refr(vec3 p, vec3 n, vec3 rd, float ior, bool a){
  vec3 r1=refract(rd,n,1.0/ior);
  if(dot(r1,r1)<1e-5) return envDir(reflect(rd,n),a);
  vec3 ip=p-n*0.010;
  float it=marchIn(ip,r1);
  vec3 ep=ip+r1*it, en=-nrm(ep);
  vec3 ab=exp(-vec3(0.085,0.055,0.035)*it);

  vec3 r2=refract(r1,en,ior);
  if(dot(r2,r2)>1e-5) return envDir(r2,a)*ab;

  vec3 rb=reflect(r1,en);
  vec3 ip2=ep+rb*0.015;
  float t2=marchIn(ip2,rb);
  vec3 ep2=ip2+rb*t2, en2=-nrm(ep2);
  ab*=exp(-vec3(0.085,0.055,0.035)*t2);

  vec3 r3=refract(rb,en2,ior);
  if(dot(r3,r3)>1e-5) return envDir(r3,a)*ab;

  vec3 rc=reflect(rb,en2);
  vec3 ip3=ep2+rc*0.015;
  float t3=marchIn(ip3,rc);
  vec3 ep3=ip3+rc*t3, en3=-nrm(ep3);
  vec3 r4=refract(rc,en3,ior);
  if(dot(r4,r4)<1e-5) r4=reflect(rc,en3);
  return envDir(r4,a)*ab*exp(-vec3(0.085,0.055,0.035)*t3);
}

vec2 sph(vec3 ro, vec3 rd, vec3 ce, float ra){
  vec3 oc=ro-ce; float b=dot(oc,rd), c=dot(oc,oc)-ra*ra, h=b*b-c;
  if(h<0.0) return vec2(1.0,-1.0);
  h=sqrt(h); return vec2(-b-h,-b+h);
}

/* ---------- התלקחויות עדשה ----------
   מה שיוצא מהגבישים ברפרנס הוא לא ברק חשמלי אלא flare של עדשה:
   ליבה לוהטת + פס אנאמורפי אופקי + קרני כוכב + הילה רכה.
   הפס האופקי הוא החתימה של עדשה אנאמורפית — הוא מה שגורם
   לזה להיראות כמו צילום של אובייקט אמיתי ולא כמו ציור. */
vec2 proj(vec3 wp){ return wp.xy*1.55/(wp.z+9.0); }

/* קודקודי הגבישים בעולם. mX ממפה עולם→מקומי, ולכן ההיפוך
   הוא M*L: קודקוד מקומי (0,0,±h) חוזר לקואורדינטות העולם. */
vec3 tip(vec3 c, mat3 m, float h, float sgn){ return c + m*vec3(0.0,0.0,sgn*h); }

vec3 flare(vec2 uv, vec2 c, float s, vec3 tint){
  vec2 d = uv - c;
  float r = length(d);

  float core = exp(-r*r/(0.00055*s));                       /* ליבה */
  float ana  = exp(-(d.y*d.y)/(0.000115*s))                 /* פס אנאמורפי */
             * exp(-abs(d.x)/(0.050*sqrt(s)));
  float a    = atan(d.y,d.x);
  float star = pow(max(0.0,abs(cos(a*3.0))),26.0)           /* קרני כוכב */
             * exp(-r/(0.075*sqrt(s)));
  float halo = exp(-r/(0.040*sqrt(s)));                     /* הילה */

  return tint*(core*3.2 + star*0.85)
       + vec3(0.62,0.80,1.00)*ana*1.7
       + vec3(0.50,0.62,1.00)*halo*0.13;
}

/* חמישה מוקדים — שני קודקודים לכל גביש גדול, ואחד לקטן */
vec3 flares(vec2 uv){
  vec3 f=vec3(0.0);
  if(SHOW_A>0.5){
    f += flare(uv, proj(tip(pA(),mA(),2.10, 1.0)), 1.50, vec3(1.00,0.97,0.92));
    f += flare(uv, proj(tip(pA(),mA(),2.10,-1.0)), 0.90, vec3(0.92,0.95,1.00));
  }
  if(SHOW_B>0.5){
    f += flare(uv, proj(tip(pB(),mB(),1.85, 1.0)), 0.88, vec3(1.00,0.94,0.98));
    f += flare(uv, proj(tip(pB(),mB(),1.85,-1.0)), 0.55, vec3(0.90,0.96,1.00));
  }
  if(SHOW_C>0.5){
    f += flare(uv, proj(tip(pC(),mC(),0.78, 1.0)), 0.34, vec3(1.00,0.96,1.00));
  }
  return f;
}

float tri(float x){ return abs(fract(x)-0.5)*4.0-1.0; }

float bolt(vec2 q, float seed, float t){
  float r=length(q); if(r>1.8) return 0.0;
  float a=atan(q.y,q.x), base=seed*2.3999632;
  /* גל משולש ולא סינוס — פינות חדות, אחרת יוצא חוט עשן */
  float jag = tri(r*1.55-t*0.55+seed*0.7)*0.250
            + tri(r*3.70+t*0.41+seed*1.9)*0.120
            + tri(r*8.10-t*0.29+seed*3.1)*0.052
            + tri(r*17.3+t*0.19+seed*5.3)*0.021;
  float da=a-base-jag;
  da=abs(mod(da+3.14159265,6.28318531)-3.14159265);
  float w=0.0040+r*0.0032;
  float line=pow(w/(da*r+w),1.55);
  float fall=exp(-r*1.30)*smoothstep(0.07,0.24,r);
  float life=0.32+0.68*pow(max(0.0,sin(t*2.4+seed*1.7)),4.0);
  return line*fall*life;
}
float electric(vec2 uv, float t){
  vec2 qa=uv-proj(pA()), qb=uv-proj(pB()), qc=uv-proj(pC());
  float e=0.0;
  for(int i=0;i<2;i++){
    float f=float(i);
    if(SHOW_A>0.5) e+=bolt(qa,f+0.30,t)*0.30;
    if(SHOW_B>0.5) e+=bolt(qb,f+5.70,t*1.13+2.0)*0.30;
    if(SHOW_C>0.5) e+=bolt(qc,f+3.10,t*1.05+3.0)*0.14;
  }
  /* המרכז נשאר נקי — שם יושבת הכותרת */
  return e * smoothstep(0.16, 0.78, length(uv*vec2(0.62,1.0)));
}

vec3 hueRot(vec3 col, float a){
  float c=cos(a), s=sin(a);
  vec3 k=vec3(0.57735027);
  return col*c + cross(k,col)*s + k*dot(k,col)*(1.0-c);
}
bool hitA(vec3 p){
  float a=sdCrystal((p-pA())*mA(), 2.10, 0.86);
  float b=sdCrystal((p-pB())*mB(), 1.85, 0.75);
  float c=sdCrystal((p-pC())*mC(), 0.78, 0.30);
  return a<=b && a<=c;
}

vec4 shade(vec2 uv){
  vec3 ro=vec3(0.0,0.0,-9.0);
  vec3 rd=normalize(vec3(uv,1.55));
  float elec=electric(uv,uTime);
  vec3  fl  =flares(uv);

  vec2 ba=SHOW_A>0.5 ? sph(ro,rd,pA(),4.2) : vec2(1.0,-1.0);
  vec2 bb=SHOW_B>0.5 ? sph(ro,rd,pB(),3.6) : vec2(1.0,-1.0);
  vec2 bc=SHOW_C>0.5 ? sph(ro,rd,pC(),1.7) : vec2(1.0,-1.0);
  float FAR=1e5;
  float tmin=min(min(ba.x>0.0?ba.x:FAR, bb.x>0.0?bb.x:FAR), bc.x>0.0?bc.x:FAR);
  float tmax=max(max(ba.y,bb.y),bc.y);

  if(tmax<=0.0||tmin>=FAR){
    float fm=max(max(fl.r,fl.g),fl.b);
    if(elec<0.0015 && fm<0.0015) return vec4(0.0);
    vec3 ec=mix(vec3(0.45,0.24,1.0),vec3(1.0),min(1.0,elec*3.2));
    vec3 g=ec*elec*2.6+fl; g=g/(1.0+g); g=pow(max(g,0.0),vec3(0.4545));
    return vec4(g, clamp(max(elec*2.6, fm*2.2),0.0,1.0));
  }

  float t=max(tmin,0.0); bool hit=false; float near=1000.0;
  for(int i=0;i<200;i++){
    vec3 p=ro+rd*t; float d=map(p);
    near=min(near,d);
    if(d<0.0006+t*0.00018){ hit=true; break; }
    t+=d*0.88;                 /* צעד מקוצר — מונע דילוג בזוויות משיקיות */
    if(t>tmax) break;
  }

  if(!hit){
    float g=exp(-near*3.1)*smoothstep(0.95,0.20,near);
    vec3 gc=vec3(0.40,0.28,0.88)*g*0.85;
    vec3 ec=mix(vec3(0.45,0.24,1.0),vec3(1.0),min(1.0,elec*3.2));
    gc+=ec*elec*2.6+fl;
    float fm=max(max(fl.r,fl.g),fl.b);
    gc=gc/(1.0+gc); gc=pow(max(gc,0.0),vec3(0.4545));
    return vec4(gc, clamp(max(max(g*0.95,min(1.0,elec*2.6)), fm*2.2),0.0,1.0));
  }

  vec3 p=ro+rd*t;
  vec3 n=nrm(p);
  n=normalize(n+(vec3(noise(p*3.4),noise(p*3.4+37.2),noise(p*3.4+71.9))-0.5)*0.020);
  float fres=pow(1.0-max(0.0,dot(-rd,n)),4.0);
  bool a=hitA(p);

  /* פיזור ספקטרלי בשמונה אורכי גל */
  vec3 trans=vec3(0.0), wsum=vec3(0.0);
  for(int i=0;i<8;i++){
    float s=(float(i)+0.5)/8.0;
    float ior=1.372+s*0.246;
    vec3 wgt=wl(s);
    trans+=refr(p,n,rd,ior,a)*wgt;
    wsum+=wgt;
  }
  trans/=max(wsum,vec3(0.0001));
  float lum=dot(trans,vec3(0.299,0.587,0.114));
  trans=mix(vec3(lum),trans,0.78);

  vec3 refl=envDir(reflect(rd,n),a);
  vec3 col=mix(trans,refl,clamp(fres,0.0,1.0)*0.70+0.08);

  /* רשת השברים לאורך המסלול הפנימי */
  vec3 rIn=refract(rd,n,1.0/1.47);
  vec3 pIn=p-n*0.010;
  float lIn=marchIn(pIn,rIn);
  col+=vec3(0.90,0.95,1.00)*crackGlow(pIn,pIn+rIn*lIn)*(a?4.8:2.6);

  col+=vec3(1.0)*pow(fres,4.5)*3.0;
  col+=vec3(0.90,0.96,1.0)*elec*2.0;
  col+=fl*0.55;

  /* הגביש השמאלי רואה בעיקר את אור הציאן ב-env; הזזה לסגול בלי לגעת בימין.
     0.90 rad ≈ 52° על ציר הלומיננס. אחרי הסיבוב מהאור הראשי הוא גם כהה
     יותר — הגברה מקומית מחזירה עושר בלי להחזיר פאה שטוחה לסופטבוקס. */
  if(a){ col=hueRot(col, 0.90); col*=1.25; }

  col*=0.68;
  col=col/(1.0+col);
  col=pow(max(col,0.0),vec3(0.4545));
  return vec4(col,1.0);
}

void main(){
  vec4 acc=vec4(0.0);
  for(int sy=0;sy<2;sy++){
    for(int sx=0;sx<2;sx++){
      vec2 j=vec2(float(sx),float(sy))*0.5+0.25;
      vec2 frag=gl_FragCoord.xy-vec2(0.5)+j+uOff;
      acc+=shade((frag-0.5*uFull)/uFull.y);
    }
  }
  gl_FragColor=acc*0.25;
}
`;

const S = '<' + 'script>', E = '<' + '/script>';

const driver = `
var W=${CANVAS_W}, H=${H}, T=${TILE}, VIEW_W=${VIEW_W};
var out=document.getElementById('out');
var big=document.createElement('canvas'); big.width=W; big.height=H;
var bctx=big.getContext('2d');
var cv=document.createElement('canvas'); cv.width=T; cv.height=T;
var gl=cv.getContext('webgl',{alpha:true,premultipliedAlpha:false,preserveDrawingBuffer:true,antialias:false});
if(!gl){ out.textContent='NO_WEBGL'; }
else{
  function sh(t,s){ var o=gl.createShader(t); gl.shaderSource(o,s); gl.compileShader(o);
    if(!gl.getShaderParameter(o,gl.COMPILE_STATUS)){ out.textContent='SHADER_FAIL '+gl.getShaderInfoLog(o); throw 0; } return o; }
  var p=gl.createProgram();
  gl.attachShader(p,sh(gl.VERTEX_SHADER,VERT_SRC));
  gl.attachShader(p,sh(gl.FRAGMENT_SHADER,FRAG_SRC));
  gl.linkProgram(p);
  if(!gl.getProgramParameter(p,gl.LINK_STATUS)){ out.textContent='LINK_FAIL '+gl.getProgramInfoLog(p); throw 0; }
  gl.useProgram(p);
  var b=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,b);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  var a=gl.getAttribLocation(p,'aP'); gl.enableVertexAttribArray(a);
  gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
  gl.uniform2f(gl.getUniformLocation(p,'uFull'),VIEW_W,H);
  gl.uniform1f(gl.getUniformLocation(p,'uTime'),3.10);
  var uOff=gl.getUniformLocation(p,'uOff');
  gl.viewport(0,0,T,T);

  var tiles=[];
  for(var y=0;y<H;y+=T) for(var x=0;x<W;x+=T) tiles.push([x,y]);

  var i=0;
  (function step(){
    if(i>=tiles.length){
      /* Bloom דו-שכבתי — הילה רחבה וברק צמוד.
         זה מה שנותן את תחושת הרנדר היקר, ועולה כלום כי הוא נאפה. */
      var bl=document.createElement('canvas'); bl.width=W; bl.height=H;
      var bc=bl.getContext('2d'); bc.filter='blur(26px)'; bc.drawImage(big,0,0);
      var bl2=document.createElement('canvas'); bl2.width=W; bl2.height=H;
      var bc2=bl2.getContext('2d'); bc2.filter='blur(7px)'; bc2.drawImage(big,0,0);

      var o=document.createElement('canvas'); o.width=W; o.height=H;
      var oc=o.getContext('2d');
      oc.fillStyle='#000'; oc.fillRect(0,0,W,H);
      oc.drawImage(big,0,0);
      oc.globalCompositeOperation='lighter';
      oc.globalAlpha=0.26; oc.drawImage(bl,0,0);
      oc.globalAlpha=0.16; oc.drawImage(bl2,0,0);
      oc.globalAlpha=1.0; oc.globalCompositeOperation='source-over';

      out.textContent=o.toDataURL(${OUT_PNG ? "'image/png'" : "'image/webp',0.93"});
      document.title='done';
      return;
    }
    var tx=tiles[i][0], ty=tiles[i][1];
    gl.uniform2f(uOff,tx,ty);
    gl.drawArrays(gl.TRIANGLES,0,3);
    /* WebGL מצייר עם ציר Y הפוך ביחס ל-2D */
    bctx.save(); bctx.translate(tx, ty+T); bctx.scale(1,-1);
    bctx.drawImage(cv,0,0); bctx.restore();
    i++;
    setTimeout(step,0);
  })();
}
`;

const page =
  '<!doctype html><meta charset="utf-8"><title>rendering</title><body style="margin:0;background:#111">' +
  '<div id="out" style="color:#888;font:11px monospace;word-break:break-all">rendering</div>' +
  S + 'var VERT_SRC=' + JSON.stringify(VERT) + ';var FRAG_SRC=' + JSON.stringify(FRAG) + ';' + E +
  S + driver + E + '</body>';

fs.writeFileSync(path.join(__dirname, '_render.html'), page);
console.log('tools/_render.html · ' + CANVAS_W + 'x' + H + ' · טייל ' + TILE +
            ' · ' + (Math.ceil(CANVAS_W/TILE)*Math.ceil(H/TILE)) + ' טיילים · שכבה ' + LAYER +
            ' · ' + (OUT_PNG ? 'png' : 'webp') +
            (EXTRA_RIGHT ? ' · extraRight ' + EXTRA_RIGHT : ''));
