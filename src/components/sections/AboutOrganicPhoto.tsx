import { useId } from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface AboutOrganicPhotoProps {
  /** Enquanto a foto real não estiver disponível, deixe `src` vazio/ausente
   * -- a moldura mostra um preenchimento neutro no lugar da foto, sem
   * quebrar a moldura/correntes decorativas ao redor. */
  src?: string;
  alt: string;
  /** Controla loop das correntes/bordas/brilho -- pausa fora da viewport,
   * retoma suavemente ao voltar (mesmo `useRepeatableInView` já usado pela
   * seção para o texto). */
  isInView: boolean;
}

/**
 * viewBox expandido: a foto (1089x1445, resolução nativa) fica inset por
 * `MARGIN` unidades em cada lado -- essa margem reserva o espaço onde
 * correntes/bordas podem se estender, então nada ultrapassa o próprio SVG
 * (raiz da barra horizontal do ciclo anterior: a corrente externa girava
 * 27° sobre um retângulo maior que o viewBox, sem margem reservada, e
 * vazava ~150 unidades para fora -- confirmado calculando a bounding box
 * do retângulo rotacionado). Toda a geometria abaixo foi verificada por
 * script para nunca ultrapassar este viewBox, em qualquer breakpoint,
 * porque tudo escala proporcionalmente a partir dele.
 */
const MARGIN = 60;
const PHOTO_W = 1089;
const PHOTO_H = 1445;
const EXPANDED_W = PHOTO_W + MARGIN * 2; // 1209
const EXPANDED_H = PHOTO_H + MARGIN * 2; // 1565
const CENTER = { x: EXPANDED_W / 2, y: EXPANDED_H / 2 };

const FRAME_PATH =
  'M 140 80 L 1069 80 A 60 60 0 0 1 1129 140 L 1129 1425 A 60 60 0 0 1 1069 1485 L 140 1485 A 60 60 0 0 1 80 1425 L 80 140 A 60 60 0 0 1 140 80 Z';

const INNER_CHAIN_PATH =
  'M 140 68 L 1069 68 A 72 72 0 0 1 1141 140 L 1141 1425 A 72 72 0 0 1 1069 1497 L 140 1497 A 72 72 0 0 1 68 1425 L 68 140 A 72 72 0 0 1 140 68 Z';

/** Levemente maior e com inclinação FIXA de 4° (nunca animada) -- bem mais
 * discreta que a diagonal de 27° da versão anterior, para caber com folga
 * dentro da margem reservada em qualquer tamanho de tela. */
const OUTER_CHAIN_LOCAL_PATH =
  'M 140 66 L 1069 66 A 74 74 0 0 1 1143 140 L 1143 1425 A 74 74 0 0 1 1069 1499 L 140 1499 A 74 74 0 0 1 66 1425 L 66 140 A 74 74 0 0 1 140 66 Z';
const OUTER_ROTATION = 4;

/** 4 linhas finas, versões levemente deslocadas da moldura principal (não
 * perfeitamente sobrepostas) -- cada uma com um movimento independente e
 * muito sutil (seção 7 do pedido). */
