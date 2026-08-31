import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { User, ClipboardCheck, BookOpen, Heart, Sparkles } from 'lucide-react';
import WhatsAppIcon from '../components/WhatsAppIcon.jsx';
import { buildWaLink } from '../data/business.js';

gsap.registerPlugin(ScrollTrigger);

const Features = () => {
  const container = useRef(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const images = [
    '/imagem2.jpg',
    '/imagem3.jpg',
    '/imagem5.jpg',
    '/imagem6.jpg',
    '/imagem7.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('.reveal-up, .reveal-image, .reveal-badge', { clearProps: 'all', opacity: 1 });
        return;
      }
      
      gsap.utils.toArray('.reveal-up').forEach((el, index) => {
        gsap.fromTo(el, 
          { y: 30, opacity: 0 }, 
          {
            y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%' },
            delay: el.classList.contains('delay-stagger') ? (index % 4) * 0.1 : 0
          }
        );
      });
      
      gsap.utils.toArray('.reveal-image').forEach((img) => {
        gsap.fromTo(img, 
          { scale: 0.985, opacity: 0 }, 
          {
            scale: 1, opacity: 1, duration: 1.0, ease: 'power2.out',
            scrollTrigger: { trigger: img, start: 'top 80%' },
          }
        );
      });

      gsap.utils.toArray('.reveal-badge').forEach((badge) => {
        gsap.fromTo(badge, 
          { y: 20, opacity: 0 }, 
          {
            y: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
            scrollTrigger: { trigger: badge, start: 'top 90%' },
            delay: 0.4
          }
        );
      });

    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section id="diferenciais" ref={container} className="relative w-full mauve-surface py-[70px] lg:py-[90px] px-[20px] lg:px-[60px] overflow-hidden scroll-mt-[96px] md:scroll-mt-[114px]">
      
      {/* Fundo suave e sutil (Glow) */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#EBD8D2] opacity-20 blur-[100px]"></div>
      </div>

      <div className="relative z-10 container-global w-full flex flex-col lg:flex-row items-center lg:items-center gap-12 lg:gap-16">
        
        {/* Coluna Esquerda: Conteúdo (44%) */}
        <div className="w-full lg:w-[44%] flex flex-col order-1 lg:order-1 justify-center">
          
          {/* Eyebrow */}
          <div className="reveal-up flex items-center gap-3 mb-5">
             <Sparkles className="w-4 h-4 text-[#A56D45] stroke-[1.5]" />
            <span className="font-sans text-[11px] lg:text-[12px] tracking-[0.25em] text-[#A56D45] font-semibold uppercase">
              Por que escolher a Mariangela
            </span>
            <div className="h-px w-8 bg-[#A56D45]/30"></div>
          </div>

          {/* Título */}
          <h2 className="reveal-up font-drama font-medium text-[#392A27] text-[38px] md:text-[44px] lg:text-[60px] leading-[1.05] mb-12 lg:mb-16">
            Cuidado em <br className="hidden lg:block"/>
            <span className="italic text-[#A56D45] font-light">cada detalhe.</span>
          </h2>

          {/* Grid 2x2 de Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[18px] lg:gap-[22px] mb-12 lg:mb-16">
            
            {/* CARD 01 */}
            <div className="reveal-up delay-stagger group relative bg-[#FDFBF9] border border-[#E7DADB]/40 rounded-[22px] lg:rounded-[26px] p-6 lg:p-7 shadow-[0_4px_20px_rgba(57,42,39,0.03)] hover:shadow-[0_12px_30px_rgba(57,42,39,0.06)] hover:-translate-y-1 transition-all duration-300 overflow-hidden min-h-[180px] lg:min-h-[200px] flex flex-col">
              <div className="w-12 h-12 rounded-full bg-[#F5EEEE] text-[#A56D45] flex items-center justify-center mb-5 group-hover:bg-[#EBD8D2]/60 transition-colors duration-300">
                <User strokeWidth={1.5} className="w-[22px] h-[22px]" />
              </div>
              <h3 className="font-drama text-[#392A27] text-[18px] lg:text-[20px] font-medium mb-2.5">Atendimento individualizado</h3>
              <p className="font-sans text-[13.5px] lg:text-[14px] text-[#715955] leading-[1.6]">
                Cada pessoa recebe atenção de acordo com suas reais necessidades.
              </p>
              {/* Linha decorativa rodapé */}
              <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-[#A56D45] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out opacity-40"></div>
            </div>

            {/* CARD 02 */}
            <div className="reveal-up delay-stagger group relative bg-[#FDFBF9] border border-[#E7DADB]/40 rounded-[22px] lg:rounded-[26px] p-6 lg:p-7 shadow-[0_4px_20px_rgba(57,42,39,0.03)] hover:shadow-[0_12px_30px_rgba(57,42,39,0.06)] hover:-translate-y-1 transition-all duration-300 overflow-hidden min-h-[180px] lg:min-h-[200px] flex flex-col">
              <div className="w-12 h-12 rounded-full bg-[#F5EEEE] text-[#A56D45] flex items-center justify-center mb-5 group-hover:bg-[#EBD8D2]/60 transition-colors duration-300">
                <ClipboardCheck strokeWidth={1.5} className="w-[22px] h-[22px]" />
              </div>
              <h3 className="font-drama text-[#392A27] text-[18px] lg:text-[20px] font-medium mb-2.5">Protocolos personalizados</h3>
              <p className="font-sans text-[13.5px] lg:text-[14px] text-[#715955] leading-[1.6]">
                Cada atendimento é pensado de forma individual, respeitando as necessidades de cada pessoa.
              </p>
              <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-[#A56D45] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out opacity-40"></div>
            </div>

            {/* CARD 03 */}
            <div className="reveal-up delay-stagger group relative bg-[#FDFBF9] border border-[#E7DADB]/40 rounded-[22px] lg:rounded-[26px] p-6 lg:p-7 shadow-[0_4px_20px_rgba(57,42,39,0.03)] hover:shadow-[0_12px_30px_rgba(57,42,39,0.06)] hover:-translate-y-1 transition-all duration-300 overflow-hidden min-h-[180px] lg:min-h-[200px] flex flex-col">
              <div className="w-12 h-12 rounded-full bg-[#F5EEEE] text-[#A56D45] flex items-center justify-center mb-5 group-hover:bg-[#EBD8D2]/60 transition-colors duration-300">
                <BookOpen strokeWidth={1.5} className="w-[22px] h-[22px]" />
              </div>
              <h3 className="font-drama text-[#392A27] text-[18px] lg:text-[20px] font-medium mb-2.5">Aperfeiçoamento constante</h3>
              <p className="font-sans text-[13.5px] lg:text-[14px] text-[#715955] leading-[1.6]">
                Busca contínua por conhecimento, técnicas e novos protocolos.
              </p>
              <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-[#A56D45] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out opacity-40"></div>
            </div>

            {/* CARD 04 */}
            <div className="reveal-up delay-stagger group relative bg-[#FDFBF9] border border-[#E7DADB]/40 rounded-[22px] lg:rounded-[26px] p-6 lg:p-7 shadow-[0_4px_20px_rgba(57,42,39,0.03)] hover:shadow-[0_12px_30px_rgba(57,42,39,0.06)] hover:-translate-y-1 transition-all duration-300 overflow-hidden min-h-[180px] lg:min-h-[200px] flex flex-col">
              <div className="w-12 h-12 rounded-full bg-[#F5EEEE] text-[#A56D45] flex items-center justify-center mb-5 group-hover:bg-[#EBD8D2]/60 transition-colors duration-300">
                <Heart strokeWidth={1.5} className="w-[22px] h-[22px]" />
              </div>
              <h3 className="font-drama text-[#392A27] text-[18px] lg:text-[20px] font-medium mb-2.5">Ambiente acolhedor</h3>
              <p className="font-sans text-[13.5px] lg:text-[14px] text-[#715955] leading-[1.6]">
                Um espaço pensado para que o atendimento também seja um momento de cuidado.
              </p>
              <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-[#A56D45] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out opacity-40"></div>
            </div>

          </div>

          {/* CTA do WhatsApp (Desktop) */}
          <div className="reveal-up hidden lg:flex justify-center w-full mt-4 lg:mt-6">
            <a
              href={buildWaLink('Olá, Mariangela! Conheci sua forma de atendimento pelo site e gostaria de agendar uma avaliação.')}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center justify-center gap-3 w-full sm:w-fit h-[54px] px-8 rounded-full bg-[#4D3A36] text-[#FFF8F6] hover:bg-[#392A27] hover:-translate-y-0.5 transition-all duration-300 shadow-[0_6px_20px_rgba(77,58,54,0.15)] font-sans text-[14.5px] font-semibold"
            >
              <WhatsAppIcon className="w-[18px] h-[18px]" />
              Agendar uma avaliação
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </a>
          </div>

        </div>

        {/* Coluna Direita: Imagem do Ambiente (56%) */}
        <div className="w-full lg:w-[56%] flex justify-center lg:justify-end order-2 lg:order-2">
          <div className="relative w-full reveal-image group">
            {/* Glow quente sutil atrás da imagem */}
            <div className="absolute inset-0 bg-[#A56D45] rounded-[28px] lg:rounded-[32px] blur-[40px] opacity-10 translate-y-4"></div>
            
            {/* Container da linha decorativa giratória */}
            <div className="w-full overflow-hidden rounded-[28px] lg:rounded-[32px] shadow-[0_30px_60px_rgba(57,42,39,0.08)] relative z-10 p-[4px] h-[420px] lg:h-[630px] bg-[#FAF6F3]">
              
              <div className="about-glow-spinner opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative w-full h-full rounded-[24px] lg:rounded-[28px] overflow-hidden z-10 bg-[#FAF6F3]">
                {images.map((src, index) => (
                  <div 
                    key={src} 
                    className={`absolute inset-0 w-full h-full transition-opacity duration-[1500ms] ease-in-out ${index === currentImgIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                  >
                    {/* Fundo Desfocado (Preenche espaços vazios com as cores da imagem) */}
                    <img 
                      src={src} 
                      alt="" 
                      className="absolute inset-0 w-full h-full object-cover blur-[20px] scale-110 opacity-70"
                    />
                    {/* Overlay escurecedor sutil para garantir contraste do badge e botão */}
                    <div className="absolute inset-0 bg-[#392A27]/5"></div>
                    
                    {/* Imagem Centralizada sem cortes */}
                    <img 
                      src={src} 
                      alt={`Ambiente da Clínica ${index + 2}`} 
                      className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Badge Flutuante */}
            <div className="reveal-badge absolute -bottom-5 -right-2 lg:-bottom-6 lg:-right-6 bg-[#FDFBF9] px-6 py-4 rounded-[18px] lg:rounded-[20px] shadow-[0_10px_30px_rgba(57,42,39,0.06)] z-20 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border border-[#A56D45]/20 flex items-center justify-center bg-[#FDFBF9]">
                <Sparkles className="w-[18px] h-[18px] text-[#A56D45] stroke-[1.5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-[10px] text-[#715955] uppercase tracking-widest font-semibold mb-0.5">Experiência</span>
                <span className="font-drama text-[20px] text-[#392A27] leading-none">Personalizada</span>
              </div>
            </div>
            
          </div>
        </div>

        {/* CTA do WhatsApp (Mobile - Abaixo da imagem) */}
        <div className="reveal-up flex lg:hidden justify-center w-full mt-8 order-3">
          <a
            href={buildWaLink('Olá, Mariangela! Conheci sua forma de atendimento pelo site e gostaria de agendar uma avaliação.')}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center justify-center gap-3 w-full sm:w-fit h-[54px] px-8 rounded-full bg-[#4D3A36] text-[#FFF8F6] hover:bg-[#392A27] hover:-translate-y-0.5 transition-all duration-300 shadow-[0_6px_20px_rgba(77,58,54,0.15)] font-sans text-[14.5px] font-semibold"
          >
            <WhatsAppIcon className="w-[18px] h-[18px]" />
            Agendar uma avaliação
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </a>
        </div>

      </div>
    </section>
  );
};

export default Features;
