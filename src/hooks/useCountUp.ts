import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Conta de 0 até `target` a ritmo linear via requestAnimationFrame,
 * disparada quando `start` vira true. Repete a cada reentrada: quando
 * `start` volta a `false` (elemento saiu da região visível), o valor é
 * zerado e fica pronto para a próxima entrada contar de novo -- enquanto
 * `start` permanece `true` sem mudar, o efeito não reexecuta (React só
 * reage a mudanças de dependência), então o valor final fica parado. Com
 * `prefers-reduced-motion`, mostra o valor final direto, sem animação, em
 * toda entrada.
 *
 * Ritmo linear (em vez de ease-out) é proposital: com um `target` pequeno
 * (ex.: 8), um easing que desacelera no fim faz o valor chegar ao número
 * final bem antes da duração terminar, dando a impressão de que o contador
 * "pulou" direto pro resultado em vez de contar. Linear mantém cada
 * incremento igualmente espaçado ao longo de toda a duração, então o
 * intervalo entre um número e outro fica sempre visível, seja o alvo 8 ou
 * 1000.
 */
export function useCountUp(target: number, durationMs: number, start: boolean) {
  const [value, setValue] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!start) {
      setValue(0);
      return;
    }

    if (prefersReducedMotion) {
      setValue(target);
      return;
    }

    let rafId: number;
    const startTime = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - startTime) / durationMs, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [start, target, durationMs, prefersReducedMotion]);

  return value;
}
