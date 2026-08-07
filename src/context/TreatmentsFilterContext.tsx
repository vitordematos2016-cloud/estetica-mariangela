import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { siteContent } from '../data/siteContent';

interface TreatmentsFilterContextValue {
  activeCategoryId: string | null;
  /** Lista de ids ativa quando o filtro veio de um card de "Qual cuidado sua
   * pele precisa?" (`requestTreatmentsFilterByGoal`) -- nunca combinada com
   * `activeCategoryId`, que fica null enquanto esta lista estiver ativa. */
  activeTreatmentIds: string[] | null;
  /** Rótulo do objetivo que gerou `activeTreatmentIds` (ex.: "Melhorar
   * manchas"), usado só para exibir "Tratamentos para: {label}" -- sempre
   * null quando o filtro veio de um chip de categoria comum. */
  activeGoalLabel: string | null;
  /** Seleciona uma categoria (ou `null` para "Todos os tratamentos") e
   * sempre limpa o filtro especial por ids -- é assim que os chips normais e
   * o botão "Ver todos os tratamentos" encerram o modo vindo do card. */
  selectCategory: (categoryId: string | null) => void;
  highlightTreatmentId: string | null;
  /** Filtra a grade pelos ids relacionados a um objetivo de pele e marca o
   * primeiro id válido para ser localizado e destacado. Ids que não existem
   * mais no catálogo são descartados; se nenhum sobrar, não altera nada e
   * retorna null (o card cai no salto padrão para `#tratamentos`, sem deixar
   * a seção presa em um estado vazio). */
  requestTreatmentsFilterByGoal: (goalLabel: string, treatmentIds: string[]) => string | null;
  clearHighlight: () => void;
  /** Id de tratamento pedido por um link direto (`#tratamento-{id}`) ainda não
   * consumido pela seção Tratamentos -- `null` quando não há nenhum pendente. */
  pendingTreatmentId: string | null;
  /** Registrado pelo carregamento inicial da página quando a URL já chega com
   * um hash de tratamento válido; a seção Tratamentos consome e abre o modal. */
  requestDeepLinkTreatment: (treatmentId: string) => void;
  clearPendingTreatment: () => void;
}

const TreatmentsFilterContext = createContext<TreatmentsFilterContextValue | undefined>(
  undefined,
);

export function TreatmentsFilterProvider({ children }: { children: ReactNode }) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [activeTreatmentIds, setActiveTreatmentIds] = useState<string[] | null>(null);
  const [activeGoalLabel, setActiveGoalLabel] = useState<string | null>(null);
  const [highlightTreatmentId, setHighlightTreatmentId] = useState<string | null>(null);
  const [pendingTreatmentId, setPendingTreatmentId] = useState<string | null>(null);

  const selectCategory = useCallback((categoryId: string | null) => {
    setActiveCategoryId(categoryId);
    setActiveTreatmentIds(null);
    setActiveGoalLabel(null);
  }, []);

  const requestTreatmentsFilterByGoal = useCallback((goalLabel: string, treatmentIds: string[]) => {
    const validIds = treatmentIds.filter((id) => siteContent.treatments.some((t) => t.id === id));
    if (validIds.length === 0) return null;
    setActiveCategoryId(null);
    setActiveTreatmentIds(validIds);
    setActiveGoalLabel(goalLabel);
    setHighlightTreatmentId(validIds[0]);
    return validIds[0];
  }, []);

  const clearHighlight = useCallback(() => {
    setHighlightTreatmentId(null);
  }, []);

  const requestDeepLinkTreatment = useCallback((treatmentId: string) => {
    setPendingTreatmentId(treatmentId);
  }, []);

  const clearPendingTreatment = useCallback(() => {
    setPendingTreatmentId(null);
  }, []);

  const value = useMemo(
    () => ({
      activeCategoryId,
      activeTreatmentIds,
      activeGoalLabel,
      selectCategory,
      highlightTreatmentId,
      requestTreatmentsFilterByGoal,
      clearHighlight,
      pendingTreatmentId,
      requestDeepLinkTreatment,
      clearPendingTreatment,
    }),
    [
      activeCategoryId,
      activeTreatmentIds,
      activeGoalLabel,
      selectCategory,
      highlightTreatmentId,
      requestTreatmentsFilterByGoal,
      clearHighlight,
      pendingTreatmentId,
      requestDeepLinkTreatment,
      clearPendingTreatment,
    ],
  );

  return (
    <TreatmentsFilterContext.Provider value={value}>{children}</TreatmentsFilterContext.Provider>
  );
}

export function useTreatmentsFilter(): TreatmentsFilterContextValue {
  const context = useContext(TreatmentsFilterContext);
  if (!context) {
    throw new Error('useTreatmentsFilter deve ser usado dentro de um TreatmentsFilterProvider');
  }
  return context;
}
