import { useInView } from 'motion/react';
import type { RefObject } from 'react';
import { REPEAT_VIEWPORT_MARGIN } from '../components/motion/variants';

interface UseOnceInViewOptions {
  amount?: number;
  margin?: `${number}${'px' | '%'} ${number}${'px' | '%'} ${number}${'px' | '%'} ${number}${'px' | '%'}`;
}

/**
 * Para animações de ENTRADA (fade/deslocamento de texto, título, imagem,
 * card) -- ao contrário de `useRepeatableInView`, dispara uma única vez e
 * nunca mais volta a `false`: ainda não visto -> oculto; entra na tela pela
 * primeira vez -> anima; já foi visto -> permanece visível para sempre,
 * mesmo subindo/descendo a página depois. Baseado em
 * `useInView(ref, { once: true })` do Motion (IntersectionObserver por
 * baixo, sem listener manual de scroll).
 *
 * Não usar para animações contínuas intencionais (correntes, brilhos,
 * "likes" em loop, substituto de hover no mobile) -- essas continuam em
 * `useRepeatableInView`, que deve mesmo repetir a cada entrada/saída da
 * viewport.
 */
export function useOnceInView<T extends Element>(
  ref: RefObject<T | null>,
  { amount = 0.3, margin = REPEAT_VIEWPORT_MARGIN }: UseOnceInViewOptions = {},
): boolean {
  return useInView(ref, { once: true, amount, margin });
}
