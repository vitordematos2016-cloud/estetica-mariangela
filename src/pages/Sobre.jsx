import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Leaf, User, ClipboardCheck, BookOpen, Heart, Calendar, Pencil, Eraser, Paintbrush } from 'lucide-react';
import BrandMark from '../components/BrandMark.jsx';
import WhatsAppIcon from '../components/WhatsAppIcon.jsx';
import { buildWaLink } from '../data/business.js';
import useSeo from '../hooks/useSeo.js';

gsap.registerPlugin(ScrollTrigger);

const Sobre = () => {
  useSeo({
    title: 'Sobre Mim | Mariangela Schinaider Estética',
    description: 'Conheça a trajetória de Mariangela Schinaider. Da sala de aula para a estética, com foco no cuidado, respeito e acolhimento.',
    path: '/sobre',
  });

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

        // Fase 4: Reset (loop)
        artTl.to('.art-photo-layer', { opacity: 0, duration: 1.0, delay: 4.0 }, 8.5)
             .set('.art-sketch-layer', { clipPath: 'inset(0 100% 0 0)' })
             .set('.art-photo-layer', { clipPath: 'inset(0 100% 0 0)', opacity: 1 })
             .set('.image-glow-spinner', { opacity: 0 });

    }, container);
    return () => ctx.revert();
  }, []);

  const scrollToDiferenciais = (e) => {
    e.preventDefault();
    const el = document.getElementById('sobre-diferenciais');
    if (el) {
      const offset = 100;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <div ref={container} className="w-full bg-background pt-32 pb-10">
      
      <section className="relative w-full overflow-hidden px-5 md:px-12 lg:px-[60px] pb-24">
        <div className="max-w-[1360px] mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-0 lg:justify-between">
          
          <div className="w-full lg:w-[45%] flex justify-center lg:justify-start lg:pl-4 order-2 lg:order-1 mt-6 lg:mt-0 relative z-10">
            <div className="relative w-full max-w-[420px] lg:max-w-none lg:w-[480px] h-[520px] lg:h-[620px] reveal-image">

              {/* Cena de Arte (Transformação Visual) */}
              <div className="art-scene-container w-full h-full p-[3px] overflow-hidden rounded-tl-none rounded-tr-[80px] rounded-br-none rounded-bl-[80px] lg:rounded-tl-[40px] lg:rounded-tr-[160px] lg:rounded-br-[40px] lg:rounded-bl-[160px] shadow-2xl shadow-accent/10 relative bg-background">
                <div className="about-glow-spinner image-glow-spinner" />
                
                <div className="w-full h-full overflow-hidden rounded-tl-none rounded-tr-[77px] rounded-br-none rounded-bl-[77px] lg:rounded-tl-[37px] lg:rounded-tr-[157px] lg:rounded-br-[37px] lg:rounded-bl-[157px] relative z-10 bg-[#FBF9F8]">
                  
                  {/* Fundo Branco/Papel */}
                  <div className="absolute inset-0 bg-[#FBF9F8] z-0"></div>

                  {/* Ícones Animados */}
                  <Pencil className="tool-pencil absolute z-30 w-10 h-10 lg:w-12 lg:h-12 text-[#555] drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)] -translate-x-1/2 -translate-y-full" />
                  <Eraser className="tool-eraser absolute z-30 w-10 h-10 lg:w-12 lg:h-12 text-[#777] drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)] -translate-x-1/2 -translate-y-full" />
                  <Paintbrush className="tool-brush absolute z-30 w-12 h-12 lg:w-14 lg:h-14 text-[#cd9646] 
drop-shadow-[0_10px_15px_rgba(0,0,0,0.4)] -translate-x-1/2 -translate-y-full" />

                  {/* CAMADA 1: O Desenho Base (Revelado por wipe) */}
                  <div className="art-sketch-layer absolute inset-0 z-10">
                    <img 
                      src="/imagem-lapis.png" 
                      alt="Mariangela Desenhada" 
                      className="w-full h-full object-cover object-[center_10%] image-zoom"
                    />
                  </div>

                  {/* CAMADA 2: A Foto Real (Revelada por wipe) */}
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
            
            <div className="reveal-up flex items-center gap-3 mb-5 lg:mb-6">
              <span className="font-sans text-[11px] lg:text-[12px] tracking-[0.35em] text-accent font-semibold uppercase">
                Sobre mim • Minha trajetória
              </span>
              <span className="h-px w-12 bg-accent/30" />
            </div>

            <h1 className="reveal-up font-drama font-medium text-primary text-[38px] md:text-[46px] lg:text-[54px] xl:text-[62px] leading-[1.05] mb-6 lg:mb-8">
              Da sala de aula para <br className="hidden sm:block" />
              <span className="italic text-accent drop-shadow-sm font-semibold">uma nova forma de cuidar.</span>
            </h1>

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

            <div className="flex flex-col sm:flex-row items-stretch gap-4 lg:gap-5 mb-14">
              
              {/* Card 1 */}
              <div className="reveal-up relative p-[2px] rounded-[24px] lg:rounded-[32px] overflow-hidden shadow-lg shadow-accent/10 group w-full sm:w-1/3">
                <div className="about-glow-spinner opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10 w-full h-full bg-gradient-to-br from-[#FFFCFB] to-[#F2EBE9] rounded-[22px] lg:rounded-[30px] flex flex-col justify-center p-6 lg:p-7 hover:-translate-y-1 transition-transform duration-300">
                  <span className="font-drama text-accent text-[38px] lg:text-[44px] leading-none mb-2">03+</span>
                  <span className="font-sans text-[11px] text-accent/80 uppercase tracking-[0.2em] font-bold mb-1">Anos</span>
                  <p className="font-sans text-[13.5px] text-secondary leading-snug">de atuação e cuidado na estética.</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="reveal-up relative p-[2px] rounded-[24px] lg:rounded-[32px] overflow-hidden shadow-lg shadow-accent/10 group w-full sm:w-1/3 delay-[50ms]">
                <div className="about-glow-spinner opacity-80 group-hover:opacity-100 transition-opacity duration-300" style={{ animationDelay: '-1.6s' }} />
                <div className="relative z-10 w-full h-full bg-gradient-to-br from-[#FFFCFB] to-[#F2EBE9] rounded-[22px] lg:rounded-[30px] flex flex-col justify-center p-6 lg:p-7 hover:-translate-y-1 transition-transform duration-300">
                  <span className="font-drama text-accent text-[32px] lg:text-[36px] leading-none mb-2 mt-1 lg:mt-2">Formação</span>
                  <span className="font-sans text-[11px] text-accent/80 uppercase tracking-[0.2em] font-bold mb-1">Graduação</span>
                  <p className="font-sans text-[13.5px] text-secondary leading-snug">Estética e Cosmética - Unicesumar.</p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="reveal-up relative p-[2px] rounded-[24px] lg:rounded-[32px] overflow-hidden shadow-lg shadow-accent/10 group w-full sm:w-1/3 delay-[100ms]">
                <div className="about-glow-spinner opacity-80 group-hover:opacity-100 transition-opacity duration-300" style={{ animationDelay: '-3.3s' }} />
                <div className="relative z-10 w-full h-full bg-gradient-to-br from-[#FFFCFB] to-[#F2EBE9] rounded-[22px] lg:rounded-[30px] flex flex-col justify-center p-6 lg:p-7 hover:-translate-y-1 transition-transform duration-300">
                  <span className="font-drama text-accent text-[32px] lg:text-[36px] leading-none mb-2 mt-1 lg:mt-2">Domínio</span>
                  <span className="font-sans text-[11px] text-accent/80 uppercase tracking-[0.2em] font-bold mb-1">Técnicas</span>
                  <p className="font-sans text-[13.5px] text-secondary leading-[1.4]">Jato de plasma, peelings e massagens.</p>
                </div>
              </div>

            </div>

            <div className="reveal-up relative max-w-[550px] mb-12 lg:mb-14 px-6 lg:px-8 border-l-[4px] border-accent/40 py-2">
              <span className="absolute -top-6 -left-2 font-drama text-accent/10 text-[80px] pointer-events-none select-none leading-none">“</span>
              <p className="font-drama italic text-primary text-[26px] lg:text-[32px] leading-[1.25] relative z-10">
                Mais do que estética, um cuidado pensado para <span className="text-accent font-bold drop-shadow-sm">fazer você se sentir bem</span> consigo mesma.
              </p>
            </div>



          </div>
        </div>
      </section>

      <section id="sobre-diferenciais" className="relative w-full bg-card/40 py-24 lg:py-32 px-5 md:px-12 lg:px-[60px] overflow-hidden">
        <div className="max-w-[1360px] mx-auto w-full flex flex-col lg:flex-row items-center gap-16 lg:gap-10">
          
          <div className="w-full lg:w-[55%] flex flex-col order-2 lg:order-1">
            
            <div className="reveal-up flex items-center gap-3 mb-4">
              <span className="font-sans text-[11px] lg:text-[12px] tracking-[0.3em] text-secondary font-bold uppercase">
                Por que escolher a Mariangela
              </span>
            </div>
            <h2 className="reveal-up font-drama font-medium text-primary text-[36px] lg:text-[46px] leading-[1.1] mb-14 lg:mb-16">
              Cuidado em cada <br className="hidden lg:block"/>
              <span className="italic text-accent">detalhe.</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12 mb-16 lg:mb-20">
              
              <div className="reveal-up flex flex-col gap-4">
                <User strokeWidth={1.2} className="w-8 h-8 text-accent" />
                <div>
                  <h3 className="font-drama text-primary text-[20px] lg:text-[22px] mb-2">Atendimento individualizado</h3>
                  <div className="w-8 h-px bg-accent/30 mb-3" />
                  <p className="font-sans text-[14px] lg:text-[15px] text-secondary leading-relaxed pr-4">
                    Cada pessoa recebe atenção de acordo com suas necessidades.
                  </p>
                </div>
              </div>

              <div className="reveal-up flex flex-col gap-4">
                <ClipboardCheck strokeWidth={1.2} className="w-8 h-8 text-accent" />
                <div>
                  <h3 className="font-drama text-primary text-[20px] lg:text-[22px] mb-2">Protocolos personalizados</h3>
                  <div className="w-8 h-px bg-accent/30 mb-3" />
                  <p className="font-sans text-[14px] lg:text-[15px] text-secondary leading-relaxed pr-4">
                    Nada de tratamento igual para todo mundo.
                  </p>
                </div>
              </div>

              <div className="reveal-up flex flex-col gap-4">
                <BookOpen strokeWidth={1.2} className="w-8 h-8 text-accent" />
                <div>
                  <h3 className="font-drama text-primary text-[20px] lg:text-[22px] mb-2">Aperfeiçoamento constante</h3>
                  <div className="w-8 h-px bg-accent/30 mb-3" />
                  <p className="font-sans text-[14px] lg:text-[15px] text-secondary leading-relaxed pr-4">
                    Busca contínua por conhecimento, técnicas e novos protocolos.
                  </p>
                </div>
              </div>

              <div className="reveal-up flex flex-col gap-4">
                <Heart strokeWidth={1.2} className="w-8 h-8 text-accent" />
                <div>
                  <h3 className="font-drama text-primary text-[20px] lg:text-[22px] mb-2">Ambiente acolhedor</h3>
                  <div className="w-8 h-px bg-accent/30 mb-3" />
                  <p className="font-sans text-[14px] lg:text-[15px] text-secondary leading-relaxed pr-4">
                    Um espaço pensado para que o atendimento também seja um momento de cuidado.
                  </p>
                </div>
              </div>

            </div>

            <div className="reveal-up">
              <a
                href={buildWaLink('Olá, Mariangela! Conheci um pouco da sua trajetória pelo site e gostaria de agendar uma avaliação com você.')}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center justify-center gap-3 w-full sm:w-fit h-[54px] px-10 rounded-full bg-accent text-white-warm hover:bg-primary transition-colors shadow-lg font-sans text-[14.5px] font-semibold"
              >
                <WhatsAppIcon className="w-5 h-5" />
                Agendar uma avaliação
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>

          </div>

          <div className="w-full lg:w-[45%] flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative w-full max-w-[520px] h-[340px] lg:h-[420px] reveal-image">
              <div className="w-full h-full overflow-hidden rounded-[24px] lg:rounded-[32px] shadow-2xl shadow-accent/10 relative">
                <img 
                  src="/imagem-inicio.webp" 
                  alt="Ambiente da Clínica" 
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      <section className="relative w-full pt-20 lg:pt-28 pb-10 px-5 md:px-12 lg:px-[60px]">
        <div className="max-w-[1200px] mx-auto reveal-up">
          <div className="relative w-full bg-card rounded-[32px] lg:rounded-[48px] overflow-hidden p-10 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-xl shadow-accent/5 border border-accent/10">
            
            <BrandMark className="absolute right-0 bottom-0 w-80 h-80 text-accent opacity-10 translate-x-1/4 translate-y-1/4 pointer-events-none" />

            <div className="flex flex-col items-center lg:items-start text-center lg:text-left relative z-10">
              <Calendar className="w-10 h-10 text-accent mb-5" strokeWidth={1.2} />
              <h2 className="font-drama font-medium text-primary text-[34px] lg:text-[42px] leading-tight mb-3">
                Vamos cuidar de você?
              </h2>
              <p className="font-sans text-[16px] lg:text-[17px] text-secondary max-w-[400px]">
                Agende sua avaliação e descubra o protocolo ideal para você.
              </p>
            </div>

            <div className="relative z-10">
              <a
                href={buildWaLink('Olá, Mariangela! Conheci um pouco da sua trajetória pelo site e gostaria de agendar uma avaliação com você.')}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center justify-center gap-3 w-full sm:w-fit h-[58px] px-10 rounded-full bg-accent text-white-warm hover:bg-primary transition-colors shadow-lg font-sans text-[15px] font-semibold"
              >
                <WhatsAppIcon className="w-5 h-5" />
                Quero agendar agora
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Sobre;

