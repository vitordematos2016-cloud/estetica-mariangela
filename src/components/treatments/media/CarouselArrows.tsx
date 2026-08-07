import { motion } from 'motion/react';
import { PREMIUM_HOVER_TRANSITION } from '../../motion/variants';
import { useGoldRipple } from '../../../hooks/useGoldRipple';

interface CarouselArrowsProps {
  onPrev: () => void;
  onNext: () => void;
  prevLabel?: string;
  nextLabel?: string;
}

/**
 * Setas premium do carrossel -- fundo creme translúcido com borda dourada
 * fina e ícone marrom/dourado profundo, para manter contraste suficiente
 * sobre qualquer foto/vídeo (claro ou escuro), diferente da versão anterior
 * (dourado fosco sobre fundo escuro, que sumia sobre mídias claras). Só deve
 * ser renderizado pelo chamador quando a lista ativa tem mais de um item.
 */
export function CarouselArrows({ onPrev, onNext, prevLabel = 'Item anterior', nextLabel = 'Próximo item' }: CarouselArrowsProps) {
  return (
    <>
      <CarouselArrow direction="prev" onClick={onPrev} label={prevLabel} />
      <CarouselArrow direction="next" onClick={onNext} label={nextLabel} />
    </>
  );
}

function CarouselArrow({
  direction,
  onClick,
  label,
}: {
  direction: 'prev' | 'next';
  onClick: () => void;
  label: string;
}) {
  const { onPointerDown, rippleLayer } = useGoldRipple();
  const isPrev = direction === 'prev';

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onPointerDown={onPointerDown}
      aria-label={label}
      whileHover={{
        scale: 1.06,
        x: isPrev ? -3 : 3,
        boxShadow: '0 0 0 4px rgba(174, 143, 134, 0.22), 0 6px 16px -6px rgba(58, 39, 35, 0.28)',
        transition: PREMIUM_HOVER_TRANSITION,
      }}
      whileTap={{ scale: 0.9, transition: { duration: 0.1 } }}
      style={{
        background: 'rgba(243, 229, 225, 0.9)',
        color: '#694e47',
        border: '1px solid rgba(174, 143, 134, 0.75)',
        boxShadow: '0 4px 14px rgba(58, 39, 35, 0.18)',
        backdropFilter: 'blur(8px)',
      }}
      className={`absolute top-1/2 z-20 -translate-y-1/2 ${
        isPrev ? 'left-4' : 'right-4'
      } flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl`}
    >
      {rippleLayer}
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        {isPrev ? (
          <path d="M10 2 4 8l6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M6 2l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </motion.button>
  );
}
