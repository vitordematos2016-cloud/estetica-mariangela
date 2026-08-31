import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Clock, Navigation, ArrowRight } from 'lucide-react';
import useSeo from '../hooks/useSeo.js';
import SectionHero from '../components/SectionHero.jsx';
import WhatsAppIcon from '../components/WhatsAppIcon.jsx';
import {
  buildWaLink, FULL_ADDRESS, HOURS,
  MAPS_EMBED_URL, MAPS_DIRECTIONS_URL, SOCIAL
} from '../data/business.js';

const InstagramIcon = ({ className = '', strokeWidth = 1.5 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M16.5 7.5v.01" />
  </svg>
);

gsap.registerPlugin(ScrollTrigger);

const Contato = () => {
  useSeo({
    title: 'Contato e Agendamento',
    description: 'Fale com a Mariangela Schinaider Estética pelo WhatsApp, e-mail ou venha nos visitar em Guaraniaçu, Paraná.',
    path: '/contato',
  });

  const locationRef = useRef(null);
  const instaRef = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('.loc-anim, .map-anim, .badge-anim, .insta-anim, .insta-card-anim', { clearProps: 'all', opacity: 1 });
        return;
      }
      
      const tlLoc = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: locationRef.current, start: 'top 80%' },
      });
      tlLoc.fromTo('.loc-anim', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 })
           .fromTo('.map-anim', { opacity: 0, scale: 0.985 }, { opacity: 1, scale: 1, duration: 0.8 }, 0.2)
           .fromTo('.badge-anim', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.6);

      const tlInsta = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: instaRef.current, start: 'top 85%' },
      });
      tlInsta.fromTo('.insta-anim', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 })
             .fromTo('.insta-card-anim', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.2);

    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-gradient-to-b from-background to-[#FBF5F1] overflow-hidden">
      <SectionHero
        label="Contato"
        titleNormal="Será um prazer"
        titleItalic="cuidar de você."
        subtitle="Escolha a forma mais fácil de falar com a gente. O agendamento é sempre feito diretamente pelo WhatsApp."
      />

      {/* Seção "Onde Estamos" */}
      <section ref={locationRef} className="container-global py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Esquerda: Info (40%) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            
            <div className="loc-anim mb-8">
              <span className="font-sans text-[11px] lg:text-[12px] tracking-[0.25em] text-accent font-bold uppercase block mb-3">
                Onde Estamos
              </span>
              <div className="w-6 h-px bg-accent/40 mb-5" />
              
              <h2 className="font-drama text-primary leading-[1.1] text-[34px] lg:text-[44px] mb-4">
                Um espaço pensado <br />
                <span className="italic text-accent">para receber você.</span>
              </h2>
              
              <p className="font-sans text-secondary text-[15px] lg:text-[16.5px] leading-relaxed max-w-sm">
                Nossa clínica foi planejada para que você se sinta acolhida, confortável e cuidada em cada detalhe.
              </p>
            </div>

            <div className="loc-anim flex flex-col gap-6 mb-10">
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#F4E6DF] flex items-center justify-center shrink-0">
                  <MapPin className="w-[20px] h-[20px] text-accent" strokeWidth={1.5} />
                </div>
                <div className="pt-1">
                  <span className="block font-sans font-semibold text-primary text-[15px] lg:text-[16px] mb-0.5">
                    {FULL_ADDRESS.split(',')[0]}, {FULL_ADDRESS.split(',')[1]?.split('-')[0]?.trim() || ''}
                  </span>
                  <span className="block font-sans text-[14px] text-secondary">
                    {FULL_ADDRESS.split('-')[1]?.trim() || FULL_ADDRESS}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#F4E6DF] flex items-center justify-center shrink-0">
                  <Clock className="w-[20px] h-[20px] text-accent" strokeWidth={1.5} />
                </div>
                <div className="pt-1">
                  <span className="block font-sans font-semibold text-primary text-[15px] lg:text-[16px] mb-0.5">
                    Atendimento
                  </span>
                  {HOURS.map((h, i) => (
                    <span key={i} className="block font-sans text-[14px] text-secondary">
                      {h}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            <div className="loc-anim flex flex-col sm:flex-row gap-4">
              <a
                href={MAPS_DIRECTIONS_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-8 h-[52px] rounded-full border border-accent/60 text-accent hover:bg-accent/5 hover:border-accent transition-colors font-sans text-[14px] font-semibold"
              >
                <Navigation className="w-[18px] h-[18px]" strokeWidth={1.5} />
                Como chegar
              </a>
              <a
                href={buildWaLink('Olá, Mariangela! Vi a localização e as informações de atendimento no site e gostaria de verificar os horários disponíveis para agendar.')}
                target="_blank"
                rel="noreferrer"
                className="btn-accent px-8 h-[52px] text-[14px]"
              >
                <WhatsAppIcon className="w-[18px] h-[18px]" />
                Agendar horário
              </a>
            </div>

          </div>

          {/* Direita: Mapa (60%) */}
          <div className="lg:col-span-7 relative">
            <div className="map-anim w-full h-[420px] lg:h-[650px] rounded-[28px] overflow-hidden border border-[#EBE1DC] shadow-[0_20px_60px_-15px_rgba(184,111,87,0.15)] relative">
              <iframe
                title="Localização da Mariangela Schinaider Estética"
                src={MAPS_EMBED_URL}
                className="w-full h-full grayscale-[10%] contrast-[1.05]"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            
            {/* Badge */}
            <div className="badge-anim absolute top-6 left-6 lg:top-12 lg:-left-8 bg-[#FBF5F1] rounded-[22px] p-5 shadow-xl border border-white flex gap-4 items-center max-w-[280px]">
              <div className="w-10 h-10 rounded-full bg-[#EFE3DB] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-accent" strokeWidth={1.5} />
              </div>
              <div>
                <span className="block font-drama text-[17px] text-primary mb-0.5">Você chegou!</span>
                <span className="block font-sans text-[13px] text-secondary leading-snug">Mariangela Schinaider Estética</span>
                <span className="block font-sans text-[12px] text-secondary/70">Guaraniaçu, PR</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Seção Redes Sociais */}
      <section ref={instaRef} className="py-20 lg:py-28 px-6 md:px-12 bg-gradient-to-b from-[#FBF5F1] to-[#FCF8F5] flex flex-col items-center overflow-hidden">
        
        <div className="text-center mb-10 lg:mb-14">
          <span className="insta-anim font-sans text-[11px] lg:text-[12px] tracking-[0.25em] text-accent font-bold uppercase mb-4 block">
            Nossas Redes Sociais
          </span>
          <div className="insta-anim flex items-center justify-center mb-5">
            <div className="w-2 h-2 rounded-full border border-accent/40" />
          </div>
          <h2 className="insta-anim font-drama text-primary text-[32px] sm:text-[44px] leading-[1.1]">
            Acompanhe a Mariangela <br />
            <span className="italic text-accent">no Instagram.</span>
          </h2>
        </div>

        {/* Card Único Instagram */}
        <a
          href={SOCIAL.instagram.url}
          target="_blank"
          rel="noopener noreferrer"
          className="insta-card-anim group relative w-full max-w-[1100px] bg-[#FCF8F5] rounded-[28px] border border-[#EBE1DC] p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 shadow-sm hover:shadow-[0_15px_50px_-10px_rgba(184,111,87,0.15)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
          {/* Fundo Decorativo "@" */}
          <div className="absolute right-[-2%] top-[-30%] text-[320px] font-serif italic text-accent opacity-[0.03] pointer-events-none select-none transition-transform duration-500 group-hover:scale-105 hidden md:block">
            @
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 lg:gap-10 relative z-10 w-full md:w-auto text-center md:text-left">
            <div className="w-20 h-20 lg:w-[90px] lg:h-[90px] rounded-[22px] border border-accent/20 flex items-center justify-center bg-white/50 group-hover:bg-accent/5 transition-colors duration-300 shrink-0">
              <InstagramIcon className="w-10 h-10 lg:w-11 lg:h-11 text-accent group-hover:scale-110 transition-transform duration-500" strokeWidth={1.2} />
            </div>
            
            <div className="flex flex-col">
              <span className="font-sans text-[13px] text-secondary/70 uppercase tracking-widest mb-1">
                Instagram
              </span>
              <span className="font-serif italic text-[24px] lg:text-[30px] text-primary mb-2">
                {SOCIAL.instagram.handle}
              </span>
              <span className="font-sans text-[14px] lg:text-[15px] text-secondary max-w-sm">
                Cuidados, novidades e um pouco do dia a dia da Mariangela.
              </span>
            </div>
          </div>

          <div className="relative z-10 shrink-0 w-full md:w-auto flex justify-center">
            <div className="flex items-center gap-2 px-8 h-[52px] rounded-full bg-primary text-[#FDF9F7] font-sans text-[14.5px] font-semibold group-hover:bg-accent transition-colors duration-300">
              Seguir no Instagram 
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </div>

        </a>

      </section>
    </div>
  );
};

export default Contato;
