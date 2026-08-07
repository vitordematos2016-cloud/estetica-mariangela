import { motion } from 'motion/react';
import { siteContent } from '../../data/siteContent';
import type { TechnologyItem } from '../../types/siteContent';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { useExpandableSection } from '../../hooks/useExpandableSection';
import { RevealGroup, RevealItem } from '../motion/reveal';
import { EASE_OUT } from '../motion/variants';
import { useMobileViewportActive } from '../../hooks/useMobileViewportActive';
import { mobileCardTransition, mobileCardVariants } from '../motion/mobileActive';

function ToggleIcon({ up }: { up: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-300 ${
        up ? 'rotate-180 border-gold bg-gold/15' : 'border-gold/40'
      }`}
    >
      <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path
          d="M2 5l5 5 5-5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gold"
        />
      </svg>
    </span>
  );
}

const toggleButtonClassName =
  'flex items-center gap-2.5 rounded-full border border-gold/40 bg-gradient-to-r from-cream via-cream to-beige/40 px-6 py-3 text-sm font-medium text-brown-dark shadow-warm-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/70 hover:shadow-warm active:border-gold/70 active:shadow-warm';

/**
 * Abaixo de 768px, `data-mobile-active` espelha o mesmo destaque que
 * `group-hover`/`group-active` já davam no desktop, só que acionado por
 * `useMobileViewportActive` (card cruzando a região central da tela) em vez
 * de um ponteiro real -- reaproveita as mesmas classes-alvo do hover via
 * `group-data-[mobile-active=true]:`, então o visual final é idêntico.
 */
function TechCard({ item }: { item: TechnologyItem }) {
  const { ref, active, isMobileViewport } = useMobileViewportActive<HTMLDivElement>();

  return (
    <RevealItem key={item.id}>
      <motion.div
        variants={mobileCardVariants}
        initial={false}
        animate={isMobileViewport ? (active ? 'active' : 'rest') : undefined}
        transition={mobileCardTransition}
      >
        <motion.div
          ref={ref}
          data-mobile-active={isMobileViewport ? active : undefined}
          className="group relative flex h-full flex-col gap-2 overflow-hidden rounded-[1.75rem_1.75rem_1.75rem_0.75rem] border border-gold/25 bg-gradient-to-br from-cream via-cream to-beige/30 p-6 shadow-warm-sm transition-all duration-300 hover:border-gold hover:shadow-warm active:border-gold active:shadow-warm data-[mobile-active=true]:border-gold data-[mobile-active=true]:shadow-warm"
          whileHover={{ y: -2.5 }}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.25, ease: EASE_OUT }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gold/10 opacity-70 blur-2xl transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100 group-data-[mobile-active=true]:opacity-100"
          />
          <span
            aria-hidden="true"
            className="relative h-1.5 w-1.5 rounded-full bg-gold/60 transition-transform duration-300 group-hover:scale-150 group-active:scale-150 group-data-[mobile-active=true]:scale-150"
          />
          <h3 className="relative text-lg text-brown-dark transition-colors duration-300 group-hover:text-gold group-active:text-gold group-data-[mobile-active=true]:text-gold">
            {item.name}
          </h3>
          <p className="relative text-sm leading-relaxed text-brown/70">{item.purpose}</p>
          {item.benefit && (
            <p className="relative text-xs font-medium uppercase tracking-wide text-gold-deep">{item.benefit}</p>
          )}
        </motion.div>
      </motion.div>
    </RevealItem>
  );
}

/**
 * Cards puramente informativos (sem onClick/href/role) — a microinteração é
 * só decorativa. `group-hover`/`whileHover` só disparam com hover real
 * (Tailwind v4 compila `hover`/`group-hover` dentro de `@media
 * (hover:hover)`), `group-active`/`whileTap` cobrem toque sem nunca ficar
 * "presos", e o Motion é neutralizado automaticamente sob
 * `prefers-reduced-motion` pelo `MotionConfig reducedMotion="user"` global.
 */
export function Technologies() {
  const { technologies } = siteContent;
  const {
    isOpen,
    sectionRef,
    bottomMarkerRef,
    topButtonVisible,
    bottomButtonVisible,
    toggle,
    closeFromBottom,
  } = useExpandableSection<HTMLElement, HTMLDivElement>();

  return (
    <section ref={sectionRef} className="bg-cream-light/40 py-24 sm:py-28">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <SectionHeading title={technologies.title} text={technologies.text} />

          {topButtonVisible && (
            <button
              type="button"
              onClick={toggle}
              aria-expanded={isOpen}
              aria-controls="conteudo-tecnologias"
              className={`mt-2 ${toggleButtonClassName}`}
            >
              {isOpen ? 'Ocultar tecnologias e produtos' : 'Conhecer tecnologias e produtos'}
              <ToggleIcon up={isOpen} />
            </button>
          )}
        </div>

        {/* Mesmo truque de grid `0fr` -> `1fr` usado em Diferenciais: a
            trilha acompanha a altura real do conteúdo (`max-content`) em vez
            de um teto fixo em pixels por breakpoint, que cortava os cards em
            telas estreitas com fonte ampliada/zoom. `overflow-hidden` mora
            no filho, não no grid. */}
        <div
          id="conteudo-tecnologias"
          aria-hidden={!isOpen}
          className={`grid transition-[grid-template-rows] duration-700 ease-in-out ${
            isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="overflow-hidden">
            <div ref={bottomMarkerRef} className="flex flex-col items-center gap-8 pt-4">
              {technologies.items.length === 0 ? (
                <RevealGroup active={isOpen} as="div" className="w-full">
                  <RevealItem
                    direction="none"
                    className="relative mx-auto flex w-full max-w-xl flex-col items-center gap-3 overflow-hidden rounded-[1.75rem] border border-dashed border-gold/35 bg-gradient-to-br from-cream via-cream to-beige/25 px-8 py-14 text-center shadow-warm-sm"
                  >
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(167, 136, 127, 0.08),transparent_60%)]"
                    />
                    <span
                      aria-hidden="true"
                      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 text-gold"
                    >
                      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.2" />
                        <path d="M8 5v3.2l2 1.3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                    </span>
                    <p className="relative text-base text-brown-dark">{technologies.notice}</p>
                  </RevealItem>
                </RevealGroup>
              ) : (
                <RevealGroup
                  active={isOpen}
                  stagger={0.08}
                  delayChildren={0.15}
                  className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {technologies.items.map((item) => (
                    <TechCard key={item.id} item={item} />
                  ))}
                </RevealGroup>
              )}

              {bottomButtonVisible && (
                <button
                  type="button"
                  onClick={closeFromBottom}
                  aria-expanded={isOpen}
                  aria-controls="conteudo-tecnologias"
                  className={`mb-4 ${toggleButtonClassName}`}
                >
                  Ocultar tecnologias e produtos
                  <ToggleIcon up={true} />
                </button>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
