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
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('.proto-anim', { clearProps: 'all', opacity: 1 });
        return;
      }
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: container.current, start: 'top 75%' },
      });
      tl.fromTo('.proto-anim-text', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.15 })
        .fromTo('.proto-anim-card', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.15, clearProps: 'transform' }, '-=0.4');
    }, container);
    return () => ctx.revert();
  }, []);

  const categories = [
    {
      id: 'facial',
      title: 'FACIAL',
      desc: 'Tecnologias e cuidados avançados para uma pele saudável, firme e iluminada.',
      img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'corporal',
      title: 'CORPORAL',
      desc: 'Protocolos que modelam, promovem bem-estar e valorizam o cuidado com o corpo.',
      img: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'laser',
      title: 'DEPILAÇÃO A LASER',
      desc: 'Mais conforto, praticidade e pele lisa por muito mais tempo.',
      img: 'https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=800&auto=format&fit=crop'
    }
  ];

  return (
    <section id="especialidades" ref={container} className="mauve-surface relative py-28 lg:py-40 px-6 md:px-12 overflow-hidden">
      
      {/* Marca d'água */}
      <img 
        src="/logo-perfil.png" 
        alt="Marca d'água Mariangela"
        className="absolute -top-12 right-[2%] w-[300px] h-[300px] lg:w-[420px] lg:h-[420px] opacity-[0.04] mix-blend-multiply pointer-events-none object-contain"
      />

      {/* Botânicos */}
      <Leaf className="absolute bottom-10 right-8 w-16 h-16 text-secondary rotate-[150deg] pointer-events-none opacity-50" strokeWidth={0.5} />
      <Leaf className="absolute top-24 left-4 w-12 h-12 text-secondary rotate-[-25deg] pointer-events-none hidden lg:block opacity-50" strokeWidth={0.5} />

      <div className="max-w-[1360px] mx-auto relative z-10">
        
        {/* Cabeçalho */}
        <div className="text-center mb-16 lg:mb-20 flex flex-col items-center">
          <div className="proto-anim-text flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-primary/30" />
            <span className="text-micro text-primary">Nossas Especialidades</span>
            <span className="h-px w-8 bg-primary/30" />
          </div>
          <h2 className="proto-anim-text flex flex-col items-center mb-6">
            <span className="text-h2 text-primary">
              Procedimentos <span className="text-gradient-warm font-semibold">exclusivos</span>
            </span>
            <span className="font-drama italic text-accent mt-1" style={{ fontSize: 'clamp(2.5rem, 2.1rem + 2vw, 3.6rem)' }}>
              para o seu bem-estar.
            </span>
          </h2>
          <p className="proto-anim-text text-body-lg text-secondary max-w-2xl">
            Descubra nossas três grandes áreas de atuação. Cada procedimento é definido de forma <span className="text-primary font-semibold">individualizada</span>, respeitando as necessidades do seu <span className="highlight-accent">corpo</span> e da sua <span className="highlight-accent">pele</span>.
          </p>
        </div>

        {/* 3 Cards de Categoria */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((cat) => (
            <Link 
              key={cat.id}
              to={`/tratamentos?cat=${cat.id}`} 
              className="proto-anim-card group card-surface rounded-[28px] md:rounded-[36px] overflow-hidden flex flex-col border border-accent/20 hover:-translate-y-2 transition-transform duration-500"
            >
              <div className="h-56 sm:h-64 w-full relative overflow-hidden shrink-0">
                <img 
                  src={cat.img} 
                  alt={cat.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-80" />
              </div>
              <div className="p-8 flex flex-col flex-1 bg-background/50 text-center items-center">
                <h3 className="font-drama text-primary text-[26px] md:text-[28px] font-semibold tracking-wide mb-3">{cat.title}</h3>
                <p className="font-sans text-secondary text-[14.5px] leading-relaxed mb-8 opacity-90">
                  {cat.desc}
                </p>
                <div className="mt-auto flex items-center gap-2 text-accent font-semibold text-[13px] uppercase tracking-widest group-hover:text-primary transition-colors">
                  Ver tratamentos
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Chamada para Ação (CTA) */}
        <div className="mt-14 lg:mt-20 flex justify-center">
          <a
            href={buildWaLink('Olá, Mariangela! Estava conhecendo os tratamentos pelo site e gostaria de agendar uma avaliação para entender qual procedimento é mais indicado para mim.')}
            target="_blank"
            rel="noreferrer"
            className="proto-anim-card btn-accent btn-glow inline-flex items-center justify-center gap-2 text-[15px] h-[54px] md:h-[58px] px-8 md:px-10"
          >
            <WhatsAppIcon className="w-[18px] h-[18px]" />
            Falar com especialista
          </a>
        </div>

      </div>
    </section>
  );
};

export default Protocol;
