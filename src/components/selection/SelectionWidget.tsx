import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useSelection } from '../../context/SelectionContext';
import { useRequest } from '../../context/RequestContext';
import { useScrollLock } from '../../hooks/useScrollLock';
import { EASE_OUT } from '../motion/variants';

export function SelectionWidget() {
  const { items, removeItem, clearItems, isPanelOpen, openPanel, closePanel, toastMessage, notify } =
    useSelection();
  const { openRequest } = useRequest();
  const [confirmingClear, setConfirmingClear] = useState(false);

  useScrollLock(isPanelOpen);

  useEffect(() => {
    if (!isPanelOpen) {
      setConfirmingClear(false);
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') closePanel();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isPanelOpen, closePanel]);

  useEffect(() => {
    if (items.length === 0 && isPanelOpen) closePanel();
  }, [items.length, isPanelOpen, closePanel]);

  function handleConfirmClear() {
    clearItems();
    setConfirmingClear(false);
    closePanel();
    notify('Sua seleção foi limpa.');
  }

  function handleContinueSelection() {
    const treatmentNames = items.map((item) => item.name);
    closePanel();
    openRequest({ treatmentNames });
  }

  return (
    <>
      {items.length > 0 && (
        <motion.button
          type="button"
          onClick={openPanel}
          aria-label={`Minha seleção, ${items.length} ${items.length === 1 ? 'item' : 'itens'}`}
          whileHover={{ y: -2, scale: 1.03 }}
          whileTap={{ scale: 0.975 }}
          transition={{ duration: 0.2, ease: EASE_OUT }}
          className="fixed bottom-6 right-5 z-40 flex items-center gap-2 rounded-full bg-brown-dark px-5 py-3.5 text-cream shadow-warm sm:bottom-8 sm:right-8"
        >
          <svg width="18" height="18" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <path
              d="M2 3h2l1.6 10.6a2 2 0 0 0 2 1.7h8.4a2 2 0 0 0 2-1.7L20 6H5.2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="9" cy="19" r="1.4" fill="currentColor" />
            <circle cx="16" cy="19" r="1.4" fill="currentColor" />
          </svg>
          <span className="text-sm font-medium">Minha seleção • {items.length}</span>
        </motion.button>
      )}

      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-24 left-1/2 z-40 -translate-x-1/2 px-4 sm:bottom-28 sm:left-auto sm:right-8 sm:translate-x-0"
      >
        {toastMessage && (
          <div className="rounded-xl border border-gold/30 bg-cream-light px-4 py-3 text-center text-sm text-brown-dark shadow-warm fade-up">
            {toastMessage}
          </div>
        )}
      </div>

      {isPanelOpen && (
        <div className="fixed inset-0 z-[90] flex justify-end">
          <button
            aria-label="Fechar minha seleção"
            className="absolute inset-0 bg-brown-dark/50 backdrop-blur-sm"
            onClick={closePanel}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="selection-panel-title"
            className="relative z-10 flex h-full w-full max-w-sm flex-col bg-cream p-6 shadow-warm sm:p-8"
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 id="selection-panel-title" className="text-2xl text-brown-dark">
                Minha Seleção
              </h3>
              <motion.button
                type="button"
                onClick={closePanel}
                aria-label="Fechar"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.92 }}
                transition={{ duration: 0.15, ease: EASE_OUT }}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-brown-dark transition-colors hover:bg-gold/10 active:bg-gold/15"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path
                    d="M1 1l12 12M13 1L1 13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.button>
            </div>

            <p className="mb-6 text-sm text-brown/60">
              {items.length} {items.length === 1 ? 'item selecionado' : 'itens selecionados'}
            </p>

            <ul className="flex flex-1 flex-col gap-3 overflow-y-auto">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-gold/20 bg-cream-light/40 px-4 py-3"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm text-brown-dark">{item.name}</span>
                    {item.category && (
                      <span className="text-xs uppercase tracking-wide text-gold-deep">{item.category}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remover ${item.name} da seleção`}
                    className="text-xs font-medium uppercase tracking-wide text-brown/60 transition-colors hover:text-gold active:text-gold"
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-3">
              {confirmingClear ? (
                <div className="flex flex-col gap-3 rounded-xl border border-gold/30 bg-cream-light/50 p-4">
                  <p className="text-sm text-brown-dark">
                    Deseja remover todos os serviços da sua seleção?
                  </p>
                  <div className="flex gap-3">
                    <motion.button
                      type="button"
                      onClick={() => setConfirmingClear(false)}
                      whileHover={{ y: -1.5 }}
                      whileTap={{ scale: 0.975 }}
                      transition={{ duration: 0.2, ease: EASE_OUT }}
                      className="flex-1 rounded-full border border-gold/50 px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-brown-dark transition-colors hover:bg-gold/10 active:bg-gold/15"
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={handleConfirmClear}
                      whileHover={{ y: -1.5 }}
                      whileTap={{ scale: 0.975 }}
                      transition={{ duration: 0.2, ease: EASE_OUT }}
                      className="flex-1 rounded-full bg-brown-dark px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-cream transition-colors hover:bg-brown"
                    >
                      Limpar seleção
                    </motion.button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setConfirmingClear(true)}
                    className="text-xs font-medium uppercase tracking-wide text-brown/60 transition-colors hover:text-gold active:text-gold"
                  >
                    Limpar seleção
                  </button>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <motion.button
                      type="button"
                      onClick={closePanel}
                      whileHover={{ y: -1.5 }}
                      whileTap={{ scale: 0.975 }}
                      transition={{ duration: 0.2, ease: EASE_OUT }}
                      className="flex-1 rounded-full border border-gold/50 px-6 py-3.5 text-sm font-medium text-brown-dark transition-colors hover:bg-gold/10 active:bg-gold/15"
                    >
                      Continuar navegando
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={handleContinueSelection}
                      disabled={items.length === 0}
                      whileHover={items.length === 0 ? undefined : { y: -1.5 }}
                      whileTap={items.length === 0 ? undefined : { scale: 0.975 }}
                      transition={{ duration: 0.2, ease: EASE_OUT }}
                      className="flex-1 rounded-full bg-brown-dark px-6 py-3.5 text-center text-sm font-medium text-cream transition-colors hover:bg-brown disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-brown-dark"
                    >
                      Conversar sobre minha seleção
                    </motion.button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
