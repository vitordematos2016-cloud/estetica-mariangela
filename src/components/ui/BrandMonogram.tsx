import { siteContent } from '../../data/siteContent';

interface BrandMonogramProps {
  className?: string;
}

/**
 * Marca provisória, 100% CSS (sem imagem/logo) -- um círculo com a inicial
 * da profissional, usado onde antes havia o logotipo/monograma real (capa de
 * cartão, abertura compacta). Substituir por um `<img>` do logotipo oficial
 * assim que a Mariangela enviar a identidade visual definitiva.
 */
export function BrandMonogram({ className = 'h-8 w-8' }: BrandMonogramProps) {
  const initial = siteContent.brand.professional.trim().charAt(0).toUpperCase() || 'M';
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full border border-gold/60 bg-cream font-heading font-medium text-brown-dark ${className}`}
      style={{ fontSize: '0.85em' }}
    >
      {initial}
    </span>
  );
}
