import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

const MOBILE_QUERY = '(max-width: 767px)';

interface UseMobileViewportActiveOptions {
  /** Janela de ativação em torno da região central da viewport. */
  rootMargin?: string;
  /** Fração mínima do elemento visível dentro da janela para contar como ativo. */
  threshold?: number;
}

interface UseMobileViewportActiveResult<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  /** Verdadeiro quando o elemento está na região principal da tela (mobile). */
  active: boolean;
  /**
   * Verdadeiro só abaixo de 768px e sem `prefers-reduced-motion`. Os
   * consumidores devem só aplicar `animate`/estilos condicionados por
   * `active` quando este flag for verdadeiro -- acima de 768px (ou com
   * movimento reduzido) nada deve ser observado nem estilizado, preservando
   * o desktop e o estado de acessibilidade exatamente como já são hoje.
   */
  isMobileViewport: boolean;
}

/**
 * Ativa um card/elemento conforme ele atravessa a região central da
 * viewport -- pensado para reproduzir no toque/rolagem (mobile) o mesmo
 * destaque que o hover de mouse já dá no desktop. Usa IntersectionObserver
 * nativo (sem listener manual de scroll), só observa abaixo de 768px, e
 * nunca ativa sob `prefers-reduced-motion` (nesse caso os consumidores devem
 * tratar o conteúdo como sempre visível/estável, sem gatilho de animação).
 */
export function useMobileViewportActive<T extends HTMLElement = HTMLDivElement>(
  options: UseMobileViewportActiveOptions = {},
): UseMobileViewportActiveResult<T> {
  const { rootMargin = '-25% 0px -35% 0px', threshold = 0.15 } = options;
  const ref = useRef<T>(null);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [active, setActive] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY);
    setIsMobileViewport(query.matches);

    const handleChange = (event: MediaQueryListEvent) => setIsMobileViewport(event.matches);
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);

  const isEnabled = isMobileViewport && !prefersReducedMotion;

  useEffect(() => {
    if (!isEnabled) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { root: null, rootMargin, threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [isEnabled, rootMargin, threshold]);

  return { ref, active, isMobileViewport: isEnabled };
}
