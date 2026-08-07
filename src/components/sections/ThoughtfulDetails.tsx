import { useRef } from 'react';
import { motion } from 'motion/react';
import { siteContent } from '../../data/siteContent';
import { Container } from '../ui/Container';
import { PhotoFrame } from '../ui/PhotoFrame';
import { Reveal } from '../motion/reveal';
import { EASE_IN_OUT, EASE_OUT } from '../motion/variants';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useMobileViewportActive } from '../../hooks/useMobileViewportActive';
import { mobileCardTransition, mobileCardVariants } from '../motion/mobileActive';
import { useRepeatableInView } from '../../hooks/useRepeatableInView';
import { useOnceInView } from '../../hooks/useOnceInView';
import { useReplayKey } from '../../hooks/useReplayKey';

/**
 * Seção pequena e delicada — uma "lembrancinha", não um bloco de conteúdo
 * principal. Foto, título e texto formam um único conjunto de interação
 * (mesmo mecanismo hover/toque já validado em Experience.tsx): `group-hover`
 * do Tailwind só dispara com hover real (`@media (hover:hover)`, padrão do
 * Tailwind v4), `group-active` cobre toque e clique, e o `whileTap`/
 * `whileHover` do Motion são neutralizados automaticamente sob
 * `prefers-reduced-motion` pelo `MotionConfig reducedMotion="user"` global.
 * O brilho de entrada é removido por completo (não só neutralizado) quando
 * o SO pede menos movimento.
 *
 * Abaixo de 768px, um wrapper externo com `useMobileViewportActive` (ref
 * próprio, distinto do `ref`/`isInView` de entrada acima) recua o conjunto
 * fora da região central da tela e devolve presença total ao cruzá-la;
 * `data-mobile-active` reaproveita as mesmas classes `group-hover:`/
 * `group-active:` via `group-data-[mobile-active=true]:`.
 */
// Sem texto/foto confirmados ainda -- seção oculta até que a Mariangela
// confirme conteúdo oficial (ver docs/PENDENCIAS_CLIENTE.md). O componente
// continua pronto para voltar, sem precisar de novo código.
const THOUGHTFUL_DETAILS_CONFIRMED = false;

