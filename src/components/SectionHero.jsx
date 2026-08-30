import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ChevronRight } from 'lucide-react';

// Hero interno compartilhado pelas páginas de conteúdo (Tratamentos, FAQ, Contato, legais).
// /sobre e as páginas individuais de tratamento têm hero próprio (mais editorial).
const SectionHero = ({ label, titleNormal, titleItalic, subtitle, breadcrumb = [] }) => {
  const container = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('.sh-crumb, .sh-label, .sh-title, .sh-sub', { clearProps: 'all', opacity: 1 });
        return;
      }
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.sh-crumb', { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0)
        .fromTo('.sh-label', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.1)
        .fromTo('.sh-title', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'power4.out' }, 0.25)
        .fromTo('.sh-sub', { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.55);
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="relative pt-[130px] md:pt-[168px] pb-16 md:pb-20 px-6 md:px-12 mauve-surface overflow-hidden">
      <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
        {breadcrumb.length > 0 && (
          <nav className="sh-crumb flex items-center flex-wrap justify-center gap-1.5 font-sans text-[12px] text-secondary mb-8">
            {breadcrumb.map((c, i) => (
              <span key={c.label} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="w-3 h-3" />}
                {c.to ? <Link to={c.to} className="hover:text-accent transition-colors">{c.label}</Link> : <span className="text-secondary">{c.label}</span>}
              </span>
            ))}
          </nav>
        )}
        <span className="sh-label text-micro text-accent mb-6">
          {label}
        </span>
        <h1 className="sh-title font-drama text-primary leading-[1.15] mb-6" style={{ fontSize: 'clamp(2.25rem, 1.7rem + 2.2vw, 3.4rem)' }}>
          {titleNormal} <span className="italic text-accent">{titleItalic}</span>
        </h1>
        {subtitle && (
          <p className="sh-sub text-body-lg text-secondary max-w-xl">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
};

export default SectionHero;
