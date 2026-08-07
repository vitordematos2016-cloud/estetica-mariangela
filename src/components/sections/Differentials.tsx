import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import type { CSSProperties } from 'react';
import { siteContent } from '../../data/siteContent';
import type { ValueItem } from '../../types/siteContent';
import { Container } from '../ui/Container';
import { Reveal, RevealGroup, RevealItem } from '../motion/reveal';
import { EASE_OUT } from '../motion/variants';
import { useMobileViewportActive } from '../../hooks/useMobileViewportActive';
import { getMobileSurfaceStyle, mobileCardTransition, mobileCardVariants } from '../motion/mobileActive';
import { useOnceInView } from '../../hooks/useOnceInView';

const icons = [
  <path key="ethics" d="M14 3v22M6 9l8-4 8 4M6 9l-4 10h8L6 9Zm16 0l-4 10h8l-4-10Z" />,
  <path key="care" d="M14 25s-9-5.6-9-13a5.5 5.5 0 0 1 9-4.2A5.5 5.5 0 0 1 23 12c0 7.4-9 13-9 13Z" />,
  <path key="natural" d="M14 25V13M14 13C8 13 5 9 5 4c5 0 9 3 9 9Zm0 0c0-6 4-9 9-9 0 5-3 9-9 9Z" />,
  <path key="safety" d="M14 3l10 4v7c0 6.5-4.3 10.9-10 13-5.7-2.1-10-6.5-10-13V7l10-4Z" />,
  <path key="innovation" d="M14 3v4M14 21v4M4 14H2M26 14h-2M6.5 6.5 5 5M23 23l-1.5-1.5M6.5 21.5 5 23M23 5l-1.5 1.5M20 14a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" />,
  <path key="excellence" d="m14 3 3 6.5 7 1-5 5 1.3 7L14 19l-6.3 3.5L9 15.5l-5-5 7-1L14 3Z" />,
];

