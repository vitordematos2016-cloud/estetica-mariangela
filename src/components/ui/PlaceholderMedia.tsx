interface PlaceholderMediaProps {
  label: string;
  description?: string;
  className?: string;
  ratio?: 'square' | 'portrait' | 'landscape' | 'media' | 'fill';
}

const ratioClasses = {
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
  // Área de imagem/vídeo do modal de detalhes: 4:3 no celular, 16:9 a partir
  // do breakpoint sm (mesmo comportamento pedido para a mídia real).
  media: 'aspect-[4/3] sm:aspect-video',
  // Sem proporção própria -- preenche 100% do container pai (usado quando
  // quem chama já define a altura/largura, ex.: `PhotoFrame`).
  fill: '',
};

/**
 * Placeholder neutro reutilizado em todo o site sempre que uma foto/vídeo
 * real ainda não está disponível: fundo branco, contorno cinza muito claro,
 * texto discreto "Imagem será adicionada" -- nunca uma imagem externa ou
 * genérica, nunca um espaço vazio/quebrado. Preserva proporção, borda e
 * arredondamento do espaço reservado, então cards/carrosséis/modais
 * continuam com o mesmo tamanho quando a mídia real for adicionada depois.
 */
export function PlaceholderMedia({
  label,
  description = 'Imagem será adicionada',
  className = '',
  ratio = 'portrait',
}: PlaceholderMediaProps) {
  return (
    <div
      role="img"
      aria-label={`${label}: ${description}`}
      className={`relative flex ${ratioClasses[ratio]} w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-[2.5rem] border border-gold/30 bg-cream text-center shadow-warm-sm ${className}`}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
        className="text-brown/25"
      >
        <rect x="4" y="7" width="32" height="26" rx="3" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="14" cy="16" r="3" stroke="currentColor" strokeWidth="1.2" />
        <path
          d="M6 29l9-9 6 6 5-5 8 8"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="px-8 text-xs font-medium uppercase tracking-[0.14em] text-brown/45">{description}</p>
    </div>
  );
}
