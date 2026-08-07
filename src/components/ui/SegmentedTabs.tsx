import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { EASE_IN, EASE_OUT, PREMIUM_HOVER_TRANSITION, PREMIUM_TAP_TRANSITION } from '../motion/variants';
import { useGoldRipple } from '../../hooks/useGoldRipple';

export interface SegmentedTabItem {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface SegmentedTabsProps {
  items: SegmentedTabItem[];
  activeId: string;
  onChange: (id: string) => void;
  /** Identificador único do grupo -- isola a barra deslizante deste grupo da
   * de outro `SegmentedTabs` na mesma árvore (ex.: nível de conteúdo vs. nível
   * de tipo de mídia). */
  layoutId: string;
  'aria-label': string;
  size?: 'sm' | 'md';
}

/**
 * Abas premium reutilizáveis com barra dourada deslizante (`layoutId` faz o
 * Motion animar a barra entre os botões automaticamente via FLIP). Usadas
 * tanto para o nível "Conteúdo" (Procedimento/Antes-Depois) quanto para o
 * nível "Tipo de mídia" (Imagem/Vídeo) do showcase de mídia do tratamento.
 */
export function SegmentedTabs({ items, activeId, onChange, layoutId, size = 'md', ...rest }: SegmentedTabsProps) {
  if (items.length === 0) return null;

  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  const paddingClasses = size === 'sm' ? 'px-3.5 py-1.5' : 'px-4 py-2';

  return (
    <div
      role="tablist"
      aria-label={rest['aria-label']}
      className="flex flex-wrap items-center gap-1.5"
    >
      <AnimatePresence initial={false} mode="popLayout">
        {items.map((item) => (
          <SegmentedTabButton
            key={item.id}
            item={item}
            isActive={item.id === activeId}
            onSelect={() => onChange(item.id)}
            layoutId={layoutId}
            textSize={textSize}
            paddingClasses={paddingClasses}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface SegmentedTabButtonProps {
  item: SegmentedTabItem;
  isActive: boolean;
  onSelect: () => void;
  layoutId: string;
  textSize: string;
  paddingClasses: string;
}

function SegmentedTabButton({
  item,
  isActive,
  onSelect,
  layoutId,
  textSize,
  paddingClasses,
}: SegmentedTabButtonProps) {
  const { onPointerDown, rippleLayer } = useGoldRipple();

  return (
    <motion.button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={onSelect}
      onPointerDown={onPointerDown}
      layout
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.18, ease: EASE_IN } }}
      transition={{ duration: 0.22, ease: EASE_OUT }}
      whileHover={{
        y: -2,
        boxShadow: '0 6px 16px -8px rgba(167, 136, 127, 0.45)',
        transition: PREMIUM_HOVER_TRANSITION,
      }}
      whileTap={{ scale: 0.97, transition: PREMIUM_TAP_TRANSITION }}
      className={`relative overflow-hidden rounded-full border ${paddingClasses} ${textSize} font-medium tracking-wide transition-colors duration-200 ${
        isActive
          ? 'border-gold/70 bg-gold/10 text-brown-dark'
          : 'border-gold/30 bg-cream/40 text-brown/60 hover:border-gold/50 hover:bg-gold/5'
      }`}
    >
      {rippleLayer}
      <span className="relative z-10 flex items-center gap-1.5">
        {item.icon && (
          <motion.span
            aria-hidden="true"
            animate={{ scale: isActive ? 1.12 : 1, opacity: isActive ? 1 : 0.7 }}
            transition={PREMIUM_HOVER_TRANSITION}
            className="inline-flex"
          >
            {item.icon}
          </motion.span>
        )}
        <motion.span
          animate={{ fontWeight: isActive ? 600 : 500 }}
          transition={PREMIUM_HOVER_TRANSITION}
        >
          {item.label}
        </motion.span>
      </span>
      {isActive && (
        <motion.span
          layoutId={layoutId}
          aria-hidden="true"
          className="absolute inset-x-3 bottom-1 h-[2px] rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-soft"
          transition={{ duration: 0.28, ease: EASE_OUT }}
        />
      )}
    </motion.button>
  );
}
