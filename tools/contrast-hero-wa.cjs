/* Contrast proof for .btn--hero-wa. WCAG 2 relative luminance. */
function srgbLin(c) {
  const x = c / 255;
  return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
}
function luminance(hex) {
  const n = hex.replace('#', '');
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return 0.2126 * srgbLin(r) + 0.7152 * srgbLin(g) + 0.0722 * srgbLin(b);
}
function contrast(fg, bg) {
  const a = luminance(fg);
  const b = luminance(bg);
  const hi = Math.max(a, b);
  const lo = Math.min(a, b);
  return (hi + 0.05) / (lo + 0.05);
}

const WHITE = '#FFFFFF';
const REST = '#9B2EE8';
const HOVER = '#9B2EE8'; /* no fill change on hover */

const rest = contrast(WHITE, REST);
const hover = contrast(WHITE, HOVER);
const pass = (n) => (n >= 4.5 ? 'PASS' : 'FAIL');

console.log('resting  bg', REST, 'vs', WHITE, rest.toFixed(4) + ':1', pass(rest));
console.log('hover    bg', HOVER, 'vs', WHITE, hover.toFixed(4) + ':1', pass(hover));
console.log('AA normal-text threshold 4.5:1  rest=' + (rest >= 4.5) + ' hover=' + (hover >= 4.5));
if (rest < 4.5 || hover < 4.5) process.exit(1);
