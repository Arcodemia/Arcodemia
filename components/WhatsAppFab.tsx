'use client';

import { FAB_SHOW_AFTER_PX, useScrolledPast } from '@/hooks/useScrolledPast';
import { DEFAULT_MSG, waURL } from '@/lib/whatsapp';
import { WhatsAppIcon } from './icons';

export function WhatsAppFab() {
  const visible = useScrolledPast(FAB_SHOW_AFTER_PX);

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
