import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import type { TreatmentMedia } from '../../../types/siteContent';
import { useScrollLock } from '../../../hooks/useScrollLock';
import { lightboxMediaVariants, overlayBackdropVariants } from '../../motion/variants';
import { CarouselArrows } from './CarouselArrows';
import { CarouselIndicators } from './CarouselIndicators';

interface MediaLightboxProps {
  isOpen: boolean;
  slides: TreatmentMedia[];
  activeIndex: number;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
  videoRef: RefObject<HTMLVideoElement | null>;
}

const SWIPE_DISMISS_OFFSET = 110;
const SWIPE_DISMISS_VELOCITY = 500;

/**
 * Visualização em tela cheia -- renderizada via portal direto em
 * `document.body` porque o painel do `Modal` (src/components/ui/Modal.tsx)
 * é um `motion.div` animado (Framer aplica `transform` inline nele), o que
 * cria um *containing block* para `position: fixed` -- sem o portal, este
 * lightbox ficaria preso aos limites do painel em vez de ocupar a tela
 * inteira. `object-fit: contain` sempre, nunca corta e nunca aplica zoom
 * além da resolução natural; a animação de entrada termina em `scale(1)`.
 */
export function MediaLightbox({ isOpen, slides, activeIndex, onClose, onSelectIndex, videoRef }: MediaLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useScrollLock(isOpen);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      closeButtonRef.current?.focus();
    } else {
      previousFocusRef.current?.focus();
      videoRef.current?.pause();
    }
  }, [isOpen, videoRef]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key === 'ArrowRight') {
        onSelectIndex((activeIndex + 1) % slides.length);
        return;
      }
      if (event.key === 'ArrowLeft') {
        onSelectIndex((activeIndex - 1 + slides.length) % slides.length);
        return;
      }
      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onSelectIndex, activeIndex, slides.length]);

  const activeMedia = slides[activeIndex];

  return createPortal(
    <AnimatePresence>
      {isOpen && activeMedia && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Visualização ampliada"
          className="media-carousel fixed inset-0 z-[200] flex items-center justify-center bg-brown-dark/92 px-4"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayBackdropVariants}
        >
          <button
            type="button"
            aria-label="Fechar visualização"
            className="absolute inset-0"
            onClick={onClose}
          />

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            style={{ top: 'max(1rem, env(safe-area-inset-top))', right: 'max(1rem, env(safe-area-inset-right))' }}
            className="pointer-events-auto absolute z-10 flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 bg-brown-dark/60 text-cream-light backdrop-blur-sm transition-colors hover:border-gold hover:bg-brown-dark/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-brown-dark"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          {/* `pointer-events-none` deixa os cliques no espaço vazio passarem
              para o botão de fundo (fechar ao clicar fora) -- cada filho
              interativo reativa `pointer-events-auto` individualmente. */}
          <div className="relative flex h-full w-full items-center justify-center pointer-events-none">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeIndex}
                variants={lightboxMediaVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                drag={activeMedia.type === 'image' ? 'y' : false}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.5}
                dragSnapToOrigin
                onDragEnd={(_event, info) => {
                  if (info.offset.y > SWIPE_DISMISS_OFFSET || info.velocity.y > SWIPE_DISMISS_VELOCITY) {
                    onClose();
                  }
                }}
                className="pointer-events-auto flex items-center justify-center"
                style={{ maxWidth: '94vw', maxHeight: '90dvh' }}
              >
                {activeMedia.type === 'image' ? (
                  <img
                    src={activeMedia.src}
                    alt={activeMedia.alt}
                    className="block"
                    style={{ width: 'auto', height: 'auto', maxWidth: '94vw', maxHeight: '90dvh', objectFit: 'contain' }}
                  />
                ) : (
                  <video
                    ref={videoRef}
                    src={activeMedia.src}
                    poster={activeMedia.poster}
                    controls
                    muted
                    playsInline
                    preload="metadata"
                    className="block"
                    style={{ width: 'auto', height: 'auto', maxWidth: '94vw', maxHeight: '90dvh', objectFit: 'contain' }}
                  >
                    <track kind="captions" />
                  </video>
                )}
              </motion.div>
            </AnimatePresence>

            {slides.length > 1 && (
              <div className="contents pointer-events-auto">
                <CarouselArrows
                  onPrev={() => onSelectIndex((activeIndex - 1 + slides.length) % slides.length)}
                  onNext={() => onSelectIndex((activeIndex + 1) % slides.length)}
                />
              </div>
            )}
          </div>

          {slides.length > 1 && (
            <div className="contents pointer-events-auto">
              <CarouselIndicators count={slides.length} activeIndex={activeIndex} onSelect={onSelectIndex} />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
