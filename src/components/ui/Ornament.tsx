import type { ReactNode } from 'react';

const sizeClasses = {
  md: 'h-20 w-20 sm:h-24 sm:w-24',
  sm: 'h-14 w-14 sm:h-16 sm:w-16',
  xs: 'h-10 w-10',
} as const;

interface OrnamentProps {
  mirror?: boolean;
  size?: keyof typeof sizeClasses;
  className?: string;
  /** Conteúdo central opcional (ex.: número de uma etapa). Sem isso, mantém
   * o pontinho dourado original do medalhão. */
  children?: ReactNode;
}

/** Medalhão decorativo (anel sólido + anel tracejado) usado como assinatura
 * visual em várias seções — origem em Purpose, hoje também em HowItWorks. */
export function Ornament({ mirror = false, size = 'md', className = '', children }: OrnamentProps) {
  return (
    <div
      aria-hidden="true"
      className={`relative ${sizeClasses[size]} ${mirror ? 'scale-x-[-1]' : ''} ${className}`}
    >
      <div className="absolute inset-0 rounded-full border border-gold/25" />
      <div className="absolute inset-3 rounded-full border border-dashed border-gold/30" />
      {children ? (
        <span
          className={`absolute inset-0 flex items-center justify-center ${mirror ? 'scale-x-[-1]' : ''}`}
        >
          {children}
        </span>
      ) : (
        <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/50" />
      )}
    </div>
  );
}
