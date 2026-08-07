import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export interface SelectionItem {
  id: string;
  type: 'treatment';
  name: string;
  category?: string;
}

interface SelectionContextValue {
  items: SelectionItem[];
  addItem: (item: SelectionItem) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
  isSelected: (id: string) => boolean;
  toastMessage: string | null;
  notify: (message: string) => void;
  isPanelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
}

const SelectionContext = createContext<SelectionContextValue | undefined>(undefined);

/** Chave usada quando a seleção ainda era persistida em localStorage. A
 * seleção agora vive só em memória (dado de cliente não pode sobreviver a um
 * F5 ou a uma nova visita); isto só limpa resíduo deixado por sessões
 * anteriores ao carregar o app. */
const LEGACY_STORAGE_KEY = 'estetica-mariangela:minha-selecao';

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<SelectionItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // storage indisponível — nada para limpar
    }
  }, []);

  const notify = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  const addItem = useCallback(
    (item: SelectionItem) => {
      setItems((current) => {
        if (current.some((existing) => existing.id === item.id)) {
          notify('Este serviço já está na sua seleção.');
          return current;
        }
        notify(`${item.name} adicionado à sua seleção ✓`);
        return [...current, item];
      });
    },
    [notify],
  );

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const clearItems = useCallback(() => {
    setItems([]);
  }, []);

  const isSelected = useCallback(
    (id: string) => items.some((item) => item.id === id),
    [items],
  );

  useEffect(() => {
    if (!toastMessage) return;
    const timeout = window.setTimeout(() => setToastMessage(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  const openPanel = useCallback(() => setIsPanelOpen(true), []);
  const closePanel = useCallback(() => setIsPanelOpen(false), []);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      clearItems,
      isSelected,
      toastMessage,
      notify,
      isPanelOpen,
      openPanel,
      closePanel,
    }),
    [items, addItem, removeItem, clearItems, isSelected, toastMessage, notify, isPanelOpen, openPanel, closePanel],
  );

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useSelection(): SelectionContextValue {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error('useSelection deve ser usado dentro de um SelectionProvider');
  }
  return context;
}
