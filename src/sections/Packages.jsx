import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Sparkles, Heart, Flower2 } from 'lucide-react';
import WhatsAppIcon from '../components/WhatsAppIcon.jsx';
import { buildWaLink } from '../data/business.js';

const PACKAGES = [
  {
    icon: Flower2,
    title: 'Pacote Facial',
    badge: 'Cuidado essencial',
    message: 'Renovação e\nhidratação',
    desc: 'Protocolos combinados para limpeza, revitalização e saúde do seu rosto.',
    featured: false,
    delay: 0.1,
  },
  {
    icon: Sparkles,
    title: 'Pacotes de Massagens',
    badge: '★ Mais procurado',
    message: 'Relaxamento e\nbem-estar',
    desc: 'Combinações de sessões focadas no seu relaxamento e recuperação muscular.',
    featured: true,
    delay: 0.2,
  },
  {
    icon: Heart,
    title: 'Pacote Corporal',
    badge: 'Tratamento contínuo',
    message: 'Resultados\nduradouros',
    desc: 'Tratamentos corporais em sessões contínuas para atingir seus objetivos.',
    featured: false,
    delay: 0.3,
  }
];

const Packages = () => {
  const container = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('.pkg-anim', { clearProps: 'all', opacity: 1 });
        return;
      }
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: container.current, start: 'top 75%' },
      });
      tl.fromTo('.pkg-head', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
        .fromTo('.pkg-card', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.15 }, 0.2);
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="relative py-24 lg:py-32 px-6 md:px-12 bg-background overflow-hidden">
      <div className="max-w-6xl mx-auto">
        
        {/* Cabeçalho centralizado */}
        <div className="pkg-head flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
          <span className="text-micro text-accent mb-4 tracking-[0.3em] uppercase">Ofertas Especiais</span>
          <h2 className="flex flex-col mb-5">
            <span className="font-drama font-medium text-primary text-[32px] sm:text-[40px] lg:text-[48px] leading-[1.1]">
              Condições exclusivas para
            </span>
            <span className="font-drama italic text-[36px] sm:text-[44px] lg:text-[54px] leading-[1.1] mt-1 text-primary">
              continuar seu <span className="highlight-accent">cuidado.</span>
            </span>
          </h2>
          <p className="font-sans text-[16px] lg:text-[18px] text-secondary leading-[1.6]">
            Escolha nossos pacotes promocionais e garanta a frequência ideal para manter seu bem-estar sempre em dia.
          </p>
        </div>

        {/* Grid de ofertas estilo Viaduca */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {PACKAGES.map((pkg, idx) => {
            const Icon = pkg.icon;
            return (
              <article key={idx} className={`pkg-card card-surface relative rounded-[32px] p-8 flex flex-col items-center text-center transition-all duration-300 ${pkg.featured ? 'border-accent shadow-[0_20px_40px_rgba(74,51,44,0.15)] -translate-y-2' : ''}`}>
                
                {/* Badge flotante */}
                <span className={`absolute -top-3.5 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase ${pkg.featured ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-mauve text-primary border border-accent/20'}`}>
                  {pkg.badge}
                </span>

                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-6 mt-4">
                  <Icon className="w-6 h-6 text-accent" strokeWidth={1.5} />
                </div>

                <h3 className="font-sans font-bold text-primary text-[15px] tracking-wide uppercase mb-4 opacity-80">{pkg.title}</h3>
                
                <div className="h-px w-12 bg-accent/20 mb-6" />

                <div className="font-drama text-primary text-[26px] leading-[1.15] mb-4 whitespace-pre-line">
                  {pkg.message}
                </div>

                <p className="font-sans text-[14px] text-secondary leading-relaxed mb-8">
                  {pkg.desc}
                </p>

                <div className="mt-auto w-full">
                  <a
                    href={buildWaLink('Olá, Mariangela! Estava conhecendo os combos e pacotes pelo site e gostaria de agendar uma avaliação.')}
                    target="_blank"
                    rel="noreferrer"
                    className={`w-full flex items-center justify-center ${pkg.featured ? 'btn-accent' : 'btn-accent bg-transparent border-2 border-accent text-primary hover:bg-accent/10 shadow-none'}`}
                  >
                    <WhatsAppIcon className="w-[16px] h-[16px]" />
                    Consultar valores
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        <p className="pkg-head text-center text-[12px] font-sans text-secondary mt-12 max-w-xl mx-auto">
          *Os valores e a disponibilidade dos pacotes podem variar. Entre em contato diretamente pelo WhatsApp para consultar as condições atualizadas.
        </p>

      </div>
    </section>
  );
};

export default Packages;
