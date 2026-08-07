import { useRef } from 'react';
import { motion } from 'motion/react';
import { siteContent } from '../../data/siteContent';
import { Container } from '../ui/Container';
import { Reveal, RevealGroup, RevealItem } from '../motion/reveal';
import { EASE_OUT } from '../motion/variants';
import { useRepeatableInView } from '../../hooks/useRepeatableInView';
import { useOnceInView } from '../../hooks/useOnceInView';
import { AboutOrganicPhoto } from './AboutOrganicPhoto';

/**
 * Destaques são puramente informativos (sem onClick/href/role) — a
 * microinteração é só decorativa. `hover:`/`group-hover:` só disparam com
 * hover real (Tailwind v4 compila dentro de `@media (hover:hover)`),
 * `active:`/`group-active:` cobrem toque sem nunca ficar "presos", e o
 * Motion é neutralizado automaticamente sob `prefers-reduced-motion` pelo
 * `MotionConfig reducedMotion="user"` global. O reflexo dourado da imagem é
 * removido por completo (não só neutralizado) sob redução de movimento.
 */
export function About() {
  const { about } = siteContent;
  const ref = useRef<HTMLElement>(null);
  // `isInView` (repete) só alimenta o loop contínuo das correntes/bordas em
  // `AboutOrganicPhoto` -- todo o resto (texto, destaques) usa `hasBeenSeen`
  // (uma vez só), para não sumir de novo ao rolar pra cima.
  const isInView = useRepeatableInView(ref, { amount: 0.3 });
  const hasBeenSeen = useOnceInView(ref, { amount: 0.3 });

  return (
    <section id="sobre" ref={ref} className="bg-cream-light/40 py-24 sm:py-28">
      <Container className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal active={hasBeenSeen} direction="left">
          <motion.div
            className="group relative"
            whileHover={{ y: -2.5, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
          >
            <AboutOrganicPhoto
              alt={`Foto de ${siteContent.brand.professional}`}
              isInView={isInView}
            />
          </motion.div>
        </Reveal>

        <div className="group/content relative flex flex-col gap-6">
          <Reveal active={hasBeenSeen} direction="right" delay={0.1}>
            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em] text-gold-deep">
              <motion.span
                aria-hidden="true"
                className="h-px w-5 origin-left bg-gold/60 transition-all duration-300 group-hover/content:w-7 group-active/content:w-7"
                initial={{ scaleX: 0 }}
                animate={hasBeenSeen ? { scaleX: 1 } : {}}
                transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.1 }}
              />
              Sobre
            </span>
          </Reveal>

          <Reveal active={hasBeenSeen} direction="right" delay={0.22}>
            <h2 className="text-3xl leading-[1.2] text-brown-dark transition-colors duration-300 group-hover/content:text-gold group-active/content:text-gold sm:text-4xl">
              {about.title}
            </h2>
          </Reveal>

          <Reveal active={hasBeenSeen} direction="right" delay={0.34}>
            <p className="text-base leading-relaxed text-brown/80 sm:text-lg">{about.text}</p>
          </Reveal>

          <RevealGroup active={hasBeenSeen} delayChildren={0.46} stagger={0.06} className="mt-2">
            {/*
              Mobile (< sm): grid 2 colunas dedicado, com o card do nome
              ocupando as duas colunas na 1ª linha. A partir de sm, as
              classes `sm:` restauram o layout original em pílulas
              (flex-wrap) — desktop/tablet permanecem intocados.
            */}
            <ul className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-3">
              {about.highlights.map((highlight, index) => {
                const isName = index === 0;

                return (
                  <RevealItem
                    as="li"
                    key={highlight}
                    direction="up"
                    duration={0.4}
                    className={isName ? 'col-span-2 sm:col-span-1' : undefined}
                  >
                    <motion.div
                      className={
                        isName
                          ? 'group relative flex h-full w-full items-center justify-center gap-2 rounded-2xl border border-gold/45 bg-gradient-to-br from-cream-light/80 to-beige/40 px-4 py-3.5 text-center shadow-[0_2px_10px_-4px_rgba(167, 136, 127, 0.22)] transition-all duration-300 hover:border-gold/60 active:scale-[0.98] active:border-gold/60 sm:h-auto sm:w-auto sm:justify-start sm:rounded-[0.85rem_0.85rem_0.85rem_0.3rem] sm:border-gold/25 sm:bg-gradient-to-br sm:from-cream-light/70 sm:to-beige/30 sm:px-3.5 sm:py-2 sm:text-left sm:shadow-none sm:active:scale-100'
                          : 'group relative flex h-full w-full items-center justify-center gap-2 rounded-xl border border-gold/25 bg-gradient-to-br from-cream-light/70 to-beige/30 px-4 py-3 text-center shadow-[0_2px_8px_-4px_rgba(167, 136, 127, 0.15)] transition-all duration-300 hover:border-gold/60 active:scale-[0.98] active:border-gold/60 sm:h-auto sm:w-auto sm:justify-start sm:rounded-[0.85rem_0.85rem_0.85rem_0.3rem] sm:px-3.5 sm:py-2 sm:text-left sm:shadow-none sm:active:scale-100'
                      }
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ duration: 0.2, ease: EASE_OUT }}
                    >
                      <span
                        aria-hidden="true"
                        className="hidden h-1.5 w-1.5 shrink-0 rounded-full bg-gold/70 transition-transform duration-300 sm:inline-block sm:group-hover:scale-125 sm:group-active:scale-125"
                      />
                      <span
                        className={
                          isName
                            ? 'text-[0.95rem] font-semibold leading-snug tracking-wide text-gold-deep transition-colors duration-300 sm:text-sm sm:font-normal sm:tracking-normal sm:text-brown-dark/85 sm:group-hover:text-brown-dark sm:group-active:text-brown-dark'
                            : 'text-sm leading-snug text-brown-dark/85 transition-colors duration-300 group-hover:text-brown-dark group-active:text-brown-dark'
                        }
                      >
                        {highlight}
                      </span>
                    </motion.div>
                  </RevealItem>
                );
              })}
            </ul>
          </RevealGroup>
        </div>
      </Container>
    </section>
  );
}
