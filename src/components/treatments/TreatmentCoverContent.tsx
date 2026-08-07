import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import type { Treatment } from '../../types/siteContent';
import { EASE_OUT } from '../motion/variants';
import { BrandMonogram } from '../ui/BrandMonogram';

interface TreatmentCoverContentProps {
  treatment: Treatment;
  onViewDetails: (treatment: Treatment) => void;
  /** Área extra opcional, renderizada logo abaixo de "Ver mais detalhes" --
   * só o catálogo de Agendamento usa isso, para a ação de seleção
   * ("Adicionar à seleção" / "Remover da seleção"). Ausente na grade
   * principal de Tratamentos: sem essa prop, o card se comporta exatamente
   * como antes (5 linhas de grid, sem espaço extra reservado). */
  footerExtra?: ReactNode;
}

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className="transition-transform duration-300 ease-out group-hover/btn:translate-x-1"
    >
      <path
        d="M2.5 7h9M7.5 3l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Linha fina -- flanqueia o monograma e sublinha o nome/CTA. */
export function GoldLine({ className = '' }: { className?: string }) {
  return <span aria-hidden="true" className={`h-px bg-gradient-to-r from-transparent via-gold-soft/70 to-transparent ${className}`} />;
}

/** Sombra de texto extremamente discreta -- só o suficiente para o marrom do
 * nome/descrição não sumir num trecho mais claro da foto, sem parecer um
 * "brilho" ao redor da letra. */
export const SOFT_SHADOW = '0 1px 2px rgba(243, 229, 225, 0.55)';

/**
 * Conteúdo padronizado da capa: monograma, nome, descrição breve e "Ver mais
 * detalhes" -- extraído de `TreatmentCard`. `footerExtra` reserva uma área
 * própria abaixo do botão para uma ação extra opcional; nenhum consumidor
 * atual passa esse prop, mas a estrutura/CSS ficam prontos caso um novo
 * card compacto (ex.: um catálogo de seleção) volte a precisar disso.
 *
 * No mobile, cada elemento é posicionado por porcentagem exata da altura do
 * card (monograma ~9%, nome ~14%, descrição ~36%, botão ~91%, footer extra perto da
 * base -- faixas pedidas pela cliente), via `position: absolute`. Nome e
 * descrição usam áreas de ALTURA FIXA (`h`/`min-h`), não centralizadas por
 * `-translate-y-1/2`: o bloco do nome (até 3 linhas, para títulos longos)
 * fica ancorado pela base (`justify-end`), então a linha dourada abaixo dele
 * sempre cai no mesmo ponto, não importa se o nome ocupa 1 ou 3 linhas. A
 * área da descrição é ancorada pelo topo (`items-start`), então uma
 * descrição de 1 linha e uma de 2 linhas começam exatamente na mesma altura.
 *
 * A partir de `sm:` (tablet/desktop), tudo volta a `position: static` e
 * reentra num grid de 5 linhas (`auto auto auto 1fr auto`, ou 6 quando há
 * `footerExtra`) com cada elemento fixado explicitamente na própria linha
 * via `row-start`. A linha `1fr` fica entre a descrição e o botão -- ela
 * absorve toda a sobra de espaço, então "Ver mais detalhes" sempre cola na
 * base do card (ou logo acima do `footerExtra`, quando presente).
 */