function ToggleIcon({ up }: { up: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={`text-gold transition-transform duration-300 ${up ? 'rotate-180' : ''}`}
    >
      <path d="M2 5l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const toggleButtonClassName =
  'flex items-center gap-2.5 rounded-full border border-gold/40 bg-cream-light/60 px-6 py-3 text-sm font-medium text-brown-dark shadow-warm-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/70 hover:shadow-warm active:border-gold/70 active:shadow-warm';

/**
 * Um nível extra entre o `RevealItem` (entrada escalonada do acordeão, já
 * controlada por `isOpen`) e o card visual: abaixo de 768px, o wrapper com
 * `useMobileViewportActive` recua o card fora da região central da tela e
 * devolve a presença de hover quando ele cruza essa região. No desktop
 * `animate` fica `undefined` -- nenhum estilo inline é aplicado, então o
 * `hover:` do Tailwind no card continua a única fonte de destaque, como
 * antes.
 */
function ValueCard({ value, index, isOpen }: { value: ValueItem; index: number; isOpen: boolean }) {
  const { ref, active, isMobileViewport } = useMobileViewportActive<HTMLDivElement>();
  const surfaceStyle = getMobileSurfaceStyle(isMobileViewport, active);
  const underlineStyle: CSSProperties = {
    opacity: isOpen ? 1 : 0,
    transitionDelay: isOpen ? `${450 + index * 80}ms` : '0ms',
    ...(isMobileViewport ? { width: active ? '4rem' : '2.5rem' } : {}),
  };

  return (
    <RevealItem key={value.title}>
      <motion.div
        ref={ref}
        variants={mobileCardVariants}
        initial={false}
        animate={isMobileViewport ? (active ? 'active' : 'rest') : undefined}
        transition={mobileCardTransition}
      >
        <div
          style={surfaceStyle}
          className="group relative flex flex-col gap-4 rounded-[1.75rem] border border-gold/20 bg-cream p-7 shadow-warm-sm transition-[box-shadow,border-color] duration-500 ease-out hover:-translate-y-1 hover:border-gold/50 hover:shadow-warm"
        >
          <div className="flex items-center gap-3">
            <span className="font-heading text-2xl text-gold/70">{String(index + 1).padStart(2, '0')}</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-brown-dark">
              <svg width="18" height="18" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  {icons[index]}
                </g>
              </svg>
            </span>
          </div>

          <h3 className="text-lg text-brown-dark">{value.title}</h3>
          <p className="text-sm leading-relaxed text-brown/70">{value.text}</p>

          <span
            aria-hidden="true"
            className="mt-1 h-px w-10 bg-gold/60 transition-[width,opacity] duration-500 ease-out group-hover:w-16"
            style={underlineStyle}
          />
        </div>
      </motion.div>
    </RevealItem>
  );
}

// Sem diferenciais/valores confirmados ainda -- seção oculta para não
// atribuir missão/valores que a Mariangela não confirmou (ver
// docs/PENDENCIAS_CLIENTE.md). O componente continua pronto para voltar,
// sem precisar de novo código.
const DIFFERENTIALS_CONFIRMED = false;

export function Differentials() {
  const { differential, values } = siteContent;
  const headingRef = useRef<HTMLDivElement>(null);
  const isHeadingInView = useOnceInView(headingRef, { amount: 0.2 });
  const [isOpen, setIsOpen] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const bottomMarkerRef = useRef<HTMLParagraphElement>(null);

  // Só observa a frase final enquanto os diferenciais estão abertos --
  // fechado, o botão inferior nunca deve aparecer, então não há necessidade
  // de rastrear a posição de rolagem.
  useEffect(() => {
    if (!isOpen) {
      setIsAtBottom(false);
      return;
    }

    const node = bottomMarkerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => setIsAtBottom(entry.isIntersecting), {
      threshold: 0.4,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [isOpen]);

  // Nunca ambos ao mesmo tempo: o botão superior cobre "fechado" e "aberto,
  // ainda no topo"; o inferior só existe quando aberto E a frase final já
  // entrou na tela. Quando um está oculto, ele é removido da renderização
  // (não apenas opacity:0), então nunca fica clicável nem focável por engano.
  const topButtonVisible = !(isOpen && isAtBottom);
  const bottomButtonVisible = isOpen && isAtBottom;

  function handleCloseFromBottom() {
    setIsOpen(false);
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (!DIFFERENTIALS_CONFIRMED) return null;

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-cream-light/30 py-24 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-beige/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-gold/10 blur-3xl"
      />

      <Container className="relative flex flex-col gap-10">
        <div ref={headingRef} className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <Reveal as="span" active={isHeadingInView} delay={0} className="text-xs font-medium uppercase tracking-[0.28em] text-gold-deep">
            {differential.eyebrow}
          </Reveal>
          <Reveal as="h2" active={isHeadingInView} delay={0.1} className="text-3xl leading-[1.2] text-brown-dark sm:text-4xl">
            {differential.title}
          </Reveal>
          <Reveal as="p" active={isHeadingInView} delay={0.2} className="text-base leading-relaxed text-brown/75 sm:text-lg">
            {differential.text}
          </Reveal>

          {topButtonVisible && (
            <button
              type="button"
              onClick={() => setIsOpen((current) => !current)}
              aria-expanded={isOpen}
              aria-controls="conteudo-diferenciais"
              className={`mt-2 ${toggleButtonClassName}`}
            >
              {isOpen ? 'Fechar diferenciais' : 'Abrir diferenciais'}
              <ToggleIcon up={isOpen} />
            </button>
          )}
        </div>

        {/* Truque de grid `0fr` -> `1fr` para animar uma altura que a gente
            nunca precisa adivinhar em pixels: com o container em
            `height: auto`, `1fr` distribui exatamente o "espaço sobrando"
            (aqui, zero -- não há altura extra no container), então a trilha
            fica do tamanho natural do conteúdo (`max-content`), não de um
            teto fixo. Substitui um teto de altura em pixels fixo por
            breakpoint que cortava os cards em telas estreitas com fonte
            ampliada/zoom (o conteúdo real passava do valor calibrado para o
            tamanho padrão de fonte). `overflow-hidden` mora no filho, não no
            grid -- é ele quem precisa recortar durante a transição. */}
        <div
          id="conteudo-diferenciais"
          aria-hidden={!isOpen}
          className={`grid transition-[grid-template-rows] duration-700 ease-in-out ${
            isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-14 pt-4">
              <RevealGroup active={isOpen} stagger={0.08} delayChildren={0.15} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {values.map((value, index) => (
                  <ValueCard key={value.title} value={value} index={index} isOpen={isOpen} />
                ))}
              </RevealGroup>

              <div className="flex flex-col items-center gap-6 pb-2">
                <motion.p
                  ref={bottomMarkerRef}
                  className="mx-auto max-w-xl text-center text-base italic leading-relaxed text-brown/70"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isOpen ? 1 : 0 }}
                  transition={{
                    duration: 0.5,
                    ease: EASE_OUT,
                    delay: isOpen ? 0.15 + values.length * 0.08 + 0.1 : 0,
                  }}
                >
                  {differential.closing}
                </motion.p>

                {bottomButtonVisible && (
                  <button
                    type="button"
                    onClick={handleCloseFromBottom}
                    aria-expanded={isOpen}
                    aria-controls="conteudo-diferenciais"
                    className={`mb-4 ${toggleButtonClassName}`}
                  >
                    Fechar diferenciais
                    <ToggleIcon up={true} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
