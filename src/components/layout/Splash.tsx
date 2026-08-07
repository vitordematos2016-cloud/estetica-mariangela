import { useCallback, useEffect, useRef, useState } from 'react';
import { siteContent } from '../../data/siteContent';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useScrollLock } from '../../hooks/useScrollLock';
import { markSplashAsShown, wasSplashAlreadyShown } from '../../utils/splashSession';
import { BrandMonogram } from '../ui/BrandMonogram';

type Phase = 'enter' | 'beam' | 'hold' | 'exit';

// `hold` + `exit` calibrados para o pedido original: capa visível por
// ~2200-2800ms (enter+beam+hold) e saída em ~600-800ms.
const TIMING = { enter: 600, beam: 1100, hold: 550, exit: 700 };
const REDUCED_TIMING = { enter: 0, beam: 0, hold: 300, exit: 200 };

interface GlowRect {
  top: number;
  left: number;
  width: number;
}

interface SplashProps {
  onFinish: () => void;
}

/**
 * Abertura completa da primeira visita -- versão neutra, 100% CSS (sem
 * fotos/logo real): fundo branco, monograma provisório e nome da marca, com
 * o mesmo feixe de luz/brilho decorativo (puro CSS) e a mesma máquina de
 * fases (enter -> beam -> hold -> exit) de antes. Substituir pelo material
 * visual oficial da Mariangela quando estiver disponível.
 */
export function Splash({ onFinish }: SplashProps) {
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(() => !wasSplashAlreadyShown());
  const [phase, setPhase] = useState<Phase>('enter');
  const [showSkip, setShowSkip] = useState(false);
  const [glowRect, setGlowRect] = useState<GlowRect | null>(null);
  const finishedRef = useRef(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    markSplashAsShown();
    setVisible(false);
    onFinish();
  }, [onFinish]);

  useScrollLock(visible);

  useEffect(() => {
    if (visible) dialogRef.current?.focus();
  }, [visible]);

  useEffect(() => {
    if (!visible) return;

    function measureGlow() {
      const dialog = dialogRef.current;
      const center = centerRef.current;
      if (!dialog || !center) return;
      const dialogRect = dialog.getBoundingClientRect();
      const centerRect = center.getBoundingClientRect();
      setGlowRect({
        top: centerRect.top - dialogRect.top + centerRect.height,
        left: centerRect.left - dialogRect.left + centerRect.width * 0.5,
        width: centerRect.width * 0.6,
      });
    }

    measureGlow();
    window.addEventListener('resize', measureGlow);
    return () => window.removeEventListener('resize', measureGlow);
  }, [visible, phase]);

  useEffect(() => {
    if (!visible) return;

    const timing = prefersReducedMotion ? REDUCED_TIMING : TIMING;
    const timers: number[] = [];

    timers.push(window.setTimeout(() => setShowSkip(true), prefersReducedMotion ? 0 : 700));
    timers.push(window.setTimeout(() => setPhase('beam'), timing.enter));
    timers.push(window.setTimeout(() => setPhase('hold'), timing.enter + timing.beam));
    timers.push(window.setTimeout(() => setPhase('exit'), timing.enter + timing.beam + timing.hold));
    timers.push(window.setTimeout(finish, timing.enter + timing.beam + timing.hold + timing.exit));

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [visible, prefersReducedMotion, finish]);

  if (!visible) return null;

  const isExiting = phase === 'exit';
  const showBeam = !prefersReducedMotion && phase !== 'enter';

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={siteContent.brand.name}
      tabIndex={-1}
      className={`fixed inset-0 z-[99999] w-dvw h-dvh min-h-svh overflow-hidden bg-cream outline-none transition-[opacity,filter,transform] duration-[700ms] ease-out ${
        isExiting ? 'pointer-events-none' : ''
      }`}
      style={
        isExiting
          ? { opacity: 0, filter: 'blur(8px)', transform: 'scale(0.99)' }
          : { opacity: 1, filter: 'blur(0px)', transform: 'scale(1)' }
      }
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(36, 23, 20, 0.03),transparent_60%)] transition-opacity duration-700 ease-out"
        style={{ opacity: prefersReducedMotion || phase !== 'enter' ? 1 : 0 }}
      />

      {showBeam && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(36, 23, 20, 0.06),transparent_55%)] splash-center-glow"
        />
      )}

      <div
        ref={centerRef}
        className={`relative flex h-full w-full flex-col items-center justify-center gap-5 px-6 text-center ${
          prefersReducedMotion ? '' : 'splash-image-in'
        }`}
      >
        <BrandMonogram className="h-20 w-20 text-3xl sm:h-24 sm:w-24" />
        <p className="font-heading text-2xl text-brown-dark sm:text-3xl">{siteContent.brand.name}</p>
      </div>

      {showBeam && <span aria-hidden="true" className="splash-beam pointer-events-none" />}

      {showBeam && glowRect && (
        <span
          aria-hidden="true"
          className="splash-line-glow pointer-events-none absolute h-[3px]"
          style={{
            top: glowRect.top,
            left: glowRect.left,
            width: glowRect.width,
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}

      {isExiting && !prefersReducedMotion && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(36, 23, 20, 0.06),transparent_60%)] splash-exit-glow"
        />
      )}

      <button
        type="button"
        onClick={finish}
        className={`fixed bottom-6 right-5 z-10 rounded-full border border-gold/40 bg-cream-light/70 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-brown-dark/85 backdrop-blur-sm transition-all duration-300 hover:border-gold hover:text-brown-dark active:border-gold active:text-brown-dark sm:bottom-8 sm:right-8 ${
          showSkip ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        Pular abertura
      </button>
    </div>
  );
}
