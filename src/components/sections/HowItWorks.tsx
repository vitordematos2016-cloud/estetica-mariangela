import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { siteContent } from '../../data/siteContent';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Ornament } from '../ui/Ornament';
import { Reveal, RevealGroup, RevealItem } from '../motion/reveal';
import { EASE_OUT } from '../motion/variants';
import { useOnceInView } from '../../hooks/useOnceInView';
import { useMobileViewportActive } from '../../hooks/useMobileViewportActive';
import { getMobileSurfaceStyle, mobileCardTransition, mobileCardVariants } from '../motion/mobileActive';

const LINE_TRANSITION = { duration: 0.9, ease: EASE_OUT };
const LINE_REST_COLOR = 'rgba(167, 136, 127, 0.35)';
const LINE_ACTIVE_COLOR = 'rgba(167, 136, 127, 0.7)';

/**
 * Cada etapa tem ativação independente no mobile via
 * `useMobileViewportActive` (o mesmo mecanismo já usado nos cards de
 * Purpose/TreatmentCard/Experience): recua fora da região central da tela e
 * ganha presença (elevação, borda e sombra douradas, brilho no marcador) ao
 * cruzá-la -- repete a cada entrada/saída, nunca revela as cinco de uma vez.
 * No desktop, `isMobileViewport` fica falso e nada disso se aplica; o hover
 * real assume via `whileHover`/`group-hover`, com `onHoverChange` avisando o
 * componente pai para destacar discretamente a linha condutora.
 */
function HowItWorksStep({
  step,
  index,
  onHoverChange,
}: {
  step: { title: string; text: string };
  index: number;
  onHoverChange: (hovering: boolean) => void;
}) {
  const { ref, active, isMobileViewport } = useMobileViewportActive<HTMLDivElement>();
  const surfaceStyle = getMobileSurfaceStyle(isMobileViewport, active);

  return (
    <RevealItem as="li">
      <motion.div
        ref={ref}
        variants={mobileCardVariants}
        initial={false}
        animate={isMobileViewport ? (active ? 'active' : 'rest') : undefined}
        transition={mobileCardTransition}
      >
        <motion.div
          data-mobile-active={isMobileViewport ? active : undefined}
          onHoverStart={() => onHoverChange(true)}
          onHoverEnd={() => onHoverChange(false)}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.985 }}
          transition={{ duration: 0.25, ease: EASE_OUT }}
          style={surfaceStyle}
          className="group flex flex-col items-center gap-4 rounded-[1.5rem] border border-gold/20 bg-cream-light/40 px-5 py-7 text-center shadow-warm-sm transition-[box-shadow,border-color] duration-500 ease-out hover:border-gold/50 hover:shadow-warm"
        >
          <div className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-2 rounded-full bg-gold/30 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-100 group-data-[mobile-active=true]:opacity-100"
            />
            <Ornament size="sm" className="relative">
              <span className="font-heading text-lg text-gold-deep sm:text-xl">
                {String(index + 1).padStart(2, '0')}
              </span>
            </Ornament>
          </div>
          <h3 className="text-lg text-brown-dark">{step.title}</h3>
          <p className="max-w-[16rem] text-sm leading-relaxed text-brown/70">{step.text}</p>
        </motion.div>
      </motion.div>
    </RevealItem>
  );
}

// Sem etapas confirmadas ainda -- seção oculta até que a Mariangela confirme
// o texto oficial da jornada de atendimento (ver docs/PENDENCIAS_CLIENTE.md).
// O componente continua pronto para voltar, sem precisar de novo código.
const HOW_IT_WORKS_CONFIRMED = false;

export function HowItWorks() {
  const { howItWorks } = siteContent;
  const pathRef = useRef<HTMLDivElement>(null);
  const isPathInView = useOnceInView(pathRef, { amount: 0.25 });
  const [hoveredCount, setHoveredCount] = useState(0);
  const isAnyHovered = hoveredCount > 0;

  if (!HOW_IT_WORKS_CONFIRMED) return null;

  // Contador em vez de booleano único: se o ponteiro sair de um card já
  // passando por cima do próximo (transição rápida entre cards vizinhos),
  // o `onHoverEnd` do primeiro não deve apagar o destaque aceso pelo
  // `onHoverStart` do segundo.
  function handleHoverChange(hovering: boolean) {
    setHoveredCount((count) => Math.max(0, count + (hovering ? 1 : -1)));
  }

  return (
    <section className="py-24 sm:py-28">
      <Container className="flex flex-col gap-16">
        <Reveal>
          <SectionHeading eyebrow="Jornada" title={howItWorks.title} text={howItWorks.text} />
        </Reveal>

        <div ref={pathRef} className="relative">
          <motion.div
            aria-hidden="true"
            className="absolute left-1/2 top-6 bottom-6 w-px origin-top -translate-x-1/2 sm:hidden"
            initial={{ scaleY: 0, backgroundColor: LINE_REST_COLOR }}
            animate={{
              scaleY: isPathInView ? 1 : 0,
              backgroundColor: isAnyHovered ? LINE_ACTIVE_COLOR : LINE_REST_COLOR,
            }}
            transition={{ scaleY: LINE_TRANSITION, backgroundColor: { duration: 0.3, ease: EASE_OUT } }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute inset-x-6 top-8 hidden h-px origin-left bg-gradient-to-r from-transparent via-gold/45 to-transparent lg:block"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isPathInView ? 1 : 0 }}
            transition={{ duration: 1, ease: EASE_OUT }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-6 top-8 hidden h-px bg-gradient-to-r from-transparent via-gold to-transparent lg:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: isAnyHovered ? 1 : 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
          />

          <RevealGroup
            as="ol"
            active={isPathInView}
            stagger={0.1}
            className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6"
          >
            {howItWorks.steps.map((step, index) => (
              <HowItWorksStep key={step.title} step={step} index={index} onHoverChange={handleHoverChange} />
            ))}
          </RevealGroup>
        </div>
      </Container>
    </section>
  );
}
