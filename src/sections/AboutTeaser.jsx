import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Pencil, Eraser, Paintbrush } from 'lucide-react';
import BrandMark from '../components/BrandMark.jsx';

gsap.registerPlugin(ScrollTrigger);

const AboutTeaser = () => {
  const container = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('.reveal-up, .reveal-image', { clearProps: 'all', opacity: 1 });
        gsap.set('.art-real-photo', { '--m1': '150%', '--m2': '150%', '--m3': '150%' });
        gsap.set('.art-sketch, .art-watercolor', { opacity: 0 });
        gsap.set('.art-quote-container', { opacity: 1, y: 0 });
        gsap.set('.art-highlight', { width: '100%', opacity: 1 });
        gsap.set('.art-pencil-icon', { opacity: 0 });
        return;
      }
      
      gsap.utils.toArray('.reveal-up').forEach((el) => {
        gsap.fromTo(el, 
          { y: 25, opacity: 0 }, 
          {
            y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%' },
          }
        );
      });
      
      gsap.utils.toArray('.reveal-image').forEach((img) => {
        gsap.fromTo(img, 
          { scale: 1.03, opacity: 0 }, 
          {
            scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out',
            scrollTrigger: { trigger: img, start: 'top 85%' },
          }
        );
      });

      gsap.to('.image-zoom', {
        scale: 1.1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.reveal-image',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });

      // --- Animação do Texto "professora de Artes" (Loop Independente) ---
      const textTl = gsap.timeline({
        scrollTrigger: { trigger: '.art-container', start: 'top 85%' },
        repeat: -1,
        repeatDelay: 1.5
      });
      textTl.set('.art-highlight', { opacity: 1, width: '0%' })
            .set('.art-pencil-icon', { opacity: 1, left: '0%', rotate: -20, y: 0 })
            .to('.art-highlight', { width: '100%', duration: 1.2, ease: 'power2.inOut' }, 0)
            .to('.art-pencil-icon', { left: '100%', rotate: 15, duration: 1.2, ease: 'power2.inOut' }, 0)
            .to('.art-pencil-icon', { opacity: 0, y: -10, duration: 0.3 }, '>')
            .to('.art-highlight', { opacity: 0, duration: 0.5 }, '+=1.0');

      // --- Animação Principal da Imagem (Pencil -> Eraser -> Brush) ---
      const artTl = gsap.timeline({
          scrollTrigger: { trigger: '.art-scene-container', start: 'top 65%' },
          repeat: -1,
          repeatDelay: 0.5,
          defaults: { ease: 'power2.out' }
        });

        // Configuração inicial
        artTl.set('.art-sketch-layer', { clipPath: 'inset(0 100% 0 0)' })
             .set('.art-photo-layer', { clipPath: 'inset(0 100% 0 0)' })
             .set('.tool-pencil', { left: '0%', opacity: 0, rotate: -25, top: '45%' })
             .set('.tool-eraser', { left: '0%', opacity: 0, rotate: -15, top: '45%' })
             .set('.tool-brush', { left: '0%', opacity: 0, rotate: -25, top: '45%' })
             .set('.image-glow-spinner', { opacity: 0 });

        // Fase 1: Lápis desenha o sketch (Esq -> Dir)
      artTl.to('.tool-pencil', { opacity: 1, duration: 0.2 }, 0)
           .to('.tool-pencil', { left: '100%', duration: 2.0, ease: 'power1.inOut' }, 0)
           .to('.tool-pencil', { top: '55%', yoyo: true, repeat: 5, duration: 0.33, ease: 'sine.inOut' }, 0)
           .to('.art-sketch-layer', { clipPath: 'inset(0 0% 0 0)', duration: 2.0, ease: 'power1.inOut' }, 0)
           .to('.tool-pencil', { opacity: 0, duration: 0.2 }, 1.8);

      // Fase 2: Borracha apaga o sketch (Esq -> Dir)
      artTl.to('.tool-eraser', { opacity: 1, duration: 0.2 }, 2.5)
           .to('.tool-eraser', { left: '100%', duration: 2.0, ease: 'power1.inOut' }, 2.5)
           .to('.tool-eraser', { top: '35%', yoyo: true, repeat: 5, duration: 0.33, ease: 'sine.inOut' }, 2.5)
           .to('.art-sketch-layer', { clipPath: 'inset(0 0 0 100%)', duration: 2.0, ease: 'power1.inOut' }, 2.5)
           .to('.tool-eraser', { opacity: 0, duration: 0.2 }, 4.3);

        // Fase 3: Pincel revela a foto final colorida (Esq -> Dir)
        artTl.to('.tool-brush', { opacity: 1, duration: 0.2 }, 5.0)
             .to('.tool-brush', { left: '100%', duration: 2.0, ease: 'power1.inOut' }, 5.0)
             .to('.tool-brush', { top: '65%', yoyo: true, repeat: 5, duration: 0.33, ease: 'sine.inOut' }, 5.0)
             .to('.art-photo-layer', { clipPath: 'inset(0 0% 0 0)', duration: 2.0, ease: 'power1.inOut' }, 5.0)
             .to('.tool-brush', { opacity: 0, duration: 0.2 }, 6.8);

        // Fase Final: Liga o efeito luminoso ao redor da imagem pronta
        artTl.to('.image-glow-spinner', { opacity: 1, duration: 1.0 }, 6.5);

        // Fase 4: Reset
        artTl.to('.art-photo-layer', { opacity: 0, duration: 1.0, delay: 4.0 }, 8.5)
             .set('.art-sketch-layer', { clipPath: 'inset(0 100% 0 0)' })
             .set('.art-photo-layer', { clipPath: 'inset(0 100% 0 0)', opacity: 1 })
             .set('.image-glow-spinner', { opacity: 0 });

    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section id="sobre" ref={container} className="relative w-full overflow-hidden px-5 md:px-12 lg:px-[60px] pb-24 pt-16 bg-background scroll-mt-[96px] md:scroll-mt-[114px]">
      <div className="container-global flex flex-col lg:flex-row items-center gap-12 lg:gap-0 lg:justify-between">
        
        {/* Esquerda: Fotografia (42%) */}
        <div className="w-full lg:w-[45%] flex justify-center lg:justify-start lg:pl-4 order-2 lg:order-1 mt-6 lg:mt-0 relative z-10">
          <div className="relative w-full max-w-[420px] lg:max-w-none lg:w-[480px] h-[520px] lg:h-[620px] reveal-image">

            <div className="art-scene-container w-full h-full p-[3px] overflow-hidden rounded-tl-none rounded-tr-[80px] rounded-br-none rounded-bl-[80px] lg:rounded-tl-[40px] lg:rounded-tr-[160px] lg:rounded-br-[40px] lg:rounded-bl-[160px] shadow-2xl shadow-accent/10 relative bg-background">
              <div className="about-glow-spinner image-glow-spinner" />
              <div className="w-full h-full overflow-hidden rounded-tl-none rounded-tr-[77px] rounded-br-none rounded-bl-[77px] lg:rounded-tl-[37px] lg:rounded-tr-[157px] lg:rounded-br-[37px] lg:rounded-bl-[157px] relative z-10 bg-[#FBF9F8]">
                  
                  <div className="absolute inset-0 bg-[#FBF9F8] z-0"></div>

                  <Pencil className="tool-pencil absolute z-30 w-10 h-10 lg:w-12 lg:h-12 text-[#555] drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)] -translate-x-1/2 -translate-y-full" />
                  <Eraser className="tool-eraser absolute z-30 w-10 h-10 lg:w-12 lg:h-12 text-[#777] drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)] -translate-x-1/2 -translate-y-full" />
                  <Paintbrush className="tool-brush absolute z-30 w-12 h-12 lg:w-14 lg:h-14 text-[#cd9646] drop-shadow-[0_10px_15px_rgba(0,0,0,0.4)] -translate-x-1/2 -translate-y-full" />

                  <div className="art-sketch-layer absolute inset-0 z-10">
                    <img 
                      src="/imagem-lapis.png" 
                      alt="Mariangela Desenhada" 
                      className="w-full h-full object-cover object-[center_10%] image-zoom"
                    />
                  </div>

                  <div className="art-photo-layer absolute inset-0 z-20">
                    <img 
                      src="/sobre-site.jpg" 
                      alt="Mariangela Schinaider" 
                      className="w-full h-full object-cover object-[center_10%] image-zoom"
                    />
                  </div>
                </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[55%] flex flex-col justify-center order-1 lg:order-2 lg:pl-10 xl:pl-12 relative z-20">
          
          {/* Eyebrow */}
          <div className="reveal-up flex items-center gap-3 mb-5 lg:mb-6">
            <span className="font-sans text-[11px] lg:text-[12px] tracking-[0.35em] text-accent font-semibold uppercase">
              Sobre mim • Minha trajetória
            </span>
            <span className="h-px w-12 bg-accent/30" />
          </div>

          {/* Título Principal */}
          <h2 className="reveal-up font-drama font-medium text-primary text-[38px] md:text-[46px] lg:text-[54px] xl:text-[62px] leading-[1.05] mb-6 lg:mb-8">
            Da sala de aula para <br className="hidden sm:block" />
            <span className="italic text-accent drop-shadow-sm font-semibold">uma nova forma de cuidar.</span>
          </h2>

          {/* Texto */}
          <p className="reveal-up font-sans text-[15.5px] lg:text-[17px] text-secondary leading-[1.75] max-w-[600px] mb-6">
            Minha trajetória começou como <span className="art-container relative inline-block whitespace-nowrap font-semibold text-accent px-1">
              professora de Artes
              <span className="art-highlight absolute bottom-[2px] left-0 h-[6px] lg:h-[8px] bg-[#cd9646]/40 rounded-full mix-blend-multiply" style={{ width: '0%', zIndex: 0 }}></span>
              <Pencil className="art-pencil-icon absolute -bottom-1 -translate-x-1/2 text-[#cd9646] w-4 h-4 lg:w-5 lg:h-5 z-10" style={{ left: '0%', opacity: 0 }} />
            </span>. Com o tempo, encontrei na Estética uma nova maneira de trabalhar com pessoas, acolher suas necessidades e contribuir para que se <span className="text-primary font-bold drop-shadow-sm">sintam melhor consigo mesmas.</span>
          </p>
          <p className="reveal-up font-sans text-[15.5px] lg:text-[17px] text-secondary leading-[1.75] max-w-[600px] mb-12">
            Hoje, dedico meu trabalho ao <span className="text-accent font-bold drop-shadow-sm">cuidado individual</span>, buscando valorizar a <span className="text-accent font-bold drop-shadow-sm">beleza natural</span> de cada pessoa com respeito, atenção e responsabilidade.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5 mb-14">
            
            {/* Card 1 */}
            <div className="reveal-up relative p-[2px] rounded-[24px] lg:rounded-[32px] overflow-hidden shadow-lg shadow-accent/10 group w-full">
              <div className="about-glow-spinner opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 w-full h-full bg-gradient-to-br from-[#FFFCFB] to-[#F2EBE9] rounded-[22px] lg:rounded-[30px] flex flex-col justify-center p-6 lg:p-7 hover:-translate-y-1 transition-transform duration-300">
                <span className="font-drama text-accent text-[38px] lg:text-[44px] leading-none mb-2">03+</span>
                <span className="font-sans text-[11px] text-accent/80 uppercase tracking-[0.2em] font-bold mb-1">Anos</span>
                <p className="font-sans text-[13.5px] text-secondary leading-snug">de atuação e cuidado na estética.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="reveal-up relative p-[2px] rounded-[24px] lg:rounded-[32px] overflow-hidden shadow-lg shadow-accent/10 group w-full delay-[50ms]">
              <div className="about-glow-spinner opacity-80 group-hover:opacity-100 transition-opacity duration-300" style={{ animationDelay: '-1.6s' }} />
              <div className="relative z-10 w-full h-full bg-gradient-to-br from-[#FFFCFB] to-[#F2EBE9] rounded-[22px] lg:rounded-[30px] flex flex-col justify-center p-6 lg:p-7 hover:-translate-y-1 transition-transform duration-300">
                <span className="font-drama text-accent text-[32px] lg:text-[36px] leading-none mb-2 mt-1 lg:mt-2">Formação</span>
                <span className="font-sans text-[11px] text-accent/80 uppercase tracking-[0.2em] font-bold mb-1">Graduação</span>
                <p className="font-sans text-[13.5px] text-secondary leading-snug">Estética e Cosmética - Unicesumar.</p>
              </div>
            </div>

            {/* Card 3 - Full Width for Long Text */}
            <div className="reveal-up relative p-[2px] rounded-[24px] lg:rounded-[32px] overflow-hidden shadow-lg shadow-accent/10 group w-full sm:col-span-2 delay-[100ms]">
              <div className="about-glow-spinner opacity-80 group-hover:opacity-100 transition-opacity duration-300" style={{ animationDelay: '-3.3s' }} />
              <div className="relative z-10 w-full h-full bg-gradient-to-br from-[#FFFCFB] to-[#F2EBE9] rounded-[22px] lg:rounded-[30px] flex flex-col sm:flex-row sm:items-center gap-5 lg:gap-8 p-6 lg:p-8 hover:-translate-y-1 transition-transform duration-300">
                <div className="shrink-0 sm:w-[140px] lg:w-[160px]">
                  <span className="block font-drama text-accent text-[32px] lg:text-[36px] leading-none mb-2 mt-1 lg:mt-2">Domínio</span>
                  <span className="block font-sans text-[11px] text-accent/80 uppercase tracking-[0.2em] font-bold mb-1">Aperfeiçoamento</span>
                </div>
                <div className="flex-1 sm:border-l sm:border-accent/20 sm:pl-6 lg:pl-8">
                  <p className="font-sans text-[13.5px] lg:text-[14.5px] text-secondary leading-[1.65]">
                    "Minha busca por conhecimento não parou no curso. Ao longo dessa caminhada, realizei diversos cursos de aperfeiçoamento, incluindo jato de plasma, peelings, limpeza de pele, massagens, diferentes técnicas de drenagem linfática e outros procedimentos estéticos."
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Frase Editorial */}
          <div className="reveal-up relative max-w-[550px] mb-12 lg:mb-14 px-6 lg:px-8 border-l-[4px] border-accent/40 py-2">
            <span className="absolute -top-6 -left-2 font-drama text-accent/10 text-[80px] pointer-events-none select-none leading-none">“</span>
            <p className="font-drama italic text-primary text-[26px] lg:text-[32px] leading-[1.25] relative z-10">
              Mais do que estética, um cuidado pensado para <span className="text-accent font-bold drop-shadow-sm">fazer você se sentir bem</span> consigo mesma.
            </p>
          </div>


        </div>
      </div>
    </section>
  );
};

export default AboutTeaser;
