'use client';

import { useScrolledPast } from '@/hooks/useScrolledPast';
import { DEFAULT_MSG, waURL } from '@/lib/whatsapp';
import { WhatsAppIcon } from './icons';

/** מופיע אחרי גלילה מה-hero, כדי לא להתחרות ב-CTA הראשי */
const SHOW_AFTER_PX = 460;

export function WhatsAppFab() {
  const visible = useScrolledPast(SHOW_AFTER_PX);

  return (
    <a
      className={`fab${visible ? ' is-on' : ''}`}
      href={waURL(DEFAULT_MSG)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="פתחו שיחת וואטסאפ"
      aria-hidden={!visible}
      tabIndex={visible ? undefined : -1}
    >
      <WhatsAppIcon />
    </a>
  );
}
