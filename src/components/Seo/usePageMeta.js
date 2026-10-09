import { useEffect } from 'react';

const SITE = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '');
const SUFFIX = ' — AG.';

function setMeta(selector, attr, value) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(selector.startsWith('link') ? 'link' : 'meta');
    const m = selector.match(/\[(\w+)="([^"]+)"\]/);
    if (m) el.setAttribute(m[1], m[2]);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

/**
 * Per-route <title>, description, canonical and social tags. The static
 * values in index.html cover crawlers that don't run JS (link previews);
 * this keeps the tab title and JS-rendering crawlers accurate per page.
 */
export function usePageMeta({ title, description, path = '/' }) {
  useEffect(() => {
    const full = title ? `${title}${SUFFIX}` : 'AG. — Creative Developer in Athens';
    const url = `${SITE}${path}`;
    document.title = full;
    if (description) {
      setMeta('meta[name="description"]', 'content', description);
      setMeta('meta[property="og:description"]', 'content', description);
      setMeta('meta[name="twitter:description"]', 'content', description);
    }
    setMeta('meta[property="og:title"]', 'content', full);
    setMeta('meta[name="twitter:title"]', 'content', full);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('link[rel="canonical"]', 'href', url);
  }, [title, description, path]);
}
