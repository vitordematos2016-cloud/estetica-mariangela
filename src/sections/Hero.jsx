import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowRight, Calendar, MapPin, Leaf, Fingerprint, ScrollText, Wand2, HeartHandshake } from 'lucide-react';
import BrandMark from '../components/BrandMark.jsx';
import WhatsAppIcon from '../components/WhatsAppIcon.jsx';
import { buildWaLink } from '../data/business.js';

const photoUrl = '/mariangela-nova.jpg.png';

const HIGHLIGHTS = [
  { icon: Fingerprint, label: 'Atendimento personalizado' },
  { icon: ScrollText, label: 'Procedimentos personalizados' },
  { icon: Wand2, label: 'Tecnologias modernas' },
  { icon: HeartHandshake, label: 'Ambiente acolhedor' },
];

const Hero = () => {
  const container = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('.hero-anim', { clearProps: 'all', opacity: 1 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo('.hero-anim-1', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.1)
        .fromTo('.hero-anim-2', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.3)
        .fromTo('.hero-anim-3', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.5)
        .fromTo('.hero-anim-4', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }, 0.7)
        .fromTo('.hero-scene', { opacity: 0, y: 50, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: 'back.out(1.5)' }, 0.8);
      
      gsap.to('.hero-scene', {
        y: -40,
        ease: 'none',
        scrollTrigger: { trigger: container.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section id="inicio" ref={container} className="hero relative w-full min-h-[100svh] pt-[104px] md:pt-[130px] hero-atmosphere overflow-hidden flex flex-col items-center justify-start">
      
      <span className="ambient-glow hidden lg:block w-[500px] h-[500px] left-1/2 top-0 -translate-x-1/2" />

      <div className="relative z-20 container-global flex flex-col items-center text-center px-6 sm:px-10 pb-12 w-full">
        
        <div className="hero-anim-1 flex items-center justify-center gap-2 font-sans text-[11px] md:text-[12px] tracking-[0.4em] text-primary font-bold mb-6 uppercase">
          Estética <span className="w-1 h-1 bg-accent rounded-full" /> Cuidado <span className="w-1 h-1 bg-accent rounded-full" /> Bem-Estar
        </div>

        <h1 className="hero-anim-2 flex flex-col items-center mb-6">
          <span className="font-drama font-medium text-primary text-[38px] sm:text-[48px] lg:text-[64px] xl:text-[76px] leading-[1.1]">
            Cuidado que valoriza
          </span>
          <span className="text-gradient-warm font-drama italic text-[42px] sm:text-[54px] lg:text-[72px] xl:text-[86px] leading-[1.02] mt-1">
            a sua <span className="highlight-accent">beleza.</span>
          </span>
        </h1>

        <p className="hero-anim-3 font-sans text-[17px] lg:text-[19px] text-secondary max-w-[600px] leading-[1.65] mb-10">
          Tratamentos estéticos personalizados, realizados com <span className="font-semibold text-primary">cuidado, acolhimento e atenção</span> às necessidades de cada pessoa.
        </p>

        <div className="hero-anim-4 flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 w-full">
          <a href={buildWaLink('Olá, Mariangela! Conheci seu trabalho pelo site e gostaria de verificar os horários disponíveis para agendar um atendimento.')} target="_blank" rel="noreferrer" className="btn-accent btn-glow w-full sm:w-auto h-[58px]">
            <WhatsAppIcon className="w-[18px] h-[18px]" />
            Agendar atendimento
          </a>
          <Link to="/tratamentos" className="btn-accent bg-transparent border-2 border-accent text-primary hover:bg-accent/10 shadow-none w-full sm:w-auto h-[58px]">
            Conhecer tratamentos <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="hero-anim-4 flex flex-wrap justify-center gap-4 mb-12">
          {HIGHLIGHTS.map((h) => {
            const Icon = h.icon;
            return (
              <div key={h.label} className="card-surface flex items-center gap-3 py-3 px-5 rounded-full">
                <Icon className="w-5 h-5 text-accent" strokeWidth={1.5} />
                <span className="font-sans text-[13px] font-semibold text-primary">{h.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="hero-scene relative z-10 w-[95%] sm:w-[90%] max-w-[1000px] mx-auto h-auto mb-16 md:mb-24 rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-[0_40px_100px_-30px_rgba(74,51,44,0.4)] hover:scale-[1.02] hover:-translate-y-2 transition-transform duration-500 ease-out cursor-pointer p-[3px] md:p-[4px] hero-glow-border">
        {/* Animated Glowing Light Beams */}
        <div className="hero-glow-spinner" />
        
        {/* Inner Content Wrapper */}
        <div className="relative z-10 w-full h-full rounded-[22px] sm:rounded-[29px] overflow-hidden bg-background">
          <img
            src="/mariangela-nova-desktop.jpg.png"
            alt="Mariangela Schinaider em seu espaço de atendimento"
            className="w-full h-auto object-cover object-center block"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      <div className="hero-scroll-cue absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2.5">
        <span className="w-[22px] h-[36px] rounded-full border border-accent/40 flex justify-center pt-2">
          <span className="scroll-dot w-1 h-1 rounded-full bg-accent" />
        </span>
        <span className="font-sans text-[9px] tracking-[0.3em] text-secondary uppercase">Role para explorar</span>
      </div>
    </section>
  );
};

export default Hero;
