import { useRef } from 'react';
import { motion } from 'motion/react';
import { siteContent } from '../../data/siteContent';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { Reveal } from '../motion/reveal';
import { EASE_OUT } from '../motion/variants';
import { useRequest } from '../../context/RequestContext';
import { buildSpecialistInquiryMessage, buildWhatsAppUrl } from '../../utils/whatsapp';
import { useOnceInView } from '../../hooks/useOnceInView';
import { useRepeatableInView } from '../../hooks/useRepeatableInView';
import { useReplayKey } from '../../hooks/useReplayKey';
import { useReducedMotion } from '../../hooks/useReducedMotion';

function ArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M3 8h9.5M8.5 3.5 13 8l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Sem biblioteca de ícones no projeto -- desenhado à mão no mesmo estilo
 * (traço fino, `currentColor`) já usado em Footer/InstagramShowcase. */
function WhatsAppIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M8 2.3a5.7 5.7 0 0 0-4.86 8.66L2.3 13.7l2.8-.83A5.7 5.7 0 1 0 8 2.3Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M5.7 6.1c.1-.25.3-.6.45-.6.15-.05.35-.05.5-.05.15 0 .3-.02.45.3s.5 1.15.55 1.25c.05.1.05.2 0 .3-.05.15-.1.2-.2.3l-.35.35c-.1.1-.2.2-.1.4.35.6 1.5 1.85 2.55 2.2.15.05.25.05.35-.05l.45-.5c.15-.15.3-.15.45-.1l1.1.5c.15.05.25.1.3.2.05.1.05.5-.1.9-.15.4-.85.7-1.2.75-.3.05-.65.1-2.15-.45-1.8-.7-2.95-2.5-3.05-2.6-.1-.1-.75-1-.75-1.85 0-.5.15-.85.3-1.05Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Selo circular decorativo puramente abstrato (nunca uma foto nova) --
 * anéis concêntricos ecoando o `Ornament` já usado em Purpose/HowItWorks,
 * com um brilho central pulsando bem devagar como referência a "brilho e
 * regeneração" da pele. Só desktop (`lg:block`): pequeno o bastante para
 * nunca disputar atenção com o texto.
 */
function DecorativeSeal({ animate }: { animate: boolean }) {
  return (
    <div aria-hidden="true" className="relative mx-auto hidden aspect-square w-full max-w-[15rem] lg:block">
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(189, 158, 149, 0.28),transparent_72%)] blur-2xl" />
      <div className="absolute inset-6 rounded-full border border-gold/25" />
      <div className="absolute inset-14 rounded-full border border-dashed border-gold/35" />
      <div className="absolute inset-[5.25rem] rounded-full bg-gradient-to-br from-cream-light to-beige/50 shadow-[inset_0_2px_10px_rgba(89, 64, 59, 0.12)]" />
      <motion.span
        className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold"
        animate={animate ? { scale: [1, 1.35, 1], opacity: [0.65, 1, 0.65] } : undefined}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

/**
 * Pontinhos de luz muito discretos, opacidade pulsando bem devagar --
 * decoração pura (`aria-hidden`), nunca renderizados sob reduced-motion.
 */
function LightDots() {
  const dots = [
    { top: '14%', right: '12%', size: 6, duration: 3.4, delay: 0 },
    { top: '32%', right: '22%', size: 4, duration: 4.1, delay: 0.7 },
    { top: '78%', left: '9%', size: 5, duration: 3.8, delay: 1.3 },
  ];
  return (
    <>
      {dots.map((dot, index) => (
        <motion.span
          key={index}
          aria-hidden="true"
          className="absolute rounded-full bg-gold/60"
          style={{ top: dot.top, right: dot.right, left: dot.left, width: dot.size, height: dot.size }}
          animate={{ opacity: [0.25, 0.85, 0.25] }}
          transition={{ duration: dot.duration, repeat: Infinity, ease: 'easeInOut', delay: dot.delay }}
        />
      ))}
    </>
  );
}

