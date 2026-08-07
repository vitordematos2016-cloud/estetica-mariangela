import { useEffect, useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { motion } from 'motion/react';
import { siteContent } from '../../data/siteContent';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { useRequest } from '../../context/RequestContext';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useScrollLock } from '../../hooks/useScrollLock';
import { useHistoryLayer } from '../../hooks/useHistoryLayer';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { EASE_OUT } from '../motion/variants';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sectionIds = siteContent.nav.map((link) => link.href.replace('#', ''));
  const activeId = useActiveSection(sectionIds);
  const headerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { openRequest } = useRequest();

  useScrollLock(isMenuOpen);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  // Faz o botão/gesto "Voltar" nativo fechar o menu mobile em vez de sair do
  // site direto -- ver `useHistoryLayer`. `restoreScroll: false` porque o
  // menu é navegação, não uma sobreposição que substitui a tela: clicar num
  // link do menu rola a página até a seção ENQUANTO o menu ainda está
  // "aberto" (só fecha depois, quando `activeId` muda) -- com a restauração
  // padrão ligada, fechar o menu devolvia a cliente à posição de antes de
  // abri-lo, desfazendo a navegação que ela acabou de pedir.
  const requestCloseMenu = useHistoryLayer({
    layer: 'mobile-menu',
    isOpen: isMenuOpen,
    onPopClose: closeMenu,
    restoreScroll: false,
  });

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 24);
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navegação por âncora dos links de seção -- fecha o menu primeiro
  // (síncrono, antes de rolar) e só então rola até a seção, num
  // `requestAnimationFrame` (dá tempo do React recommitar o DOM sem o
  // `overflow: hidden` do menu antes da rolagem começar). Não deixa o
  // navegador processar a navegação nativa do `href` (por isso
  // `preventDefault`): a rolagem nativa por hash e esta rolagem por JS
  // brigariam pelo mesmo scroll, e a nativa também empilha uma entrada de
  // histórico por clique -- nenhuma das duas é necessária aqui, só a rolagem
  // suave até a seção certa.
  function navigateToSection(sectionId: string) {
    setIsMenuOpen(false);
    requestAnimationFrame(() => {
      const target = document.getElementById(sectionId);
      if (!target) return;

      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      if (prefersReducedMotion) return;

      // Correção de deriva: numa rolagem longa (ex.: do topo até
      // "Localização", passando por dezenas de imagens `loading="lazy"`), o
      // alvo do `scrollIntoView` suave é calculado uma vez no início -- a
      // animação nativa persegue esse valor fixo até o fim, então um
      // `<body>` que cresce DURANTE a rolagem não a redireciona sozinho.
      // Várias dessas imagens só terminam de carregar (e empurrar o layout)
      // em instantes diferentes uns dos outros, alguns bem depois do fim da
      // rolagem -- por isso a correção só liga DEPOIS que o `scrollend`
      // nativo confirma que a animação suave já terminou (nunca compete com
      // ela em andamento) e, a partir daí, continua observando o `<body>`
      // por uma janela curta, reajustando instantaneamente a cada mudança de
      // altura. Cancela na hora se a cliente rolar manualmente -- nunca
      // briga com um gesto ativo -- e se desliga sozinho depois, sem manter
      // um observer preso indefinidamente.
      let settled = false;
      let userInterrupted = false;
      function markInterrupted() {
        userInterrupted = true;
      }
      window.addEventListener('wheel', markInterrupted, { once: true, passive: true });
      window.addEventListener('touchstart', markInterrupted, { once: true, passive: true });

      function onScrollEnd() {
        settled = true;
        if (userInterrupted) return;
        target?.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
      window.addEventListener('scrollend', onScrollEnd, { once: true });

      const resizeObserver = new ResizeObserver(() => {
        if (!settled || userInterrupted) return;
        target?.scrollIntoView({ behavior: 'auto', block: 'start' });
      });
      resizeObserver.observe(document.body);

      window.setTimeout(() => {
        resizeObserver.disconnect();
        window.removeEventListener('scrollend', onScrollEnd);
        window.removeEventListener('wheel', markInterrupted);
        window.removeEventListener('touchstart', markInterrupted);
      }, 2500);
    });
  }

  function handleNavClick(sectionId: string) {
    return (event: ReactMouseEvent) => {
      event.preventDefault();
      navigateToSection(sectionId);
    };
  }

  // Fecha o menu mobile ao tocar/clicar fora dele (cabeçalho + dropdown, via
  // `headerRef`) -- listener no document, só ligado enquanto aberto.
  // `pointerdown` cobre mouse e toque
  // num único evento; o efeito só é registrado depois que `isMenuOpen` já
  // virou true (num render seguinte), então o mesmo toque que abre o menu
  // nunca é capturado por este listener e não fecha o menu no mesmo instante.
  // Cliques dentro do cabeçalho/menu (inclusive o botão de abrir/fechar e os
  // links) ficam dentro de `headerRef`, então nunca disparam o fechamento
  // por aqui -- só o próprio onClick de cada um continua atuando.
  useEffect(() => {
    if (!isMenuOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        requestCloseMenu();
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isMenuOpen, requestCloseMenu]);

  // Escape fecha o menu mobile, no mesmo padrão do modal de detalhes e da
  // mídia em tela cheia.
  useEffect(() => {
    if (!isMenuOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') requestCloseMenu();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen, requestCloseMenu]);

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-cream/90 shadow-warm-sm backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <Container className="flex items-center justify-between py-4">
        {/* Mobile/tablet compacto: o botão do menu fica à esquerda -- por
            isso vem primeiro no fluxo, antes da logo. Um espaçador invisível
            do mesmo tamanho (44px) depois dos elementos de desktop equilibra
            a `justify-between`, mantendo a logo centralizada em vez de
            deslocada para a direita; some junto com o botão a partir de
            `lg:`, onde o cabeçalho volta ao layout original (logo à
            esquerda, nav + CTA à direita). */}
        <motion.button
          type="button"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 text-brown-dark transition-colors hover:bg-gold/10 active:bg-gold/15 lg:hidden"
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => (isMenuOpen ? requestCloseMenu() : setIsMenuOpen(true))}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.15, ease: EASE_OUT }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            {isMenuOpen ? (
              <path
                d="M2 2l16 16M18 2L2 18"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M2 5h16M2 10h16M2 15h16"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            )}
          </svg>
        </motion.button>

        <a
          href="#inicio"
          onClick={handleNavClick('inicio')}
          className="font-heading text-xl tracking-wide text-brown-dark text-center sm:text-2xl"
        >
          {siteContent.brand.name}
        </a>

        <nav aria-label="Navegação principal" className="hidden items-center gap-8 lg:flex">
          {siteContent.nav.map((link) => {
            const sectionId = link.href.replace('#', '');
            const isActive = activeId === sectionId;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={handleNavClick(sectionId)}
                aria-current={isActive ? 'page' : undefined}
                className={`text-sm font-medium tracking-wide transition-colors ${
                  isActive ? 'text-gold-deep' : 'text-brown-dark hover:text-gold'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Button
            type="button"
            onClick={() => openRequest({ mode: 'avaliacao' })}
            variant="primary"
            className="px-6 py-3 text-xs"
          >
            {siteContent.headerCta.label}
          </Button>
        </div>

        <div aria-hidden="true" className="h-11 w-11 shrink-0 lg:hidden" />
      </Container>

      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-gold/20 bg-cream px-5 pb-8 pt-4 shadow-warm lg:hidden"
        >
          <nav aria-label="Navegação mobile" className="flex flex-col gap-1">
            {siteContent.nav.map((link) => {
              const sectionId = link.href.replace('#', '');
              const isActive = activeId === sectionId;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleNavClick(sectionId)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                    isActive ? 'bg-gold/10 text-gold-deep' : 'text-brown-dark hover:bg-gold/5'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
          <Button
            type="button"
            onClick={() => {
              closeMenu();
              openRequest({ mode: 'avaliacao' });
            }}
            variant="primary"
            className="mt-4 w-full"
          >
            {siteContent.headerCta.label}
          </Button>
        </div>
      )}
    </header>
  );
}
