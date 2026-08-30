import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import BrandMark from '../components/BrandMark.jsx';
import WhatsAppIcon from '../components/WhatsAppIcon.jsx';
import { buildWaLink } from '../data/business.js';

const FinalCta = () => {
  const container = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('.fcta-mark, .fcta-title, .fcta-sub, .fcta-btn', { clearProps: 'all', opacity: 1 });
        return;
      }
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: container.current, start: 'top 78%' },
      });
      tl.fromTo('.fcta-mark', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.9 })
        .fromTo('.fcta-title', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, 0.2)
        .fromTo('.fcta-sub', { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.45)
        .fromTo('.fcta-btn', { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.65);
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="relative py-28 lg:py-36 px-6 md:px-12 bg-primary overflow-hidden">
      <BrandMark className="absolute -bottom-16 -right-10 w-[280px] h-[280px] lg:w-[380px] lg:h-[380px] text-white opacity-[0.05] pointer-events-none" />

      <div className="max-w-2xl mx-auto text-center relative z-10 flex flex-col items-center">
        <BrandMark className="fcta-mark w-9 h-9 text-accent-light mb-8" />
        <h2 className="fcta-title font-drama italic text-white-warm text-[32px] sm:text-[42px] lg:text-[50px] leading-[1.15] mb-5">
          Será um prazer <span className="text-accent-light">cuidar de você.</span>
        </h2>
        <p className="fcta-sub font-sans text-background/70 text-[16px] lg:text-[17px] leading-relaxed mb-10 max-w-md">
          Seu momento de autocuidado começa com uma mensagem. Agende diretamente pelo WhatsApp.
        </p>
        <a
          href={buildWaLink('Olá, Mariangela! Visitei o site e gostaria de agendar um horário.')}
          target="_blank"
          rel="noreferrer"
          className="fcta-btn btn-accent h-[58px] px-9"
        >
          <WhatsAppIcon className="w-[18px] h-[18px]" />
          Agendar atendimento
        </a>
      </div>
    </section>
  );
};

export default FinalCta;
