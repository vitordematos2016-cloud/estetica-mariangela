import type { PointerEvent as ReactPointerEvent } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react';
import { siteContent } from '../../data/siteContent';
import { Container } from '../ui/Container';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useRequest } from '../../context/RequestContext';
import { Reveal, RevealGroup, RevealItem } from '../motion/reveal';
import { HeroImageCarousel } from './hero/HeroImageCarousel';

interface HeroProps {
  splashFinished: boolean;
}

/**
 * Rastreamento de cursor (glow de fundo da seção) usa apenas MotionValues
 * atualizadas via `.set()` dentro dos handlers — nunca `setState` — para não
 * causar re-render a cada pixel. `pointerType !== 'mouse'` descarta
 * toque/caneta antes de mexer em qualquer valor, e sob
 * `prefers-reduced-motion` o handler retorna cedo (os valores nunca saem do
 * repouso). O carrossel de fotos (crossfade automático) mora em
 * `HeroImageCarousel` -- ver esse componente para a lógica visual completa.
 */
export function Hero({ splashFinished }: HeroProps) {
  const { hero } = siteContent;
  const { openRequest } = useRequest();

  const rawGlowX = useMotionValue(25);
  const rawGlowY = useMotionValue(15);
  const glowX = useSpring(rawGlowX, { stiffness: 30, damping: 20, mass: 0.7 });
  const glowY = useSpring(rawGlowY, { stiffness: 30, damping: 20, mass: 0.7 });
  const glowBackground = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, rgba(167, 136, 127, 0.12), transparent 55%)`;

  function handleSectionPointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    rawGlowX.set(((event.clientX - rect.left) / rect.width) * 100);
    rawGlowY.set(((event.clientY - rect.top) / rect.height) * 100);
  }

  function handleSectionPointerLeave() {
    rawGlowX.set(25);
    rawGlowY.set(15);
  }

  return (
    <section
      id="inicio"
      onPointerMove={handleSectionPointerMove}
      onPointerLeave={handleSectionPointerLeave}
      className="relative overflow-hidden pb-20 pt-24 sm:pb-28 sm:pt-28 lg:pt-40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cream-light via-cream to-cream"
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: glowBackground }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-beige/40 blur-3xl sm:h-96 sm:w-96"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-40 h-64 w-64 rounded-full bg-gold/15 blur-3xl"
      />

      <Container className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <RevealGroup
          active={splashFinished}
          stagger={0.12}
          className="order-2 flex flex-col items-center gap-6 text-center lg:order-1 lg:items-start lg:text-left"
        >
          <RevealItem>
            <Badge>{hero.eyebrow}</Badge>
          </RevealItem>
          <RevealItem className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
            <h1 className="text-4xl leading-[1.15] text-brown-dark sm:text-5xl lg:text-[3.4rem]">
              {hero.title}
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-brown/80 sm:text-lg">
              {hero.description}
            </p>
          </RevealItem>
          <RevealItem className="flex w-full flex-col gap-3.5 sm:w-auto sm:flex-row sm:gap-4">
            <Button
              type="button"
              onClick={() => openRequest({ mode: 'avaliacao' })}
              variant="primary"
              shine
              className="w-full shadow-[0_20px_45px_-18px_rgba(167, 136, 127, 0.55)] hover:shadow-[0_24px_55px_-16px_rgba(167, 136, 127, 0.65)] sm:w-auto"
            >
              {hero.secondaryCta.label}
            </Button>
            <Button href={hero.primaryCta.href} variant="secondary" className="w-full sm:w-auto">
              {hero.primaryCta.label}
            </Button>
          </RevealItem>
        </RevealGroup>

        <Reveal
          active={splashFinished}
          delay={0.15}
          className="relative order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-lg"
        >
          <HeroImageCarousel images={hero.images} />
        </Reveal>
      </Container>
    </section>
  );
}
