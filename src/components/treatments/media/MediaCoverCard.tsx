import type { ReactNode } from 'react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { EASE_OUT, PREMIUM_HOVER_TRANSITION, PREMIUM_TAP_TRANSITION } from '../../motion/variants';
import { useGoldRipple } from '../../../hooks/useGoldRipple';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

export type MediaCoverKind = 'procedimento' | 'antesDepois';

interface MediaCoverCardProps {
  kind: MediaCoverKind;
  onReveal: () => void;
}

const ProcedureIcon = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M10 2c3 4 6 7.8 6 11a6 6 0 1 1-12 0c0-3.2 3-7 6-11Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
);

const ResultIcon = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M10 2.5v15" stroke="currentColor" strokeWidth="1.4" />
    <path d="M6.5 7.5v5M13.5 7.5v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const ArrowIcon = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const COVER_CONTENT: Record<MediaCoverKind, { eyebrow: string; text: string; cta: string; icon: ReactNode }> = {
  procedimento: {
    eyebrow: 'Conheça o procedimento',
    text: 'Veja como o tratamento é realizado.',
    cta: 'Ver procedimento',
    icon: ProcedureIcon,
  },
  antesDepois: {
    eyebrow: 'Resultados reais',
    text: 'Veja registros de evolução e resultados deste tratamento.',
    cta: 'Ver resultado',
    icon: ResultIcon,
  },
};

/**
 * Capa elegante que esconde a mídia real até o clique -- nunca usa a própria
 * foto como fundo, só gradiente bege/dourado e círculos desfocados (mesmo
 * motivo decorativo do `PlaceholderMedia`). O brilho diagonal no hover segue
 * o mesmo padrão do `shine` em `Button.tsx`: replay manual por chave,
 * desligado sob `prefers-reduced-motion`.
 */
export function MediaCoverCard({ kind, onReveal }: MediaCoverCardProps) {
  const { eyebrow, text, cta, icon } = COVER_CONTENT[kind];
  const { onPointerDown, rippleLayer } = useGoldRipple();
  const prefersReducedMotion = useReducedMotion();
  const [sweepReplay, setSweepReplay] = useState(0);
  const showSweep = !prefersReducedMotion;

  function handleHoverStart() {
    if (showSweep) setSweepReplay((count) => count + 1);
  }

  return (
    <motion.button
      type="button"
      onClick={onReveal}
      onPointerDown={onPointerDown}
      onHoverStart={handleHoverStart}
      aria-label={cta}
      whileHover={{
        y: -2,
        boxShadow: '0 10px 24px -12px rgba(167, 136, 127, 0.5)',
        transition: PREMIUM_HOVER_TRANSITION,
      }}
      whileTap={{ scale: 0.98, transition: PREMIUM_TAP_TRANSITION }}
      className="group relative w-full overflow-hidden rounded-[1.75rem] border border-gold/35 bg-gradient-to-br from-cream-light via-cream to-beige/50 p-5 text-left shadow-warm-sm transition-colors duration-200 hover:border-gold/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
    >
      <span aria-hidden="true" className="pointer-events-none absolute -left-8 -top-8 h-24 w-24 rounded-full bg-gold/10 blur-2xl" />
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-10 -right-6 h-28 w-28 rounded-full bg-brown/10 blur-2xl" />

      {showSweep && (
        <motion.span
          aria-hidden="true"
          key={sweepReplay}
          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-gold/25 to-transparent"
          initial={{ x: '-140%', opacity: 0 }}
          animate={{ x: '340%', opacity: [0, 1, 0] }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        />
      )}

      {rippleLayer}

      <span className="relative z-10 flex flex-col gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-cream/60 text-gold-deep transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-105">
          {icon}
        </span>
        <span className="text-xs font-medium uppercase tracking-[0.16em] text-gold-deep">{eyebrow}</span>
        <span className="text-sm leading-relaxed text-brown/70">{text}</span>
        <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-brown-dark">
          {cta}
          <span
            aria-hidden="true"
            className="inline-flex transition-transform duration-300 ease-out group-hover:translate-x-1"
          >
            {ArrowIcon}
          </span>
        </span>
      </span>
    </motion.button>
  );
}
