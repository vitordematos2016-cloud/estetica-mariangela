import { useCallback, useEffect, useRef } from 'react';

export const HISTORY_APP_ID = 'estetica-mariangela';

interface HistoryLayerState {
  app: typeof HISTORY_APP_ID;
  layer: string;
  [key: string]: unknown;
}

interface UseHistoryLayerOptions {
  /** Nome estável da camada (ex.: "treatment-details", "media-fullscreen", "mobile-menu"). */
  layer: string;
  isOpen: boolean;
  /** Fechamento real (ex.: `setSelectedTreatment(null)`) -- só é chamado pelo
   * listener de `popstate` (botão/gesto Voltar nativo) ou como último
   * recurso, quando esta camada não tem entrada própria no histórico. */
  onPopClose: () => void;
  /** Hash opcional (sem "#") refletido na URL enquanto a camada está aberta. */
  hash?: string;
  /** Dados extras gravados no state do history (ex.: `{ treatmentId }`). */
  data?: Record<string, unknown>;
  /** Restaura a rolagem capturada na abertura quando a camada fecha --
   * correto para sobreposições que substituem a tela (modal, tela cheia),
   * erra para camadas de navegação como o menu mobile: se a rolagem mudou
   * *enquanto* a camada estava aberta (ex.: clicar num link do menu rola até
   * a seção e só depois o menu fecha), restaurar devolveria a cliente à
   * posição de antes de abrir o menu, desfazendo a navegação que ela acabou
   * de pedir. Default `true` (mantém o comportamento já usado por
   * modal/lightbox). */
  restoreScroll?: boolean;
}

function readLayerState(): HistoryLayerState | null {
  return (window.history.state as HistoryLayerState | null) ?? null;
}

/**
 * Faz o botão/gesto "Voltar" nativo fechar sobreposições internas (modal,
 * tela cheia, menu mobile) em vez de sair do site direto. Cada camada aberta
 * ganha no máximo uma entrada no histórico -- nunca duplicada, mesmo que
 * `hash`/`data` mudem enquanto ela permanece aberta (ex.: trocar de
 * tratamento sem fechar o modal só atualiza a entrada existente via
 * `replaceState`). Também guarda a posição de rolagem no instante em que a
 * camada abre e (quando `restoreScroll` não é `false`) a restaura no
 * instante em que ela fecha, por qualquer via.
 *
 * `requestClose` é o que os botões "X"/fechar, clique fora e Escape devem
 * chamar: se esta camada é dona da entrada no topo do histórico, desfaz essa
 * entrada (`history.back()`), o que dispara `popstate` e só então chama
 * `onPopClose` -- nunca os dois ao mesmo tempo, o que deixaria uma entrada
 * fantasma. Se uma camada aninhada (ex.: mídia em tela cheia dentro do modal)
 * estiver no topo, `requestClose` não faz nada -- quem deve responder é a
 * própria camada aninhada.
 */
export function useHistoryLayer({
  layer,
  isOpen,
  onPopClose,
  hash,
  data,
  restoreScroll = true,
}: UseHistoryLayerOptions): () => void {
  const ownsEntryRef = useRef(false);
  const wasOpenRef = useRef(false);
  const scrollYRef = useRef(0);
  const onPopCloseRef = useRef(onPopClose);
  onPopCloseRef.current = onPopClose;

  const dataKey = data ? JSON.stringify(data) : '';

  useEffect(() => {
    if (isOpen) {
      if (!wasOpenRef.current) {
        scrollYRef.current = window.scrollY;
      }
      wasOpenRef.current = true;

      const entryState: HistoryLayerState = { app: HISTORY_APP_ID, layer, ...(data ?? {}) };
      const current = readLayerState();

      if (current?.layer === layer) {
        if (hash) window.history.replaceState(entryState, '', `#${hash}`);
        else window.history.replaceState(entryState, '');
      } else {
        if (hash) window.history.pushState(entryState, '', `#${hash}`);
        else window.history.pushState(entryState, '');
        ownsEntryRef.current = true;
      }
      return;
    }

    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      // Se ainda "dona" da entrada aqui, o fechamento veio de um caminho que
      // não passou por `requestClose` nem por `popstate` (ex.: navegação do
      // menu mobile chamando `setIsMenuOpen(false)` direto para já ir rolando
      // até a seção) -- nesses dois outros casos `ownsEntryRef` já teria sido
      // zerado antes de chegar aqui. Sem isso, a entrada que empilhamos na
      // abertura ficaria fantasma no histórico (o botão "Voltar" nativo
      // precisaria de um toque a mais para realmente sair da página).
      if (ownsEntryRef.current) {
        ownsEntryRef.current = false;
        window.history.back();
      }
      if (restoreScroll) {
        const targetY = scrollYRef.current;
        requestAnimationFrame(() => {
          window.scrollTo({ top: targetY, behavior: 'auto' });
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, layer, hash, dataKey, restoreScroll]);

  useEffect(() => {
    function handlePopState() {
      if (!ownsEntryRef.current) return;
      if (readLayerState()?.layer !== layer) {
        ownsEntryRef.current = false;
        onPopCloseRef.current();
      }
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [layer]);

  return useCallback(() => {
    if (!ownsEntryRef.current) {
      onPopCloseRef.current();
      return;
    }
    if (readLayerState()?.layer === layer) {
      window.history.back();
    }
    // Senão: uma camada aninhada está no topo -- ela é quem deve responder.
  }, [layer]);
}
