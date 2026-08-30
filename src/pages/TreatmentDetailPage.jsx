import { useEffect, useRef, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { ChevronRight, CheckCircle2, Plus, ArrowRight, AlertCircle } from 'lucide-react';
import useSeo from '../hooks/useSeo.js';
import WhatsAppIcon from '../components/WhatsAppIcon.jsx';
import { buildWaLink } from '../data/business.js';
import { getTreatmentBySlug } from '../data/treatments.js';
import { TREATMENT_DETAILS } from '../data/treatmentDetails.js';
import { FAQS } from '../data/faqs.js';

const TreatmentDetailPage = () => {
  const { slug } = useParams();
  const container = useRef(null);
  const [openFaq, setOpenFaq] = useState(0);

  const treatment = getTreatmentBySlug(slug);
  const detail = TREATMENT_DETAILS[slug];

  useSeo({
    title: treatment ? treatment.title : 'Tratamento',
    description: treatment?.summary,
    path: `/tratamentos/${slug}`,
    image: treatment?.img,
  });

  useEffect(() => {
    if (!treatment || !detail) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('.td-hero-photo, .td-hero-text, .td-block', { clearProps: 'all', opacity: 1 });
        return;
      }
      gsap.fromTo('.td-hero-photo', { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 1.3, ease: 'power2.out' });
      gsap.fromTo('.td-hero-text', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, delay: 0.2, ease: 'power3.out' });
      gsap.utils.toArray('.td-block').forEach((el) => {
        gsap.fromTo(el, { y: 24, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 80%' },
        });
      });
    }, container);
    return () => ctx.revert();
  }, [treatment, detail]);

  if (!treatment || !treatment.hasDetailPage || !detail) {
    return <Navigate to="/tratamentos" replace />;
  }

  const Icon = treatment.icon;
  const photoRight = detail.layoutVariant === 'photo-right';
  const relatedFaqs = detail.relatedFaqIndices.map((i) => FAQS[i]).filter(Boolean);

  return (
    <div ref={container}>
      {/* Hero específico */}
      <section className={`relative pt-[110px] md:pt-[130px] pb-16 lg:pb-24 px-6 md:px-12 mauve-surface overflow-hidden`}>
        <div className={`max-w-6xl mx-auto flex flex-col ${photoRight ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-10 lg:gap-16`}>
          <div className="td-hero-photo w-full lg:w-[48%] relative aspect-[4/3] overflow-hidden shadow-[0_35px_70px_-35px_rgba(74,51,44,0.4)]" style={{ borderRadius: photoRight ? '120px 24px 120px 24px' : '24px 120px 24px 120px' }}>
            <img src={treatment.img} alt={treatment.title} className="w-full h-full object-cover" />
          </div>
          <div className="td-hero-text w-full lg:w-[52%]">
            <nav className="flex items-center flex-wrap gap-1.5 font-sans text-[12px] text-secondary mb-7">
              <Link to="/" className="hover:text-accent transition-colors">Início</Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/tratamentos" className="hover:text-accent transition-colors">Tratamentos</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-secondary">{treatment.title}</span>
            </nav>
            <Icon className="w-9 h-9 text-accent mb-6" strokeWidth={1.3} />
            <h1 className="font-drama text-primary text-[30px] sm:text-[38px] lg:text-[44px] leading-[1.15] mb-5">{treatment.title}</h1>
            <p className="font-sans text-[16px] lg:text-[17px] text-secondary leading-relaxed max-w-md mb-8">{treatment.summary}</p>
            <a
              href={buildWaLink(`Olá, Mariangela! Vi o ${treatment.title} no seu site e gostaria de saber mais sobre o procedimento e verificar horários disponíveis.`)}
              target="_blank"
              rel="noreferrer"
              className="btn-accent h-[54px]"
            >
              <WhatsAppIcon className="w-[16px] h-[16px]" />
              Agendar atendimento
            </a>
          </div>
        </div>
      </section>

      {/* Explicação */}
      <section className="td-block py-16 lg:py-20 px-6 md:px-12 mauve-surface">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-micro text-accent mb-5 block">Como funciona</span>
          <p className="font-drama text-primary text-[22px] sm:text-[26px] leading-snug mb-4">{detail.explanation}</p>
          <p className="font-sans text-[15px] text-secondary leading-relaxed">{detail.howItWorks}</p>
        </div>
      </section>

      {/* Benefícios / objetivos / fatores */}
      <section className="td-block py-16 lg:py-24 px-6 md:px-12 bg-background">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-drama text-primary text-[22px] sm:text-[26px] mb-8 text-center">{detail.highlightsLabel}</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {detail.highlights.map((h) => (
              <li key={h} className="card-surface flex items-start gap-3 font-sans text-[14.5px] text-secondary leading-snug rounded-[16px] p-4">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" strokeWidth={1.5} />
                {h}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Cuidados / atenção */}
      <section className="td-block py-14 px-6 md:px-12 bg-background">
        <div
          className="card-surface max-w-2xl mx-auto rounded-[24px] p-8 flex items-start gap-4"
          style={detail.careNotesEmphasis ? { borderColor: 'rgba(89,71,65,0.85)' } : undefined}
        >
          <AlertCircle className={`w-5 h-5 shrink-0 mt-0.5 ${detail.careNotesEmphasis ? 'text-primary' : 'text-accent'}`} strokeWidth={1.5} />
          <p className={`font-sans text-[14.5px] leading-relaxed ${detail.careNotesEmphasis ? 'text-primary font-medium' : 'text-secondary'}`}>{detail.careNotes}</p>
        </div>
      </section>

      {/* FAQ relacionado */}
      {relatedFaqs.length > 0 && (
        <section className="td-block py-16 lg:py-20 px-6 md:px-12 mauve-surface">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-drama text-primary text-[22px] sm:text-[26px] mb-8 text-center">Perguntas frequentes</h2>
            <div className="flex flex-col gap-3">
              {relatedFaqs.map((item, i) => {
                const isOpen = openFaq === i;
                return (
                  <div key={item.q} className={`card-surface rounded-[18px] ${isOpen ? 'card-surface-open' : ''}`}>
                    <button onClick={() => setOpenFaq(isOpen ? -1 : i)} className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group">
                      <span className="font-drama text-[16px] text-primary group-hover:text-accent transition-colors">{item.q}</span>
                      <Plus className={`w-4 h-4 text-accent shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
                    </button>
                    <div className="grid transition-all duration-300" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
                      <div className="overflow-hidden">
                        <p className="font-sans text-[14px] text-secondary leading-relaxed px-6 pb-5">{item.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="td-block py-20 lg:py-24 px-6 md:px-12 bg-background text-center flex flex-col items-center">
        <p className="font-drama italic text-primary text-[22px] sm:text-[26px] mb-8 max-w-md">
          Vamos conversar sobre o que é melhor para você.
        </p>
        <a
          href={buildWaLink(`Olá, Mariangela! Vi o ${treatment.title} no seu site e gostaria de saber mais sobre o procedimento e verificar horários disponíveis.`)}
          target="_blank"
          rel="noreferrer"
          className="btn-accent h-[56px] px-8"
        >
          <WhatsAppIcon className="w-[18px] h-[18px]" />
          Agendar atendimento
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </a>
      </section>
    </div>
  );
};

export default TreatmentDetailPage;
