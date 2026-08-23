import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

/* ============================================================
   כותרות אבטחה
   ------------------------------------------------------------
   ⚠️ ה-CSP נאכף כ-HTTP header ולא כ-<meta>, מאותן שתי סיבות
   שתועדו באתר הסטטי:
     1. header יכול לאכוף frame-ancestors. <meta> מתעלם ממנו
        לגמרי, כלומר אין הגנת clickjacking.
     2. מעשית — תחת פרוטוקול file:// המקור נחשב אטום, 'self'
        לא תואם לו, וה-meta היה חוסם את הפונטים המקומיים בכל
        פעם שפותחים את הקובץ לבדיקה.

   'unsafe-inline' ל-script נדרש ל-hydration של Next, בדיוק כפי
   שהיה נדרש קודם לסקריפט המוטבע. ל-style הוא נדרש ל-CSS
   שמוטבע בזמן הריצה.
   ============================================================ */

/* ⚠️ React במצב פיתוח משתמש ב-eval לשחזור stack traces, ו-HMR
   פותח WebSocket. שניהם נדרשים ב-`next dev` בלבד.

   ⚠️ הבדיקה היא לפי phase ולא לפי process.env.NODE_ENV.
   ב-`next start` ה-NODE_ENV לא אמין ברגע טעינת ה-config,
   ו-'unsafe-eval' דלף לייצור. זה נתפס בבדיקת curl על הכותרות
   ולא בעין — כדאי לבדוק ככה גם בעתיד. */
function buildCSP(isDev) {
  return [
    "default-src 'self'",
    "base-uri 'none'",
    "object-src 'none'",
    "img-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
    `connect-src 'self'${isDev ? ' ws: http:' : ''}`,
    "form-action 'self'",
    "frame-ancestors 'none'",
    'upgrade-insecure-requests',
  ].join('; ');
}

/* Permissions-Policy — 24 יכולות מושבתות, זהה למקור */
const PERMISSIONS_POLICY = [
  'accelerometer=()',
  'ambient-light-sensor=()',
  'autoplay=()',
  'battery=()',
  'camera=()',
  'display-capture=()',
  'document-domain=()',
  'encrypted-media=()',
  'fullscreen=(self)',
  'geolocation=()',
  'gyroscope=()',
  'magnetometer=()',
  'microphone=()',
  'midi=()',
  'payment=()',
  'picture-in-picture=()',
  'publickey-credentials-get=()',
  'screen-wake-lock=()',
  'sync-xhr=()',
  'usb=()',
  'xr-spatial-tracking=()',
  'interest-cohort=()',
].join(', ');

const STATIC_SECURITY_HEADERS = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'off' },
  { key: 'Permissions-Policy', value: PERMISSIONS_POLICY },
];

/** @type {(phase: string) => import('next').NextConfig} */
export default function config(phase) {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    reactStrictMode: true,
    poweredByHeader: false,

    async headers() {
      return [
        {
          source: '/:path*',
          headers: [
            { key: 'Content-Security-Policy', value: buildCSP(isDev) },
            ...STATIC_SECURITY_HEADERS,
          ],
        },

        /* התמונות ב-public/img נטענות בשם קבוע. הן משתנות רק
           כשמרנדרים אותן מחדש, ואז אפשר לשנות גם את שם הקובץ.
           הפונטים עוברים דרך next/font ומקבלים hash בשם הקובץ,
           ולכן Next כבר מגיש אותם מ-/_next/static עם immutable. */
        {
          source: '/img/:path*',
          headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
        },
        {
          source: '/api/:path*',
          headers: [
            { key: 'Cache-Control', value: 'no-store' },
            { key: 'X-Robots-Tag', value: 'noindex' },
          ],
        },
      ];
    },
  };
}
