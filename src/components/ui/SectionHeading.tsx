interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: 'left' | 'center';
  tone?: 'dark' | 'light';
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = 'center',
  tone = 'dark',
}: SectionHeadingProps) {
  const alignClasses = align === 'center' ? 'text-center items-center mx-auto' : 'text-left items-start';
  const titleColor = tone === 'dark' ? 'text-brown-dark' : 'text-cream';
  const textColor = tone === 'dark' ? 'text-brown/80' : 'text-cream-light/85';
  const eyebrowColor = tone === 'dark' ? 'text-gold-deep' : 'text-gold';

  return (
    <div className={`flex max-w-2xl flex-col gap-4 ${alignClasses}`}>
      {eyebrow && (
        <span className={`text-xs font-medium uppercase tracking-[0.28em] ${eyebrowColor}`}>
          {eyebrow}
        </span>
      )}
      <h2 className={`text-3xl sm:text-4xl md:text-[2.75rem] leading-[1.15] ${titleColor}`}>
        {title}
      </h2>
      {text && <p className={`text-base sm:text-lg leading-relaxed ${textColor}`}>{text}</p>}
    </div>
  );
}
