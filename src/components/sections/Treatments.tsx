import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Treatment } from '../../types/siteContent';
import { siteContent } from '../../data/siteContent';
import { Container } from '../ui/Container';
import { TreatmentCard } from '../treatments/TreatmentCard';
import { TreatmentModal } from '../treatments/TreatmentModal';
import { useTreatmentsFilter } from '../../context/TreatmentsFilterContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useHistoryLayer } from '../../hooks/useHistoryLayer';
import { buildTreatmentHash } from '../../utils/treatmentDeepLink';
import { Reveal } from '../motion/reveal';
import { EASE_OUT } from '../motion/variants';

const SPECIAL_OFFERS_FILTER_ID = 'condicoes-especiais';

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true" className={className}>
      <path
        d="M6.5 0.5c.3 2.1 1.1 2.9 3.2 3.2-2.1.3-2.9 1.1-3.2 3.2-.3-2.1-1.1-2.9-3.2-3.2 2.1-.3 2.9-1.1 3.2-3.2Z"
        fill="currentColor"
      />
      <path
        d="M10.8 7.3c.16 1.05.55 1.44 1.6 1.6-1.05.16-1.44.55-1.6 1.6-.16-1.05-.55-1.44-1.6-1.6 1.05-.16 1.44-.55 1.6-1.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Estilo compartilhado dos chips de categoria: selecionado usa o mesmo
 * tratamento sólido (fundo brown-dark) já aprovado no chip "Condições
 * especiais", para que o filtro ativo se destaque com uma única cor de
 * ênfase em vez de tons de dourado empilhados. */
function chipClass(active: boolean) {
  return `shrink-0 rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-wide transition-all duration-300 ${
    active
      ? 'border-gold bg-brown-dark text-cream-light shadow-warm-sm'
      : 'border-gold/25 bg-cream text-brown/60 hover:border-gold/60 hover:text-brown-dark active:border-gold/60 active:text-brown-dark'
  }`;
}

const CHIP_TAP = { scale: 0.96 };
const CHIP_TRANSITION = { duration: 0.2, ease: EASE_OUT };

