import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight, Sparkles, Activity, Zap, Leaf } from 'lucide-react';
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

const CAT_ICONS = {
  facial: Sparkles,
  corporal: Activity,
  depilacao: Zap
};

const MegaMenuPanel = ({ isOpen, onClose }) => {
  const [activeCat, setActiveCat] = useState('facial');
  const [isChanging, setIsChanging] = useState(false);
  const currentTreatments = treatmentsByCategory(activeCat);
  const featured = currentTreatments.find(t => t.featured) || currentTreatments[0];

  const handleCatChange = (cat) => {
    if (cat === activeCat) return;
    setIsChanging(true);
    setTimeout(() => {
      setActiveCat(cat);
      setIsChanging(false);
    }, 150); // Metade do fade para trocar o conteúdo no escuro
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Fecha clicando fora tratado no Wrapper ou aqui
  useEffect(() => {
    if (!isOpen) {
      // reseta para facial quando fecha
      setTimeout(() => setActiveCat('facial'), 300);
    }
  }, [isOpen]);

  return (
    <div 
      className={`absolute top-full left-[50%] -translate-x-[50%] pt-4 w-[1000px] transition-all duration-350 ease-[cubic-bezier(0.2,0.8,0.2,1)] z-40 ${
        isOpen ? 'opacity-100 visible translate-y-0 scale-100' : 'opacity-0 invisible -translate-y-[10px] scale-[0.975]'
      }`}
      style={{ perspective: '1200px' }}
    >
      <div 
        className="p-8 pb-6 flex flex-col relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(207,191,192,.98), rgba(183,159,152,.96))',
          border: '1px solid rgba(89,71,65,.55)',
          boxShadow: '0 32px 80px rgba(74,51,44,.20), 0 10px 24px rgba(74,51,44,.08)',
          borderRadius: '28px',
          transform: isOpen ? 'rotateX(0.5deg)' : 'rotateX(0)',
          transition: 'transform 400ms ease'
        }}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-5 mb-6 border-b border-[#594741]/15">
          <div className="flex items-center gap-2 text-[#4A332C]">
            <Leaf className="w-4 h-4 opacity-70" />
            <span className="text-[10.5px] uppercase font-bold tracking-[0.2em] opacity-90">Explore nossos cuidados</span>
          </div>
          <Link to="/tratamentos" onClick={onClose} className="group/link text-[12.5px] font-sans font-semibold text-[#4A332C] hover:text-[#4A332C] flex items-center gap-1.5 transition-colors">
            Ver todos os tratamentos <ArrowRight className="w-3.5 h-3.5 transform group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Corpo (3 colunas) */}
        <div className="grid grid-cols-[240px_1fr_280px] gap-10">
          
          {/* Col 1: Categorias */}
          <div className="flex flex-col gap-2 relative">
            <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-[#594741]/10 rounded-full" />
            
            {CATEGORIES.map((cat) => {
              const isActive = activeCat === cat;
              const Icon = CAT_ICONS[cat];
              const tCount = treatmentsByCategory(cat).length;
              
              return (
                <button
                  key={cat}
                  onMouseEnter={() => handleCatChange(cat)}
                  onClick={() => handleCatChange(cat)}
                  className={`w-full text-left flex items-center gap-4 py-3.5 px-4 rounded-[18px] transition-all duration-300 ${
                    isActive 
                      ? 'bg-[rgba(255,255,255,0.4)] border border-[rgba(89,71,65,0.2)] shadow-[0_16px_34px_rgba(74,51,44,.14)] translate-x-[2px] -translate-y-[2px] relative z-10' 
                      : 'border border-transparent hover:bg-white/10'
                  }`}
                >
                  <div className={`flex items-center justify-center w-[42px] h-[42px] rounded-full border transition-colors ${
                    isActive ? 'bg-[#594741] border-[#594741] text-[#FFF8F6]' : 'bg-transparent border-[#594741]/20 text-[#594741]'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className={`font-sans font-bold text-[15px] ${isActive ? 'text-[#4A332C]' : 'text-[#4A332C]/80'}`}>
                      {CATEGORY_LABELS[cat]}
                    </span>
                    <span className="font-sans text-[11.5px] text-[#4A332C]/60">
                      {tCount} cuidado{tCount > 1 ? 's' : ''}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 ml-auto transition-transform duration-300 ${isActive ? 'opacity-100 -rotate-90 text-[#4A332C]' : 'opacity-0 text-[#4A332C]/50'}`} />
                </button>
              );
            })}
            
            {/* CTA Extra embaixo das categorias */}
            <div className="mt-auto pt-6 pr-4">
              <Link
                to="/pacotes"
                onClick={() => {
                  onClose();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group flex flex-col justify-center w-full relative overflow-hidden rounded-[18px] bg-[#4A332C] text-[#FFF8F6] shadow-[0_8px_16px_rgba(74,51,44,.12)] hover:shadow-[0_12px_24px_rgba(74,51,44,.15)] transition-all duration-300 hover:-translate-y-0.5 p-4"
              >
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#F4E6DF]" />
                    <span className="font-sans font-bold text-[13.5px] tracking-wide text-white">Pacotes Especiais</span>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-80 group-hover:translate-x-1 transition-transform text-[#F4E6DF]" />
                </div>
                <div className="absolute top-0 right-0 w-[60px] h-[60px] bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
              </Link>
            </div>
          </div>

          {/* Wrapper Animado para Col 2 e Col 3 */}
          <div className={`col-span-2 grid grid-cols-[1fr_280px] gap-10 transition-all duration-250 ${isChanging ? 'opacity-0 translate-x-2' : 'opacity-100 translate-x-0'}`}>
            
            {/* Col 2: Lista de Tratamentos */}
            <div className="flex flex-col">
              <h4 className="text-[10.5px] uppercase font-bold tracking-[0.2em] text-[#4A332C]/70 mb-4">{CATEGORY_LABELS[activeCat]}</h4>
              <ul className="flex flex-col pr-4">
                {currentTreatments.map((t) => (
                  <li key={t.slug}>
                    <Link
                      to={treatmentHref(t, activeCat)}
                      onClick={onClose}
                      className="group/item flex items-center justify-between py-3 border-b border-[#594741]/10 hover:border-[#594741]/30 hover:bg-white/5 transition-all duration-300 rounded-md -mx-2 px-2"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#594741]/30 group-hover/item:bg-[#4A332C] transition-colors" />
                        <span className="font-sans font-semibold text-[13.5px] text-[#4A332C]/90 group-hover/item:text-[#4A332C] group-hover/item:translate-x-1 transition-transform duration-300">
                          {t.title}
                        </span>
                        {t.featured && (
                          <span className="px-2 py-[3px] rounded-full bg-[#594741]/10 text-[#4A332C] text-[9.5px] font-bold uppercase tracking-[0.08em] ml-1">
                            Destaque
                          </span>
                        )}
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#594741]/30 group-hover/item:text-[#4A332C] group-hover/item:translate-x-1 transition-all duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Card de Destaque */}
            <div className="flex flex-col">
              <h4 className="text-[10.5px] uppercase font-bold tracking-[0.2em] text-[#4A332C]/70 mb-4">Tratamento em destaque</h4>
              {featured && (
                <Link 
                  to={treatmentHref(featured, activeCat)}
                  onClick={onClose}
                  className="group/feat flex flex-col relative rounded-[24px] overflow-hidden border border-[#594741]/30 hover:border-[#594741]/60 bg-[#B79F98] shadow-[0_14px_30px_rgba(74,51,44,.10)] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(74,51,44,.15)] transition-all duration-300 h-[280px]"
                >
                  <div className="h-[52%] w-full relative overflow-hidden shrink-0">
                    <img 
                      src={featured.img} 
                      alt={featured.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/feat:scale-105"
                    />
                    <div className="absolute inset-0 bg-[#594741]/10 mix-blend-multiply" />
                    <div className="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-[#B79F98] to-transparent pointer-events-none" />
                    
                    {/* Icon floating suspenso */}
                    <div className="absolute top-4 right-4 w-[34px] h-[34px] rounded-full border border-[#594741]/40 bg-[#B79F98]/90 backdrop-blur-md shadow-md flex items-center justify-center text-[#4A332C]">
                      <Sparkles className="w-[15px] h-[15px]" />
                    </div>
                  </div>
                  
                  <div className="p-5 pt-2 flex flex-col flex-1 relative bg-[#B79F98]">
                    <h5 className="font-sans font-bold text-[#4A332C] text-[15px] leading-tight mb-2 group-hover/feat:text-[#4A332C]">{featured.title}</h5>
                    <p className="font-sans text-[#4A332C]/80 text-[11.5px] line-clamp-2 leading-relaxed mb-4">
                      {featured.catalogSummary}
                    </p>
                    
                    <div className="mt-auto flex items-center gap-1.5 text-[#4A332C]/90 font-sans font-bold text-[12px] group-hover/feat:text-[#4A332C] transition-colors">
                      Conhecer tratamento <ArrowRight className="w-3.5 h-3.5 transform group-hover/feat:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// Wrapper para gerenciar o hover (área de tolerância) e o link especial
const MegaMenuWrapper = ({ active, link, goToSection, linkRefs }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);
  const wrapperRef = useRef(null);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 180); // Tolerância
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div 
      ref={wrapperRef}
      className="relative" 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
    >
      <a
        ref={(el) => { linkRefs.current[link.id] = el; }}
        href={`#${link.id}`}
        onClick={(e) => { e.preventDefault(); goToSection(link.id); setIsOpen(false); }}
        className={`nav-link relative py-[6px] px-[14px] duration-300 whitespace-nowrap rounded-[100px] border transition-all flex items-center gap-1 ${
          isOpen || active
            ? 'bg-[#CFBFC0]/30 border-[#CFBFC0]/50 shadow-[0_4px_12px_rgba(74,51,44,.05)] text-[#4A332C] font-semibold'
            : 'border-transparent text-secondary hover:text-accent'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {link.label}
        {isOpen ? (
          <ChevronDown className="w-3.5 h-3.5 text-[#4A332C] rotate-180 transition-transform duration-300" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300" />
        )}
      </a>
      <MegaMenuPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

// Wrapper para gerenciar o acordeão duplo no mobile
const MobileMegaMenuWrapper = ({ link, active, mobileTreatmentsOpen, setMobileTreatmentsOpen, goToSection, closeMenu }) => {
  const [activeCat, setActiveCat] = useState(null);

  return (
    <div className="border-b border-[#CFBFC0]/30">
      <button
        type="button"
        onClick={() => setMobileTreatmentsOpen((v) => !v)}
        className="w-full flex items-center justify-between py-3.5 text-left"
      >
        <span className={`${active ? 'text-[#4A332C] font-medium' : 'text-[#594741]'}`}>
          {link.label}
        </span>
        <ChevronDown className={`w-4 h-4 text-[#594741] transition-transform duration-300 ${mobileTreatmentsOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className="grid transition-all duration-300" style={{ gridTemplateRows: mobileTreatmentsOpen ? '1fr' : '0fr' }}>
        <div className="overflow-hidden">
          <div className="pb-4 flex flex-col gap-1 pl-2">
            {CATEGORIES.map((cat) => {
              const isOpen = activeCat === cat;
              return (
                <div key={cat} className="flex flex-col border-l-2 border-[#594741]/10 pl-3 mt-1">
                  <button
                    type="button"
                    onClick={() => setActiveCat(isOpen ? null : cat)}
                    className="flex items-center justify-between py-2.5 text-left"
                  >
                    <span className={`font-sans text-[15px] ${isOpen ? 'text-[#4A332C] font-semibold' : 'text-[#594741]/90'}`}>
                      {CATEGORY_LABELS[cat]}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#594741]/60 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div className="grid transition-all duration-300" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
                    <div className="overflow-hidden">
                      <ul className="flex flex-col gap-3 py-2 pl-1">
                        {treatmentsByCategory(cat).map((t) => (
                          <li key={t.slug}>
                            <Link 
                              to={treatmentHref(t, cat)} 
                              onClick={closeMenu}
                              className="font-sans text-[13.5px] text-[#594741]/80 flex items-center gap-2 hover:text-[#4A332C]"
                            >
                              <span className="w-1 h-1 rounded-full bg-[#594741]/30" />
                              {t.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
            <Link to="/tratamentos" onClick={() => { closeMenu(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="inline-flex items-center gap-1.5 font-sans text-[13.5px] font-bold text-[#4A332C] mt-5 pl-3">
              Ver todos os tratamentos <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/pacotes" onClick={() => { closeMenu(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="group mt-5 flex items-center justify-between p-3.5 rounded-[16px] bg-[#4A332C] text-[#FFF8F6] shadow-md relative overflow-hidden">
              <div className="flex items-center gap-3 relative z-10">
                <Sparkles className="w-4 h-4 text-[#F4E6DF]" />
                <span className="font-sans font-semibold text-[13.5px] text-white">Pacotes Especiais</span>
              </div>
              <ArrowRight className="w-4 h-4 opacity-80 group-hover:translate-x-1 transition-transform text-[#F4E6DF] relative z-10" />
              <div className="absolute top-0 right-0 w-[60px] h-[60px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

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
        <div className="w-full h-full px-4 sm:px-6 md:px-8 lg:px-10 flex xl:grid xl:grid-cols-[auto_1fr_auto] items-center justify-between gap-1 sm:gap-6 xl:gap-10">

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
                  <MegaMenuWrapper 
                    key={link.id} 
                    active={active} 
                    link={link} 
                    goToSection={goToSection} 
                    linkRefs={linkRefs} 
                  />
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
                  <MobileMegaMenuWrapper
                    key={link.id}
                    link={link}
                    active={active}
                    mobileTreatmentsOpen={mobileTreatmentsOpen}
                    setMobileTreatmentsOpen={setMobileTreatmentsOpen}
                    goToSection={goToSection}
                    closeMenu={() => setMobileOpen(false)}
                  />
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
