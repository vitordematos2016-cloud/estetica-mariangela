import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowUp, Plus, Minus, ArrowRight } from 'lucide-react';
import { buildWaLink, MAPS_DIRECTIONS_URL } from '../data/business.js';

gsap.registerPlugin(ScrollTrigger);

const FAQS_DATA = [
  {
    q: 'Quantas sessões são necessárias?',
    a: 'O número varia conforme o procedimento, as características individuais, os objetivos e a resposta de cada pessoa. A avaliação ajuda a definir o protocolo mais adequado.',
  },
  {
    q: 'Preciso agendar antes?',
    a: 'Sim. Os atendimentos são realizados com agendamento prévio para que cada horário seja reservado de forma adequada.',
  },
  {
    q: 'Como faço meu agendamento?',
    a: 'O agendamento pode ser realizado diretamente pelo WhatsApp. Informe o procedimento desejado e o melhor dia ou período para o atendimento.',
  },
  {
    q: 'Quais formas de pagamento são aceitas?',
    a: 'Aceitamos Pix, dinheiro, cartão de débito e cartão de crédito.',
  },
  {
    q: 'Posso parcelar?',
    a: 'Sim. Há possibilidade de parcelamento em até 10x. Consulte as condições no momento do agendamento.',
  },
  {
    q: 'Onde fica a Estética Mariangela?',
    a: <>Estamos localizados em Guaraniaçu - PR. <a href={MAPS_DIRECTIONS_URL} target="_blank" rel="noreferrer" className="text-accent underline hover:opacity-80 transition-opacity">Ver localização no Google Maps &rarr;</a></>,
  },
  {
    q: 'A drenagem pós-operatória exige liberação?',
    a: 'Em situações pós-operatórias, é importante seguir as orientações do profissional responsável pelo procedimento. Quando necessário, poderá ser solicitada liberação antes do início dos atendimentos.',
  },
  {
    q: 'O número de sessões é igual para todo mundo?',
    a: 'Não. A quantidade pode variar conforme o procedimento, as características individuais, os objetivos e a evolução de cada pessoa. Por isso, a avaliação é importante para orientar o atendimento.',
  },
];

const FaqPreview = () => {
  const container = useRef(null);
  const faqListRef = useRef(null);
  
  // Pergunta 0 começa aberta
  const [openIndex, setOpenIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const WA_LINK = buildWaLink('Olá, Mariangela! Consultei as dúvidas frequentes no site, mas ainda tenho uma dúvida e gostaria da sua ajuda.');

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('.faqp-label, .faqp-title, .faqp-subtitle, .faqp-item, .faqp-more, .faqp-final', { clearProps: 'all', opacity: 1 });
        return;
      }
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: container.current, start: 'top 75%' },
      });
      tl.fromTo('.faqp-label', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
        .fromTo('.faqp-title', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.15)
        .fromTo('.faqp-subtitle', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.3)
        .fromTo('.faqp-item.initial-item', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, 0.4)
        .fromTo('.faqp-more', { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.9)
        .fromTo('.faqp-final', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 }, 1.0);
    }, container);
    return () => ctx.revert();
  }, []);

  const handleToggleMore = () => {
    const willShow = !showAll;
    setShowAll(willShow);

    if (willShow) {
      setTimeout(() => {
        gsap.fromTo('.faqp-item.extra-item', 
          { y: 10, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' }
        );
      }, 0);
    } else {
      if (openIndex > 3) setOpenIndex(-1);
    }
  };

  const visibleFaqs = showAll ? FAQS_DATA : FAQS_DATA.slice(0, 4);

  return (
    <section id="faq" ref={container} className="py-24 lg:py-32 px-6 md:px-12 scroll-mt-[96px] md:scroll-mt-[114px] hero-atmosphere">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        
        <div className="text-center mb-14">
          <span className="faqp-label font-sans text-[11px] lg:text-[12px] tracking-[0.25em] text-accent font-bold uppercase mb-4 block">
            Dúvidas frequentes
          </span>
          <h2 className="faqp-title font-drama text-primary text-[32px] sm:text-[40px] leading-[1.1] mb-5">
            Antes de agendar, <br/>
            <span className="italic text-accent">tire suas dúvidas.</span>
          </h2>
          <p className="faqp-subtitle font-sans text-secondary text-[15px] max-w-sm mx-auto">
            Reunimos aqui as principais informações para você se sentir <strong className="text-primary font-medium">segura e bem orientada</strong> antes do seu atendimento.
          </p>
        </div>

        <div className="w-full flex flex-col gap-4 mb-8" ref={faqListRef}>
          {visibleFaqs.map((item, i) => {
            const isOpen = openIndex === i;
            const numStr = String(i + 1).padStart(2, '0');
            const isExtra = i >= 4;

            return (
              <div 
                key={i} 
                className={`faqp-item ${isExtra ? 'extra-item' : 'initial-item'} mauve-surface rounded-[24px] border border-[#EBE1DC] overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-[0_10px_30px_rgba(184,111,87,0.06)]' : 'shadow-sm'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="w-full flex items-center gap-4 lg:gap-6 px-6 lg:px-8 py-5 lg:py-6 text-left group"
                  aria-expanded={isOpen}
                >
                  <span className="font-drama italic text-accent text-[20px] lg:text-[24px] shrink-0 opacity-80">
                    {numStr}
                  </span>
                  
                  <span className="font-serif text-[17px] sm:text-[19px] text-primary group-hover:text-accent transition-colors flex-1 pr-4">
                    {item.q}
                  </span>
                  
                  <div className="shrink-0 flex items-center justify-center text-accent/80 group-hover:text-accent transition-colors">
                    {isOpen ? <Minus strokeWidth={1.5} className="w-5 h-5" /> : <Plus strokeWidth={1.5} className="w-5 h-5" />}
                  </div>
                </button>
                
                <div
                  className="grid transition-all duration-400 ease-in-out"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <p className="font-sans text-[15px] text-primary/85 leading-[1.7] px-6 lg:px-8 pb-6 lg:pb-8 pt-2 max-w-2xl ml-10 lg:ml-12 border-t border-[#EBE1DC]/40">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Botão Ver Mais / Mostrar Menos */}
        <button
          onClick={handleToggleMore}
          className="faqp-more flex items-center gap-2 px-6 py-2.5 rounded-full border border-accent/40 text-accent font-serif text-[15px] hover:bg-accent/5 transition-colors mb-16"
          aria-expanded={showAll}
        >
          {showAll ? (
            <>Mostrar menos <ArrowUp className="w-4 h-4 ml-1" /></>
          ) : (
            <>Ver mais dúvidas <ArrowDown className="w-4 h-4 ml-1" /></>
          )}
        </button>

        {/* CTA Final */}
        <div className="faqp-final flex flex-col items-center text-center mt-4">
          <div className="w-8 h-px bg-accent/30 mb-6" />
          <h4 className="font-serif text-primary text-[20px] lg:text-[22px] mb-2">
            Ainda ficou com alguma dúvida?
          </h4>
          <p className="font-sans text-secondary text-[14.5px] mb-6">
            Converse diretamente com a Mariangela.
          </p>
          
          <a
            href={WA_LINK}
            target="_blank"
            rel="noreferrer"
            className="btn-accent px-8 h-[50px] text-[14px] group"
          >
            Tirar minha dúvida
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

      </div>
    </section>
  );
};

export default FaqPreview;
