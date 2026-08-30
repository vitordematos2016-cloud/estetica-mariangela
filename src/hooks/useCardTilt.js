import { useCallback, useRef } from 'react';

// Tilt 3D extremamente sutil (1-2°) + reflexo seguindo o mouse via CSS vars (--card-rx/--card-ry/--mx/--my),
// consumidas pela classe .card-surface-tilt em index.css. Só desktop com mouse fino; nunca em
// touch nem quando o sistema pede menos movimento — nesses casos as vars simplesmente não são escritas.
export default function useCardTilt(maxDeg = 1.6) {
  const ref = useRef(null);

  const onMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const rect = el.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - relY) * maxDeg * 2;
    const ry = (relX - 0.5) * maxDeg * 2;
    el.style.setProperty('--card-rx', `${rx.toFixed(2)}deg`);
    el.style.setProperty('--card-ry', `${ry.toFixed(2)}deg`);
    el.style.setProperty('--mx', `${(relX * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${(relY * 100).toFixed(1)}%`);
  }, [maxDeg]);

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--card-rx', '0deg');
    el.style.setProperty('--card-ry', '0deg');
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
