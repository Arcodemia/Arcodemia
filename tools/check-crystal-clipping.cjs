/* האם גביש נחתך על המסך? חישוב אנליטי מתוך פרמטרי השיידר. */
const MX = (hw) => Math.max(0.13, 0.18*hw);
const MY = () => 0.115;
const ks = (a) => Math.min(0.62, Math.max(0.28, -0.10 + 0.45 * a));
const extU = (L, r, z) => Math.sqrt(L * L + r * r) * 1.55 / (z + 9);
const SZ = { A: [2.10, 0.86, 0.40], B: [1.85, 0.75, -0.60], C: [0.78, 0.30, -3.10] };

function crystals(iw, ih) {
  const a = iw / ih, halfW = 0.5 * a, k = ks(a);
  const out = {};
  for (const key of ['A', 'B', 'C']) {
    const [L0, r0, z] = SZ[key];
    const e = extU(L0 * k, r0 * k, z);
    let ux, uy;
    if (key === 'A') { ux = -(halfW - e - MX(halfW)); uy = 0.10; }
    if (key === 'B') { ux = halfW - e - MX(halfW); uy = -0.13; }
    if (key === 'C') { ux = (halfW - e - MX(halfW)) * 0.72; uy = (0.5 - e - MY()) * 0.86; }
    /* לקואורדינטות תמונה מנורמלות 0..1 */
    out[key] = {
      xc: 0.5 + ux / (2 * halfW), yc: 0.5 + uy,
      ex: e / (2 * halfW), ey: e,
    };
  }
  return out;
}

const VIEWS = [
  ['1920x1080', 1920, 657, 'ultra'], ['1600x900', 1600, 657, 'ultra'],
  ['1440x900', 1440, 657, 'ultra'], ['1280x800', 1280, 657, 'ultra'],
  ['1279x800', 1279, 657, 'wide'], ['1024x768', 1024, 638, 'wide'],
  ['834x1112', 834, 607, 'wide'], ['390x844', 390, 688, 'tall'], ['360x780', 360, 667, 'tall'],
];
const IMG = { ultra: [1800, 760], wide: [1800, 1120], tall: [900, 1150] };

console.log(' viewport     img    crystal  visible?   worst overflow');
for (const [tag, bw, bh, which] of VIEWS) {
  const [iw, ih] = IMG[which];
  const cs = crystals(iw, ih);
  const scale = Math.max(bw / iw, bh / ih);
  const dispW = iw * scale, dispH = ih * scale;
  const cropX = (dispW - bw) / 2 / dispW, cropY = (dispH - bh) / 2 / dispH;
  const lines = [];
  for (const key of ['A', 'B', 'C']) {
    const c = cs[key];
    const over = Math.max(
      cropX - (c.xc - c.ex), (c.xc + c.ex) - (1 - cropX),
      cropY - (c.yc - c.ey), (c.yc + c.ey) - (1 - cropY),
    );
    lines.push(`${key}:${over <= 0 ? 'whole' : 'CUT ' + (over * 100).toFixed(1) + '%'}`);
  }
  console.log(` ${tag.padEnd(11)} ${which.padEnd(5)}  ${lines.join('  ')}`);
}
