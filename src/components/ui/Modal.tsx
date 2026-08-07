import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useScrollLock } from '../../hooks/useScrollLock';
import { EASE_OUT, overlayBackdropVariants, overlayPanelVariants } from '../motion/variants';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useScrollLock(isOpen);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
    } else {
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
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
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayBackdropVariants}
        >
          <button
            aria-label="Fechar"
            className="absolute inset-0 bg-brown-dark/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="relative z-10 max-h-[85dvh] w-full max-w-lg overflow-y-auto rounded-[2rem] bg-cream p-7 shadow-warm sm:p-9"
            variants={overlayPanelVariants}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <h3 id="modal-title" className="text-2xl text-brown-dark">
                {title}
              </h3>
              <motion.button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Fechar detalhes"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.92 }}
                transition={{ duration: 0.15, ease: EASE_OUT }}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 text-brown-dark transition-colors hover:bg-gold/10 active:bg-gold/15"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M1 1l14 14M15 1L1 15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
