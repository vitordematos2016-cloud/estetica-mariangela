import { useRef } from 'react';
import { motion } from 'motion/react';
import { siteContent } from '../../data/siteContent';
import { Container } from '../ui/Container';
import { Ornament } from '../ui/Ornament';
import { useCountUp } from '../../hooks/useCountUp';
import { Reveal } from '../motion/reveal';
import { EASE_OUT } from '../motion/variants';
import { useOnceInView } from '../../hooks/useOnceInView';
import { useReplayKey } from '../../hooks/useReplayKey';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Painel de conquista discreto: quando os dois contadores terminam (ambos
 * atingem o valor final), um brilho curto passa uma única vez. `isInView`
 * agora é "uma vez só" (nunca mais volta a `false`) -- os contadores contam
 * do zero até o valor final apenas na primeira vez que a seção é vista, e
 * permanecem no valor final para sempre depois disso (não recontam ao
 * rolar pra cima e descer de novo).
 */
export function FacadeYears() {
  const { facade } = siteContent;
  // Sem anos de experiência/clientes atendidos confirmados ainda -- a seção
  // fica oculta (nunca mostra "0" nem um valor genérico) até que os números
  // reais sejam confirmados (ver docs/PENDENCIAS_CLIENTE.md). O componente
  // continua montado em App.tsx, pronto para voltar assim que `facade.years`
  // e/ou `facade.clients` forem preenchidos.
  const hasConfirmedNumbers = facade.years > 0 || facade.clients > 0;
  const ref = useRef<HTMLElement>(null);
  const isInView = useOnceInView(ref, { amount: 0.3 });
  const prefersReducedMotion = useReducedMotion();

  const yearsValue = useCountUp(facade.years, 1200, isInView);
  const clientsValue = useCountUp(facade.clients, 1800, isInView);
  const bothComplete = isInView && yearsValue === facade.years && clientsValue === facade.clients;
  const celebrationKey = useReplayKey(bothComplete);
  const showCelebration = bothComplete && !prefersReducedMotion;

  if (!hasConfirmedNumbers) return null;

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-cream-light via-beige/35 to-cream py-24 text-center sm:py-28"
    >
      {!prefersReducedMotion && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(167, 136, 127, 0.28),transparent_60%)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ duration: 1.1, ease: EASE_OUT }}
        />
      )}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[44rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/15 sm:h-[36rem] sm:w-[36rem]"
      />

      {showCelebration && (
        <motion.div
          key={celebrationKey}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <motion.span
            className="h-40 w-40 rounded-full bg-gold/35 blur-3xl sm:h-56 sm:w-56"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 0.9, 0], scale: [0.6, 1.3, 1.5] }}
            transition={{ duration: 1.1, ease: EASE_OUT }}
          />
          {[0, 1, 2, 3].map((spark) => (
            <motion.span
              key={spark}
              className="absolute h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_10px_2px_rgba(167, 136, 127, 0.6)]"
              style={{
                left: `${50 + Math.cos((spark / 4) * Math.PI * 2) * 22}%`,
                top: `${50 + Math.sin((spark / 4) * Math.PI * 2) * 22}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0.8] }}
              transition={{ duration: 0.9, delay: 0.15 + spark * 0.05, ease: EASE_OUT }}
            />
          ))}
        </motion.div>
      )}

      <Container className="relative flex flex-col items-center gap-10">
        <Reveal as="div" active={isInView} direction="up" delay={0}>
          <Ornament size="xs" className="mx-auto mb-4" />
        </Reveal>

        <Reveal
          as="p"
          active={isInView}
          direction="up"
          delay={0}
          className="text-sm font-medium uppercase tracking-[0.35em] text-gold-deep"
        >
          {facade.title}
        </Reveal>

        <div className="flex flex-col items-center gap-8 md:flex-row md:items-stretch md:gap-14">
          <Reveal
            as="div"
            active={isInView}
            direction="none"
            delay={0.15}
            className="flex flex-col items-center gap-2"
          >
            <motion.div
              className="group flex flex-col items-center gap-2"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
            >
              <span
                aria-hidden="true"
                className="h-px w-6 bg-gold/50 transition-all duration-300 group-hover:w-9 group-hover:bg-gold"
              />
              <span
                className="font-heading whitespace-nowrap text-[3rem] leading-none text-brown-dark sm:text-[3.75rem] lg:text-[4.5rem]"
                aria-label={`Mais de ${facade.years} ${facade.yearsLabel}`}
              >
                <span aria-hidden="true" className="text-gold-deep">
                  +
                </span>
                <span>{yearsValue}</span>
              </span>
              <Reveal
                as="p"
                active={isInView}
                direction="up"
                delay={0.4}
                className="text-sm font-medium uppercase tracking-[0.18em] text-brown/70"
              >
                {facade.yearsLabel}
              </Reveal>
            </motion.div>
          </Reveal>

          <Reveal
            as="span"
            active={isInView}
            direction="none"
            delay={0.55}
            aria-hidden={true}
            className="h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent md:h-auto md:w-px md:bg-gradient-to-b md:self-stretch"
          />

          <Reveal
            as="div"
            active={isInView}
            direction="none"
            delay={0.15}
            className="flex flex-col items-center gap-2"
          >
            <motion.div
              className="group flex flex-col items-center gap-2"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
            >
              <span
                aria-hidden="true"
                className="h-px w-6 bg-gold/50 transition-all duration-300 group-hover:w-9 group-hover:bg-gold"
              />
              <span
                className="font-heading whitespace-nowrap text-[3rem] leading-none text-brown-dark sm:text-[3.75rem] lg:text-[4.5rem]"
                aria-label={`Mais de ${facade.clients.toLocaleString('pt-BR')} ${facade.clientsLabel}`}
              >
                <span aria-hidden="true" className="text-gold-deep">
                  +
                </span>
                <span>{clientsValue.toLocaleString('pt-BR')}</span>
              </span>
              <Reveal
                as="p"
                active={isInView}
                direction="up"
                delay={0.45}
                className="text-sm font-medium uppercase tracking-[0.18em] text-brown/70"
              >
                {facade.clientsLabel}
              </Reveal>
            </motion.div>
          </Reveal>
        </div>

        <Reveal
          as="p"
          active={isInView}
          direction="up"
          delay={0.7}
          className="max-w-md text-base leading-relaxed text-brown/70"
        >
          {facade.text}
        </Reveal>
      </Container>
    </section>
  );
}
