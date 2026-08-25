'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CONFIG } from '@/lib/config';
import { FAB_SHOW_AFTER_PX, useScrolledPast } from '@/hooks/useScrolledPast';
import { CopyIcon, FacebookIcon, ShareIcon, WhatsAppIcon } from './icons';

const SHARE_TEXT = 'ARCODEMIA — דפי נחיתה מקצועיים לעסקים מקומיים';

type FallbackTarget = 'whatsapp' | 'facebook';

function fallbackHref(kind: FallbackTarget, url: string, text: string): string {
  switch (kind) {
    case 'whatsapp':
      return `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

function sharePayload(url: string): ShareData {
  return { title: SHARE_TEXT, text: SHARE_TEXT, url };
}

async function tryNativeShare(data: ShareData): Promise<'shared' | 'cancelled' | 'unsupported'> {
  if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') {
    return 'unsupported';
  }
  try {
    if (typeof navigator.canShare === 'function' && !navigator.canShare(data)) {
      return 'unsupported';
    }
    await navigator.share(data);
    return 'shared';
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return 'cancelled';
    return 'unsupported';
  }
}

export function ShareFab() {
  const visible = useScrolledPast(FAB_SHOW_AFTER_PX);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLAnchorElement>(null);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const url = CONFIG.siteUrl;
  const data = sharePayload(url);

  const close = useCallback(() => {
    setOpen(false);
    setCopied(false);
    btnRef.current?.focus();
  }, []);

  if (!visible && open) {
    setOpen(false);
    setCopied(false);
  }

  useEffect(() => {
    if (open) firstItemRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t)) return;
      if (btnRef.current?.contains(t)) return;
      setOpen(false);
      setCopied(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [open]);

  useEffect(() => {
    return () => {
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
    };
  }, []);

  const onTrigger = async () => {
    if (open) {
      close();
      return;
    }
    const result = await tryNativeShare(data);
    if (result === 'unsupported') setOpen(true);
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
      copiedTimer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={`share-fab${visible ? ' is-on' : ''}`}
        ref={btnRef}
        aria-label="שיתוף"
        aria-expanded={open}
        aria-controls="sharePanel"
        aria-hidden={!visible}
        tabIndex={visible ? undefined : -1}
        onClick={onTrigger}
      >
        <ShareIcon />
      </button>

      <div
        className={`share-panel${open ? ' is-open' : ''}`}
        id="sharePanel"
        ref={panelRef}
        role="dialog"
        aria-modal="false"
        aria-labelledby="shareTitle"
      >
        <h2 id="shareTitle">שיתוף</h2>
        <div className="share-panel__list">
          <a
            ref={firstItemRef}
            href={fallbackHref('whatsapp', url, SHARE_TEXT)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon />
            וואטסאפ
          </a>
          <a href={fallbackHref('facebook', url, SHARE_TEXT)} target="_blank" rel="noopener noreferrer">
            <FacebookIcon />
            פייסבוק
          </a>
          <button type="button" onClick={onCopy}>
            <CopyIcon />
            {copied ? 'הקישור הועתק' : 'העתקת קישור'}
          </button>
        </div>
        <p className="share-panel__live" role="status" aria-live="polite">
          {copied ? 'הקישור הועתק' : ''}
        </p>
      </div>
    </>
  );
}
