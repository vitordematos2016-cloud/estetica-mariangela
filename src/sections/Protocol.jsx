import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowRight, Leaf } from 'lucide-react';
import WhatsAppIcon from '../components/WhatsAppIcon.jsx';
import { buildWaLink } from '../data/business.js';

const Protocol = () => {
  const container = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Observer para animar os cards no mobile quando rolar sobre eles
    const mobileObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-active');
        } else {
          entry.target.classList.remove('is-active');
        }
      });
    }, { rootMargin: '-30% 0px -30% 0px' }); // Ativa quando o card cruza a área central da tela

    const cards = document.querySelectorAll('.protocol-card');
    if (window.innerWidth < 1024) {
      cards.forEach(card => mobileObserver.observe(card));
    }

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('.proto-anim', { clearProps: 'all', opacity: 1 });
        return;
      }
      
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: container.current, start: 'top 75%' },
      });
      
      tl.fromTo('.proto-label', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
        .fromTo('.proto-headline', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.4')
        .fromTo('.proto-text', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.5')
        .fromTo('.proto-card', { y: 30, opacity: 0, scale: 0.985 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, clearProps: 'transform' }, '-=0.4')
        .fromTo('.proto-cta', { y: 20, opacity: 0, scale: 0.985 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, clearProps: 'transform' }, '-=0.4')
        .fromTo('.proto-watermark', { opacity: 0 }, { opacity: 0.06, duration: 1.5 }, '-=0.8');
    }, container);
    
    return () => {
      ctx.revert();
      mobileObserver.disconnect();
    };
  }, []);

  const categories = [
    {
      id: 'facial',
      number: '01',
      label: 'FACIAL',
      title: 'Cuidados para a pele',
      subtext: '6 tratamentos',
      cta: 'Ver todos os tratamentos',
      img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop',
      mt: 'md:mt-0'
    },
    {
      id: 'corporal',
      number: '02',
      label: 'CORPORAL',
      title: 'Bem-estar e cuidados corporais',
      subtext: '9 tratamentos',
      cta: 'Ver todos os tratamentos',
      img: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=800&auto=format&fit=crop',
      mt: 'md:-mt-4' // Desnível solicitado
    },
    {
      id: 'depilacao',
      number: '03',
      label: 'DEPILAÇÃO',
      title: 'Laser Hakon 4D',
      subtext: 'Redução progressiva dos pelos',
      cta: 'Ver todos os tratamentos',
      img: '/capa-laser-hakon-4d.png',
      mt: 'md:mt-0'
    }
  ];

  return (
    <section id="especialidades" ref={container} className="relative py-28 lg:py-40 px-6 md:px-12 overflow-hidden bg-mauve" style={{ backgroundImage: 'radial-gradient(ellipse 120% 70% at 50% 0%, rgba(255, 255, 255, 0.12), transparent 60%)' }}>
      
      {/* Marca d'água */}
      <img 
        src="/logo-perfil.png" 
        alt="Marca d'água Mariangela"
        className="proto-watermark absolute top-10 -right-[5%] w-[400px] h-[400px] lg:w-[600px] lg:h-[600px] mix-blend-multiply pointer-events-none object-contain"
        style={{ opacity: 0 }}
      />

      {/* Line Art Botânicos */}
      <Leaf className="absolute bottom-12 right-12 w-20 h-20 text-brown-dark rotate-[150deg] pointer-events-none opacity-[0.12]" strokeWidth={0.5} />
      <Leaf className="absolute top-20 left-10 w-16 h-16 text-brown-dark rotate-[-25deg] pointer-events-none hidden lg:block opacity-[0.12]" strokeWidth={0.5} />

      <div className="container-global relative z-10 flex flex-col items-center">
        
        {/* Cabeçalho Editorial */}
        <div className="text-center md:text-left md:self-start w-full max-w-3xl mb-16 lg:mb-24 flex flex-col">
          <div className="proto-label flex items-center justify-center md:justify-start gap-3 mb-6">
            <span className="text-[11px] font-sans font-bold tracking-[0.25em] text-coffee-deep uppercase">TRATAMENTOS</span>
            <span className="h-[1px] w-12 bg-coffee-deep/40" />
          </div>
          
          <h2 className="proto-headline flex flex-col mb-6">
            <span className="font-drama text-[36px] md:text-[46px] lg:text-[52px] leading-tight text-coffee-deep">
              Cuidados para diferentes
            </span>
            <span className="font-drama text-[36px] md:text-[46px] lg:text-[52px] leading-tight italic text-coffee-light">
              momentos e necessidades.
            </span>
          </h2>
          
          <p className="proto-text font-sans text-[16px] md:text-[18px] text-coffee-deep/80 max-w-xl leading-relaxed">
            Conheça os cuidados oferecidos pela Mariangela e encontre a categoria que mais combina com o que você procura.
          </p>
        </div>

        {/* 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full relative z-20">
          {categories.map((cat) => (
            <Link 
              key={cat.id}
              to={`/tratamentos?cat=${cat.id}`} 
              className={`proto-card group protocol-card flex flex-col relative overflow-hidden w-full h-[460px] lg:h-[490px] ${cat.mt}`}
            >
              {/* Imagem Superior */}
              <div className="h-[55%] w-full relative overflow-hidden shrink-0">
                <img 
                  src={cat.img} 
                  alt={cat.title} 
                  className="w-full h-full object-cover transition-transform duration-[800ms] group-hover:scale-[1.05] group-[.is-active]:scale-[1.05]"
                />
                {/* Degradê apenas na borda inferior da foto (35% da altura) para fundir sem manchar o topo */}
                <div className="absolute bottom-0 left-0 w-full h-[35%] bg-gradient-to-t from-[#594741] to-transparent" />
              </div>
              
              {/* Símbolo decorativo logo (Flutuando entre a imagem e o fundo) */}
              <div className="absolute right-6 top-[48%] -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 bg-[#654E46]/60 backdrop-blur-md flex items-center justify-center z-20 transition-transform duration-500 group-hover:scale-110 group-[.is-active]:scale-110 shadow-lg">
                <Leaf className="w-5 h-5 text-white-warm opacity-90" strokeWidth={1} />
              </div>
              
              {/* Conteúdo Inferior (Fundo Marrom Escuro) */}
              <div className="flex flex-col flex-1 px-8 pb-8 pt-4 z-10 bg-[#594741] relative">
                <div className="mb-2">
                  <span className="font-sans text-[11px] font-bold tracking-[0.2em] text-[#B79F98] uppercase">
                    {cat.number} — {cat.label}
                  </span>
                </div>
                
                <h3 className="font-drama text-white-warm text-[28px] md:text-[32px] lg:text-[34px] leading-tight mb-2 pr-2 transition-colors group-hover:text-white group-[.is-active]:text-white">{cat.title}</h3>
                
                <p className="font-sans text-white-warm/80 text-[14px]">
                  {cat.subtext}
                </p>
                
                <div className="mt-auto pt-5 border-t border-white-warm/10 flex items-center justify-between text-white-warm font-sans font-medium text-[14px] group-hover:text-[#B79F98] group-[.is-active]:text-[#B79F98] transition-all duration-300">
                  <span>{cat.cta}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 group-[.is-active]:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Final CTA */}
        <div className="mt-20 lg:mt-24 proto-cta relative z-20">
          <a
            href={buildWaLink('Olá, Mariangela! Gostaria de falar sobre os tratamentos e entender qual é o mais indicado para mim.')}
            target="_blank"
            rel="noreferrer"
            className="protocol-cta inline-flex items-center justify-center gap-2 text-[15px] md:text-[16px] font-semibold h-[60px] md:h-[64px] px-10 md:px-12"
          >
            <WhatsAppIcon className="w-5 h-5" />
            Falar com a Mariangela pelo WhatsApp
          </a>
        </div>

      </div>
    </section>
  );
};

export default Protocol;
