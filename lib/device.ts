/* בדיקת מכשיר בלחיצה בלבד — לא בצד שרת. */

const MOBILE_UA = /Android|iPhone|iPad|iPod/i;

/** אותו סף כמו פיצול תמונת הגיבור ב-Hero / globals.css. */
const MOBILE_MAX_WIDTH = 833;

/** true בנייד (UA או רוחב מסך). ב-SSR מחזיר false. */
export function isMobile(): boolean {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') return false;
  return MOBILE_UA.test(navigator.userAgent) || window.innerWidth <= MOBILE_MAX_WIDTH;
}
