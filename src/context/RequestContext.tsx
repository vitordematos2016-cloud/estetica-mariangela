import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

/**
 * Estado que o formulário único de "Solicitar atendimento" usa para
 * pré-preencher o campo "Tratamento de interesse":
 * - "treatments": um ou mais tratamentos já escolhidos (clique num
 *   tratamento específico ou "Conversar sobre minha seleção") -- o campo vem
 *   travado, sem obrigar a cliente a procurar de novo.
 * - "avaliacao": botões de avaliação abrem com essa opção pré-selecionada no
 *   campo (ainda editável).
 * - "open": botões genéricos ("Solicitar atendimento") abrem o campo em
 *   branco, com as 3 opções (avaliação / ainda não sei / lista de
 *   tratamentos) para a cliente escolher.
 */
export type RequestPrefillMode = 'open' | 'avaliacao' | 'treatments';

export interface RequestPrefill {
  mode: RequestPrefillMode;
  treatmentNames?: string[];
}

interface OpenRequestOptions {
  mode?: 'avaliacao';
  treatmentNames?: string[];
}

interface RequestContextValue {
  isOpen: boolean;
  prefill: RequestPrefill;
  /** Muda a cada `openRequest` -- usado como `key` do formulário para
   * garantir um estado limpo (nome, seleção) sempre que o modal reabre,
   * mesmo que o tratamento pré-preenchido seja o mesmo de antes. */
  openId: number;
  openRequest: (options?: OpenRequestOptions) => void;
  closeRequest: () => void;
}

const RequestContext = createContext<RequestContextValue | undefined>(undefined);

const DEFAULT_PREFILL: RequestPrefill = { mode: 'open' };

export function RequestProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prefill, setPrefill] = useState<RequestPrefill>(DEFAULT_PREFILL);
  const [openId, setOpenId] = useState(0);

  const openRequest = useCallback((options?: OpenRequestOptions) => {
    const treatmentNames = (options?.treatmentNames ?? []).filter((name) => name.trim().length > 0);

    const nextPrefill: RequestPrefill =
      treatmentNames.length > 0
        ? { mode: 'treatments', treatmentNames }
        : options?.mode === 'avaliacao'
          ? { mode: 'avaliacao' }
          : { mode: 'open' };

    setPrefill(nextPrefill);
    setOpenId((current) => current + 1);
    setIsOpen(true);
  }, []);

  const closeRequest = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, prefill, openId, openRequest, closeRequest }),
    [isOpen, prefill, openId, openRequest, closeRequest],
  );

  return <RequestContext.Provider value={value}>{children}</RequestContext.Provider>;
}

export function useRequest(): RequestContextValue {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error('useRequest deve ser usado dentro de um RequestProvider');
  }
  return context;
}
