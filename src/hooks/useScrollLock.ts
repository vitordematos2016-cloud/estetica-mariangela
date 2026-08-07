import { useEffect } from 'react';

export function useScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    // Trava tanto `html` quanto `body` -- só o `body` deixa a rolagem do
    // elemento raiz "vazar" em alguns navegadores mobile (Safari/iOS em
    // particular), o que permite um leve arrasto da página por trás de
    // overlays de tela cheia como a capa de primeira visita.
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [locked]);
}
