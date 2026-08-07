import { useCallback, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { EASE_OUT } from '../components/motion/variants';
import { useReducedMotion } from './useReducedMotion';

interface RippleItem {
  id: number;
  x: number;
  y: number;
  size: number;
}

let rippleSeq = 0;

/**
 * Ripple dourado discreto para o clique dos botões premium (abas, setas do
 * carrossel). É um efeito manual (não `whileTap`), então precisa checar
 * `useReducedMotion()` diretamente -- o `MotionConfig reducedMotion="user"`
 * global só neutraliza gestos declarativos (`whileHover`/`whileTap`), não
 * este `motion.span` disparado por `onPointerDown` (mesmo padrão do `shine`
 * em `Button.tsx`).
 */
export function useGoldRipple() {
  const [ripples, setRipples] = useState<RippleItem[]>([]);
  const prefersReducedMotion = useReducedMotion();

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (prefersReducedMotion) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.6;
      const id = ++rippleSeq;
      setRipples((current) => [
        ...current,
        { id, x: event.clientX - rect.left, y: event.clientY - rect.top, size },
      ]);
    },
    [prefersReducedMotion],
  );

  const removeRipple = useCallback((id: number) => {
    setRipples((current) => current.filter((ripple) => ripple.id !== id));
  }, []);

  const rippleLayer: ReactNode = (
    <AnimatePresence>
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full bg-gold/35"
          style={{
            left: ripple.x - ripple.size / 2,
            top: ripple.y - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
          }}
          initial={{ scale: 0, opacity: 0.45 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          onAnimationComplete={() => removeRipple(ripple.id)}
        />
      ))}
    </AnimatePresence>
  );

  return { onPointerDown, rippleLayer };
}
