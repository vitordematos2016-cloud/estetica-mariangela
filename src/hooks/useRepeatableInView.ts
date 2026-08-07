import { useInView } from 'motion/react';
import type { RefObject } from 'react';
import { REPEAT_VIEWPORT_MARGIN } from '../components/motion/variants';

interface UseRepeatableInViewOptions {
  amount?: number;
  /** Mesmo formato do CSS `margin`/`rootMargin` -- afasta o gatilho das
   * bordas cruas da viewport para não reiniciar com pequenos movimentos de
   * rolagem perto da borda. */
  margin?: `${number}${'px' | '%'} ${number}${'px' | '%'} ${number}${'px' | '%'} ${number}${'px' | '%'}`;
}

/**
 * Substitui `useInView(ref, { once: true, ... })` nas seções que devem
 * repetir a animação de entrada sempre que o elemento voltar à região
 * visível: entra -> ativa; permanece visível -> não reinicia (o booleano
 * não muda); sai o suficiente (além da margem) -> desativa e fica pronto
 * para repetir; volta -> ativa de novo. Continua baseado em
 * IntersectionObserver (via Motion), sem listener manual de scroll nem
 * atualização de estado a cada pixel.
 */
export function useRepeatableInView<T extends Element>(
  ref: RefObject<T | null>,
  { amount = 0.3, margin = REPEAT_VIEWPORT_MARGIN }: UseRepeatableInViewOptions = {},
): boolean {
  return useInView(ref, { once: false, amount, margin });
}
