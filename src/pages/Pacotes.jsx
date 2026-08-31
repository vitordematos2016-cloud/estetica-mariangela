import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useSeo from '../hooks/useSeo.js';
import PromoPackageCard, { PROMO_PACKAGES } from '../components/PromoPackageCard.jsx';
import WhatsAppIcon from '../components/WhatsAppIcon.jsx';
import { buildWaLink } from '../data/business.js';

gsap.registerPlugin(ScrollTrigger);

const Pacotes = () => {
  useSeo({
    title: 'Pacotes Promocionais - Mariangela Schinaider Estética',
    description: 'Conheça nossos pacotes promocionais exclusivos. Cuidados pensados para diferentes momentos e necessidades.',
    path: '/pacotes',
  });

  const container = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('.pacote-anim', { clearProps: 'all', opacity: 1 });
        return;
      }
      
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      
      tl.fromTo('.pacote-hero', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0 })
        .fromTo('.pacote-anim', { y: 30, opacity: 0, scale: 0.985 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.12 }, 0.3);
        
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="mauve-surface min-h-screen pt-32 md:pt-40 pb-24 md:pb-32 px-6 md:px-12 relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-full h-[600px] overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#EBD8D2] opacity-30 blur-[120px]"></div>
        <div className="absolute top-[20%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#F5EEEE] opacity-20 blur-[100px]"></div>
      </div>

      <div className="container-global relative z-10">
        
        {/* HERO */}
        <div className="pacote-hero text-center max-w-4xl mx-auto mb-20 lg:mb-28">
          <span className="font-sans text-[11px] lg:text-[12px] tracking-[0.25em] text-[#A56D45] font-bold uppercase mb-4 block">
            Pacotes
          </span>
          <h1 className="font-drama text-primary text-[42px] sm:text-[50px] lg:text-[64px] leading-[1.05] mb-6">
            Experiências de cuidado <br className="hidden md:block" />
            <span className="italic text-[#A56D45] font-light">pensadas para você.</span>
          </h1>
          <p className="font-sans text-secondary text-[16px] lg:text-[17px] leading-[1.6] max-w-2xl mx-auto">
            Combinações exclusivas de procedimentos criadas para oferecer um atendimento completo. Cada pacote foi desenhado para maximizar seu bem-estar, respeitando sempre a sua individualidade.
          </p>
        </div>

        {/* GRID DE PACOTES - Layout Amplo/Editorial */}
        <div className="flex flex-col gap-16 lg:gap-24 mb-24">
          
          {/* PACOTE EXCLUSIVO (Laser) - Destaque Máximo - Centralizado e Maior */}
          <div className="pacote-anim w-full max-w-3xl mx-auto">
            <PromoPackageCard pkg={PROMO_PACKAGES.find(p => p.id === 'laser-premium')} className="h-full" />
          </div>

          {/* DOIS PACOTES INTERMEDIÁRIOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full max-w-5xl mx-auto">
            <div className="pacote-anim">
              <PromoPackageCard pkg={PROMO_PACKAGES.find(p => p.id === 'pele-renovada')} className="h-full" />
            </div>
            <div className="pacote-anim">
              <PromoPackageCard pkg={PROMO_PACKAGES.find(p => p.id === 'projeto-contorno')} className="h-full" />
            </div>
          </div>

          {/* DOIS PACOTES FINAIS (Bem estar / Relaxamento) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full max-w-5xl mx-auto">
            <div className="pacote-anim">
              <PromoPackageCard pkg={PROMO_PACKAGES.find(p => p.id === 'detox-leveza')} className="h-full" />
            </div>
            <div className="pacote-anim">
              <PromoPackageCard pkg={PROMO_PACKAGES.find(p => p.id === 'alivio-relaxamento')} className="h-full" />
            </div>
          </div>

        </div>

        {/* FOOTER DA PÁGINA DE PACOTES */}
        <div className="pacote-anim flex flex-col items-center text-center max-w-2xl mx-auto pt-16 border-t border-[#A56D45]/20">
          <h4 className="font-serif text-[#392A27] text-[22px] lg:text-[26px] mb-3">
            Precisa de uma indicação?
          </h4>
          <p className="font-sans text-secondary text-[15px] lg:text-[16px] leading-[1.6] mb-8">
            Cada corpo é único. Se você tem dúvidas sobre qual pacote é o mais adequado para o seu momento, entre em contato para uma avaliação.
          </p>
          <a
            href={buildWaLink('Olá, Mariangela! Estava olhando os pacotes promocionais no site e gostaria de conversar para saber qual é o mais indicado para mim.')}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-8 h-[54px] rounded-full bg-[#4A332C] text-[#FFF8F6] hover:bg-[#392A27] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 font-sans text-[14.5px] font-semibold"
          >
            <WhatsAppIcon className="w-[18px] h-[18px]" />
            Conversar com a Mariangela
          </a>
          
          <div className="mt-12 opacity-60">
            <p className="font-sans text-[11px] lg:text-[12px] text-secondary tracking-wide uppercase">
              Atendimento mediante agendamento. Protocolos sujeitos à avaliação profissional.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Pacotes;
