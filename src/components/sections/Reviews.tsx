import { useRef, useState } from 'react';
import type { TouchEvent } from 'react';
import { motion } from 'motion/react';
import { siteContent } from '../../data/siteContent';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../motion/reveal';
import { EASE_OUT } from '../motion/variants';
import { useMobileViewportActive } from '../../hooks/useMobileViewportActive';
import { mobileCardTransition, mobileCardVariants } from '../motion/mobileActive';

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 text-gold" aria-label={`${rating} de 5 estrelas`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          width="17"
          height="17"
          viewBox="0 0 16 16"
          fill={index < rating ? 'currentColor' : 'none'}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path d="M8 1l2.1 4.3 4.7.7-3.4 3.3.8 4.7L8 11.8l-4.2 2.2.8-4.7L1.2 6l4.7-.7L8 1Z" />
        </svg>
      ))}
    </div>
  );
}

function LeafArrow({ direction }: { direction: 'prev' | 'next' }) {
  const tilt = direction === 'prev' ? '-rotate-12' : 'rotate-12';
  const corners =
    direction === 'prev'
      ? 'rounded-tl-none rounded-tr-full rounded-br-full rounded-bl-full'
      : 'rounded-tr-none rounded-tl-full rounded-bl-full rounded-br-full';

  return (
    <span
      aria-hidden="true"
      className={`flex h-10 w-10 items-center justify-center border border-gold/50 bg-cream shadow-warm-sm transition-all duration-300 ${corners} ${tilt} group-hover:border-gold group-hover:-translate-y-0.5 group-hover:shadow-warm group-active:border-gold group-active:shadow-warm`}
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 13 13"
        fill="none"
        className={`text-brown-dark ${direction === 'prev' ? 'rotate-12' : '-rotate-12'}`}
      >
        {direction === 'prev' ? (
          <path d="M8 2.5L3.5 6.5L8 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M5 2.5L9.5 6.5L5 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </span>
  );
}

/**
 * Carrossel de avaliações -- funciona com qualquer quantidade de itens,
 * inclusive um só: com `reviews.length <= 1`, as setas e o indicador de
 * página ("01/02") ficam ocultos (não há para onde navegar) e o card
 * permanece centralizado, sem swipe/teclado inertes. Sem qualquer menção ao
 * Google (nenhuma confirmação de que o depoimento veio do Google) e sem
 * nota/estrelas quando `rating` não estiver confirmado (`0`).
 */
export function Reviews() {
  const { reviews, reviewsNotice } = siteContent;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const { ref: mobileRef, active: mobileActive, isMobileViewport } = useMobileViewportActive<HTMLDivElement>();
  const hasMultiple = reviews.length > 1;

  function goToNext() {
    setDirection(1);
    setIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  }

  function goToPrevious() {
    setDirection(-1);
    setIndex((prev) => (prev === 0 ? 0 : prev - 1));
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (!hasMultiple) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goToNext();
    } else if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      goToPrevious();
    }
  }

  function handleTouchStart(event: TouchEvent) {
    if (!hasMultiple) return;
    touchStartX.current = event.touches[0].clientX;
  }

  function handleTouchEnd(event: TouchEvent) {
    if (!hasMultiple || touchStartX.current === null) return;
    const deltaX = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(deltaX) < 40) return;
    if (deltaX < 0) goToNext();
    else if (index > 0) goToPrevious();
  }

  const current = reviews[index];

  return (
    <section id="avaliacoes" className="bg-cream-light/40 py-24 sm:py-28">
      <Container className="flex flex-col items-center gap-12">
        <Reveal>
          <SectionHeading eyebrow="Avaliações" title="O que dizem sobre a Estética Mariangela" />
        </Reveal>

        {reviews.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-[2rem] border border-dashed border-gold/40 bg-cream px-8 py-14 text-center">
            <p className="text-base text-brown-dark">{reviewsNotice}</p>
          </div>
        ) : (
          <>
            <motion.div
              ref={mobileRef}
              variants={mobileCardVariants}
              initial={false}
              animate={isMobileViewport ? (mobileActive ? 'active' : 'rest') : undefined}
              transition={mobileCardTransition}
              className="w-full max-w-xl"
            >
            <motion.div
              role="region"
              aria-roledescription={hasMultiple ? 'carrossel' : undefined}
              aria-label="Avaliações de clientes"
              tabIndex={0}
              onKeyDown={handleKeyDown}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              data-mobile-active={isMobileViewport ? mobileActive : undefined}
              whileHover={{ y: -3.5, scale: 1.01, rotate: 0.4 }}
              whileTap={{ scale: 0.985, transition: { duration: 0.15, ease: EASE_OUT } }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              className="group relative w-full max-w-xl rounded-[2.5rem_2.5rem_2.5rem_1rem] outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 -rotate-2 rounded-[2.5rem_2.5rem_2.5rem_1rem] bg-beige/30"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-4 rounded-[3rem] bg-gold/10 opacity-70 blur-2xl transition-opacity duration-300 group-hover:opacity-100 group-data-[mobile-active=true]:opacity-100"
              />

              <motion.figure
                key={current.id}
                initial={{ opacity: 0, x: direction * 14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
                className="relative flex flex-col items-center gap-6 rounded-[2.5rem_2.5rem_2.5rem_1rem] border border-gold/25 bg-gradient-to-br from-cream via-cream-light to-beige/40 px-6 py-9 text-center shadow-warm-sm ring-1 ring-gold/10 transition-shadow duration-300 group-hover:shadow-warm group-hover:ring-gold/25 group-data-[mobile-active=true]:shadow-warm group-data-[mobile-active=true]:ring-gold/25 sm:px-10 sm:py-12"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-6 top-3 font-heading text-6xl leading-none text-gold/20 sm:text-7xl"
                >
                  “
                </span>

                {current.rating > 0 && <StarRow rating={current.rating} />}

                <blockquote className="relative max-w-md text-base leading-relaxed text-brown-dark sm:text-lg">
                  “{current.text}”
                </blockquote>

                <span
                  aria-hidden="true"
                  className="h-px w-10 bg-gradient-to-r from-transparent via-gold/50 to-transparent"
                />

                <figcaption className="flex flex-col items-center gap-2">
                  <span className="font-heading text-lg text-brown-dark sm:text-xl">{current.author}</span>
                  <span className="text-[0.65rem] font-medium uppercase tracking-[0.12em] text-brown/50">
                    Comentário público no Instagram
                  </span>
                </figcaption>
              </motion.figure>
            </motion.div>
            </motion.div>

            {/* Relato individual, sem nenhuma garantia de resultado -- ver
                seção 11/22 das diretrizes de conteúdo. */}
            <p className="max-w-md text-center text-xs text-brown/50">
              Relato individual. Os resultados podem variar de pessoa para pessoa.
            </p>

            {hasMultiple && (
              <div className="flex flex-col items-center gap-3">
                <div className="group flex items-center gap-4">
                  {index > 0 && (
                    <motion.button
                      type="button"
                      onClick={goToPrevious}
                      aria-label="Ver avaliação anterior"
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.15, ease: EASE_OUT }}
                      className="group rounded-full p-1.5"
                    >
                      <LeafArrow direction="prev" />
                    </motion.button>
                  )}
                  <motion.button
                    type="button"
                    onClick={goToNext}
                    aria-label="Ver próxima avaliação"
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.15, ease: EASE_OUT }}
                    className="group rounded-full p-1.5"
                  >
                    <LeafArrow direction="next" />
                  </motion.button>
                </div>

                <p className="text-xs font-medium tracking-[0.15em] text-brown/50">
                  {String(index + 1).padStart(2, '0')} / {String(reviews.length).padStart(2, '0')}
                </p>
              </div>
            )}
          </>
        )}
      </Container>
    </section>
  );
}
