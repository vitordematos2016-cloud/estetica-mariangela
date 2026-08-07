export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'none';

// Mesma curva já usada em index.css (.splash-image-in) — reaproveitada aqui
// para manter a mesma assinatura de movimento em toda a experiência Motion.
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN = [0.4, 0, 1, 1] as const;
// Usada para movimentos de "fechamento"/saída que devem ser rápidos mas sem
// brusquidão (ex.: portas de madeira fechando ao sair da viewport) --
// distinta de EASE_IN (que acelera até o fim, mais abrupta).
export const EASE_IN_OUT = [0.4, 0, 0.2, 1] as const;

// Afasta o gatilho de entrada/saída da viewport das bordas cruas -- usado
// por Reveal/RevealGroup e pelos hooks de reentrada (useRepeatableInView,
// useInView com once:false) para não reiniciar animações com pequenos
// movimentos de rolagem perto da borda.
export const REPEAT_VIEWPORT_MARGIN = '-10% 0px -10% 0px' as const;

export const directionOffset: Record<RevealDirection, { x?: number; y?: number }> = {
  up: { y: 22 },
  down: { y: -22 },
  left: { x: -32 },
  right: { x: 32 },
  none: {},
};

export const overlayBackdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: EASE_OUT } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: EASE_IN } },
};

export const overlayPanelVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.26, ease: EASE_OUT } },
  exit: { opacity: 0, scale: 0.97, y: 6, transition: { duration: 0.16, ease: EASE_IN } },
};

// Reaproveitadas pelos botões premium do showcase de mídia (abas, setas do
// carrossel) para manter a mesma assinatura de hover/toque do resto do site.
export const PREMIUM_HOVER_TRANSITION = { duration: 0.22, ease: EASE_OUT };
export const PREMIUM_TAP_TRANSITION = { duration: 0.15, ease: EASE_OUT };

// Crossfade usado no showcase de mídia do modal ao trocar de conteúdo
// (Procedimento/Antes-Depois) ou de tipo (Imagem/Vídeo) -- itens ficam
// posicionados em `absolute inset-0` no chamador para que a sobreposição
// entre saída/entrada não desloque o layout.
export const mediaCrossfadeVariants = {
  initial: { opacity: 0, scale: 0.98, filter: 'blur(2px)' },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.2, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    filter: 'blur(2px)',
    transition: { duration: 0.2, ease: EASE_IN },
  },
};

// Slide direcional do carrossel (mesmo conteúdo/tipo, item diferente) --
// `custom` (1 ou -1) é passado pelo chamador via prop `custom` do
// AnimatePresence/motion.div para decidir de que lado a próxima mídia entra.
const CAROUSEL_SLIDE_OFFSET = 24;

export const carouselSlideVariants = {
  initial: (direction: 1 | -1) => ({
    opacity: 0,
    x: direction * CAROUSEL_SLIDE_OFFSET,
  }),
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.28, ease: EASE_OUT },
  },
  exit: (direction: 1 | -1) => ({
    opacity: 0,
    x: direction * -CAROUSEL_SLIDE_OFFSET,
    transition: { duration: 0.2, ease: EASE_IN },
  }),
};

// Linha de capas ("Ver procedimento"/"Ver resultado") do showcase de mídia --
// some com um leve deslocamento para cima antes da mídia revelada entrar
// (ver `mediaRevealVariants`), nunca as duas ao mesmo tempo (`AnimatePresence
// mode="wait"` no chamador).
export const coverGroupVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: EASE_OUT } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18, ease: EASE_IN } },
};

// Mídia revelada ao clicar numa capa -- fade + leve deslocamento vertical +
// escala 98%→100% + blur sumindo, ~480ms somados à saída da capa (dentro do
// intervalo de 350-500ms pedido para o efeito de revelação completo).
export const mediaRevealVariants = {
  initial: { opacity: 0, y: 10, scale: 0.98, filter: 'blur(2px)' },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.3, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    y: 8,
    scale: 0.98,
    filter: 'blur(2px)',
    transition: { duration: 0.2, ease: EASE_IN },
  },
};

// Entrada/saída da mídia em tela cheia (`MediaLightbox`) -- só fade + escala
// mínima (97%→100%), sem blur, terminando sempre em `scale(1)` (sem
// transformação residual sobre o conteúdo final, como pedido).
export const lightboxMediaVariants = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.26, ease: EASE_OUT } },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.18, ease: EASE_IN } },
};
