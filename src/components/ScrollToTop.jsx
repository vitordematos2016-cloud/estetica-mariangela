import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToSection, prefersReducedMotion } from '../lib/scroll.js';

// A cada troca de rota: volta ao topo, ou rola até a âncora (#hash) quando presente
// (usado pelos itens do menu que levam a seções da Home a partir de outras páginas).
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      // dá alguns frames para a página de destino montar antes de procurar o elemento
      let attempts = 0;
      const tryScroll = () => {
        attempts += 1;
        const done = scrollToSection(id, { instant: true });
        if (!done && attempts < 10) requestAnimationFrame(tryScroll);
      };
      requestAnimationFrame(tryScroll);
    } else {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'instant' });
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