const BORDER_LINES: {
  path: string;
  color: string;
  opacity: number;
  strokeWidth: number;
  duration: number;
  animate: Record<string, number[]>;
}[] = [
  {
    path: 'M 140 76 L 1069 76 A 64 64 0 0 1 1133 140 L 1133 1425 A 64 64 0 0 1 1069 1489 L 140 1489 A 64 64 0 0 1 76 1425 L 76 140 A 64 64 0 0 1 140 76 Z',
    color: '#bd9e95',
    opacity: 0.55,
    strokeWidth: 1.6,
    duration: 18,
    animate: { x: [-3, 3, -3], rotate: [-0.35, 0.35, -0.35] },
  },
  {
    path: 'M 140 72 L 1069 72 A 68 68 0 0 1 1137 140 L 1137 1425 A 68 68 0 0 1 1069 1493 L 140 1493 A 68 68 0 0 1 72 1425 L 72 140 A 68 68 0 0 1 140 72 Z',
    color: '#a7887f',
    opacity: 0.4,
    strokeWidth: 1.4,
    duration: 23,
    animate: { y: [-3, 3, -3], scale: [1, 1.012, 1] },
  },
  {
    path: 'M 140 68 L 1069 68 A 72 72 0 0 1 1141 140 L 1141 1425 A 72 72 0 0 1 1069 1497 L 140 1497 A 72 72 0 0 1 68 1425 L 68 140 A 72 72 0 0 1 140 68 Z',
    color: '#7b5d55',
    opacity: 0.3,
    strokeWidth: 1.3,
    duration: 28,
    animate: { x: [2.5, -2.5, 2.5], y: [-2, 2, -2], rotate: [0.3, -0.3, 0.3] },
  },
  {
    path: 'M 140 64 L 1069 64 A 76 76 0 0 1 1145 140 L 1145 1425 A 76 76 0 0 1 1069 1501 L 140 1501 A 76 76 0 0 1 64 1425 L 64 140 A 76 76 0 0 1 140 64 Z',
    color: '#bd9e95',
    opacity: 0.22,
    strokeWidth: 1.2,
    duration: 31,
    animate: { x: [-1.5, 1.5, -1.5], y: [1.5, -1.5, 1.5] },
  },
];

interface ChainStrokeProps {
  pathD: string;
  direction: 1 | -1;
  duration: number;
  animated: boolean;
}

/** Corrente em 3 camadas sobre o MESMO path (relevo + corpo + brilho
 * esparso) -- só `strokeDashoffset` anima, o path em si fica parado. */
function ChainStroke({ pathD, direction, duration, animated }: ChainStrokeProps) {
  const LINK_PERIOD = 34;
  const GLINT_PERIOD = 48;
  const linkAnimate = animated ? { strokeDashoffset: [0, direction * -LINK_PERIOD] } : undefined;
  const glintAnimate = animated ? { strokeDashoffset: [0, direction * -GLINT_PERIOD] } : undefined;
  const linkTransition = { duration, repeat: Infinity, ease: 'linear' as const };
  const glintTransition = { duration: duration * 1.7, repeat: Infinity, ease: 'linear' as const };

  return (
    <>
      <motion.path
        d={pathD}
        fill="none"
        stroke="#7b5d55"
        strokeWidth={9}
        strokeLinecap="round"
        strokeDasharray="26 8"
        opacity={0.4}
        animate={linkAnimate}
        transition={linkTransition}
      />
      <motion.path
        d={pathD}
        fill="none"
        stroke="#bd9e95"
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray="26 8"
        opacity={0.92}
        animate={linkAnimate}
        transition={linkTransition}
      />
      <motion.path
        d={pathD}
        fill="none"
        stroke="#f3e5e1"
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray="8 40"
        opacity={0.48}
        animate={glintAnimate}
        transition={glintTransition}
      />
    </>
  );
}

