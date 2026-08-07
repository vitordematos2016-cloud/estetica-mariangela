import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { CredentialItem } from '../../types/siteContent';
import { PlaceholderMedia } from '../ui/PlaceholderMedia';
import { useScrollLock } from '../../hooks/useScrollLock';
import { useHeldValue } from '../../hooks/useHeldValue';
import { EASE_OUT, overlayBackdropVariants } from '../motion/variants';

interface CertificateLightboxProps {
  items: CredentialItem[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function CertificateLightbox({ items, activeIndex, onClose, onNavigate }: CertificateLightboxProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const isOpen = activeIndex !== null;
  // Mantém o índice do último certificado aberto durante a animação de saída
  // — `activeIndex` já volta a `null` no instante do fechamento.
  const displayIndex = useHeldValue(activeIndex);

  useScrollLock(isOpen);

  useEffect(() => {
    setIsZoomed(false);
  }, [activeIndex]);

  useEffect(() => {
    if (!isOpen || activeIndex === null) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight' && activeIndex !== null && activeIndex < items.length - 1) {
        onNavigate(activeIndex + 1);
      }
      if (event.key === 'ArrowLeft' && activeIndex !== null && activeIndex > 0) {
        onNavigate(activeIndex - 1);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, items.length, onClose, onNavigate]);

  if (displayIndex === null) return null;
  const item = items[displayIndex];
  if (!item) return null;

  const hasPrev = displayIndex > 0;
  const hasNext = displayIndex < items.length - 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Certificado: ${item.title}`}
          className="fixed inset-0 z-[110] flex flex-col items-center justify-center gap-4 bg-brown-dark/90 px-4 py-8"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayBackdropVariants}
        >
      <motion.button
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.92 }}
        transition={{ duration: 0.15, ease: EASE_OUT }}
        className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-cream-light/40 text-cream-light transition-colors hover:bg-cream-light/10 active:bg-cream-light/15"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </motion.button>

      <div className="relative flex w-full max-w-2xl flex-1 items-center justify-center">
        {hasPrev && (
          <motion.button
            type="button"
            onClick={() => onNavigate(displayIndex - 1)}
            aria-label="Certificado anterior"
            whileHover={{ scale: 1.06, x: -2 }}
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.15, ease: EASE_OUT }}
            className="absolute left-0 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-cream-light/40 text-cream-light transition-colors hover:bg-cream-light/10 active:bg-cream-light/15 sm:-left-4"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M11 3l-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        )}

        <motion.button
          type="button"
          onClick={() => setIsZoomed((current) => !current)}
          aria-label={isZoomed ? 'Reduzir zoom' : 'Ampliar zoom'}
          whileTap={{ scale: 0.985 }}
          transition={{ duration: 0.15, ease: EASE_OUT }}
          className="max-h-[70vh] w-full max-w-md overflow-hidden rounded-2xl border border-gold/40 bg-cream shadow-warm"
        >
          <PlaceholderMedia
            label={item.title}
            description="Imagem do certificado em preparação"
            ratio="portrait"
            className={`rounded-none transition-transform duration-300 ${isZoomed ? 'scale-125' : 'scale-100'}`}
          />
        </motion.button>

        {hasNext && (
          <motion.button
            type="button"
            onClick={() => onNavigate(displayIndex + 1)}
            aria-label="Próximo certificado"
            whileHover={{ scale: 1.06, x: 2 }}
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.15, ease: EASE_OUT }}
            className="absolute right-0 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-cream-light/40 text-cream-light transition-colors hover:bg-cream-light/10 active:bg-cream-light/15 sm:-right-4"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M7 3l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        )}
      </div>

      <div className="text-center text-cream-light">
        <p className="text-sm font-medium">{item.title}</p>
        {item.institution && <p className="text-xs text-cream-light/70">{item.institution}</p>}
        {items.length > 1 && (
          <p className="mt-1 text-xs text-cream-light/50">
            {displayIndex + 1} de {items.length}
          </p>
        )}
      </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
