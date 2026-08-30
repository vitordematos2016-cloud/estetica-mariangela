import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Clock, Navigation } from 'lucide-react';
import WhatsAppIcon from '../components/WhatsAppIcon.jsx';
import { FULL_ADDRESS, HOURS, MAPS_EMBED_URL, MAPS_DIRECTIONS_URL, buildWaLink } from '../data/business.js';

gsap.registerPlugin(ScrollTrigger);

const Location = () => {
  const locationRef = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('.loc-anim, .map-anim', { clearProps: 'all', opacity: 1 });
        return;
      }
      
      const tlLoc = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: locationRef.current, start: 'top 80%' },
      });
      tlLoc.fromTo('.loc-anim', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 })
           .fromTo('.map-anim', { opacity: 0, scale: 0.985 }, { opacity: 1, scale: 1, duration: 0.8 }, 0.2);
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="contato" ref={locationRef} className="w-full mauve-surface py-16 lg:py-24 scroll-mt-[96px] md:scroll-mt-[114px]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
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
            
            <p className="font-sans text-primary/80 text-[15px] lg:text-[16.5px] leading-relaxed max-w-sm">
              Nossa clínica foi planejada para que você se sinta <strong className="text-primary font-semibold text-[16px] lg:text-[17.5px]">acolhida, confortável e cuidada</strong> em cada detalhe.
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
                <span className="block font-sans text-[14px] text-primary/80">
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
                  <span key={i} className="block font-sans text-[14px] text-primary/80">
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
              className="btn-accent px-8 h-[52px] text-[14px] flex items-center justify-center gap-2"
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
        </div>

      </div>
    </section>
  );
};

export default Location;