export function ThoughtfulDetails() {
  const { thoughtfulDetails, brand } = siteContent;
  const ref = useRef<HTMLDivElement>(null);
  // `isInView` (repete) só alimenta o brilho -- a entrada da foto/título/
  // texto usa `hasBeenSeen` (uma vez só).
  const isInView = useRepeatableInView(ref, { amount: 0.4 });
  const hasBeenSeen = useOnceInView(ref, { amount: 0.4 });
  const prefersReducedMotion = useReducedMotion();
  // Exceção deliberada ao `once: true` do resto do site: só as portas de
  // madeira repetem a cada entrada/saída da viewport (pedido explícito da
  // cliente para esta seção). `doorContainerRef` observa a moldura da foto
  // (não a seção inteira, mais alta). `amount: 0.55` + margem de -18% em
  // cima/embaixo (encolhe a área observada para a faixa central da tela)
  // exige a moldura já bem visível antes de abrir -- valores mais frouxos
  // (0.35 / -8%) disparavam a abertura cedo demais, com a moldura ainda
  // quase toda fora da tela, e quem rolava num ritmo normal só via a
  // segunda metade do movimento.
  const doorContainerRef = useRef<HTMLDivElement>(null);
  const isDoorInView = useRepeatableInView(doorContainerRef, { amount: 0.55, margin: '-18% 0px -18% 0px' });
  const doorTransition = isDoorInView
    ? { duration: 2.1, ease: EASE_OUT }
    : { duration: 1.6, ease: EASE_IN_OUT };
  const shimmerReplayKey = useReplayKey(isInView);
  const { ref: mobileRef, active: mobileActive, isMobileViewport } = useMobileViewportActive<HTMLDivElement>();

  if (!THOUGHTFUL_DETAILS_CONFIRMED) return null;

  return (
    <section className="py-16 sm:py-20">
      <Container className="flex justify-center">
        <motion.div
          ref={mobileRef}
          variants={mobileCardVariants}
          initial={false}
          animate={isMobileViewport ? (mobileActive ? 'active' : 'rest') : undefined}
          transition={mobileCardTransition}
        >
        <motion.div
          ref={ref}
          data-mobile-active={isMobileViewport ? mobileActive : undefined}
          className="group relative mx-auto flex w-full max-w-xs flex-col items-center gap-3 text-center sm:max-w-sm"
          whileHover={{ y: -2.5, scale: 1.01, rotate: 0.4 }}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
        >
          <Reveal active={hasBeenSeen} delay={0} className="w-full">
            {/* Largura travada em `max-w-[14rem]`/`sm:max-w-[16rem]` -- igual
                à da própria foto -- e `mx-auto` para centralizar: sem isso,
                este bloco herdava a largura cheia do cartão (`w-full` do
                Reveal acima) e a foto, mais estreita, ficava colada à
                esquerda dentro dele, com o brilho e as portas visivelmente
                fora de centro em relação ao título/texto abaixo. */}
            <div className="relative mx-auto w-full max-w-[14rem] sm:max-w-[16rem]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-3 rounded-[2.25rem] bg-gold/10 opacity-60 blur-2xl transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100 group-data-[mobile-active=true]:opacity-100"
              />
              <div
                aria-hidden="true"
                className="absolute -top-1.5 left-1/2 h-4 w-10 -translate-x-1/2 -rotate-3 rounded-[2px] bg-gold/25 shadow-sm"
              />

              <motion.div
                className="relative"
                whileHover={{ scale: 1.015 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
              >
                <div
                  ref={doorContainerRef}
                  className="detail-image-reveal relative overflow-hidden rounded-[2rem]"
                >
                  <motion.div
                    className="relative"
                    initial={prefersReducedMotion ? undefined : false}
                    animate={
                      prefersReducedMotion
                        ? undefined
                        : { opacity: isDoorInView ? 1 : 0.9, scale: isDoorInView ? 1 : 1.01 }
                    }
                    transition={doorTransition}
                  >
                    <PhotoFrame
                      alt={`Detalhe de cuidado da ${brand.name}`}
                      className="relative w-full transition-shadow duration-300 group-hover:border-gold/70 group-hover:shadow-warm group-active:border-gold/70 group-active:shadow-warm group-data-[mobile-active=true]:border-gold/70 group-data-[mobile-active=true]:shadow-warm"
                    />
                  </motion.div>

                  {!prefersReducedMotion && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]"
                    >
                      <motion.div
                        key={shimmerReplayKey}
                        aria-hidden="true"
                        className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-cream/60 to-transparent mix-blend-screen"
                        initial={{ x: '-40%', opacity: 0 }}
                        animate={isInView ? { x: '340%', opacity: [0, 1, 0] } : {}}
                        transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.6 }}
                      />
                    </div>
                  )}

                  {!prefersReducedMotion && (
                    <>
                      <motion.div
                        aria-hidden="true"
                        className="detail-door detail-door--left"
                        data-open={isDoorInView}
                        initial={false}
                        animate={{ rotateY: isDoorInView ? -92 : 0, opacity: isDoorInView ? 0 : 1 }}
                        transition={{
                          rotateY: doorTransition,
                          // Some navegadores continuam pintando um resquício
                          // de `box-shadow`/borda da porta mesmo depois do
                          // `backface-visibility: hidden` a esconder na
                          // rotação -- some a `opacity` só depois que o giro
                          // termina (delay = duração do giro), então o
                          // movimento em si fica idêntico, e ao fechar ela
                          // volta visível instantaneamente, antes de girar.
                          opacity: { duration: 0, delay: isDoorInView ? doorTransition.duration : 0 },
                        }}
                      >
                        <span className="detail-door__glass" />
                        <span className="detail-door__gold-line" />
                        <span className="detail-door__handle" />
                      </motion.div>
                      <motion.div
                        aria-hidden="true"
                        className="detail-door detail-door--right"
                        data-open={isDoorInView}
                        initial={false}
                        animate={{ rotateY: isDoorInView ? 92 : 0, opacity: isDoorInView ? 0 : 1 }}
                        transition={{
                          rotateY: doorTransition,
                          opacity: { duration: 0, delay: isDoorInView ? doorTransition.duration : 0 },
                        }}
                      >
                        <span className="detail-door__glass" />
                        <span className="detail-door__gold-line" />
                        <span className="detail-door__handle" />
                      </motion.div>
                    </>
                  )}

                  <span aria-hidden="true" className="detail-frame" />
                </div>
              </motion.div>
            </div>
          </Reveal>

          <Reveal active={hasBeenSeen} delay={0.18}>
            <h2 className="text-2xl text-brown-dark transition-colors duration-300 group-hover:text-gold group-active:text-gold group-data-[mobile-active=true]:text-gold sm:text-3xl">
              {thoughtfulDetails.title}
            </h2>
          </Reveal>

          <Reveal active={hasBeenSeen} delay={0.28}>
            <p className="max-w-xs text-base leading-relaxed text-brown/75 sm:max-w-sm">
              {thoughtfulDetails.text}
            </p>
          </Reveal>
        </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
