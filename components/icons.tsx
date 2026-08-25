/* אייקונים מוטבעים. מוטבעים ולא כקבצים, כדי שלא תיווצר בקשה
   נוספת ושה-CSP יוכל להישאר בלי img-src חיצוני. */

export function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.5 14.4c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.6c.1-.2.2-.3.3-.5 0-.2 0-.4 0-.5 0-.2-.7-1.6-.9-2.2-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5 4.5.7.3 1.3.5 1.7.6.7.2 1.3.2 1.8.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.5-.3Z" />
      <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3a8.2 8.2 0 1 1 7.2 3.9Z" />
    </svg>
  );
}

export function LogoMark() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 4 27 28H5z" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" />
      <path d="M11.4 21h9.2" stroke="#B14BFF" strokeWidth="2.1" strokeLinecap="round" />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 1.9.6 2.8a2 2 0 0 1-.4 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.8.6a2 2 0 0 1 1.8 2.1Z" />
    </svg>
  );
}

export function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2.5" y="4.5" width="19" height="15" rx="3" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function A11yIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="4.2" r="1.9" fill="currentColor" stroke="none" />
      <path d="M4.5 8.2c2.4.9 4.9 1.4 7.5 1.4s5.1-.5 7.5-1.4" />
      <path d="M12 9.6v4.2" />
      <path d="m12 13.8-3 7" />
      <path d="m12 13.8 3 7" />
    </svg>
  );
}

export function ShareIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 14v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
      <path d="m16 6-4-4-4 4" />
      <path d="M12 2v13" />
    </svg>
  );
}

export function CopyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="11" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

export function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12.07C22 6.5 17.52 2 12 2S2 6.5 2 12.07C2 17.1 5.66 21.24 10.44 22v-7.01H7.9v-2.92h2.54V9.84c0-2.5 1.49-3.89 3.78-3.89.7 0 1.64.12 2.42.24v2.67h-1.37c-1.34 0-1.76.83-1.76 1.7v2.04h3l-.48 2.92h-2.52V22C18.34 21.24 22 17.1 22 12.07Z" />
    </svg>
  );
}
