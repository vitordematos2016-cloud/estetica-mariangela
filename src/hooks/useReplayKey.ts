import { useEffect, useRef, useState } from 'react';

/**
 * Devolve uma chave que muda toda vez que `trigger` passa de `false` para
 * `true` -- pensada para o prop `key` de uma animação de sequência única
 * (raio de luz, shimmer) que precisa reiniciar do zero a cada reentrada na
 * tela. Só alternar o `animate` nem sempre reinicia essas animações: se o
 * alvo anterior já deixou algum valor (ex.: `x`) parado no fim do trajeto,
 * repetir o mesmo `animate` não o move dali. Trocar a `key` força o Motion a
 * remontar o elemento, reaplicando `initial` e reproduzindo a sequência
 * inteira, sempre a partir do zero.
 */
export function useReplayKey(trigger: boolean): number {
  const [key, setKey] = useState(0);
  const wasTrue = useRef(trigger);

  useEffect(() => {
    if (trigger && !wasTrue.current) {
      setKey((current) => current + 1);
    }
    wasTrue.current = trigger;
  }, [trigger]);

  return key;
}
