import { useEffect, useMemo, useRef, useState } from 'react';
import type { Ref } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Treatment, TreatmentMedia } from '../../../types/siteContent';
import { PlaceholderMedia } from '../../ui/PlaceholderMedia';
import { SegmentedTabs, type SegmentedTabItem } from '../../ui/SegmentedTabs';
import {
  carouselSlideVariants,
  coverGroupVariants,
  EASE_OUT,
  mediaCrossfadeVariants,
  mediaRevealVariants,
  PREMIUM_HOVER_TRANSITION,
  PREMIUM_TAP_TRANSITION,
} from '../../motion/variants';
import { useGoldRipple } from '../../../hooks/useGoldRipple';
import { useHistoryLayer } from '../../../hooks/useHistoryLayer';
import { CarouselArrows } from './CarouselArrows';
import { CarouselIndicators } from './CarouselIndicators';
import { MediaCoverCard, type MediaCoverKind } from './MediaCoverCard';
import { MediaLightbox } from './MediaLightbox';

interface TreatmentMediaShowcaseProps {
  treatment: Treatment;
  /** Estado do `Modal` pai (`!!treatment` cru, não o valor retido durante a
   * animação de saída) -- assim que vira `false`, qualquer vídeo tocando é
   * pausado imediatamente, mesmo enquanto o modal ainda anima o fechamento. */
  isOpen: boolean;
}

type MediaTypeKind = 'image' | 'video';

const SHOWCASE_FRAME_CLASSES =
  'relative w-full overflow-hidden rounded-[2rem] border border-gold/30 bg-gradient-to-br from-cream-light via-cream to-beige/50 shadow-warm-sm';
const MEDIA_MAX_HEIGHT_CLASSES = 'max-h-[360px] sm:max-h-[440px] lg:max-h-[560px]';

const ImageIcon = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="1.5" y="3" width="13" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="5.5" cy="6.5" r="1.1" stroke="currentColor" strokeWidth="1.1" />
    <path
      d="M2 11.5 6 8l2.5 2 2-1.7L14 11.5"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const VideoIcon = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="1.5" y="3.5" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.3" />
    <path d="M12.5 6.2 14.5 5v6l-2-1.2" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
);

