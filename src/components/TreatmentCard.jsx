import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { buildWaLink } from '../data/business.js';
import useCardTilt from '../hooks/useCardTilt.js';

// Rótulo de categoria (singular, maiúsculo) — única fonte, usada em qualquer card de tratamento do site.
export const CATEGORY_TAG = {
  facial: 'Facial',
  corporal: 'Corporal',
  depilacao: 'Depilação',
};

// CTA único: leva à página própria quando existe; senão, ao WhatsApp — nunca um card "sem ação".
// Café profundo (não marrom) e a seta desloca 5px no hover, conforme o sistema de card do site.
const CardCta = ({ t, className = '' }) => (
  t.hasDetailPage ? (
    <Link to={`/tratamentos/${t.slug}`} className={`inline-flex items-center gap-1.5 font-sans text-[13.5px] font-semibold text-primary border-b border-primary/0 hover:border-primary/40 transition-colors w-fit ${className}`}>
      Conhecer tratamento
      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-[5px]" />
    </Link>
  ) : (
    <a href={buildWaLink(`Olá, Mariangela! Vi as informações sobre ${t.title} no site e gostaria de agendar uma avaliação.`)} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-1.5 font-sans text-[13.5px] font-semibold text-primary border-b border-primary/0 hover:border-primary/40 transition-colors w-fit ${className}`}>
      Consultar pelo WhatsApp
      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-[5px]" />
    </a>
  )
);

// Componente único de card de tratamento, usado em toda a Home ("Tratamentos em destaque")
// e no catálogo completo (/tratamentos) — um só sistema visual: marrom suave (--card), borda
// marrom escura, sombra derivada do café, elevação no hover (ver .card-surface em index.css).
//
// variant="large"   → imagem lateral, editorial, para os 2 tratamentos-destaque principais (alterna lado via `reverse`);
//                     ganha o tilt 3D sutil + reflexo do mouse, reservado aos cards mais importantes.
// variant="compact" → imagem no topo, para os demais destaques da Home e para todo o catálogo.
const TreatmentCard = ({
  t,
  variant = 'compact',
  num,
  title,
  subheadline,
  description,
  reverse = false,
  animClass = '',
  className = '',
}) => {
  const displayNum = num ?? t.num ?? t.catalogNum;
  const displayTitle = title ?? t.featuredTitle ?? t.title;
  const displayDescription = description ?? t.catalogSummary ?? t.featuredDescription ?? t.summary;
  const tilt = useCardTilt(1.5);

  if (variant === 'large') {
    return (
      <div
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        className={`${animClass} card-surface card-surface-tilt group overflow-hidden rounded-[30px] flex flex-col ${
          reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'
        } ${className}`}
      >
        <div className="relative w-full lg:w-[47%] h-[260px] sm:h-[340px] lg:h-auto overflow-hidden shrink-0">
          <img
            src={t.img}
            alt={t.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-[650ms] ease-out group-hover:scale-[1.035]"
          />
        </div>
        <div className="relative flex-1 p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
          <span className="text-micro text-accent mb-4">
            {CATEGORY_TAG[t.category]}
          </span>
          <div className="flex items-center gap-3 mb-5">
            <span className="font-drama italic text-accent text-[30px] leading-none">{displayNum}</span>
            <span className="h-px flex-1 max-w-12 bg-accent/40" />
          </div>
          <h3 className="font-drama text-primary mb-3 leading-[1.12]" style={{ fontSize: 'clamp(32px, 3vw, 42px)' }}>
            {displayTitle}
          </h3>
          {subheadline && (
            <p className="font-drama italic text-accent leading-snug mb-4" style={{ fontSize: 'clamp(17px, 1.4vw, 20px)' }}>
              {subheadline}
            </p>
          )}
          <p className="text-body text-secondary mb-7 max-w-[440px] line-clamp-4">{displayDescription}</p>
          <CardCta t={t} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${animClass} card-surface group overflow-hidden rounded-[28px] flex flex-col h-full ${className}`}
    >
      <div className="relative h-[230px] sm:h-[250px] overflow-hidden shrink-0">
        <img
          src={t.img}
          alt={t.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[650ms] ease-out group-hover:scale-[1.035]"
        />
      </div>
      <div className="relative flex-1 p-6 sm:p-7 flex flex-col">
        <span className="text-micro text-accent mb-3">
          {CATEGORY_TAG[t.category]}
        </span>
        <div className="flex items-center gap-2.5 mb-3">
          <span className="font-drama italic text-accent text-[21px] leading-none">{displayNum}</span>
          <span className="h-px flex-1 max-w-8 bg-accent/30" />
        </div>
        <h3 className="font-drama text-primary mb-2 leading-[1.15]" style={{ fontSize: 'clamp(24px, 2vw, 30px)' }}>
          {displayTitle}
        </h3>
        {subheadline && <p className="font-drama italic text-accent text-[15px] leading-snug mb-2.5">{subheadline}</p>}
        <p className="font-sans text-[13.5px] text-secondary leading-relaxed mb-5 line-clamp-3">{displayDescription}</p>
        <CardCta t={t} className="mt-auto" />
      </div>
    </div>
  );
};

export default TreatmentCard;
