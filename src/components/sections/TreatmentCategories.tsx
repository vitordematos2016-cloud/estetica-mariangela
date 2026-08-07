import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { siteContent } from '../../data/siteContent';
import type { TreatmentCategoryGroup } from '../../types/siteContent';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { useTreatmentsFilter } from '../../context/TreatmentsFilterContext';
import { Reveal, RevealGroup, RevealItem } from '../motion/reveal';
import { EASE_OUT } from '../motion/variants';
import { useGoldRipple } from '../../hooks/useGoldRipple';
import { useMobileViewportActive } from '../../hooks/useMobileViewportActive';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { mobileCardTransition, mobileCardVariants } from '../motion/mobileActive';

/** Um ícone refinado por categoria -- traço fino, `currentColor` (herda a
 * cor dourada do selo de vidro), sem nenhum emoji nativo. Inspirados nos
 * símbolos pedidos (✨ 🌿 💎 🎯), redesenhados como linha/geometria para
 * combinar com o resto do site em vez de imitar o emoji colorido. */
const CATEGORY_ICONS: Record<string, ReactNode> = {
  // Brilho/estrelas -- Limpezas de Pele & Glow.
  'limpeza-glow': (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10.5 2.5c.45 3.2 1.55 4.3 4.75 4.75-3.2.45-4.3 1.55-4.75 4.75-.45-3.2-1.55-4.3-4.75-4.75 3.2-.45 4.3-1.55 4.75-4.75Z"
        fill="currentColor"
      />
      <path
        d="M5.4 12.2c.24 1.5.74 2 2.24 2.24-1.5.24-2 .74-2.24 2.24-.24-1.5-.74-2-2.24-2.24 1.5-.24 2-.74 2.24-2.24Z"
        fill="currentColor"
        opacity="0.75"
      />
    </svg>
  ),
  // Folha delicada -- Peelings & Renovação Celular.
  'peelings-renovacao': (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M4.5 15.2C3 10 5.8 4.8 13.2 3.4c1.9 7.2-1.6 11.6-8.7 11.8Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M4.7 15c2.6-3.2 5-5.8 8.3-9.9" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  ),
  // Diamante lapidado -- Alta Tecnologia & Rejuvenescimento.
  'alta-tecnologia': (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M5.3 4.5h9.4l2.3 3.6-6.5 8-6.5-8 2.3-3.6Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M5.3 4.5 8 8.1m6.7-3.6L12 8.1M2.5 8.1h15M8 8.1l2-3.6 2 3.6m-4 0 2 8"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
        opacity="0.85"
      />
    </svg>
  ),
  // Alvo/foco de precisão -- Remoção & Estética Especializada.
  'remocao-especializada': (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="10" cy="10" r="3.6" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="10" cy="10" r="1" fill="currentColor" />
    </svg>
  ),
};

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M2 7h10M8 3l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M2.5 7.2l3 3 6-6.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Selo de vidro/cristal ao redor do ícone: fundo translúcido em gradiente
 * (deixa a cor do card por baixo transparecer), borda dourada fina, brilho
 * interno simulando a borda de um vidro lapidado, e um reflexo diagonal que
 * desliza discretamente ao passar o mouse (`group-hover`) -- mesma
 * linguagem de "sweep" já usada nos cards de tratamento
 * (`TreatmentCoverFrame`) e no `shine` do `Button`, aplicada aqui só ao
 * selo do ícone para não competir com o card inteiro.
 */
function CrystalIconBadge({ children }: { children: ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gold/40 bg-gradient-to-br from-cream-light/90 via-cream/70 to-beige/50 text-gold-deep shadow-[inset_0_1px_1px_rgba(243, 229, 225, 0.7),inset_0_-6px_10px_-8px_rgba(123, 93, 85, 0.35),0_6px_16px_-8px_rgba(167, 136, 127, 0.5)] transition-all duration-300 group-hover:border-gold group-hover:shadow-[inset_0_1px_1px_rgba(243, 229, 225, 0.85),inset_0_-6px_10px_-8px_rgba(123, 93, 85, 0.4),0_10px_22px_-8px_rgba(167, 136, 127, 0.65)] group-focus-visible:border-gold group-data-[mobile-active=true]:border-gold"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-1/2 z-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-cream/80 to-transparent opacity-0 transition-[transform,opacity] duration-500 ease-out group-hover:translate-x-[220%] group-hover:opacity-100"
        style={{ transform: 'translateX(-40%)' }}
      />
      <span className="relative z-[1] transition-transform duration-300 group-hover:scale-110 group-data-[mobile-active=true]:scale-110">
        {children}
      </span>
    </span>
  );
}

interface CategoryCardProps {
  group: TreatmentCategoryGroup;
  isActive: boolean;
  onSelect: () => void;
}

/**
 * Cada card é o próprio controle de filtro -- um `<button>` inteiro
 * clicável (não um link, porque a ação é filtrar/rolar dentro da página, não
 * navegar), com `aria-pressed` refletindo se a categoria está ativa. Visual
 * "vidro lapidado": fundo translúcido em gradiente + `backdrop-blur`, borda
 * dourada fina (mais forte quando ativo), reflexo diagonal discreto e selo
 * de cristal ao redor do ícone (`CrystalIconBadge`). Toque no mobile ganha o
 * mesmo destaque do hover via `useMobileViewportActive` (cruzar a região
 * central da tela) + um ripple dourado no toque (`useGoldRipple`) -- nunca
 * depende de hover para funcionar.
 */
function CategoryCard({ group, isActive, onSelect }: CategoryCardProps) {
  const { ref, active, isMobileViewport } = useMobileViewportActive<HTMLButtonElement>();
  const { onPointerDown, rippleLayer } = useGoldRipple();
  const count = group.treatmentIds.length;

  return (
    <RevealItem>
      <motion.div
        variants={mobileCardVariants}
        initial={false}
        animate={isMobileViewport ? (active ? 'active' : 'rest') : undefined}
        transition={mobileCardTransition}
        className="h-full"
      >
        <motion.button
          ref={ref}
          type="button"
          aria-pressed={isActive}
          data-mobile-active={isMobileViewport ? active : undefined}
          onPointerDown={onPointerDown}
          onClick={onSelect}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.985 }}
          transition={{ duration: 0.25, ease: EASE_OUT }}
          className={`group relative flex h-full w-full flex-col items-start gap-4 overflow-hidden rounded-[1.75rem_1.75rem_1.75rem_0.75rem] border p-6 text-left backdrop-blur-md transition-colors duration-300 ${
            isActive
              ? 'border-gold bg-gradient-to-br from-beige/50 via-cream-light/70 to-gold-soft/15 shadow-warm'
              : 'border-gold/25 bg-gradient-to-br from-cream/70 via-cream-light/50 to-beige/25 shadow-warm-sm hover:border-gold hover:shadow-warm active:border-gold active:shadow-warm data-[mobile-active=true]:border-gold data-[mobile-active=true]:shadow-warm'
          }`}
        >
          {rippleLayer}

          {/* Reflexo diagonal do card inteiro -- mesma receita do `shine` de
              `Button`/`TreatmentCoverFrame`, só que bem mais discreto aqui
              (opacidade baixa) para não competir com o do selo do ícone. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -left-1/3 z-0 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-cream/50 to-transparent opacity-0 transition-[transform,opacity] duration-700 ease-out group-hover:translate-x-[420%] group-hover:opacity-100"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gold/10 opacity-70 blur-2xl transition-opacity duration-300 group-hover:opacity-100 group-data-[mobile-active=true]:opacity-100"
          />

          {isActive && (
            <span className="absolute right-4 top-4 z-[1] flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-wide text-brown-dark shadow-warm-sm">
              <CheckIcon />
              Ativa
            </span>
          )}

          <CrystalIconBadge>{CATEGORY_ICONS[group.id]}</CrystalIconBadge>

          <span className="relative z-[1] flex flex-col gap-1.5">
            <span className="font-heading text-xl leading-snug text-brown-dark transition-colors duration-300 group-hover:text-gold-deep">
              {group.title}
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-brown/50">
              {count} tratamento{count === 1 ? '' : 's'}
            </span>
          </span>

          <span className="relative z-[1] mt-auto flex items-center gap-2 pt-2 text-xs font-medium uppercase tracking-[0.2em] text-gold-deep">
            Ver tratamentos
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              <ArrowIcon />
            </span>
            <span
              aria-hidden="true"
              className="h-px flex-1 bg-gradient-to-r from-gold/40 to-transparent transition-all duration-300 group-hover:from-gold/80"
            />
          </span>
        </motion.button>
      </motion.div>
    </RevealItem>
  );
}

/**
 * Substitui a antiga "Qual cuidado sua pele precisa?" (7 objetivos de pele)
 * por 4 grandes categorias de tratamento, num visual "vidro lapidado"
 * (glassmorphism discreto + dourado) em vez dos cards planos anteriores.
 * Cada card filtra a grade de Tratamentos pelos ids do grupo -- mesmo
 * mecanismo já usado pelos objetivos antigos
 * (`requestTreatmentsFilterByGoal`, `TreatmentsFilterContext`): filtra por
 * lista de ids, rola até o primeiro tratamento e o destaca por ~2s, mantém
 * o filtro ativo até a cliente escolher outra categoria ou "Todos os
 * tratamentos" (chip já existente acima da grade, em `Treatments.tsx` --
 * não duplicado aqui). `aria-pressed` de cada card reflete
 * `activeGoalLabel === group.title`, então funciona mesmo se duas
 * categorias tivessem o mesmo primeiro tratamento (comparação por ids no
 * contexto, não por texto).
 */
export function TreatmentCategories() {
  const { treatmentCategoryGroups } = siteContent;
  const { activeGoalLabel, requestTreatmentsFilterByGoal } = useTreatmentsFilter();
  const prefersReducedMotion = useReducedMotion();

  function handleSelect(group: TreatmentCategoryGroup) {
    requestTreatmentsFilterByGoal(group.title, group.treatmentIds);
  }

  return (
    <section className="relative overflow-hidden bg-cream-light/40 py-24 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(167, 136, 127, 0.08),transparent_55%)]"
      />
      {!prefersReducedMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-gold/10 blur-3xl"
        />
      )}

      <Container className="relative flex flex-col gap-12">
        <Reveal>
          <SectionHeading title={treatmentCategoryGroups.title} text={treatmentCategoryGroups.text} />
        </Reveal>

        <RevealGroup stagger={0.08} className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {treatmentCategoryGroups.items.map((group) => (
            <CategoryCard
              key={group.id}
              group={group}
              isActive={activeGoalLabel === group.title}
              onSelect={() => handleSelect(group)}
            />
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
