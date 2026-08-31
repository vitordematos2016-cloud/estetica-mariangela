import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import PromoPackageCard, { PROMO_PACKAGES } from '../components/PromoPackageCard.jsx';
import WhatsAppIcon from '../components/WhatsAppIcon.jsx';
import { buildWaLink } from '../data/business.js';

gsap.registerPlugin(ScrollTrigger);

const PromoPackages = () => {
  const container = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('.pp-anim', { clearProps: 'all', opacity: 1 });
        return;
      }
      
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: container.current, start: 'top 75%' },
      });
      
      tl.fromTo('.pp-label', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
        .fromTo('.pp-title', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.15)
        .fromTo('.pp-desc', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.3)
        .fromTo('.pp-card-row1', { y: 30, opacity: 0, scale: 0.985 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15 }, 0.4)
        .fromTo('.pp-card-row2', { y: 30, opacity: 0, scale: 0.985 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15 }, 0.6)
        .fromTo('.pp-footer', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 }, 0.9);
        
    }, container);
    return () => ctx.revert();
  }, []);

  // Split packages as requested
  const laserPkg = PROMO_PACKAGES.find(p => p.id === 'laser-premium');
  const pelePkg = PROMO_PACKAGES.find(p => p.id === 'pele-renovada');
  const bottomPkgs = PROMO_PACKAGES.filter(p => !['laser-premium', 'pele-renovada'].includes(p.id));

  return (
    <section ref={container} className="relative py-24 lg:py-32 px-6 md:px-12 bg-[#CFBFC0]/5 overflow-hidden">
      <div className="container-global">
        
        {/* Cabeçalho */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <span className="pp-label pp-anim font-sans text-[11px] lg:text-[12px] tracking-[0.25em] text-[#A56D45] font-bold uppercase mb-4 block">
            Pacotes Especiais
          </span>
          <h2 className="pp-title pp-anim font-drama text-primary text-[38px] md:text-[44px] lg:text-[56px] leading-[1.05] mb-5">
            Cuidados pensados <br/>
            <span className="italic text-[#A56D45] font-light">para diferentes momentos.</span>
          </h2>
          <p className="pp-desc pp-anim font-sans text-secondary text-[15px] lg:text-[16px] leading-[1.6] max-w-2xl">
            Conheça combinações de procedimentos criadas para oferecer uma experiência de cuidado mais completa, sempre respeitando a avaliação e as necessidades individuais de cada pessoa.
          </p>
          <div className="pp-desc pp-anim mt-6 w-12 h-px bg-[#A56D45]/40"></div>
        </div>

        {/* Composição Editorial dos Cards */}
        
        {/* Linha 1 (Desktop: 2 colunas assimétricas / Mobile: 1 coluna) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 mb-6 lg:mb-8">
          <div className="pp-card-row1 pp-anim lg:col-span-3">
            <PromoPackageCard pkg={laserPkg} className="h-full" />
          </div>
          <div className="pp-card-row1 pp-anim lg:col-span-2">
            <PromoPackageCard pkg={pelePkg} className="h-full" />
          </div>
        </div>

        {/* Linha 2 (Desktop: 3 colunas / Tablet: 2 colunas / Mobile: 1 coluna) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {bottomPkgs.map((pkg, idx) => (
            <div key={pkg.id} className="pp-card-row2 pp-anim">
              <PromoPackageCard pkg={pkg} className="h-full" />
            </div>
          ))}
        </div>

        {/* Bloco Dúvidas Finais */}
        <div className="pp-footer pp-anim flex flex-col items-center text-center mt-8 pt-12 border-t border-[#A56D45]/10">
          <h4 className="font-serif text-[#392A27] text-[20px] lg:text-[22px] mb-2">
            Não sabe qual combinação combina mais com você?
          </h4>
          <p className="font-sans text-secondary text-[14.5px] mb-6">
            Converse com a Mariangela e tire suas dúvidas antes de escolher o seu cuidado.
          </p>
          <a
            href={buildWaLink('Olá, Mariangela! Gostaria de ajuda para escolher o melhor pacote de cuidados para o meu caso.')}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-center gap-2.5 px-8 h-[50px] rounded-full border border-[#A56D45]/40 text-[#A56D45] font-sans text-[14.5px] font-semibold hover:bg-[#A56D45]/10 hover:border-[#A56D45] transition-all duration-300 w-full sm:w-auto"
          >
            <WhatsAppIcon className="w-[18px] h-[18px]" />
            Falar com a Mariangela pelo WhatsApp
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

        {/* Aviso Legal */}
        <div className="pp-footer pp-anim text-center mt-12 opacity-60">
          <p className="font-sans text-[11px] lg:text-[12px] text-secondary tracking-wide uppercase">
            Atendimento mediante agendamento. Protocolos sujeitos à avaliação profissional.
          </p>
        </div>

      </div>
    </section>
  );
};

export default PromoPackages;
