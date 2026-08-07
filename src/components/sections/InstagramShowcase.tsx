import { useRef } from 'react';
import { motion } from 'motion/react';
import { siteContent } from '../../data/siteContent';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { EASE_OUT } from '../motion/variants';
import { useRepeatableInView } from '../../hooks/useRepeatableInView';
import { useOnceInView } from '../../hooks/useOnceInView';
import { useReducedMotion } from '../../hooks/useReducedMotion';

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
    </svg>
  );
}

/** Não há biblioteca de ícones instalada no projeto (confirmado em
 * package.json) -- todo ícone aqui é sempre um SVG desenhado à mão, no
 * mesmo estilo (traço fino, `currentColor`) já usado em todo o site. Este
 * é um "joinha" simples, equivalente a um ThumbsUp. */
function ThumbsUpIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M5 7H2.6a1 1 0 0 0-1 1v5.2a1 1 0 0 0 1 1H5m0-7.2v7.2m0-7.2 2.3-4.4a1 1 0 0 1 1.8.2l.1.4a2.1 2.1 0 0 1-.1 1.5L8.3 7H12a1.4 1.4 0 0 1 1.3 2l-1.6 3.8a1.4 1.4 0 0 1-1.3.9H5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface LikeConfig {
  left: string;
  size: number;
  delay: number;
  duration: number;
  repeatDelay: number;
  distance: number;
  drift: number;
  tone: string;
  maxOpacity: number;
}

/** 6 "likes" (dentro da faixa pedida de 5 a 6), cada um com posição
 * horizontal, tamanho, atraso inicial, duração de subida (2.4s-3.4s),
 * pausa entre repetições, distância percorrida, deriva lateral e tom de
 * cor diferentes entre si -- para o loop parecer orgânico em vez de cópias
 * sincronizadas do mesmo elemento. Só tons já usados no site (dourado,
 * champagne/dourado claro, bege quente, marrom suave, dourado profundo com
 * baixa opacidade). */
const LIKE_ICONS: LikeConfig[] = [
  { left: '8%', size: 15, delay: 0, duration: 2.6, repeatDelay: 1.5, distance: 112, drift: -9, tone: 'text-gold', maxOpacity: 0.7 },
  { left: '24%', size: 20, delay: 0.5, duration: 3, repeatDelay: 1.1, distance: 132, drift: 10, tone: 'text-gold-soft', maxOpacity: 0.6 },
  { left: '40%', size: 13, delay: 1, duration: 2.4, repeatDelay: 1.8, distance: 98, drift: -6, tone: 'text-beige', maxOpacity: 0.55 },
  { left: '58%', size: 18, delay: 0.25, duration: 3.2, repeatDelay: 1, distance: 138, drift: 8, tone: 'text-brown/45', maxOpacity: 0.55 },
  { left: '75%', size: 16, delay: 0.75, duration: 2.8, repeatDelay: 1.4, distance: 118, drift: -10, tone: 'text-gold-deep/40', maxOpacity: 0.6 },
  { left: '90%', size: 14, delay: 1.2, duration: 3.4, repeatDelay: 1.2, distance: 106, drift: 6, tone: 'text-gold/70', maxOpacity: 0.55 },
];

/**
 * Bloco pequeno e minimalista, tratado como extra próximo do final da
 * página -- sem cards, carrossel ou galeria (removidos por decisão de
 * produto). Só ícone + título curto + frase curta + botão direto para o
 * Instagram, usando a mesma URL já cadastrada em `siteContent.contact`.
 *
 * Ao entrar na viewport (via `useRepeatableInView`), o card ganha presença
 * e alguns "likes" decorativos sobem em loop (`repeat: Infinity` +
 * `repeatDelay` por ícone) dentro da própria seção. Os likes só ficam
 * montados enquanto `isInView` é verdadeiro (`{showLikes && (...)}`): sair
 * da viewport desmonta o grupo inteiro -- interrompendo o loop de imediato
 * e liberando o trabalho da animação -- e reentrar remonta do zero, cada
 * ícone recomeçando do seu próprio atraso inicial. O próprio ciclo de
 * mount/unmount garante o reinício limpo, sem precisar de `useReplayKey`
 * aqui (só é necessário quando o elemento continua montado e apenas o
 * `animate` alterna, o que não é o caso). A entrada do card em si é
 * independente do loop dos likes -- não reinicia a cada ciclo deles. Tudo
 * decorativo: `pointer-events-none`, `aria-hidden`, nunca monta sob
 * `prefers-reduced-motion`.
 */
export function InstagramShowcase() {
  const { instagramShowcase, contact } = siteContent;
  const sectionRef = useRef<HTMLElement>(null);
  // `isInView` (repete) só controla o loop dos "likes" decorativos --
  // entram/saem de propósito a cada vez que a seção cruza a viewport. A
  // entrada do card em si usa `hasBeenSeen` (uma vez só), então não volta a
  // ficar semi-opaco/deslocado ao rolar de volta pra cima.
  const isInView = useRepeatableInView(sectionRef, { amount: 0.4 });
  const hasBeenSeen = useOnceInView(sectionRef, { amount: 0.4 });
  const prefersReducedMotion = useReducedMotion();
  const showLikes = isInView && !prefersReducedMotion;

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-10 sm:py-12">
      <Container className="flex justify-center">
        <div className="relative w-full max-w-md">
          {showLikes && (
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
              {LIKE_ICONS.map((icon, index) => (
                <motion.span
                  key={index}
                  className={`absolute bottom-[8%] ${icon.tone}`}
                  style={{ left: icon.left }}
                  initial={{ opacity: 0, y: 0, x: 0, scale: 0.6 }}
                  animate={{
                    opacity: [0, icon.maxOpacity, icon.maxOpacity, 0],
                    scale: [0.6, 1, 1, 0.8],
                    y: -icon.distance,
                    x: icon.drift,
                  }}
                  transition={{
                    duration: icon.duration,
                    delay: 0.15 + icon.delay,
                    repeat: Infinity,
                    repeatDelay: icon.repeatDelay,
                    ease: EASE_OUT,
                  }}
                >
                  <ThumbsUpIcon size={icon.size} />
                </motion.span>
              ))}
            </div>
          )}

          <motion.div
            className="relative z-10"
            initial={{ opacity: 0.92, y: 10, scale: 0.98 }}
            animate={
              hasBeenSeen
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0.92, y: 10, scale: 0.98 }
            }
            transition={{ duration: 0.5, ease: EASE_OUT }}
          >
            <motion.div
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.985 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
              className="group flex w-full flex-col items-center gap-3 rounded-[1.5rem] border border-gold/20 bg-gradient-to-b from-cream-light/50 to-beige/20 px-6 py-8 text-center shadow-warm-sm transition-[box-shadow,border-color] duration-500 ease-out hover:border-gold/45 hover:shadow-warm sm:px-8"
            >
              <motion.span
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 text-gold"
                whileHover={{ scale: 1.1, rotate: 6 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
              >
                <InstagramIcon />
              </motion.span>
              <h2 className="text-xl text-brown-dark sm:text-2xl">{instagramShowcase.title}</h2>
              <p className="text-sm leading-relaxed text-brown/70">{instagramShowcase.text}</p>
              <Button
                href={contact.instagramUrl}
                target="_blank"
                rel="noreferrer"
                variant="secondary"
                className="mt-1 px-6 py-2.5 text-xs"
              >
                {instagramShowcase.ctaLabel}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
