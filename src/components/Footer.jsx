import { Link, useLocation } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon.jsx';
import { PHONE_DISPLAY, FULL_ADDRESS, HOURS, SOCIAL, buildWaLink } from '../data/business.js';

const InstagramIcon = ({ className = '', strokeWidth = 1.5 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M16.5 7.5v.01" />
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  const handleLogoClick = () => window.scrollTo(0, 0);

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `inline-block py-1 transition-all duration-300 ${
      isActive
        ? 'text-accent font-medium translate-x-1'
        : 'text-primary/70 hover:text-accent hover:translate-x-1'
    }`;
  };

  const devMessage = encodeURIComponent("Olá, Matos Soluções! Estava navegando pelo site da Mariangela Schinaider Estética. Gostaria de desenvolver meu site.");
  const devWaUrl = `https://wa.me/5545998378795?text=${devMessage}`;

  return (
    <footer id="footer" className="mauve-surface pt-16 pb-8 px-6 md:px-12 border-t border-[#EBE1DC]">
      <div className="container-global grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16 text-center md:text-left">
        
        {/* Coluna 1: Marca */}
        <div className="lg:col-span-1 flex flex-col items-center md:items-start">
          <Link to="/" onClick={handleLogoClick} className="inline-flex flex-col md:flex-row items-center gap-3 group mb-4">
            <img src="/logo-perfil.png" alt="Logo Mariangela Schinaider" className="w-[52px] h-[52px] rounded-[14px] shadow-sm group-hover:scale-105 transition-transform duration-300" />
            <span className="font-drama text-primary text-[15px] tracking-[0.15em] uppercase leading-tight mt-1">
              Mariangela<br className="hidden md:block" />Schinaider<br className="hidden md:block" />Estética
            </span>
          </Link>
          <p className="font-sans text-[14px] text-primary/80 leading-relaxed max-w-[250px] mb-6 mx-auto md:mx-0">
            Realçando sua beleza com cuidado, técnica e acolhimento.
          </p>
          <div className="flex items-center justify-center md:justify-start gap-4">
            <a href={SOCIAL.instagram.url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#F4E6DF] flex items-center justify-center text-accent hover:bg-accent hover:text-white hover:-translate-y-2 hover:shadow-lg transition-all duration-300">
              <InstagramIcon className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </a>
            <a href={buildWaLink('Olá, Mariangela! Encontrei seu contato pelo site e gostaria de falar com você.')} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#F4E6DF] flex items-center justify-center text-accent hover:bg-accent hover:text-white hover:-translate-y-2 hover:shadow-lg transition-all duration-300">
              <WhatsAppIcon className="w-[18px] h-[18px]" />
            </a>
          </div>
        </div>

        {/* Coluna 2: Navegação */}
        <div className="flex flex-col items-center md:items-start">
          <h5 className="font-sans text-[11px] tracking-[0.2em] text-accent font-bold uppercase mb-6">Navegação</h5>
          <ul className="flex flex-col items-center md:items-start gap-3 font-sans text-[14px]">
            <li><Link to="/" className={getLinkClass('/')}>Início</Link></li>
            <li><Link to="/tratamentos" className={getLinkClass('/tratamentos')}>Tratamentos</Link></li>
            <li><Link to="/sobre" className={getLinkClass('/sobre')}>Sobre</Link></li>
            <li><a href="/#diferenciais" className={getLinkClass('/#diferenciais')}>Diferenciais</a></li>
            <li><a href="/#faq" className={getLinkClass('/#faq')}>FAQ</a></li>
            <li><Link to="/contato" className={getLinkClass('/contato')}>Contato</Link></li>
          </ul>
        </div>

        {/* Coluna 3: Contato */}
        <div className="flex flex-col items-center md:items-start">
          <h5 className="font-sans text-[11px] tracking-[0.2em] text-accent font-bold uppercase mb-6">Contato</h5>
          <ul className="flex flex-col items-center md:items-start gap-4 font-sans text-[14px] text-primary/80">
            <li className="flex items-center md:items-start gap-3 group justify-center md:justify-start">
              <WhatsAppIcon className="w-[18px] h-[18px] text-accent shrink-0 md:mt-0.5 group-hover:scale-110 transition-transform" />
              <a href={buildWaLink('Olá, Mariangela! Encontrei seu contato pelo site e gostaria de falar com você.')} target="_blank" rel="noreferrer" className="inline-block hover:text-accent transition-colors">{PHONE_DISPLAY}</a>
            </li>
            <li className="flex items-center md:items-start gap-3 group justify-center md:justify-start">
              <InstagramIcon className="w-[18px] h-[18px] text-accent shrink-0 md:mt-0.5 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <a href={SOCIAL.instagram.url} target="_blank" rel="noreferrer" className="inline-block hover:text-accent transition-colors">{SOCIAL.instagram.handle}</a>
            </li>
            <li className="flex items-center md:items-start gap-3 group justify-center md:justify-start text-center md:text-left">
              <MapPin className="w-[18px] h-[18px] text-accent shrink-0 md:mt-0.5 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <span className="leading-relaxed hover:text-accent transition-colors cursor-default">
                {FULL_ADDRESS.split(',')[0]}, {FULL_ADDRESS.split(',')[1]?.split('-')[0]?.trim()} - <br/>
                {FULL_ADDRESS.split('-')[1]?.trim() || FULL_ADDRESS}
              </span>
            </li>
          </ul>
        </div>

        {/* Coluna 4: Horários */}
        <div className="flex flex-col items-center md:items-start">
          <h5 className="font-sans text-[11px] tracking-[0.2em] text-accent font-bold uppercase mb-6">Horário de Atendimento</h5>
          <ul className="flex flex-col items-center md:items-start space-y-2 font-sans text-primary/80 text-[14.5px]">
            {HOURS.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>

      </div>

      {/* Copyright */}
      <div className="container-global pt-8 border-t border-accent/20 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <p className="font-sans text-[12px] text-primary/70">
          &copy; {currentYear} Mariangela Schinaider Estética. Todos os direitos reservados.
        </p>
        <p className="font-sans text-[12px] text-primary/60">
          Desenvolvido por{' '}
          <a 
            href={devWaUrl}
            target="_blank" 
            rel="noreferrer"
            className="hover:text-accent transition-colors"
          >
            Matos Soluções
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