export function FinalCta() {
  const { finalCta, contact } = siteContent;
  const { openRequest } = useRequest();
  const specialistWhatsappUrl = buildWhatsAppUrl(contact.whatsappNumber, buildSpecialistInquiryMessage());
  const canTalkToSpecialist = !!specialistWhatsappUrl;
  const ref = useRef<HTMLElement>(null);
  // `hasBeenSeen` (uma vez só) governa a entrada do cartão inteiro --
  // `frameInView` (repete) só alimenta o brilho que passa pela moldura, o
  // mesmo padrão já usado em Location/ThoughtfulDetails.
  const hasBeenSeen = useOnceInView(ref, { amount: 0.3 });
  const frameInView = useRepeatableInView(ref, { amount: 0.4 });
  const shineReplayKey = useReplayKey(frameInView);
  const prefersReducedMotion = useReducedMotion();

  const [titleBefore, titleAfter] = finalCta.title.split(finalCta.titleHighlight);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-cream-light via-beige/20 to-cream-light py-16 sm:py-24 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-beige/50 blur-3xl"
      />

      <Container>
        <Reveal active={hasBeenSeen} direction="up" amount={0.3}>
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] border border-gold/30 bg-gradient-to-br from-cream via-cream-light to-beige/40 px-6 py-10 shadow-warm sm:px-12 sm:py-14 lg:px-10 lg:py-16 xl:px-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_50%_0%,rgba(167, 136, 127, 0.14),transparent_70%)]"
            />

            {!prefersReducedMotion && (
              <motion.div
                key={shineReplayKey}
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -left-1/4 z-10 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-cream/70 to-transparent mix-blend-overlay"
                initial={{ x: '-40%', opacity: 0 }}
                animate={frameInView ? { x: '600%', opacity: [0, 1, 0] } : {}}
                transition={{ duration: 2.4, ease: EASE_OUT, delay: 0.4 }}
              />
            )}

            {!prefersReducedMotion && <LightDots />}

            <svg
              aria-hidden="true"
              className="pointer-events-none absolute -right-8 top-1/2 hidden h-64 w-64 -translate-y-1/2 opacity-50 lg:block"
              viewBox="0 0 200 200"
              fill="none"
            >
              <path d="M20 180 C 20 80, 100 20, 190 20" stroke="url(#final-cta-gold-line)" strokeWidth="1.2" />
              <defs>
                <linearGradient id="final-cta-gold-line" x1="0" y1="0" x2="200" y2="200">
                  <stop offset="0%" stopColor="#a7887f" stopOpacity="0" />
                  <stop offset="50%" stopColor="#bd9e95" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#a7887f" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            <div className="relative grid gap-10 lg:grid-cols-[1.4fr_0.6fr] lg:items-center lg:gap-8 xl:gap-12">
              <div className="flex flex-col items-center gap-5 text-center sm:gap-6 lg:items-start lg:text-left">
                <span className="text-xs font-medium uppercase tracking-[0.28em] text-gold-deep">
                  {finalCta.eyebrow}
                </span>

                <h2
                  aria-label={finalCta.title}
                  className="max-w-xl font-heading text-[1.85rem] leading-[1.25] text-brown-dark sm:text-4xl lg:text-[2.75rem]"
                >
                  <span aria-hidden="true">
                    {titleBefore}
                    <span className="text-gold-deep">{finalCta.titleHighlight}</span>
                    {titleAfter}
                  </span>
                </h2>

                <p className="max-w-[650px] text-[clamp(0.9375rem,1.4vw,1.125rem)] leading-[1.65] text-brown/80">
                  {finalCta.text}
                </p>

                <div className="mt-2 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
                  <Button
                    type="button"
                    onClick={() => openRequest()}
                    variant="primary"
                    shine
                    className="border border-gold-deep/30 bg-gradient-to-b from-gold-soft to-gold text-brown-dark shadow-[0_10px_30px_-10px_rgba(167, 136, 127, 0.55)] transition-shadow duration-300 hover:shadow-[0_16px_40px_-12px_rgba(167, 136, 127, 0.7)]"
                  >
                    {finalCta.primaryCta.label}
                    <ArrowIcon />
                  </Button>

                  {canTalkToSpecialist && (
                    <Button
                      href={specialistWhatsappUrl ?? undefined}
                      target="_blank"
                      rel="noreferrer"
                      variant="secondary"
                      className="bg-cream/50 backdrop-blur-sm"
                    >
                      <WhatsAppIcon />
                      {finalCta.secondaryCtaLabel}
                    </Button>
                  )}
                </div>
              </div>

              <DecorativeSeal animate={!prefersReducedMotion} />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