const BackArrowIcon = (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ExpandIcon = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M6 2H2v4M10 2h4v4M2 10v4h4M14 10v4h-4"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Área de mídia do modal de detalhes -- a mídia real fica escondida atrás de
 * capas ("Ver procedimento"/"Ver resultado") até o clique; só então mostra as
 * abas Imagem/Vídeo (quando ambos existem), o carrossel e o botão de
 * ampliar (tela cheia via `MediaLightbox`). Nunca usa `object-cover`: a
 * mídia sempre aparece inteira (`object-contain`) dentro de uma altura
 * máxima responsiva, com o quadro se ajustando suavemente (`layout`) entre o
 * estado de capas e o de mídia revelada, sem pular.
 */
export function TreatmentMediaShowcase({ treatment, isOpen }: TreatmentMediaShowcaseProps) {
  const procedureMedia = treatment.media ?? [];
  const beforeAfterMedia = treatment.beforeAfter ?? [];
  const hasProcedure = procedureMedia.length > 0;
  const hasBeforeAfter = beforeAfterMedia.length > 0;

  const procedureTypes = (['image', 'video'] as const).filter((type) =>
    procedureMedia.some((item) => item.type === type),
  );

  // Só no desktop (`lg:`): com apenas uma capa disponível, centraliza-a em
  // vez de deixá-la alinhada como se faltasse um segundo card. Baseado na
  // contagem real de seções, nunca numa classe fixa por tratamento.
  const availableSectionsCount = (hasProcedure ? 1 : 0) + (hasBeforeAfter ? 1 : 0);
  const isSoloCover = availableSectionsCount === 1;

  const [revealed, setRevealed] = useState<MediaCoverKind | null>(null);
  const [mediaType, setMediaType] = useState<MediaTypeKind>(() => procedureTypes[0] ?? 'image');
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [transitionMode, setTransitionMode] = useState<'crossfade' | 'slide'>('crossfade');
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const inlineVideoRef = useRef<HTMLVideoElement | null>(null);
  const lightboxVideoRef = useRef<HTMLVideoElement | null>(null);
  const backButtonRef = useRef<HTMLButtonElement | null>(null);
  const coversContainerRef = useRef<HTMLDivElement | null>(null);
  const prevRevealedRef = useRef<MediaCoverKind | null>(revealed);

  useEffect(() => {
    if (prevRevealedRef.current === revealed) return;
    if (revealed !== null) {
      backButtonRef.current?.focus();
    } else {
      coversContainerRef.current?.focus();
    }
    prevRevealedRef.current = revealed;
  }, [revealed]);

  useEffect(() => {
    if (isOpen) return;
    inlineVideoRef.current?.pause();
    lightboxVideoRef.current?.pause();
  }, [isOpen]);

  // Faz o botão/gesto "Voltar" nativo fechar primeiro a mídia em tela cheia
  // (uma camada própria, aninhada dentro do modal de detalhes) em vez de
  // fechar o modal inteiro ou sair do site -- ver `useHistoryLayer`.
  const requestCloseLightbox = useHistoryLayer({
    layer: 'media-fullscreen',
    isOpen: lightboxOpen,
    onPopClose: closeLightbox,
  });

  const mediaTypeTabs: SegmentedTabItem[] =
    revealed === 'antesDepois'
      ? [{ id: 'image', label: 'Imagem', icon: ImageIcon }]
      : procedureTypes.map((type) => ({
          id: type,
          label: type === 'image' ? 'Imagem' : 'Vídeo',
          icon: type === 'image' ? ImageIcon : VideoIcon,
        }));

  const slides: TreatmentMedia[] = useMemo(() => {
    if (revealed === 'antesDepois') {
      return treatment.beforeAfter ?? [];
    }
    return (treatment.media ?? []).filter((item) => item.type === mediaType);
  }, [revealed, mediaType, treatment.media, treatment.beforeAfter]);

  const activeIndex = Math.min(index, Math.max(slides.length - 1, 0));
  const activeMedia = slides[activeIndex];

  const nextMedia = slides.length > 1 ? slides[(activeIndex + 1) % slides.length] : undefined;
  const nextImageSrc = nextMedia?.type === 'image' ? nextMedia.src : undefined;
  const nextVideoSrc = nextMedia?.type === 'video' ? nextMedia.src : undefined;

  useEffect(() => {
    if (!nextImageSrc) return;
    const preloadImage = new Image();
    preloadImage.src = nextImageSrc;
  }, [nextImageSrc]);

  if (!hasProcedure && !hasBeforeAfter) {
    return <PlaceholderMedia label={treatment.name} description="Conteúdo visual em preparação" ratio="media" />;
  }

  function handleReveal(kind: MediaCoverKind) {
    const types: MediaTypeKind[] = kind === 'antesDepois' ? ['image'] : procedureTypes;
    setTransitionMode('crossfade');
    setRevealed(kind);
    setMediaType(types[0] ?? 'image');
    setIndex(0);
  }

  function handleHide() {
    inlineVideoRef.current?.pause();
    setRevealed(null);
  }

  function handleTypeChange(nextTypeId: string) {
    const nextType = nextTypeId as MediaTypeKind;
    if (nextType === mediaType) return;
    setTransitionMode('crossfade');
    setMediaType(nextType);
    setIndex(0);
  }

  function goNext() {
    if (slides.length <= 1) return;
    setTransitionMode('slide');
    setDirection(1);
    setIndex((current) => (current + 1) % slides.length);
  }

  function goPrev() {
    if (slides.length <= 1) return;
    setTransitionMode('slide');
    setDirection(-1);
    setIndex((current) => (current - 1 + slides.length) % slides.length);
  }

  function goToIndex(target: number) {
    if (target === activeIndex || slides.length <= 1) return;
    setTransitionMode('slide');
    setDirection(target > activeIndex ? 1 : -1);
    setIndex(target);
  }

  function openLightbox() {
    inlineVideoRef.current?.pause();
    setLightboxOpen(true);
  }

  function closeLightbox() {
    setLightboxOpen(false);
  }

  return (
    <>
      <motion.div layout transition={{ duration: 0.3, ease: EASE_OUT }} className={SHOWCASE_FRAME_CLASSES}>
        <AnimatePresence mode="wait" initial={false}>
          {revealed === null ? (
            <motion.div
              key="covers"
              ref={coversContainerRef}
              tabIndex={-1}
              variants={coverGroupVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={`grid grid-cols-1 gap-3 p-4 focus:outline-none sm:grid-cols-2 sm:p-5 ${
                isSoloCover ? 'lg:flex lg:justify-center lg:items-stretch' : ''
              }`}
            >
              {hasProcedure && (
                <div className={isSoloCover ? 'lg:w-full lg:max-w-[520px] lg:flex-none' : undefined}>
                  <MediaCoverCard kind="procedimento" onReveal={() => handleReveal('procedimento')} />
                </div>
              )}
              {hasBeforeAfter && (
                <div className={isSoloCover ? 'lg:w-full lg:max-w-[520px] lg:flex-none' : undefined}>
                  <MediaCoverCard kind="antesDepois" onReveal={() => handleReveal('antesDepois')} />
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="media"
              variants={mediaRevealVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col gap-3 p-3 sm:p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <HideButton ref={backButtonRef} kind={revealed} onClick={handleHide} />
                <SegmentedTabs
                  items={mediaTypeTabs}
                  activeId={mediaType}
                  onChange={handleTypeChange}
                  layoutId={`media-type-tabs-${treatment.id}`}
                  aria-label="Tipo de mídia"
                  size="sm"
                />
              </div>

              <div className="media-carousel relative flex items-center justify-center overflow-hidden rounded-[1.25rem] bg-beige/25 p-2 sm:p-3">
                <AnimatePresence custom={direction} initial={false}>
                  <motion.div
                    key={`${mediaType}:${activeIndex}`}
                    custom={direction}
                    variants={transitionMode === 'crossfade' ? mediaCrossfadeVariants : carouselSlideVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="flex items-center justify-center"
                  >
                    {activeMedia?.type === 'image' && (
                      <img
                        src={activeMedia.src}
                        alt={activeMedia.alt}
                        loading="lazy"
                        decoding="async"
                        onClick={openLightbox}
                        className={`${MEDIA_MAX_HEIGHT_CLASSES} w-auto max-w-full cursor-zoom-in rounded-[0.85rem] object-contain`}
                      />
                    )}
                    {activeMedia?.type === 'video' && (
                      <video
                        ref={inlineVideoRef}
                        src={activeMedia.src}
                        poster={activeMedia.poster}
                        controls
                        muted
                        playsInline
                        preload="metadata"
                        className={`${MEDIA_MAX_HEIGHT_CLASSES} w-auto max-w-full rounded-[0.85rem] object-contain`}
                      >
                        <track kind="captions" />
                      </video>
                    )}
                  </motion.div>
                </AnimatePresence>

                {slides.length > 1 && <CarouselArrows onPrev={goPrev} onNext={goNext} />}
                {/* Indicadores ficam embaixo do quadro -- escondidos para vídeo
                    para não sobrepor a barra de controles nativa do player. */}
                {slides.length > 1 && mediaType === 'image' && (
                  <CarouselIndicators count={slides.length} activeIndex={activeIndex} onSelect={goToIndex} />
                )}

                <ExpandButton onClick={openLightbox} />

                {nextVideoSrc && (
                  <video
                    key={`preload-${nextVideoSrc}`}
                    src={nextVideoSrc}
                    preload="metadata"
                    muted
                    playsInline
                    className="hidden"
                    aria-hidden="true"
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <MediaLightbox
        isOpen={lightboxOpen}
        slides={slides}
        activeIndex={activeIndex}
        onClose={requestCloseLightbox}
        onSelectIndex={setIndex}
        videoRef={lightboxVideoRef}
      />
    </>
  );
}

interface HideButtonProps {
  kind: MediaCoverKind;
  onClick: () => void;
  ref: Ref<HTMLButtonElement>;
}

function HideButton({ kind, onClick, ref }: HideButtonProps) {
  const { onPointerDown, rippleLayer } = useGoldRipple();
  const label = kind === 'antesDepois' ? 'Ocultar resultado' : 'Ocultar procedimento';

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      onPointerDown={onPointerDown}
      aria-label={label}
      whileHover={{ x: -2, transition: PREMIUM_HOVER_TRANSITION }}
      whileTap={{ scale: 0.97, transition: PREMIUM_TAP_TRANSITION }}
      className="relative flex items-center gap-1.5 overflow-hidden rounded-full border border-gold/30 bg-cream/40 px-3.5 py-1.5 text-xs font-medium text-brown/70 transition-colors hover:border-gold/50 hover:bg-gold/5 hover:text-brown-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
    >
      {rippleLayer}
      <span className="relative z-10 inline-flex items-center gap-1.5">
        {BackArrowIcon}
        {label}
      </span>
    </motion.button>
  );
}

function ExpandButton({ onClick }: { onClick: () => void }) {
  const { onPointerDown, rippleLayer } = useGoldRipple();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onPointerDown={onPointerDown}
      aria-label="Ampliar mídia"
      whileHover={{
        scale: 1.08,
        boxShadow: '0 0 0 4px rgba(167, 136, 127, 0.16), 0 8px 18px -8px rgba(167, 136, 127, 0.55)',
        transition: PREMIUM_HOVER_TRANSITION,
      }}
      whileTap={{ scale: 0.92 }}
      className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-gold/50 bg-brown-dark/35 text-gold-soft backdrop-blur-sm transition-colors hover:border-gold hover:bg-brown-dark/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
    >
      {rippleLayer}
      {ExpandIcon}
    </motion.button>
  );
}
