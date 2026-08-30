import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Leaf, Info } from 'lucide-react';
import { QrCode, Banknote, CreditCard, Wallet } from 'lucide-react';
import { buildWaLink } from '../data/business.js';

gsap.registerPlugin(ScrollTrigger);

// SVG personalizado para o Ícone de Cartões 3D
const Pseudo3DCards = () => (
  <div className="relative w-28 h-24 mb-6">
    {/* Cartão de Fundo (Mais escuro/borrado) */}
    <div className="absolute inset-0 bg-gradient-to-tr from-[#8E4935] to-[#A25740] rounded-[14px] transform rotate-[-8deg] -translate-x-2 -translate-y-2 opacity-80 shadow-lg border border-[#C67E63]/30" />
    
    {/* Cartão da Frente (Destaque) */}
    <div className="absolute inset-0 bg-gradient-to-tr from-[#D6967E] via-[#C98770] to-[#B86F57] rounded-[14px] transform rotate-[4deg] translate-x-2 shadow-2xl border border-white/20 flex flex-col justify-between p-3 overflow-hidden">
      
      {/* Brilho Superior/Esquerdo */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/30 to-transparent opacity-60 pointer-events-none" />

      {/* Detalhes do Cartão - Chip */}
      <div className="w-6 h-4 rounded-sm border border-[#E9CDB7]/60 flex items-center justify-center relative z-10 opacity-80 ml-1">
        <div className="w-full h-px bg-[#E9CDB7]/40 absolute top-1/2 -translate-y-1/2" />
        <div className="w-px h-full bg-[#E9CDB7]/40 absolute left-1/2 -translate-x-1/2" />
      </div>
      
      {/* Linhas simulando números */}
      <div className="space-y-1.5 relative z-10 w-full">
        <div className="flex gap-2">
          <div className="h-1.5 w-6 bg-white/30 rounded-full" />
          <div className="h-1.5 w-6 bg-white/30 rounded-full" />
          <div className="h-1.5 w-6 bg-white/30 rounded-full" />
          <div className="h-1.5 w-6 bg-white/30 rounded-full" />
        </div>
        <div className="flex justify-between items-center pr-1">
          <div className="h-1.5 w-12 bg-white/20 rounded-full" />
          <div className="h-2 w-8 bg-white/40 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

const PAY_METHODS = [
  {
    title: 'Pix',
    text: 'Rápido e prático.',
    icon: QrCode,
  },
  {
    title: 'Dinheiro',
    text: 'Pagamento presencial.',
    icon: Banknote,
  },
  {
    title: 'Cartão de débito',
    text: 'Simples e imediato.',
    icon: CreditCard,
  },
  {
    title: 'Cartão de crédito',
    text: 'Mais flexibilidade para pagar.',
    icon: Wallet,
  },
];

const Payments = () => {
  const container = useRef(null);
  const WA_LINK = buildWaLink('Olá, Mariangela! Vi as formas de pagamento no site e gostaria de tirar uma dúvida sobre as condições de pagamento e parcelamento.');

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('.pay-anim', { clearProps: 'all', opacity: 1 });
        return;
      }
      
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: container.current, start: 'top 80%' },
      });

      // Headers (Eyebrow, Titulo, Subtitulo)
      tl.fromTo('.pay-header-anim', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.15 }
      );

      // Card Principal
      tl.fromTo('.pay-main-card',
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8 },
        "-=0.3"
      );

      // Cards Menores
      tl.fromTo('.pay-item',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
        "-=0.5"
      );

      // Footer
      tl.fromTo('.pay-footer-anim',
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
        "-=0.2"
      );

    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="relative py-16 lg:py-20 px-5 md:px-12 lg:px-[60px] mauve-surface overflow-hidden z-10">
      <style>{`
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        .hover-shine::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.6), transparent);
          transform: skewX(-20deg);
          pointer-events: none;
          z-index: 10;
        }
        .hover-shine:hover::after {
          animation: shine 0.6s ease-in-out;
        }
        @keyframes heartbeat {
          0% { transform: scale(1); }
          15% { transform: scale(1.02); }
          30% { transform: scale(1); }
          45% { transform: scale(1.02); }
          70% { transform: scale(1); }
          100% { transform: scale(1); }
        }
        .animate-heartbeat {
          animation: heartbeat 2.5s infinite cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;
        }
      `}</style>

      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-white/40 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/4 pointer-events-none z-0" />
      <div className="absolute top-10 right-10 opacity-10 pointer-events-none z-0 rotate-[15deg]">
        <svg width="200" height="200" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-accent">
          {/* Floral SVG placeholder genérico leve */}
          <path d="M50 100 C50 70 20 60 20 40 C20 20 40 20 50 40 C60 20 80 20 80 40 C80 60 50 70 50 100 Z" />
          <path d="M50 40 C45 30 35 30 35 40 C35 50 50 60 50 60 C50 60 65 50 65 40 C65 30 55 30 50 40 Z" />
        </svg>
      </div>

      <div className="relative z-10 max-w-[1360px] mx-auto w-full flex flex-col">
        
        {/* Cabeçalho */}
        <div className="flex flex-col items-center text-center mb-10 lg:mb-14">
          <span className="pay-header-anim font-sans text-[11px] lg:text-[12px] tracking-[0.25em] text-accent font-bold uppercase mb-3">
            Facilidade no pagamento
          </span>
          
          <div className="pay-header-anim flex items-center justify-center mb-5">
            <span className="w-6 h-px bg-accent/40" />
            <Leaf className="w-3 h-3 text-accent mx-2" />
            <span className="w-6 h-px bg-accent/40" />
          </div>

          <h2 className="pay-header-anim font-drama text-primary leading-[1.1] mb-5" style={{ fontSize: 'clamp(2.5rem, 2vw + 1.5rem, 3.8rem)' }}>
            Pagamento fácil, <br />
            <span className="italic text-accent">do seu jeito.</span>
          </h2>
          
          <p className="pay-header-anim font-sans text-[15px] lg:text-[17px] text-secondary max-w-lg">
            Opções práticas para tornar seu cuidado ainda mais acessível.
          </p>
        </div>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 mb-12 lg:mb-16">
          
          {/* Card Esquerdo (10x) - 45% */}
          <div className="pay-main-card lg:col-span-5 relative w-full min-h-[360px]">
            <div className="animate-heartbeat absolute inset-0 w-full h-full rounded-[28px] overflow-hidden shadow-2xl shadow-[#B86F57]/20 p-8 lg:p-10 flex flex-col justify-center group bg-gradient-to-br from-[#B86F57] to-[#A95F4C]">
              
              {/* Hover Effects */}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              {/* Watermark removed */}

              {/* Removed floral ornament */}

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <Pseudo3DCards />
                  <h3 className="font-drama text-[#FDF9F7] text-[40px] lg:text-[48px] leading-[1.05] mb-4">
                    Parcele em <br />
                    <span className="text-[32px] lg:text-[38px]">até</span> <span className="italic text-[#E9CDB7] text-[44px] lg:text-[52px]">10x</span>
                  </h3>
                  <div className="w-10 h-[2px] bg-[#E9CDB7]/40 mb-6" />
                </div>
                
                <p className="font-sans text-[15px] lg:text-[16px] text-[#FDF9F7]/90 leading-[1.6] max-w-[280px]">
                  Mais flexibilidade para você cuidar de si sem abrir mão do seu planejamento.
                </p>
              </div>
            </div>
          </div>

          {/* Cards Direita (2x2) - 55% */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PAY_METHODS.map((m, idx) => {
              const Icon = m.icon;
              return (
                <div 
                  key={idx} 
                  className="pay-item hover-shine group relative bg-[#FCF8F5] rounded-[24px] border border-[#EBE1DC] p-6 lg:p-7 flex flex-col min-h-[170px] shadow-sm hover:shadow-[0_10px_40px_-10px_rgba(184,111,87,0.3)] hover:-translate-y-[3px] hover:border-[#B86F57]/30 transition-all duration-300 overflow-hidden"
                >
                  <div className="w-12 h-12 rounded-full bg-[#F4E6DF] group-hover:bg-[#EFDFD6] flex items-center justify-center mb-auto transition-colors duration-300">
                    <Icon className="w-[22px] h-[22px] text-accent" strokeWidth={1.5} />
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-drama text-primary text-[20px] lg:text-[22px] leading-snug mb-1">
                      {m.title}
                    </h4>
                    <p className="font-sans text-secondary text-[14px] opacity-80">
                      {m.text}
                    </p>
                    {/* Linha decorativa animada no hover */}
                    <div className="h-[2px] w-0 bg-accent/60 group-hover:w-8 transition-all duration-300 mt-4 rounded-full" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Rodapé da Seção */}
        <div className="flex flex-col items-center text-center">
          <div className="pay-footer-anim mb-4 text-accent/50">
             <Leaf className="w-4 h-4 mx-auto" />
          </div>
          <h4 className="pay-footer-anim font-drama text-primary text-[22px] lg:text-[26px] mb-4">
            Pagamento simples. Seu cuidado em primeiro lugar.
          </h4>
          <p className="pay-footer-anim flex items-center gap-2 font-sans text-[13.5px] lg:text-[14.5px] text-secondary/80 bg-black/5 px-4 py-2 rounded-full mb-8">
            <Info className="w-4 h-4 text-accent" />
            Consulte condições de parcelamento no momento do agendamento.
          </p>
          <a href={WA_LINK} target="_blank" rel="noreferrer" className="pay-footer-anim btn-accent px-10 h-[52px] text-[14px]">
            Quero garantir meu horário
          </a>
        </div>

      </div>
    </section>
  );
};

export default Payments;