export function Treatments() {
  const { treatments, treatmentCategories } = siteContent;
  const hasActiveSpecialOffers = treatments.some((treatment) => treatment.specialOffer?.active);
  const availableCategories = treatmentCategories.filter((category) =>
    treatments.some((treatment) => treatment.categoryId === category.id),
  );
  const {
    activeCategoryId,
    activeTreatmentIds,
    activeGoalLabel,
    selectCategory,
    highlightTreatmentId,
    clearHighlight,
    pendingTreatmentId,
    clearPendingTreatment,
  } = useTreatmentsFilter();
  const [search, setSearch] = useState('');
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const prefersReducedMotion = useReducedMotion();

  function closeTreatmentModal() {
    setSelectedTreatment(null);
  }

  // Faz o botão/gesto "Voltar" nativo do celular fechar o modal "Ver mais
  // detalhes" e devolver a cliente exatamente à seção Tratamentos, na mesma
  // posição de rolagem, em vez de sair do site -- ver `useHistoryLayer`.
  const requestCloseTreatmentModal = useHistoryLayer({
    layer: 'treatment-details',
    isOpen: selectedTreatment !== null,
    onPopClose: closeTreatmentModal,
    hash: selectedTreatment ? buildTreatmentHash(selectedTreatment.id) : undefined,
    data: selectedTreatment ? { treatmentId: selectedTreatment.id } : undefined,
  });

  // Consome um link direto (`#tratamento-{id}`) validado no carregamento da
  // página (ver `TreatmentDeepLinkGate` em `App.tsx`) -- localiza o
  // tratamento e abre o modal corretamente, em vez de deixar um hash inerte
  // ou um modal quebrado sem dados.
  useEffect(() => {
    if (!pendingTreatmentId) return;
    const found = treatments.find((item) => item.id === pendingTreatmentId);
    clearPendingTreatment();
    if (!found) return;
    document.getElementById('tratamentos')?.scrollIntoView({ behavior: 'auto', block: 'start' });
    setSelectedTreatment(found);
  }, [pendingTreatmentId, treatments, clearPendingTreatment]);

  // Tanto um filtro de categoria quanto o filtro especial por ids (vindo dos
  // cards de "Qual cuidado sua pele precisa?") descartam uma busca antiga
  // incompatível, para que ela não continue escondendo os tratamentos que
  // deveriam aparecer.
  useEffect(() => {
    if (activeCategoryId || activeTreatmentIds) setSearch('');
  }, [activeCategoryId, activeTreatmentIds]);

  // Rola até o tratamento principal pedido pelos cards de "Qual cuidado sua
  // pele precisa?" e o destaca por ~2s. Se o id não existir no DOM ainda
  // (ex.: a busca antiga não foi limpa nesta mesma leva de atualizações),
  // aguardamos o efeito acima antes de desistir, em vez de cancelar o
  // destaque prematuramente.
  useEffect(() => {
    if (!highlightTreatmentId) return;

    const node = document.getElementById(`servico-${highlightTreatmentId}`);
    if (!node) {
      if (search.trim().length > 0) return;
      clearHighlight();
      return;
    }

    node.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    const timeout = window.setTimeout(clearHighlight, 2000);
    return () => window.clearTimeout(timeout);
  }, [highlightTreatmentId, search, clearHighlight, prefersReducedMotion]);

  const filteredTreatments = useMemo(() => {
    return treatments.filter((treatment) => {
      // O filtro especial por ids (cards de "Qual cuidado sua pele precisa?")
      // tem prioridade e ignora categoria/busca -- mostra só os tratamentos
      // relacionados, na ordem oficial do catálogo, até o cliente escolher
      // outro filtro ou "Ver todos os tratamentos".
      if (activeTreatmentIds) return activeTreatmentIds.includes(treatment.id);

      const matchesCategory =
        !activeCategoryId ||
        (activeCategoryId === SPECIAL_OFFERS_FILTER_ID
          ? treatment.specialOffer?.active === true
          : treatment.categoryId === activeCategoryId);
      const matchesSearch =
        search.trim().length === 0 ||
        treatment.name.toLowerCase().includes(search.toLowerCase()) ||
        (treatment.summary ?? '').toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [treatments, activeCategoryId, activeTreatmentIds, search]);

  return (
    <section
      id="tratamentos"
      className="relative overflow-hidden bg-gradient-to-b from-cream-light/60 via-cream to-cream py-24 sm:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(167, 136, 127, 0.14),transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-beige/35 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-gold/10 blur-3xl"
      />

      <Container className="relative flex flex-col gap-10 sm:gap-14">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
          <Reveal
            as="span"
            className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-cream px-4 py-1.5 text-xs font-medium uppercase tracking-[0.28em] text-gold-deep shadow-warm-sm"
          >
            <SparkleIcon />
            Tratamentos
          </Reveal>
          <Reveal
            as="h2"
            delay={0.08}
            className="text-3xl leading-[1.12] text-brown-dark sm:text-4xl md:text-[3.1rem]"
          >
            Cuidados pensados para a individualidade da sua pele
          </Reveal>
          <Reveal
            aria-hidden
            delay={0.16}
            className="h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent"
          />
          <Reveal as="p" delay={0.2} className="text-base leading-relaxed text-brown/75 sm:text-lg">
            Cada tratamento é indicado a partir de uma avaliação personalizada, com transparência sobre benefícios e cuidados.
          </Reveal>
        </div>

        <div className="flex flex-col gap-5 rounded-[2rem] border border-gold/15 bg-cream p-4 shadow-warm-sm sm:p-6">
          {activeTreatmentIds && activeGoalLabel && (
            <div className="flex flex-wrap items-center justify-center gap-2 self-center rounded-full border border-gold/40 bg-beige/30 px-4 py-2 text-xs font-medium uppercase tracking-wide text-brown-dark">
              <span>
                Tratamentos indicados para: <span className="text-gold-deep">{activeGoalLabel}</span>
              </span>
              <button
                type="button"
                onClick={() => selectCategory(null)}
                aria-label="Limpar filtro e ver todos os tratamentos"
                className="flex h-5 w-5 items-center justify-center rounded-full border border-gold/40 text-brown-dark transition-colors hover:bg-gold/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
              >
                <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          )}

          <div className="relative">
            <div className="chip-row-scroll flex gap-2.5 overflow-x-auto pb-1 lg:flex-wrap lg:justify-center lg:overflow-visible lg:pb-0">
              <motion.button
                type="button"
                onClick={() => selectCategory(null)}
                aria-pressed={activeCategoryId === null && activeTreatmentIds === null}
                whileTap={CHIP_TAP}
                transition={CHIP_TRANSITION}
                className={chipClass(activeCategoryId === null && activeTreatmentIds === null)}
              >
                Todos os tratamentos
              </motion.button>
              {availableCategories.map((category) => (
                <motion.button
                  key={category.id}
                  type="button"
                  onClick={() => selectCategory(category.id)}
                  aria-pressed={activeCategoryId === category.id}
                  title={category.description}
                  whileTap={CHIP_TAP}
                  transition={CHIP_TRANSITION}
                  className={chipClass(activeCategoryId === category.id)}
                >
                  {category.name}
                </motion.button>
              ))}
              {hasActiveSpecialOffers && (
                <motion.button
                  type="button"
                  onClick={() => selectCategory(SPECIAL_OFFERS_FILTER_ID)}
                  aria-pressed={activeCategoryId === SPECIAL_OFFERS_FILTER_ID}
                  whileTap={CHIP_TAP}
                  transition={CHIP_TRANSITION}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 font-heading text-xs tracking-wide transition-all duration-300 ${
                    activeCategoryId === SPECIAL_OFFERS_FILTER_ID
                      ? 'border-gold bg-brown-dark text-cream-light shadow-warm-sm'
                      : 'border-gold/60 bg-beige/40 text-brown-dark hover:border-gold active:border-gold'
                  }`}
                >
                  <SparkleIcon />
                  Condições especiais
                </motion.button>
              )}
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-cream to-transparent lg:hidden"
            />
          </div>

          {treatments.length > 0 && (
            <label className="relative mx-auto w-full sm:w-72">
              <span className="sr-only">Buscar tratamento</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar tratamento..."
                className="w-full rounded-full border border-gold/30 bg-cream-light/40 px-5 py-2.5 text-sm text-brown-dark placeholder:text-brown/40 focus:border-gold focus:bg-cream"
              />
            </label>
          )}
        </div>

        {treatments.length > 0 && filteredTreatments.length === 0 && (
          <p className="text-center text-sm text-brown/60">
            {search.trim().length > 0
              ? 'Nenhum tratamento encontrado para essa busca.'
              : 'Nenhum tratamento disponível nesta categoria no momento.'}
          </p>
        )}

        {filteredTreatments.length > 0 && (
          <motion.div layout className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredTreatments.map((treatment, index) => (
                <motion.div
                  key={treatment.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.5, ease: EASE_OUT, delay: Math.min(index * 0.05, 0.3) }}
                  className="h-full"
                >
                  <TreatmentCard
                    treatment={treatment}
                    onViewDetails={setSelectedTreatment}
                    isHighlighted={treatment.id === highlightTreatmentId}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {(activeCategoryId !== null || activeTreatmentIds !== null) && (
          <div className="flex justify-center">
            <motion.button
              type="button"
              onClick={() => selectCategory(null)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.975 }}
              transition={CHIP_TRANSITION}
              className="rounded-full border border-gold/40 bg-cream-light/60 px-6 py-3 text-sm font-medium text-brown-dark shadow-warm-sm transition-all duration-300 hover:border-gold/70 hover:shadow-warm active:border-gold/70 active:shadow-warm"
            >
              Ver todos os tratamentos
            </motion.button>
          </div>
        )}
      </Container>

      <TreatmentModal treatment={selectedTreatment} onClose={requestCloseTreatmentModal} />
    </section>
  );
}
