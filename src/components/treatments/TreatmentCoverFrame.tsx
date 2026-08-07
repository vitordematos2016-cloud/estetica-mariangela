import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import type { Treatment } from '../../types/siteContent';
import { TreatmentCoverImage } from './TreatmentCoverImage';
import { EASE_OUT } from '../motion/variants';
import { useMobileViewportActive } from '../../hooks/useMobileViewportActive';
import { getMobileSurfaceStyle, mobileCardTransition, mobileCardVariants } from '../motion/mobileActive';

interface TreatmentCoverFrameProps {
  treatment: Treatment;
  isHighlighted?: boolean;
  /** Só o card da grade principal de Tratamentos usa isso, para o scroll de
   * destaque (`document.getElementById('servico-' + id)`) -- o card do
   * catálogo de Agendamento não define id nenhum, para nunca duplicar id no
   * documento enquanto os dois estiverem montados ao mesmo tempo. */
  id?: string;
  /** Classes de tamanho (aspect-ratio, min-height, largura, margem) -- cada
   * variante define o próprio tamanho; a moldura só fornece o chrome visual
   * compartilhado (capa, gradiente de legibilidade, hover, brilho ao passar
   * o mouse, estado "ativo" no scroll mobile). */
  sizeClassName: string;
  children: ReactNode;
}

const SWEEP_CLASSES =
  'pointer-events-none absolute inset-0 z-[3] -translate-x-[120%] skew-x-[-14deg] bg-gradient-to-r from-transparent via-gold-soft/25 to-transparent opacity-0 transition-[transform,opacity] duration-[1100ms] ease-out group-hover:translate-x-[120%] group-hover:opacity-100 group-active:translate-x-[120%] group-active:opacity-100 motion-reduce:transition-none motion-reduce:opacity-0';

/**
 * Véu creme translúcido bem leve em toda a altura do card -- só o suficiente
 * para dar contraste ao texto marrom-escuro, preservando a cor natural da
 * capa/foto de cada tratamento por baixo (pedido explícito da cliente: nada
 * de lavar a foto inteira num tom creme uniforme). Mais opaco no topo (logo
 * monograma + nome) e na base ("Ver mais detalhes"), quase transparente no meio,
 * onde a descrição já tem sombra de texto própria para legibilidade.
 */
const COVER_GRADIENT =
  'linear-gradient(180deg, rgba(243, 229, 225, 0.55) 0%, rgba(243, 229, 225, 0.32) 20%, rgba(243, 229, 225, 0.16) 42%, rgba(243, 229, 225, 0.14) 58%, rgba(243, 229, 225, 0.32) 80%, rgba(243, 229, 225, 0.58) 100%)';

/**
 * Moldura compartilhada dos cards de tratamento (grade principal e catálogo
 * de Agendamento) -- capa preenchendo 100% da área, gradiente de
 * legibilidade e o mesmo "estado ativo mobile" (substitui o hover de mouse
 * pelo cruzar a região central da tela ao rolar). Cada chamador só injeta o
 * próprio conteúdo (via `children`) e controla o próprio tamanho (via
 * `sizeClassName`), evitando duplicar esta base visual entre os dois cards.
 */
export function TreatmentCoverFrame({ treatment, isHighlighted = false, id, sizeClassName, children }: TreatmentCoverFrameProps) {
  const { ref: mobileActiveRef, active: mobileActive, isMobileViewport } = useMobileViewportActive<HTMLDivElement>();
  // O destaque temporário de busca (isHighlighted) tem prioridade sobre a
  // presença mobile por rolagem -- nunca os dois competindo pelo mesmo estilo.
  const surfaceStyle = isHighlighted ? undefined : getMobileSurfaceStyle(isMobileViewport, mobileActive);

  return (
    <motion.div
      ref={mobileActiveRef}
      variants={mobileCardVariants}
      initial={false}
      animate={isMobileViewport ? (mobileActive ? 'active' : 'rest') : undefined}
      transition={mobileCardTransition}
      className="h-full"
    >
      <motion.article
        id={id}
        whileHover={{ y: -3, scale: 1.01 }}
        whileTap={{ scale: 0.988 }}
        transition={{ duration: 0.3, ease: EASE_OUT }}
        style={surfaceStyle}
        className={`group relative isolate overflow-hidden rounded-[1.75rem] border shadow-warm-sm transition-[box-shadow,border-color] duration-700 ease-out motion-reduce:duration-0 hover:shadow-warm active:shadow-warm ${
          isHighlighted ? 'border-gold shadow-warm' : 'border-gold/25 hover:border-gold/60 active:border-gold/60'
        } ${sizeClassName}`}
      >
        <TreatmentCoverImage
          treatmentId={treatment.id}
          coverImage={treatment.coverImage}
          label={treatment.name}
          className="group-hover:scale-[1.035] group-active:scale-[1.015]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] opacity-95 transition-opacity duration-500 ease-out group-hover:opacity-100"
          style={{ background: COVER_GRADIENT }}
        />

        <div className="relative z-[2] h-full">{children}</div>

        <div className={SWEEP_CLASSES} />
      </motion.article>
    </motion.div>
  );
}
