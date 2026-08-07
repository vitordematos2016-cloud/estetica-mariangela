import { PlaceholderMedia } from './PlaceholderMedia';

interface PhotoFrameProps {
  /** Enquanto a foto real não estiver disponível, deixe `src` vazio/ausente
   * -- o quadro mostra `PlaceholderMedia` preenchendo a mesma área (mesma
   * proporção, borda e cantos arredondados), sem quebrar o layout. */
  src?: string;
  alt: string;
  rounded?: string;
  className?: string;
  priority?: boolean;
  aspectClassName?: string;
  imgClassName?: string;
}

/**
 * aspect-[941/1672] é a proporção nativa das fotos originalmente usadas nesta
 * moldura -- mantida aqui para preservar o layout mesmo sem uma foto real
 * ainda. `aspectClassName` permite substituir essa razão quando o container
 * pai já define sua própria largura/altura. `imgClassName` permite trocar
 * `object-cover` por `object-contain` quando a exigência é mostrar a foto
 * inteira, sem corte nenhum (ex.: bloco de mídia da Localização).
 */
export function PhotoFrame({
  src,
  alt,
  rounded = 'rounded-[2rem]',
  className = '',
  priority = false,
  aspectClassName = 'aspect-[941/1672]',
  imgClassName = 'h-full w-full object-cover object-center',
}: PhotoFrameProps) {
  return (
    <div
      className={`${aspectClassName} overflow-hidden border border-gold/45 shadow-warm-sm ${rounded} ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          width={941}
          height={1672}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
          decoding="async"
          className={imgClassName}
        />
      ) : (
        <PlaceholderMedia label={alt} ratio="fill" className="h-full w-full rounded-none border-0" />
      )}
    </div>
  );
}