export function TreatmentCoverContent({ treatment, onViewDetails, footerExtra }: TreatmentCoverContentProps) {
  // Quando a descrição breve de um tratamento for bem mais longa que a
  // média (texto oficial > ~58 caracteres), marcar aqui o respectivo `id`
  // para usar uma área mais larga e sem limite de linhas em vez do
  // `line-clamp-2`/largura fixa padrão. TODO: revisar esta lista quando os
  // textos oficiais da Mariangela chegarem.
  const LONG_COVER_DESCRIPTION_IDS: string[] = [];
  const hasLongCoverDescription = LONG_COVER_DESCRIPTION_IDS.includes(treatment.id);

  return (
    <div
      className={`relative h-full p-[clamp(18px,4vw,28px)] pb-5 text-center transition-transform duration-500 ease-out group-hover:-translate-y-0.5 motion-reduce:transition-none sm:grid sm:items-center sm:justify-items-center sm:gap-2.5 sm:pb-[32px] lg:pb-[36px] ${
        footerExtra ? 'sm:grid-rows-[auto_auto_auto_1fr_auto_auto]' : 'sm:grid-rows-[auto_auto_auto_1fr_auto]'
      }`}
    >
      {/* Iluminação creme muito suave só atrás do nome/descrição -- ajuda a
          legibilidade nas capas mais claras sem esconder a arte nem virar
          uma caixa sólida. Só no mobile. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[37%] h-[46%] w-[94%] -translate-x-1/2 -translate-y-1/2 sm:hidden"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(243, 229, 225, 0.72) 0%, rgba(243, 229, 225, 0.38) 55%, transparent 100%)',
        }}
      />

      <div className="absolute left-1/2 top-[9%] flex w-[78%] -translate-x-1/2 -translate-y-1/2 items-center gap-3 sm:static sm:row-start-1 sm:w-full sm:translate-x-0 sm:translate-y-0">
        <GoldLine className="flex-1" />
        <div className="relative flex shrink-0 items-center justify-center">
          <BrandMonogram className="h-6 w-6 text-[0.7rem] sm:h-7 sm:w-7" />
        </div>
        <GoldLine className="flex-1" />
      </div>

      <div className="absolute left-1/2 top-[14%] flex h-[78px] w-[86%] -translate-x-1/2 flex-col items-center justify-end gap-2 sm:static sm:row-start-2 sm:h-auto sm:w-full sm:min-h-[92px] sm:translate-x-0 sm:translate-y-0 sm:justify-end sm:gap-2.5">
        <h3
          style={{ textShadow: SOFT_SHADOW }}
          className="line-clamp-3 w-full font-heading text-lg font-semibold uppercase leading-snug tracking-wide text-brown-dark sm:text-xl"
        >
          {treatment.name}
        </h3>
        <GoldLine className="w-10 shrink-0" />
      </div>

      {/* Área da descrição -- altura reservada igual em todos os cards
          (`min-h`), com o texto alinhado ao topo dessa área (não
          centralizado): assim, uma descrição de 1 linha e uma de 2 linhas
          começam exatamente no mesmo ponto, em vez de "flutuarem" em torno
          de um centro que muda com a altura do texto. Largura e font-size
          FIXOS (não `clamp`) em cada faixa -- 178px/13px mobile, 190px/14px
          desktop -- calibrados para descrições curtas quebrarem em
          exatamente 2 linhas (nem 1, nem 3), até ~58 caracteres. Um
          `clamp()` de font-size aqui faria essa largura deixar de valer em
          parte da faixa "sm:" (a fonte só chega a 15px em telas muito
          largas), quebrando a garantia de 2 linhas nos tamanhos
          intermediários -- por isso um valor fixo por faixa, não fluido.
          `text-balance` equilibra visualmente as linhas. `hasLongCoverDescription`
          usa uma área mais larga e sem limite de linhas para os textos
          oficiais bem mais longos que os demais -- o espaço vazio abaixo da
          descrição e acima do botão em todos os cards é bem maior do que 2
          linhas de texto, então crescer aqui não invade o botão "Ver mais
          detalhes". */}
      <div
        className={`absolute left-1/2 top-[36%] flex ${hasLongCoverDescription ? 'w-[92%]' : 'w-[min(86%,178px)]'} min-h-[38px] -translate-x-1/2 items-start justify-center sm:static sm:top-auto sm:row-start-3 sm:w-full sm:min-h-[42px] sm:translate-x-0 sm:translate-y-0`}
      >
        <p
          style={{ textShadow: SOFT_SHADOW }}
          className={`w-full text-balance text-center text-[13px] font-medium leading-[1.35] text-brown sm:text-[14px] sm:leading-[1.4] ${
            hasLongCoverDescription ? 'max-w-[260px]' : 'line-clamp-2 max-w-[178px] sm:max-w-[190px]'
          }`}
        >
          {treatment.shortCoverDescription ?? treatment.summary ?? ''}
        </p>
      </div>

      <div
        className={`absolute left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 sm:static sm:row-start-5 sm:translate-x-0 sm:translate-y-0 ${
          footerExtra ? 'top-[76%]' : 'top-[89.5%] -translate-y-1/2'
        }`}
      >
        <GoldLine className="w-10" />
        <motion.button
          type="button"
          onClick={() => onViewDetails(treatment)}
          aria-label={`Ver mais detalhes do tratamento ${treatment.name}`}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.2, ease: EASE_OUT }}
          className="group/btn -mx-4 -my-3 inline-flex items-center gap-1.5 rounded-full px-4 py-3 text-sm font-semibold tracking-wide text-brown-dark transition-[color,filter] duration-300 hover:text-gold-deep hover:drop-shadow-[0_0_7px_rgba(167, 136, 127, 0.55)]"
        >
          Ver mais detalhes
          <ArrowIcon />
        </motion.button>
      </div>

      {/* `sm:pt-1`: o botão "Ver mais detalhes" usa margem negativa
          (`-my-3`) para ampliar a área de toque sem crescer visualmente --
          isso "come" ~2px do gap do grid até esta linha; o padding-top aqui
          devolve essa folga só quando `footerExtra` existe. */}
      {footerExtra && (
        <div className="absolute inset-x-0 bottom-4 flex justify-center px-[clamp(18px,4vw,28px)] sm:static sm:row-start-6 sm:w-full sm:px-0 sm:pt-1">
          {footerExtra}
        </div>
      )}
    </div>
  );
}