function BorderLine({
  line,
  animated,
  mobileDampen,
}: {
  line: (typeof BORDER_LINES)[number];
  animated: boolean;
  mobileDampen: number;
}) {
  const animate = animated
    ? Object.fromEntries(Object.entries(line.animate).map(([k, v]) => [k, v.map((n) => n * mobileDampen)]))
    : undefined;
  return (
    <motion.path
      d={line.path}
      fill="none"
      stroke={line.color}
      strokeWidth={line.strokeWidth}
      opacity={line.opacity}
      animate={animate}
      transition={{ duration: line.duration, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      style={{ transformOrigin: `${CENTER.x}px ${CENTER.y}px` }}
    />
  );
}

/**
 * Moldura de cantos arredondados com correntes decorativas + linhas
 * douradas animadas + brilho percorrendo o contorno, toda contida dentro de
 * um viewBox expandido (nunca ultrapassa a área reservada, ver `MARGIN`
 * acima). Foto sem filtro, sem corte (`preserveAspectRatio="xMidYMid
 * meet"`). Camadas, de trás para frente: halo estático -> linhas de borda
 * -> corrente externa -> foto + borda principal -> corrente interna ->
 * brilho percorrendo o contorno.
 */
export function AboutOrganicPhoto({ src, alt, isInView }: AboutOrganicPhotoProps) {
  const prefersReducedMotion = useReducedMotion();
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, '');
  const clipId = `about-frame-clip-${rawId}`;
  const shadowFilterId = `about-chain-shadow-${rawId}`;
  const glintGradientId = `about-glint-${rawId}`;

  const animated = isInView && !prefersReducedMotion;

  return (
    <div className="flex w-full min-w-0 justify-center overflow-hidden">
      <div className="relative isolate w-full max-w-[380px] md:w-[min(62vw,450px)] lg:mx-0 lg:w-[clamp(390px,42vw,500px)] xl:w-[clamp(420px,39vw,550px)]">
        {/* Halo estático suave -- profundidade sem competir com o rosto. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-[6%] rounded-[3rem]"
          style={{
            background: 'radial-gradient(circle, rgba(223, 193, 185, 0.32) 0%, rgba(223, 193, 185, 0) 72%)',
          }}
        />

        <svg
          viewBox={`0 0 ${EXPANDED_W} ${EXPANDED_H}`}
          className="relative block h-auto w-full"
          role="img"
          aria-label={alt}
        >
          <defs>
            <clipPath id={clipId}>
              <path d={FRAME_PATH} />
            </clipPath>
            <filter id={shadowFilterId} x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="#59403b" floodOpacity="0.14" />
            </filter>
            <linearGradient id={glintGradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#98776e" stopOpacity="0.35" />
              <stop offset="45%" stopColor="#cfaea6" stopOpacity="0.7" />
              <stop offset="52%" stopColor="#f3e5e1" stopOpacity="1" />
              <stop offset="59%" stopColor="#cfaea6" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#98776e" stopOpacity="0.35" />
            </linearGradient>
          </defs>

          {/* Linhas douradas -- traseiras, ao redor da foto. */}
          {BORDER_LINES.map((line, i) => (
            <BorderLine key={i} line={line} animated={animated} mobileDampen={1} />
          ))}

          {/* Corrente externa -- inclinação fixa, atrás da foto/moldura. */}
          <g transform={`rotate(${OUTER_ROTATION} ${CENTER.x} ${CENTER.y})`} filter={`url(#${shadowFilterId})`}>
            <ChainStroke pathD={OUTER_CHAIN_LOCAL_PATH} direction={-1} duration={27} animated={animated} />
          </g>

          {/* Foto -- sem filtro, sem corte por descompasso de proporção.
              Enquanto `src` estiver ausente, preenche a mesma área com um
              retângulo neutro e um texto discreto, sem quebrar a moldura. */}
          {src ? (
            <image
              href={src}
              x={MARGIN}
              y={MARGIN}
              width={PHOTO_W}
              height={PHOTO_H}
              preserveAspectRatio="xMidYMid meet"
              clipPath={`url(#${clipId})`}
            />
          ) : (
            <g clipPath={`url(#${clipId})`}>
              <rect x={MARGIN} y={MARGIN} width={PHOTO_W} height={PHOTO_H} fill="#f3e5e1" />
              <text
                x={CENTER.x}
                y={CENTER.y}
                textAnchor="middle"
                fontSize="32"
                fill="#b09188"
                fontFamily="'Jost', sans-serif"
              >
                Imagem será adicionada
              </text>
            </g>
          )}

          {/* Borda principal -- mesmo path do recorte. */}
          <path d={FRAME_PATH} fill="none" stroke="#f3e5e1" strokeWidth={5} opacity={0.35} />
          <path d={FRAME_PATH} fill="none" stroke="#a7887f" strokeWidth={2.4} />

          {/* Corrente interna -- por cima, colada à borda. */}
          <g filter={`url(#${shadowFilterId})`}>
            <ChainStroke pathD={INNER_CHAIN_PATH} direction={1} duration={20} animated={animated} />
          </g>

          {/* Brilho perolado percorrendo o contorno -- segmento curto,
              vão longo, desloca-se devagar; nunca vira a moldura inteira em
              tracejado. */}
          <motion.path
            d={FRAME_PATH}
            fill="none"
            stroke={`url(#${glintGradientId})`}
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray="6 170"
            style={{ filter: 'drop-shadow(0 0 5px rgba(192, 161, 152, 0.35))' }}
            animate={animated ? { strokeDashoffset: [0, -176] } : undefined}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          />
        </svg>
      </div>
    </div>
  );
}
