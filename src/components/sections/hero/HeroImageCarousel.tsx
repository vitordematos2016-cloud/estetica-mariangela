import { useCallback, useEffect, useState } from 'react';
import type { CSSProperties, FocusEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { HeroImage } from '../../../types/siteContent';
import { EASE_OUT } from '../../motion/variants';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

interface HeroImageCarouselProps {
  images: HeroImage[];
}

const AUTOPLAY_MS = 5000;
const TRANSITION_MS = 900;

/** Estilo inline só com as 3 variáveis de `object-position` (ver
 * `.hero-image-media` em src/index.css) -- nenhum outro valor aqui. */
function positionVars(image: HeroImage): CSSProperties {
  return {
    '--pos-desktop': image.position,
    '--pos-tablet': image.positionTablet ?? image.position,
    '--pos-mobile': image.positionMobile ?? image.position,
  } as CSSProperties;
}

/**
 * Alternância automática entre as fotos do Hero -- crossfade suave (~900ms)
 * com leve aproximação na foto que entra, sem slide lateral e sem tela
 * vazia (a foto que sai e a que entra ficam sobrepostas em `absolute
 * inset-0` durante toda a transição). Pausa no hover e no foco por teclado,
 * retoma ao sair.
 *
 * O loop em si é UM ÚNICO `setInterval` (nunca `setTimeout` reagendado a
 * cada troca): o efeito só depende de `images.length` e `isPaused` -- nunca
 * do índice ativo, nem de scroll/IntersectionObserver/visibilidade do Hero
 * -- então ele não é destruído/recriado a cada 5s, só quando o carrossel de
 * fato pausa (hover/foco) ou retoma. `setActiveIndex` usa a forma funcional
 * (`(current) => ...`), então o próprio `setInterval` nunca precisa ser
 * recriado para "ver" o índice atualizado.
 */
export function HeroImageCarousel({ images }: HeroImageCarouselProps) {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  // Um único booleano de pausa (nunca iniciado como `true`) -- hover e foco
  // por teclado só ligam/desligam esta mesma flag, nunca dois estados
  // concorrentes que poderiam divergir.
  const [isPaused, setIsPaused] = useState(false);
  // As fotos além da primeira só entram no DOM (como preload invisível) um
  // instante depois do primeiro paint, para nunca competir com o
  // carregamento crítico da foto inicial.
  const [restReady, setRestReady] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setRestReady(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (images.length < 2 || isPaused) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % images.length);
    }, AUTOPLAY_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [images.length, isPaused]);

  const handleSelect = useCallback((next: number) => {
    setActiveIndex(next);
  }, []);

  function handleFocus() {
    setIsPaused(true);
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsPaused(false);
    }
  }

  const imageVariants = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.25, ease: EASE_OUT } },
        exit: { opacity: 0, transition: { duration: 0.2, ease: EASE_OUT } },
      }
    : {
        initial: { opacity: 0, scale: 1.025 },
        animate: { opacity: 1, scale: 1, transition: { duration: TRANSITION_MS / 1000, ease: EASE_OUT } },
        exit: { opacity: 0, transition: { duration: TRANSITION_MS / 1000, ease: EASE_OUT } },
      };

  const current = images[activeIndex];
  const count = images.length;

  return (
    <div
      onPointerEnter={() => setIsPaused(true)}
      onPointerLeave={() => setIsPaused(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className="hero-visual-scene relative mx-auto"
    >
      <div className="hero-visual-image relative mx-auto overflow-hidden rounded-[1.75rem] border border-gold/55 shadow-warm">
        <AnimatePresence mode="sync" initial={false}>
          <motion.img
            key={current.src}
            src={current.src}
            alt={current.alt}
            width={900}
            height={1200}
            loading="eager"
            decoding="async"
            fetchPriority={activeIndex === 0 ? 'high' : undefined}
            draggable={false}
            style={positionVars(current)}
            variants={imageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="hero-image-media absolute inset-0 block h-full w-full object-cover"
          />
        </AnimatePresence>

        {/* Preload invisível das demais fotos -- fica no DOM (o navegador
            busca e faz cache normalmente), nunca visível nem sobreposto à
            foto ativa; garante que a troca em ~5s nunca mostre um estado
            vazio enquanto a próxima imagem ainda está carregando. */}
        {restReady &&
          images.map((image, imageIndex) =>
            imageIndex === activeIndex ? null : (
              <img
                key={image.src}
                src={image.src}
                alt=""
                aria-hidden="true"
                width={900}
                height={1200}
                loading="eager"
                decoding="async"
                className="absolute h-0 w-0 opacity-0"
              />
            ),
          )}

        {/* Overlay muito discreto -- só o suficiente para uniformizar o
            contraste da moldura, nunca sobre o rosto (opacidade mínima). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brown-dark/12 via-transparent to-transparent"
        />

        {/* Anúncio discreto da foto ativa para leitores de tela -- a troca
            automática nunca é anunciada como alerta, só disponível sob
            demanda (aria-live="polite", nunca "assertive"). */}
        <p aria-live="polite" className="sr-only">
          {current.alt}
        </p>
      </div>

      {count > 1 && (
        <div
          role="tablist"
          aria-label="Selecionar foto em destaque"
          className="relative z-10 mt-3 flex items-center justify-center gap-1.5 rounded-full bg-beige/40 px-3 py-1.5"
        >
          {images.map((image, dotIndex) => {
            const isActive = dotIndex === activeIndex;
            return (
              <button
                key={image.src}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Mostrar foto ${dotIndex + 1} de ${count}`}
                onClick={() => handleSelect(dotIndex)}
                className="flex h-8 w-8 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-gold-deep focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
              >
                <span
                  aria-hidden="true"
                  className={`block h-2 rounded-full transition-all duration-300 ${
                    isActive ? 'w-5 bg-gold-deep' : 'w-2 bg-gold/60 hover:bg-gold-deep/60'
                  }`}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
