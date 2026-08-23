/* eslint-config-next 16 מייצא flat config נייטיבי.
   ⚠️ לא להשתמש ב-FlatCompat כאן — הוא נופל על
   "Converting circular structure to JSON" מול הגרסה הזו. */
import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

const config = [
  { ignores: ['.next/**', 'node_modules/**', 'tools/**', 'next-env.d.ts'] },
  ...coreWebVitals,
  ...typescript,
];

export default config;
