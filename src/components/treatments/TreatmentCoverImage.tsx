import { useState } from 'react';
import { PlaceholderMedia } from '../ui/PlaceholderMedia';

interface TreatmentCoverImageProps {
  treatmentId: string;
  coverImage?: string;
  label: string;
  className?: string;
  priority?: boolean;
}

/**
 * Capa oficial real do tratamento -- preenche por completo o contêiner do
 * chamador (posicionamento absoluto, `inset-0`), que é quem define a
 * proporção/altura do card. Some quando `coverImage` existir; se estiver
 * ausente ou falhar ao carregar, cai de volta para um placeholder neutro
 * (nunca ícone quebrado, nunca espaço vazio). Exclusivo dos cards -- mídias
 * reais de procedimento/antes-depois continuam vindo só de
 * `media`/`beforeAfter` dentro do modal.
 *
 * TODO: quando as capas oficiais da Mariangela chegarem, calibrar aqui um
 * `object-position` por tratamento se a composição da arte concentrar o
 * elemento principal fora do centro (hoje usa `center` para todos).
 */
export function TreatmentCoverImage({
  treatmentId: _treatmentId,
  coverImage,
  label,
  className = '',
  priority = false,
}: TreatmentCoverImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!coverImage || failed) {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden">
        <PlaceholderMedia label={label} ratio="fill" className="h-full rounded-none border-0" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-gradient-to-br from-cream-light via-cream to-beige/50">
      <img
        src={coverImage}
        alt={label}
        width={640}
        height={800}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : undefined}
        onLoad={() => setLoaded(true)}
        onError={() => {
          console.warn(`Capa não encontrada ou falhou ao carregar: ${coverImage} (${label})`);
          setFailed(true);
        }}
        className={`h-full w-full object-cover object-center transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
      />
    </div>
  );
}
