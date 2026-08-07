import { useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { siteContent } from '../../data/siteContent';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { PhotoFrame } from '../ui/PhotoFrame';
import { copyToClipboard } from '../../utils/clipboard';
import { Reveal } from '../motion/reveal';
import { EASE_OUT } from '../motion/variants';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useRepeatableInView } from '../../hooks/useRepeatableInView';
import { useReplayKey } from '../../hooks/useReplayKey';
import { hasValue } from '../../utils/links';

/**
 * O tilt da fachada usa MotionValues atualizadas via `.set()` no
 * `onPointerMove` (nunca `setState`), restritas a `pointerType === 'mouse'`
 * e a `!prefersReducedMotion` -- em toque ou com movimento reduzido, os
 * valores nunca saem do repouso. `whileHover`/`whileTap` declarativos já são
 * neutralizados sob `prefers-reduced-motion` pelo `MotionConfig
 * reducedMotion="user"` global. As mesmas MotionValues são reaproveitadas
 * pelos blocos mobile e desktop -- só um está visível por vez (`md:hidden` /
 * `hidden md:grid`), então não há disputa entre eles.
 */
export function Location() {
  const { address } = siteContent;
  const [copied, setCopied] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // O raio observa o próprio wrapper da foto (não a viewport da seção
  // inteira) para só disparar quando a imagem realmente estiver visível --
  // um `useInView` por árvore (mobile/desktop), já que as duas existem no
  // DOM ao mesmo tempo e só uma fica visível via CSS por vez.
  const beamFrameMobileRef = useRef<HTMLDivElement>(null);
  const beamFrameDesktopRef = useRef<HTMLDivElement>(null);
  const beamInViewMobile = useRepeatableInView(beamFrameMobileRef, { amount: 0.4 });
  const beamInViewDesktop = useRepeatableInView(beamFrameDesktopRef, { amount: 0.4 });
  const beamReplayKeyMobile = useReplayKey(beamInViewMobile);
  const beamReplayKeyDesktop = useReplayKey(beamInViewDesktop);

  // Efeito exclusivo do bloco mobile: cada elemento reage continuamente ao
  // PROGRESSO da própria rolagem (useScroll + useTransform), não a um
  // booleano de "entrou na tela" -- um useInView anterior só disparava uma
  // transição curta ao cruzar um limiar e ficava estático o resto do tempo,
  // o que não é perceptível durante uma rolagem lenta. Refs próprias, sem
  // afetar beamFrameMobileRef/beamInViewMobile (raio, inalterado).
  const photoScrollRef = useRef<HTMLDivElement>(null);
  const addressScrollRef = useRef<HTMLDivElement>(null);
  const actionsScrollRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: photoProgress } = useScroll({
    target: photoScrollRef,
    offset: ['start end', 'end start'],
  });
  const { scrollYProgress: addressProgress } = useScroll({
    target: addressScrollRef,
    offset: ['start end', 'end start'],
  });
  const { scrollYProgress: actionsProgress } = useScroll({
    target: actionsScrollRef,
    offset: ['start end', 'end start'],
  });

  const photoY = useTransform(photoProgress, [0, 0.45, 1], [18, 0, -8]);
  const photoScale = useTransform(photoProgress, [0, 0.45, 1], [0.97, 1, 0.99]);
  const photoOpacity = useTransform(photoProgress, [0, 0.45, 1], [0.82, 1, 0.92]);
  const photoShadowAlpha = useTransform(photoProgress, [0, 0.45, 1], [0.15, 0.4, 0.28]);
  const photoRingAlpha = useTransform(photoProgress, [0, 0.45, 1], [0.2, 0.5, 0.35]);
  const photoBoxShadow = useMotionTemplate`0 0 0 2px rgba(144,111,102,${photoRingAlpha}), 0 22px 42px -18px rgba(42,27,24,${photoShadowAlpha})`;

  const addressY = useTransform(addressProgress, [0, 0.4, 1], [20, 0, -6]);
  const addressOpacity = useTransform(addressProgress, [0, 0.4, 1], [0.85, 1, 0.94]);

  const mapsY = useTransform(actionsProgress, [0.05, 0.35], [14, 0]);
  const mapsScale = useTransform(actionsProgress, [0.05, 0.35], [0.98, 1]);
  const mapsOpacity = useTransform(actionsProgress, [0.05, 0.35], [0.85, 1]);
  const wazeY = useTransform(actionsProgress, [0.15, 0.45], [14, 0]);
  const wazeOpacity = useTransform(actionsProgress, [0.15, 0.45], [0.85, 1]);
  const copyY = useTransform(actionsProgress, [0.25, 0.55], [14, 0]);
  const copyOpacity = useTransform(actionsProgress, [0.25, 0.55], [0.85, 1]);

  const rawTiltX = useMotionValue(0);
  const rawTiltY = useMotionValue(0);
  const tiltX = useSpring(rawTiltX, { stiffness: 160, damping: 18, mass: 0.4 });
  const tiltY = useSpring(rawTiltY, { stiffness: 160, damping: 18, mass: 0.4 });
  const glowShiftX = useTransform(tiltY, [-1, 1], [3, -3]);
  const glowShiftY = useTransform(tiltX, [-1, 1], [-3, 3]);

  function handleFramePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (prefersReducedMotion || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width - 0.5;
    const relY = (event.clientY - rect.top) / rect.height - 0.5;
    rawTiltY.set(relX * 2);
    rawTiltX.set(relY * -2);
  }

  function handleFramePointerLeave() {
    rawTiltX.set(0);
    rawTiltY.set(0);
  }

  async function handleCopyAddress() {
    const fullAddress = `${address.street} — ${siteContent.brand.name}`;
    const success = await copyToClipboard(fullAddress);
    if (success) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    }
  }

  const facadeAlt = `Fachada da ${siteContent.brand.name}`;
  const hasMaps = hasValue(address.googleMapsUrl);
  const hasWaze = hasValue(address.wazeUrl);

  return (
    <section id="localizacao" className="bg-cream-light/40 py-24 sm:py-28">
      {/* Mobile (<768px): título -> imagem -> "Localização" -> endereço ->
          referência -> botões. Bloco independente do desktop para não
          reaproveitar estilos fora do breakpoint. */}
      <Container className="flex flex-col gap-5 md:hidden">
        <Reveal className="flex flex-col items-center gap-1.5 text-center">
          <span className="text-xs font-medium uppercase tracking-[0.28em] text-gold-deep">
            Localização
          </span>
          <h2 className="text-3xl leading-[1.15] text-brown-dark">{address.title}</h2>
          <span aria-hidden="true" className="mt-1 h-px w-10 bg-gold/50" />
        </Reveal>

        <motion.div
          ref={photoScrollRef}
          style={
            prefersReducedMotion
              ? { opacity: 1, y: 0, scale: 1 }
              : { y: photoY, scale: photoScale, opacity: photoOpacity }
          }
          className="relative [perspective:1000px]"
        >
          <motion.div
            aria-hidden="true"
            style={{ x: glowShiftX, y: glowShiftY }}
            className="pointer-events-none absolute -inset-x-3 -inset-y-5 translate-x-1 translate-y-1.5 -z-10 rounded-[2.5rem] bg-gold/10 blur-2xl"
          />
          <motion.div
            onPointerMove={handleFramePointerMove}
            onPointerLeave={handleFramePointerLeave}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.985 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            style={{ rotateX: tiltX, rotateY: tiltY }}
            className="group"
          >
            <motion.div
              ref={beamFrameMobileRef}
              style={prefersReducedMotion ? undefined : { boxShadow: photoBoxShadow }}
              className="location-media relative isolate mx-auto w-full max-w-[270px] overflow-hidden rounded-[2rem] shadow-warm-sm"
            >
              <PhotoFrame
                alt={facadeAlt}
                imgClassName="h-full w-full object-contain object-center"
                className="w-full transition-[border-color,box-shadow] duration-300 motion-reduce:transition-none group-hover:border-gold group-hover:shadow-warm group-active:border-gold group-active:shadow-warm"
              />
              {!prefersReducedMotion && (
                <motion.div
                  key={beamReplayKeyMobile}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 z-20 w-1/3 -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(189, 158, 149, 0.45)_30%,rgba(243, 229, 225, 0.75)_50%,rgba(189, 158, 149, 0.45)_70%,transparent)] blur-sm"
                  initial={{ x: '-200%', opacity: 0 }}
                  animate={beamInViewMobile ? { x: '500%', opacity: [0, 1, 1, 0] } : {}}
                  transition={{ duration: 1.4, ease: EASE_OUT, delay: 0.7 }}
                />
              )}
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          ref={addressScrollRef}
          style={
            prefersReducedMotion
              ? { opacity: 1, y: 0 }
              : { y: addressY, opacity: addressOpacity }
          }
          className="relative mx-auto flex w-full flex-col items-center gap-1.5 rounded-[1.5rem] border border-gold/15 bg-cream/50 p-5 text-center"
        >
          <span aria-hidden="true" className="h-px w-8 bg-gold/50" />
          <p className="text-lg text-brown-dark">{address.street}</p>
          {address.reference && <p className="text-sm text-brown/60">{address.reference}</p>}
        </motion.div>

        <div ref={actionsScrollRef} className="flex flex-col gap-3">
          {hasMaps && (
          <motion.div
            style={
              prefersReducedMotion
                ? { opacity: 1, y: 0, scale: 1 }
                : { y: mapsY, scale: mapsScale, opacity: mapsOpacity }
            }
          >
            <motion.a
              href={address.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
              className="flex min-h-12 w-full items-center justify-center rounded-full bg-brown-dark px-6 text-center text-sm font-medium text-cream shadow-warm-sm transition-shadow duration-300 hover:shadow-warm active:shadow-warm"
            >
              Abrir no Google Maps
            </motion.a>
          </motion.div>
          )}
          <div className="grid grid-cols-1 gap-3 min-[390px]:grid-cols-2">
            {hasWaze && (
            <motion.div
              style={prefersReducedMotion ? { opacity: 1, y: 0 } : { y: wazeY, opacity: wazeOpacity }}
            >
              <motion.a
                href={address.wazeUrl}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.975 }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
                className="flex min-h-11 items-center justify-center rounded-full border border-gold/50 px-4 text-center text-sm font-medium text-brown-dark transition-colors hover:bg-gold/10"
              >
                Abrir no Waze
              </motion.a>
            </motion.div>
            )}
            <motion.div
              style={prefersReducedMotion ? { opacity: 1, y: 0 } : { y: copyY, opacity: copyOpacity }}
            >
              <motion.button
                type="button"
                onClick={handleCopyAddress}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.975 }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
                className="flex min-h-11 items-center justify-center rounded-full border border-gold/50 px-4 text-center text-sm font-medium text-brown-dark transition-colors hover:bg-gold/10"
              >
                {copied ? 'Endereço copiado!' : 'Copiar endereço'}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </Container>

      {/* Tablet/notebook/desktop (>=768px): composição já aprovada, intacta. */}
      <Container className="hidden md:grid md:gap-14 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="flex flex-col gap-6">
          <Reveal direction="left">
            <SectionHeading
              align="left"
              eyebrow="Localização"
              title={address.title}
            />
          </Reveal>

          <Reveal
            as="div"
            direction="left"
            delay={0.15}
            className="flex flex-col gap-2 rounded-[1.5rem] border border-gold/20 bg-cream/40 p-5 transition-colors duration-300 hover:border-gold/40"
          >
            <span aria-hidden="true" className="h-px w-10 bg-gold/50" />
            <p className="text-lg text-brown-dark">{address.street}</p>
            {address.reference && <p className="text-sm text-brown/60">{address.reference}</p>}
          </Reveal>

          <Reveal
            as="div"
            direction="left"
            delay={0.25}
            className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            {hasMaps && (
            <motion.a
              href={address.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
              className="rounded-full bg-brown-dark px-6 py-3 text-center text-sm font-medium text-cream shadow-warm-sm transition-shadow duration-300 hover:shadow-warm active:shadow-warm"
            >
              Abrir no Google Maps
            </motion.a>
            )}
            {hasWaze && (
            <motion.a
              href={address.wazeUrl}
              target="_blank"
              rel="noreferrer"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.975 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
              className="rounded-full border border-gold/50 px-6 py-3 text-center text-sm font-medium text-brown-dark transition-colors hover:bg-gold/10"
            >
              Abrir no Waze
            </motion.a>
            )}
            <motion.button
              type="button"
              onClick={handleCopyAddress}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.975 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
              className="rounded-full border border-gold/50 px-6 py-3 text-sm font-medium text-brown-dark transition-colors hover:bg-gold/10"
            >
              {copied ? 'Endereço copiado!' : 'Copiar endereço'}
            </motion.button>
          </Reveal>
        </div>

        <Reveal direction="right" delay={0.1} className="flex flex-col gap-3">
          <div className="relative [perspective:1000px]">
            <motion.div
              aria-hidden="true"
              style={{ x: glowShiftX, y: glowShiftY }}
              className="pointer-events-none absolute -inset-4 -z-10 rounded-[2.5rem] bg-gold/10 blur-2xl"
            />
            <motion.div
              onPointerMove={handleFramePointerMove}
              onPointerLeave={handleFramePointerLeave}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.985 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
              style={{ rotateX: tiltX, rotateY: tiltY }}
              className="group"
            >
              <div
                ref={beamFrameDesktopRef}
                className="location-media relative isolate mx-auto w-full max-w-[340px] overflow-hidden rounded-[2rem] lg:max-w-[400px]"
              >
                <PhotoFrame
                  alt={facadeAlt}
                  imgClassName="h-full w-full object-contain object-center"
                  className="w-full transition-[border-color,box-shadow] duration-300 motion-reduce:transition-none group-hover:border-gold group-hover:shadow-warm group-active:border-gold group-active:shadow-warm"
                />
                {!prefersReducedMotion && (
                  <motion.div
                    key={beamReplayKeyDesktop}
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-0 z-20 w-1/3 -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(189, 158, 149, 0.45)_30%,rgba(243, 229, 225, 0.75)_50%,rgba(189, 158, 149, 0.45)_70%,transparent)] blur-sm"
                    initial={{ x: '-200%', opacity: 0 }}
                    animate={beamInViewDesktop ? { x: '500%', opacity: [0, 1, 1, 0] } : {}}
                    transition={{ duration: 1.4, ease: EASE_OUT, delay: 0.7 }}
                  />
                )}
              </div>
            </motion.div>
          </div>
          <p className="text-center text-sm text-brown/60">
            {siteContent.brand.name} — {address.street}
          </p>
          {hasMaps && (
            <p className="text-center text-sm text-brown/60 lg:hidden">
              Mapa interativo disponível pelo link do Google Maps acima
            </p>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
