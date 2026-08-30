import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageCircle, MessageSquareText, User, Flower2, ArrowRight } from 'lucide-react';
import WhatsAppIcon from '../components/WhatsAppIcon.jsx';
import { buildWaLink } from '../data/business.js';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { num: '01', title: 'Entre em contato', text: 'O agendamento é realizado diretamente pelo WhatsApp.', icon: MessageCircle },
  { num: '02', title: 'Conte o que você procura', text: 'Informe o procedimento desejado e o melhor dia e horário para o seu atendimento.', icon: MessageSquareText },
  { num: '03', title: 'Avaliação individual', text: 'As necessidades e características de cada pessoa são consideradas antes da definição do atendimento.', icon: User },
  { num: '04', title: 'Protocolo personalizado', text: 'O procedimento é realizado conforme as necessidades individuais e orientações específicas.', icon: Flower2 },
];



const BackgroundFloralCorner = ({ className }) => (
  <svg className={className} viewBox="0 0 400 400" fill="none" stroke="currentColor" strokeWidth="0.5">
    <path d="M200 400 C 250 300 300 250 400 200" />
    <path d="M200 400 C 150 300 100 250 0 200" />
    <path d="M300 250 C 320 180 250 120 200 0" />
    <path d="M100 250 C 80 180 150 120 200 0" />
    <circle cx="200" cy="100" r="20" stroke="currentColor" strokeWidth="0.5" />
    <path d="M200 120 C 180 180 220 180 200 120 Z" />
  </svg>
);

