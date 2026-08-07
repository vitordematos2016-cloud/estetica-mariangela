import { motion } from 'motion/react';
import { EASE_OUT } from '../../motion/variants';

interface CarouselIndicatorsProps {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
}

/**
 * Indicadores modernos com a barra ativa alongando e deslizando -- `layout="position"`
 * deixa o Motion suavizar apenas o deslocamento causado pelos vizinhos
 * mudando de largura, enquanto a própria largura/cor anima via transição CSS
 * comum (evita duplicar a mesma animação em dois sistemas). Só deve ser
 * renderizado pelo chamador quando há mais de um item.
 */
export function CarouselIndicators({ count, activeIndex, onSelect }: CarouselIndicatorsProps) {
  return (
    <div className="absolute inset-x-0 bottom-3 z-20 flex items-center justify-center gap-1.5">
      {Array.from({ length: count }, (_, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={index}
            type="button"
            aria-label={`Ir para item ${index + 1}`}
            aria-current={isActive}
            onClick={() => onSelect(index)}
            className="flex h-3 items-center justify-center px-0.5"
          >
            <motion.span
              layout="position"
              transition={{ duration: 0.3, ease: EASE_OUT }}
              className={`block h-1.5 rounded-full transition-[width,background-color] duration-300 ease-out ${
                isActive ? 'w-5 bg-gold' : 'w-1.5 bg-cream-light/70 hover:bg-gold/60'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
