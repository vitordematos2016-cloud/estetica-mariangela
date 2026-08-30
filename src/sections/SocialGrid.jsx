import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { SOCIAL } from '../data/business.js';

gsap.registerPlugin(ScrollTrigger);

const InstagramIcon = ({ className = '', strokeWidth = 1.5 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M16.5 7.5v.01" />
  </svg>
);

const HeartIcon = ({ className = '', style }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className} style={style}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const LikeIcon = ({ className = '', style }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className} style={style}>
    <path d="M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
  </svg>
);

const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-[28px]">
      <style>{`
        @keyframes insta-float {
          0% { transform: translateY(50px) scale(0.6) rotate(-15deg); opacity: 0; }
          15% { opacity: 0.6; transform: translateY(0px) scale(1) rotate(10deg); }
          50% { opacity: 0.6; transform: translateY(-120px) scale(1.1) rotate(-10deg); }
          85% { opacity: 0; transform: translateY(-240px) scale(0.8) rotate(15deg); }
          100% { transform: translateY(-300px) scale(0.6); opacity: 0; }
        }
        .insta-particle {
          position: absolute;
          animation: insta-float 5s linear infinite;
          color: rgba(184, 111, 87, 0.25);
        }
      `}</style>
      <HeartIcon className="insta-particle w-6 h-6 bottom-[-30px] left-[5%]" style={{ animationDelay: '0s' }} />
      <LikeIcon className="insta-particle w-5 h-5 bottom-[-30px] left-[20%]" style={{ animationDelay: '1.2s' }} />
      <HeartIcon className="insta-particle w-7 h-7 bottom-[-30px] left-[35%]" style={{ animationDelay: '2.4s', color: 'rgba(184, 111, 87, 0.15)' }} />
      <HeartIcon className="insta-particle w-4 h-4 bottom-[-30px] left-[50%]" style={{ animationDelay: '0.8s' }} />
      <LikeIcon className="insta-particle w-6 h-6 bottom-[-30px] left-[65%]" style={{ animationDelay: '3.1s' }} />
      <HeartIcon className="insta-particle w-5 h-5 bottom-[-30px] left-[80%]" style={{ animationDelay: '1.8s', color: 'rgba(184, 111, 87, 0.3)' }} />
      <HeartIcon className="insta-particle w-4 h-4 bottom-[-30px] left-[95%]" style={{ animationDelay: '3.8s' }} />
      
      <HeartIcon className="insta-particle w-4 h-4 bottom-[-30px] left-[12%]" style={{ animationDelay: '2.1s', animationDuration: '6s' }} />
      <HeartIcon className="insta-particle w-5 h-5 bottom-[-30px] left-[28%]" style={{ animationDelay: '0.4s', animationDuration: '5.5s', color: 'rgba(184, 111, 87, 0.2)' }} />
      <LikeIcon className="insta-particle w-4 h-4 bottom-[-30px] left-[42%]" style={{ animationDelay: '1.6s', animationDuration: '5.2s' }} />
      <HeartIcon className="insta-particle w-6 h-6 bottom-[-30px] left-[58%]" style={{ animationDelay: '2.9s', animationDuration: '5.8s' }} />
      <LikeIcon className="insta-particle w-5 h-5 bottom-[-30px] left-[75%]" style={{ animationDelay: '0.9s', animationDuration: '5.3s' }} />
      <HeartIcon className="insta-particle w-5 h-5 bottom-[-30px] left-[88%]" style={{ animationDelay: '2.6s', animationDuration: '6.2s', color: 'rgba(184, 111, 87, 0.2)' }} />
    </div>
  );
};

const SocialGrid = () => {
  const instaRef = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('.insta-anim, .insta-card-anim', { clearProps: 'all', opacity: 1 });
        return;
      }
      
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
    <section ref={instaRef} className="py-20 lg:py-28 px-6 md:px-12 hero-atmosphere flex flex-col items-center overflow-hidden">
      
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
        <FloatingParticles />

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
              <strong className="text-primary font-medium">Cuidados, novidades e um pouco do dia a dia</strong> da Mariangela.
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
  );
};

export default SocialGrid;
