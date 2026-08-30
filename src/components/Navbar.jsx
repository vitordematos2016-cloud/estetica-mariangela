import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import BrandMark from './BrandMark.jsx';
import WhatsAppIcon from './WhatsAppIcon.jsx';
import { buildWaLink } from '../data/business.js';
import { TREATMENTS_CATALOG, CATEGORY_LABELS } from '../data/treatments.js';
import { scrollToSection } from '../lib/scroll.js';

// Padrão único de hash do projeto: #inicio (nunca #hero / #home).
export const NAV_LINKS = [
  { id: 'inicio', label: 'Início' },
  { id: 'tratamentos', label: 'Tratamentos', mega: true },
  { id: 'sobre', label: 'Sobre' },
  { id: 'diferenciais', label: 'Diferenciais' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contato', label: 'Contato' },
];

const SECTION_IDS = NAV_LINKS.map((l) => l.id);

// Páginas internas: o item ativo vem da rota, não do ScrollSpy.
function activeIdFromPath(pathname) {
  if (pathname.startsWith('/tratamentos')) return 'tratamentos';
  if (pathname.startsWith('/sobre')) return 'sobre';
  if (pathname.startsWith('/faq')) return 'faq';
  if (pathname.startsWith('/contato')) return 'contato';
  return null;
}

const CATEGORIES = ['facial', 'corporal', 'depilacao'];

// Tratamentos de uma categoria, já filtrados — única fonte usada pelo mega-menu desktop
// e pelo acordeão mobile, para não duplicar a mesma lógica de filtro/link nos dois lugares.
const treatmentsByCategory = (cat) => TREATMENTS_CATALOG.filter((t) => t.category === cat);
const treatmentHref = (t, cat) => (t.hasDetailPage ? `/tratamentos/${t.slug}` : `/tratamentos?cat=${cat}`);

const MegaMenuPanel = () => (
  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[620px] opacity-0 invisible -translate-y-1 scale-[0.98] group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:scale-100 transition-all duration-300 [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)] z-40">
    <div className="bg-card border border-[rgba(89,71,65,0.55)] rounded-[24px] shadow-[0_28px_60px_rgba(74,51,44,0.16)] p-8 grid grid-cols-3 gap-8">
      {CATEGORIES.map((cat) => (
        <div key={cat}>
          <h4 className="text-micro text-accent mb-4">{CATEGORY_LABELS[cat]}</h4>
          <ul className="flex flex-col gap-2.5">
            {treatmentsByCategory(cat).map((t) => (
              <li key={t.slug}>
                <Link
                  to={treatmentHref(t, cat)}
                  className="font-sans text-[13.5px] text-secondary hover:text-accent transition-colors"
                >
                  {t.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

const Navbar = () => {
  const navRef = useRef(null);
  const linksNavRef = useRef(null);
  const linkRefs = useRef({});
  const [scrollActiveId, setScrollActiveId] = useState('inicio');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileTreatmentsOpen, setMobileTreatmentsOpen] = useState(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  // Sombra ao rolar (só estética, não interfere no ScrollSpy)
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 28) navRef.current?.classList.add('nav-scrolled');
      else navRef.current?.classList.remove('nav-scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ScrollSpy real — UM único IntersectionObserver observando as 6 seções da Home.
  useEffect(() => {
    if (!isHome) return;

    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return;

    // Fallbacks de borda: topo força "inicio", fim de página força "contato"
    // (o Footer não é uma seção observada, então o IO sozinho pode perder o "contato" lá embaixo).
    const checkEdges = () => {
      const scrollY = window.scrollY;
      if (scrollY < 100) {
        setScrollActiveId('inicio');
        return true;
      }
      const nearBottom = window.innerHeight + scrollY >= document.documentElement.scrollHeight - 120;
      if (nearBottom) {
        setScrollActiveId('contato');
        return true;
      }
      return false;
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        checkEdges();
        ticking = false;
      });
    };

    checkEdges();
    window.addEventListener('scroll', onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        if (checkEdges()) return; // borda tem prioridade sobre o IO

        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;

        // Seção dominante: maior intersectionRatio dentro da faixa de decisão;
        // empate desempatado pela mais próxima do topo (critério estável, sem flicker).
        const dominant = visible.reduce((a, b) => {
          if (b.intersectionRatio !== a.intersectionRatio) {
            return b.intersectionRatio > a.intersectionRatio ? b : a;
          }
          return b.boundingClientRect.top < a.boundingClientRect.top ? b : a;
        });
        setScrollActiveId(dominant.target.id);
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [isHome]);

  // Regra de prioridade: Home = ScrollSpy manda; página interna = rota manda. Nunca as duas juntas.
  const activeId = isHome ? scrollActiveId : activeIdFromPath(location.pathname);

  // Indicador deslizante: mede a posição real do link ativo e desliza até ele, em vez de
  // recriar um pill a cada troca — só existe um único indicador, ele só se move.
  useEffect(() => {
    const measure = () => {
      const container = linksNavRef.current;
      const el = linkRefs.current[activeId];
      if (!container || !el) {
        setIndicator((prev) => ({ ...prev, opacity: 0 }));
        return;
      }
      const containerBox = container.getBoundingClientRect();
      const linkBox = el.getBoundingClientRect();
      setIndicator({
        left: linkBox.left - containerBox.left - 14,
        width: linkBox.width + 28,
        opacity: 1,
      });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [activeId]);

  // Acompanha o hash na URL enquanto rola a Home, sem empilhar histórico (replaceState).
  const lastHashRef = useRef(null);
  useEffect(() => {
    if (!isHome) return;
    const nextHash = activeId === 'inicio' ? '' : `#${activeId}`;
    if (lastHashRef.current === nextHash) return;
    lastHashRef.current = nextHash;
    const url = window.location.pathname + nextHash;
    window.history.replaceState(null, '', url);
  }, [isHome, activeId]);

  // Fecha o menu mobile ao trocar de rota
  useEffect(() => {
    setMobileOpen(false);
    setMobileTreatmentsOpen(false);
  }, [location.pathname]);

  // Trava o scroll do body com o drawer mobile aberto
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const goToSection = useCallback((id) => {
    setMobileOpen(false);
    if (isHome) {
      scrollToSection(id);
    } else {
      navigate(`/#${id}`);
    }
  }, [isHome, navigate]);

  const handleLogoClick = useCallback((e) => {
    if (isHome) {
      e.preventDefault();
      scrollToSection('inicio');
    }
  }, [isHome]);

  const desktopLinkClass = (active) =>
    `nav-link relative pb-2 duration-[280ms] whitespace-nowrap ${
      active ? 'text-primary font-medium' : 'text-secondary hover:text-accent'
    } after:content-[''] after:absolute after:left-0 after:bottom-[-8px] after:h-[1.5px] after:w-full after:bg-accent after:origin-center after:transition-transform after:duration-[280ms] after:ease-out ${
      active ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
    }`;

  return (
    <>
    <header
      ref={navRef}
      className="fixed top-0 left-0 w-full z-50 pt-[10px] px-3 md:pt-4 md:px-5 pointer-events-none"
    >
      <div
        className="pointer-events-auto w-full max-w-[1360px] mx-auto h-[76px] md:h-[88px] rounded-[26px] md:rounded-[28px] bg-[rgba(216,202,204,0.78)] backdrop-blur-[20px] backdrop-saturate-[1.15] border border-[rgba(89,71,65,0.18)] shadow-[0_14px_40px_rgba(74,51,44,0.10)] transition-shadow duration-500 [.nav-scrolled_&]:shadow-[0_18px_46px_rgba(74,51,44,0.16)]"
      >
        <div className="w-full h-full max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 flex xl:grid xl:grid-cols-[auto_1fr_auto] items-center justify-between gap-1 sm:gap-6 xl:gap-10">

          {/* ESQUERDA – Hamburger (mobile) + Logo */}
          <div className="justify-self-start flex items-center gap-1 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="xl:hidden flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 text-primary shrink-0 -ml-1 sm:-ml-2"
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.6} />
            </button>

            <Link to="/" onClick={handleLogoClick} className="flex items-center gap-2 sm:gap-3 group">
              <img 
                src="/logo-perfil.png" 
                alt="Logo Mariangela" 
                className="w-[40px] h-[40px] sm:w-[52px] sm:h-[52px] md:w-[64px] md:h-[64px] object-contain rounded-[12px] sm:rounded-[18px] shadow-sm group-hover:scale-105 transition-transform duration-300"
              />
              <span className="flex flex-col leading-none">
                <span className="font-drama text-primary text-[13px] sm:text-[18px] md:text-[21px] tracking-[0.05em] sm:tracking-[0.12em] font-medium uppercase whitespace-nowrap">Mariangela Schinaider</span>
                <span className="font-sans text-secondary text-[7px] sm:text-[9.5px] md:text-[11px] tracking-[0.4em] sm:tracking-[0.55em] uppercase mt-[7px] ml-px font-semibold">Estética</span>
              </span>
            </Link>
          </div>

          {/* CENTRO — navegação desktop, em coluna própria: nunca sobrepõe a logo */}
          <nav ref={linksNavRef} className="hidden xl:flex relative justify-self-center items-center gap-[38px] text-[15px] tracking-wide font-sans text-secondary">
            <span
              className="nav-indicator"
              style={{ left: `${indicator.left}px`, width: `${indicator.width}px`, opacity: indicator.opacity }}
              aria-hidden="true"
            />
            {NAV_LINKS.map((link) => {
              const active = activeId === link.id;
              if (link.mega) {
                return (
                  <div key={link.id} className="group relative">
                    <a
                      ref={(el) => { linkRefs.current[link.id] = el; }}
                      href={`#${link.id}`}
                      onClick={(e) => { e.preventDefault(); goToSection(link.id); }}
                      className={desktopLinkClass(active)}
                      aria-current={active ? 'page' : undefined}
                    >
                      <span className="inline-flex items-center gap-1">
                        {link.label}
                        <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" />
                      </span>
                    </a>
                    <MegaMenuPanel />
                  </div>
                );
              }
              return (
                <a
                  ref={(el) => { linkRefs.current[link.id] = el; }}
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => { e.preventDefault(); goToSection(link.id); }}
                  className={desktopLinkClass(active)}
                  aria-current={active ? 'page' : undefined}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* DIREITA – CTA (Agendar) */}
          <div className="justify-self-end flex items-center">
            <a
              href={buildWaLink('Olá, Mariangela! Conheci seu trabalho pelo site e gostaria de verificar os horários disponíveis para agendar um atendimento.')}
              target="_blank"
              rel="noreferrer"
              aria-label="Agendar pelo WhatsApp"
              className="nav-cta btn-glow inline-flex items-center justify-center gap-2 bg-accent text-white rounded-full text-[13px] sm:text-[14.5px] font-semibold w-10 h-10 sm:w-auto sm:h-[51px] md:h-[53px] sm:pl-[26px] sm:pr-[30px] hover:bg-primary transition-[background-color] duration-300"
            >
              <WhatsAppIcon />
              <span className="hidden sm:inline">Agendar</span>
            </a>
          </div>
        </div>
      </div>
    </header>

    {/* Drawer mobile/tablet — via portal: escapa do containing block criado pelo backdrop-blur do header */}
    {createPortal(
      <div
        className={`xl:hidden fixed inset-0 z-[60] transition-all duration-300 ${mobileOpen ? 'visible' : 'invisible pointer-events-none'}`}
        aria-hidden={!mobileOpen}
      >
        <div
          className={`absolute inset-0 bg-primary/40 backdrop-blur-sm transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-[86%] max-w-[380px] bg-background shadow-2xl flex flex-col px-7 pt-7 pb-8 overflow-y-auto transition-[transform,opacity] duration-[400ms] [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)] origin-top-right ${mobileOpen ? 'translate-x-0 scale-100 opacity-100' : 'translate-x-full scale-95 opacity-0'}`}
        >
          <div className="flex items-center justify-between mb-10">
            <img src="/logo-perfil.png" alt="Mariangela Schinaider Estética" className="h-[45px] w-auto object-contain mix-blend-multiply" />
            <button type="button" onClick={() => setMobileOpen(false)} aria-label="Fechar menu" className="w-10 h-10 flex items-center justify-center text-primary">
              <X className="w-6 h-6" strokeWidth={1.6} />
            </button>
          </div>

          <nav className="flex flex-col gap-1 font-sans text-[17px] text-primary mb-8">
            {NAV_LINKS.map((link) => {
              const active = activeId === link.id;
              const itemClass = `py-3.5 border-b border-accent-light/30 transition-colors duration-[280ms] ${active ? 'text-primary font-medium' : 'text-secondary'}`;

              if (link.mega) {
                return (
                  <div key={link.id} className="border-b border-accent-light/30">
                    <button
                      type="button"
                      onClick={() => setMobileTreatmentsOpen((v) => !v)}
                      className="w-full flex items-center justify-between py-3.5 text-left"
                    >
                      <span className={`${active ? 'text-primary font-medium' : 'text-secondary'}`}>
                        {link.label}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-accent transition-transform duration-300 ${mobileTreatmentsOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <div className="grid transition-all duration-300" style={{ gridTemplateRows: mobileTreatmentsOpen ? '1fr' : '0fr' }}>
                      <div className="overflow-hidden">
                        <div className="pb-4 flex flex-col gap-4">
                          {CATEGORIES.map((cat) => (
                            <div key={cat}>
                              <p className="text-micro text-accent mb-2">{CATEGORY_LABELS[cat]}</p>
                              <ul className="flex flex-col gap-1.5">
                                {treatmentsByCategory(cat).map((t) => (
                                  <li key={t.slug}>
                                    <Link to={treatmentHref(t, cat)} className="font-sans text-[14px] text-secondary">
                                      {t.title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                          <Link to="/tratamentos" className="inline-flex items-center gap-1.5 font-sans text-[13px] font-semibold text-accent mt-1">
                            Ver todos os tratamentos <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => { e.preventDefault(); goToSection(link.id); }}
                  className={itemClass}
                  aria-current={active ? 'page' : undefined}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <a
            href={buildWaLink('Olá, Mariangela! Conheci seu trabalho pelo site e gostaria de verificar os horários disponíveis para agendar um atendimento.')}
            target="_blank"
            rel="noreferrer"
            className="mt-auto bg-accent text-white hover:bg-primary h-[54px] rounded-full font-sans font-semibold text-[15px] flex items-center justify-center gap-2"
          >
            <WhatsAppIcon className="w-[18px] h-[18px]" />
            Agendar atendimento
          </a>
        </div>
      </div>,
      document.body
    )}
    </>
  );
};

export default Navbar;
