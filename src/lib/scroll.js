// Utilitário central de scroll suave até uma seção, respeitando prefers-reduced-motion
// e o scroll-margin-top já configurado em cada seção-alvo (compensa o header fixo).

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function scrollToSection(id, { instant = false } = {}) {
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({
    behavior: instant || prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  });
  return true;
}
