import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, RefObject } from 'react';
import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { EASE_OUT } from '../motion/variants';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useRepeatableInView } from '../../hooks/useRepeatableInView';
import { useReplayKey } from '../../hooks/useReplayKey';

const baseClasses =
  'relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-all duration-200 focus-visible:outline-offset-4 min-h-11 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none';

const variantClasses = {
  primary: 'bg-brown-dark text-cream hover:bg-brown shadow-warm-sm hover:shadow-warm',
  secondary:
    'border border-gold/60 text-brown-dark hover:border-gold hover:bg-gold/10 bg-transparent',
  ghost: 'text-brown-dark hover:text-gold',
} as const;

type Variant = keyof typeof variantClasses;

const HOVER_TRANSITION = { duration: 0.22, ease: EASE_OUT };
const TAP_TRANSITION = { duration: 0.15, ease: EASE_OUT };

/** Elevação/escala no hover (mouse real) e compressão no toque, por variante
 * — `ghost` não tem contêiner visível, então só ganha escala, sem elevação. */
const hoverAnimation: Record<Variant, { y?: number; scale: number; transition: typeof HOVER_TRANSITION }> = {
  primary: { y: -2, scale: 1.015, transition: HOVER_TRANSITION },
  secondary: { y: -2, scale: 1.012, transition: HOVER_TRANSITION },
  ghost: { scale: 1.01, transition: HOVER_TRANSITION },
};

const tapAnimation: Record<Variant, { scale: number; transition: typeof TAP_TRANSITION }> = {
  primary: { scale: 0.975, transition: TAP_TRANSITION },
  secondary: { scale: 0.975, transition: TAP_TRANSITION },
  ghost: { scale: 0.97, transition: TAP_TRANSITION },
};

interface CommonProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
  /**
   * Brilho diagonal reservado para CTAs principais (ex.: `variant="primary"
   * shine`): passa uma vez quando o botão entra na viewport e pode repetir
   * no hover — só em ponteiros com hover real, o Motion já filtra isso.
   * Nunca renderizado sob `prefers-reduced-motion`. Não usar em botões
   * secundários/de card para não poluir o site com brilho repetido.
   */
  shine?: boolean;
}

// Framer Motion tipa alguns handlers de gesto (drag/animation) de forma
// incompatível com os handlers nativos do DOM do mesmo nome — omitidos aqui
// porque este componente não os usa e o conflito é só de tipos, não de
// comportamento.
type ConflictingHandlers = 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd';

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, ConflictingHandlers> & { href?: undefined };

type ButtonAsAnchor = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, ConflictingHandlers> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

/**
 * `whileHover`/`whileTap` só disparam com ponteiro real (hover) e gesto de
 * toque reais — nunca ficam "presos", nunca exigem toque duplo — e são
 * neutralizados automaticamente sob `prefers-reduced-motion` pelo
 * `MotionConfig reducedMotion="user"` global (main.tsx). O brilho (`shine`)
 * é resolvido manualmente porque seu gatilho por rolagem deve continuar
 * existindo mesmo sem qualquer clique; por isso ele checa
 * `useReducedMotion()` diretamente e não renderiza nada quando ativo.
 */
export function Button({
  variant = 'primary',
  children,
  className = '',
  shine = false,
  ...rest
}: ButtonProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useRepeatableInView(ref as RefObject<Element>, { amount: 0.6 });
  const viewReplayKey = useReplayKey(isInView);
  const [hoverReplay, setHoverReplay] = useState(0);

  const showShine = shine && !prefersReducedMotion;

  function handleHoverStart() {
    if (showShine) setHoverReplay((count) => count + 1);
  }

  const shineElement = showShine && (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-cream/40 to-transparent mix-blend-overlay"
      key={viewReplayKey + hoverReplay}
      initial={{ x: '-140%', opacity: 0 }}
      animate={isInView ? { x: '340%', opacity: [0, 1, 0] } : {}}
      transition={{ duration: 0.9, ease: EASE_OUT }}
    />
  );

  if ('href' in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest as Omit<AnchorHTMLAttributes<HTMLAnchorElement>, ConflictingHandlers>;
    return (
      <motion.a
        ref={ref as RefObject<HTMLAnchorElement>}
        href={href}
        className={classes}
        whileHover={hoverAnimation[variant]}
        whileTap={tapAnimation[variant]}
        onHoverStart={handleHoverStart}
        {...anchorRest}
      >
        {children}
        {shineElement}
      </motion.a>
    );
  }

  const { disabled, ...buttonRest } = rest as Omit<ButtonHTMLAttributes<HTMLButtonElement>, ConflictingHandlers>;
  return (
    <motion.button
      ref={ref as RefObject<HTMLButtonElement>}
      disabled={disabled}
      className={classes}
      whileHover={disabled ? undefined : hoverAnimation[variant]}
      whileTap={disabled ? undefined : tapAnimation[variant]}
      onHoverStart={disabled ? undefined : handleHoverStart}
      {...buttonRest}
    >
      {children}
      {shineElement}
    </motion.button>
  );
}
