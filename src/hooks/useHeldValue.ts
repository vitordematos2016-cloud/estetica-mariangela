import { useEffect, useState } from 'react';

/**
 * Mantém o último valor não nulo enquanto `value` volta a `null` — usado para
 * animar a saída de modais/lightboxes cujo conteúdo vem de uma prop que já
 * fica `null` no instante do fechamento (o AnimatePresence precisa do
 * conteúdo ainda presente durante a transição de saída).
 */
export function useHeldValue<T>(value: T | null): T | null {
  const [held, setHeld] = useState<T | null>(value);

  useEffect(() => {
    if (value !== null) setHeld(value);
  }, [value]);

  return value !== null ? value : held;
}
