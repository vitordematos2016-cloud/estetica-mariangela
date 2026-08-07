import { EASE_OUT } from './variants';

/**
 * Peças reutilizáveis do "estado ativo mobile": um card fora da região
 * principal da tela recua discretamente (`rest`); ao entrar na região
 * central, ganha a mesma presença que o hover já dá no desktop (`active`).
 * Só usa `transform`/`opacity` (baratos para o compositor) -- sombra e borda
 * ficam de fora das variants e são aplicadas via `style` inline pelos
 * componentes (ver `getMobileSurfaceStyle`), condicionadas a
 * `isMobileViewport`, para nunca disputar especificidade com as classes
 * Tailwind de hover do desktop.
 */
export const mobileCardVariants = {
  rest: { scale: 0.98, y: 10, opacity: 0.94 },
  active: { scale: 1, y: 0, opacity: 1 },
};

export const mobileCardTransition = { duration: 0.4, ease: EASE_OUT };

/** Para a imagem interna de um card (ex.: `PlaceholderMedia`, `PhotoFrame`). */
export const mobileImageVariants = {
  rest: { scale: 1 },
  active: { scale: 1.02 },
};

/** Para detalhes decorativos que no desktop só aparecem via `group-hover`. */
export const mobileDetailVariants = {
  rest: { opacity: 0.55 },
  active: { opacity: 1 },
};

const REST_SHADOW = '0 10px 22px -14px rgba(89, 64, 59, 0.18)';
const ACTIVE_SHADOW = '0 26px 58px -18px rgba(167, 136, 127, 0.45)';
const REST_BORDER = 'rgba(167, 136, 127, 0.22)';
const ACTIVE_BORDER = 'rgba(167, 136, 127, 0.65)';

/**
 * Sombra/borda do estado ativo mobile como `style` inline puro -- nunca como
 * classe Tailwind -- porque duas classes de utilidade que miram a mesma
 * propriedade (ex.: `border-gold/25` e `border-gold`) empatam em
 * especificidade e a ordem de origem no CSS gerado decide, não a ordem no
 * JSX. `style` sempre vence e nunca conflita com `hover:`/`group-hover:`
 * (que no mobile não disparam mesmo, por serem `@media (hover: hover)`).
 * Retorna `undefined` fora do mobile para não deixar nenhum resíduo inline.
 */
export function getMobileSurfaceStyle(
  isMobileViewport: boolean,
  active: boolean,
): { boxShadow: string; borderColor: string } | undefined {
  if (!isMobileViewport) return undefined;
  return {
    boxShadow: active ? ACTIVE_SHADOW : REST_SHADOW,
    borderColor: active ? ACTIVE_BORDER : REST_BORDER,
  };
}
