import { useEffect } from 'react';

const SITE_NAME = 'Mariangela Schinaider Estética';
const SITE_URL = 'https://mariangelaschinaider.com.br'; // domínio provisório — ajustar quando o domínio final for definido

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * Define título/description/canonical/Open Graph da página atual.
 * Sem dependência externa — CSR simples via useEffect, suficiente para um SPA institucional.
 */
export default function useSeo({ title, description, path = '', image }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const canonicalUrl = `${SITE_URL}${path}`;

    document.title = fullTitle;
    upsertMeta('name', 'description', description);
    upsertCanonical(canonicalUrl);

    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', canonicalUrl);
    if (image) upsertMeta('property', 'og:image', image.startsWith('http') ? image : `${SITE_URL}${image}`);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description);
  }, [title, description, path, image]);
}