const Journey = () => {
  const container = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reduced) {
      gsap.set('.jrn-eyebrow, .jrn-title, .jrn-step, .jrn-step-mobile, .jrn-cta', { opacity: 1, y: 0 });
      gsap.set('.jrn-line', { scaleX: 1 });
      gsap.set('.jrn-line-mobile', { scaleY: 1 });
      gsap.set('.jrn-arrow', { opacity: 1, scale: 1 });
      return;
      }

      // Hide elements initially
      gsap.set('.jrn-eyebrow, .jrn-title', { opacity: 0, y: 20 });
      gsap.set('.jrn-line', { scaleX: 0 });
      gsap.set('.jrn-line-mobile', { scaleY: 0 });
      gsap.set('.jrn-arrow', { opacity: 0, scale: 0.5 });
      gsap.set('.jrn-step, .jrn-step-mobile', { opacity: 0, y: 20 });
      gsap.set('.jrn-cta', { opacity: 0, y: 20 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: 'top 75%',
        },
      });

      // A: Eyebrow e Título
      tl.to('.jrn-eyebrow', { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' })
        .to('.jrn-title', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.2 }, '-=0.3');

      const isDesktop = window.innerWidth >= 1024;

      if (isDesktop) {
        // Desktop Timeline (Horizontal)
        // A linha tem width: 75% da div (do centro da col 1 ao centro da col 4).
        // Desenha a linha da esquerda para a direita (escala X) em 2 segundos
        tl.to('.jrn-line', { scaleX: 1, duration: 2, ease: 'power1.inOut' }, '+=0.2');

        // Aparecimento sequencial sincronizado com o desenho da linha
        // Passo 01 começa exatamente com a linha (0s)
        tl.to('.jrn-step:nth-child(1)', { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.2)' }, '-=2.0');
        
        // Seta 1 (a 16% da linha)
        tl.to('.jrn-arrow:nth-child(1)', { opacity: 1, scale: 1, duration: 0.3 }, '-=1.66');
        
        // Passo 02 (a 33% da linha)
        tl.to('.jrn-step:nth-child(2)', { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.2)' }, '-=1.33');
        
        // Seta 2 (a 50% da linha)
        tl.to('.jrn-arrow:nth-child(2)', { opacity: 1, scale: 1, duration: 0.3 }, '-=1.0');
        
        // Passo 03 (a 66% da linha)
        tl.to('.jrn-step:nth-child(3)', { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.2)' }, '-=0.66');
        
        // Seta 3 (a 83% da linha)
        tl.to('.jrn-arrow:nth-child(3)', { opacity: 1, scale: 1, duration: 0.3 }, '-=0.33');
        
        // Passo 04 (no final da linha)
        tl.to('.jrn-step:nth-child(4)', { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.2)' }, '-=0.1');

      } else {
        // Mobile Timeline (Vertical)
        tl.to('.jrn-line-mobile', { scaleY: 1, duration: 2, ease: 'power1.inOut' }, '+=0.2');
        tl.to('.jrn-step-mobile', { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.2)', stagger: 0.6 }, '-=2.0');
      }

      // CTA Final
      tl.to('.jrn-cta', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.15 }, '-=0.2');

    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="relative py-[90px] lg:py-[110px] px-4 overflow-hidden hero-atmosphere">
      
      {/* Radial Glow de fundo para iluminação suave central */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#FDFBF9_0%,_transparent_70%)] opacity-70 pointer-events-none"></div>

      {/* Florais Decorativos Editoriais de Fundo */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] lg:w-[600px] lg:h-[600px] pointer-events-none text-[#B97854] opacity-[0.03] -translate-x-1/4 translate-y-1/4 rotate-12">
        <BackgroundFloralCorner className="w-full h-full" />
      </div>
      <div className="absolute top-0 right-0 w-[300px] h-[300px] pointer-events-none text-[#B97854] opacity-[0.03] translate-x-1/4 -translate-y-1/4 -rotate-45">
        <BackgroundFloralCorner className="w-full h-full" />
      </div>

      <div className="relative z-10 w-full max-w-[1380px] mx-auto flex flex-col items-center">
        
        {/* ABERTURA */}
        <div className="jrn-eyebrow flex flex-col items-center mb-6 lg:mb-8">
          <div className="flex items-center gap-3 mb-3">
             <div className="h-px w-6 bg-[#B97854]/40" />
             <SparkleIcon />
             <div className="h-px w-6 bg-[#B97854]/40" />
          </div>
          <span className="font-sans text-[11px] lg:text-[13px] tracking-[0.3em] text-[#B97854] font-medium uppercase">
            Jornada do atendimento
          </span>
        </div>

        {/* TÍTULO */}
        <h2 className="text-center mb-[70px] lg:mb-[90px]">
          <span className="jrn-title block font-drama text-[#392A27] text-[40px] sm:text-[46px] lg:text-[58px] leading-[1.1] mb-1">
            Seu cuidado começa
          </span>
          <span className="jrn-title block font-drama italic text-[#B97854] text-[40px] sm:text-[46px] lg:text-[58px] leading-[1.1] font-light">
            antes do procedimento.
          </span>
        </h2>

        {/* TIMELINE DESKTOP */}
        <div className="hidden lg:block relative w-full mb-[100px]">
          {/* Fundo da linha (opcional, fica atrás da animada) */}
          <div className="absolute top-[88px] left-[12.5%] w-[75%] h-px bg-[#B97854]/20 -translate-y-1/2" />
          
          {/* Linha animada principal */}
          <div className="jrn-line absolute top-[88px] left-[12.5%] w-[75%] h-[2px] bg-[#B97854] origin-left -translate-y-1/2 shadow-[0_0_8px_rgba(185,120,84,0.3)] z-0" />
          
          {/* Setas integradas à linha (25%, 50%, 75%) */}
          <div className="jrn-arrow absolute top-[88px] left-[25%] -translate-y-1/2 -translate-x-1/2 text-[#B97854] z-10 bg-[#FAF6F3] px-1"><ArrowRight className="w-[14px] h-[14px] stroke-[2px]" /></div>
          <div className="jrn-arrow absolute top-[88px] left-[50%] -translate-y-1/2 -translate-x-1/2 text-[#B97854] z-10 bg-[#FAF6F3] px-1"><ArrowRight className="w-[14px] h-[14px] stroke-[2px]" /></div>
          <div className="jrn-arrow absolute top-[88px] left-[75%] -translate-y-1/2 -translate-x-1/2 text-[#B97854] z-10 bg-[#FAF6F3] px-1"><ArrowRight className="w-[14px] h-[14px] stroke-[2px]" /></div>

          {/* Grid de 4 Passos */}
          <div className="grid grid-cols-4 w-full relative z-20">
            {STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.num} className="jrn-step group flex flex-col items-center">
                  <span className="font-drama italic text-[#B97854] text-[24px] lg:text-[26px] mb-4 group-hover:-translate-y-1 transition-transform duration-300">
                    {s.num}
                  </span>
                  
                  {/* Círculo do Ícone */}
                  <div className="w-[88px] h-[88px] rounded-full bg-[#FDFBF9] border border-[#FFFDFB] shadow-[0_8px_24px_rgba(57,42,39,0.04)] flex items-center justify-center relative group-hover:-translate-y-1 group-hover:shadow-[0_12px_30px_rgba(185,120,84,0.12)] transition-all duration-300">
                    <Icon className="w-8 h-8 text-[#B97854] group-hover:text-[#A56D45] transition-colors duration-300" strokeWidth={1.1} />
                    {/* Glow radial sutil ao hover */}
                    <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,_rgba(185,120,84,0.1)_0%,_transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-150 pointer-events-none"></div>
                  </div>

                  {/* Tracinho vertical conectando texto */}
                  <div className="w-px h-[32px] bg-[#B97854]/30 my-5" />

                  {/* Título e Texto */}
                  <h3 className="font-drama text-[#392A27] text-[21px] lg:text-[23px] font-medium mb-3 group-hover:text-[#B97854] transition-colors duration-300 text-center px-4">
                    {s.title}
                  </h3>
                  
                  <div className="w-6 h-px bg-[#B97854]/60 mb-3" />
                  
                  <p className="font-sans text-[14px] lg:text-[14.5px] text-[#715955] leading-relaxed text-center px-4 max-w-[260px]">
                    {s.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* TIMELINE MOBILE */}
        <div className="lg:hidden w-full flex flex-col items-center relative mb-16">
          {/* Fundo da linha mobile */}
          <div className="absolute top-[88px] bottom-[88px] left-1/2 -translate-x-1/2 w-px bg-[#B97854]/20" />
          
          {/* Linha animada mobile */}
          <div className="jrn-line-mobile absolute top-[88px] left-1/2 -translate-x-1/2 w-[2px] bg-[#B97854] origin-top shadow-[0_0_8px_rgba(185,120,84,0.3)] z-0" />

          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={s.num} className={`jrn-step-mobile flex flex-col items-center w-full relative z-10 ${idx !== STEPS.length - 1 ? 'mb-12' : ''}`}>
                <span className="font-drama italic text-[#B97854] text-[22px] mb-3 bg-[#FAF6F3] px-2">{s.num}</span>
                
                <div className="w-[72px] h-[72px] rounded-full bg-[#FDFBF9] border border-[#FFFDFB] shadow-[0_8px_20px_rgba(57,42,39,0.04)] flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[#B97854]" strokeWidth={1.2} />
                </div>
                
                <div className="w-px h-[24px] bg-transparent my-2" /> {/* Espaçador */}
                
                <h3 className="font-drama text-[#392A27] text-[20px] font-medium mb-2 bg-[#FAF6F3] px-4 text-center">
                  {s.title}
                </h3>
                
                <div className="w-6 h-px bg-[#B97854]/60 mb-3" />
                
                <p className="font-sans text-[14.5px] text-[#715955] leading-relaxed text-center px-4 max-w-[300px] bg-[#FAF6F3]/80">
                  {s.text}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA FINAL */}
        <div className="flex flex-col items-center mt-6 lg:mt-10">
          <h4 className="jrn-cta font-drama text-[#392A27] text-[28px] lg:text-[34px] mb-8 font-medium">
            Pronta para começar?
          </h4>
          
          <div className="jrn-cta">
            <a
              href={buildWaLink('Olá, Mariangela! Vi como funciona o atendimento pelo site e gostaria de iniciar agendando minha avaliação. Quais horários estão disponíveis?')}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center justify-center gap-3 w-full sm:w-fit h-[58px] lg:h-[62px] px-10 rounded-full bg-[#5C3626] text-[#FFF8F6] hover:bg-[#4A2B1E] hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_24px_rgba(92,54,38,0.18)] hover:shadow-[0_12px_32px_rgba(92,54,38,0.25)] font-sans text-[14.5px] lg:text-[15px] font-semibold tracking-wide"
            >
              <WhatsAppIcon className="w-[18px] h-[18px] text-[#FFF8F6]" />
              Agendar minha avaliação
              <ArrowRight className="w-[16px] h-[16px] group-hover:translate-x-1.5 transition-transform duration-300" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

// Mini icone floral/brilho no eyebrow
const SparkleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#B97854]">
    <path d="M12 3v18M3 12h18M6.5 6.5l11 11M6.5 17.5l11-11" strokeLinecap="round" />
  </svg>
);

export default Journey;
