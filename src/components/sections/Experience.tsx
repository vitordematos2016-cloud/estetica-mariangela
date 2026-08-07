import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { siteContent } from '../../data/siteContent';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { PhotoFrame } from '../ui/PhotoFrame';
import { Reveal, RevealGroup, RevealItem } from '../motion/reveal';
import { EASE_OUT } from '../motion/variants';
import { useMobileViewportActive } from '../../hooks/useMobileViewportActive';
import { mobileCardTransition, mobileCardVariants } from '../motion/mobileActive';

/**
 * Um "conjunto" completo (foto + título opcional + descrição), tratado como
 * uma única unidade de interação: passar o mouse ou tocar em qualquer parte
 * dele (foto ou texto) reage no conjunto inteiro, de forma coordenada.
 *  - `group-hover:`/`motion-safe:group-hover:` (Tailwind) só disparam em
 *    ponteiros com hover real — Tailwind v4 já compila `hover`/`group-hover`
 *    dentro de `@media (hover: hover)`, então nunca ficam presos em toque.
 *  - `group-active:` cobre toque e clique nos dois, sempre solta ao soltar.
 *  - `whileTap` do Motion comprime o conjunto inteiro; é neutralizado
 *    automaticamente pelo MotionConfig reducedMotion="user" global (só
 *    afeta valores de transform, por isso o deslocamento do título usa
 *    `motion-safe:` em paralelo — cor, sombra e borda continuam podendo
 *    mudar, só que instantâneas, via a regra global de reduced-motion já
 *    existente em index.css).
 *
 * Abaixo de 768px, um wrapper externo com `useMobileViewportActive` recua o
 * conjunto fora da região central da tela e devolve presença total ao
 * cruzá-la; `data-mobile-active` no `.group` reaproveita as mesmas classes
 * `group-hover:`/`group-active:` já existentes (via a variante
 * `group-data-[mobile-active=true]:`), então o efeito mobile é visualmente
 * idêntico ao hover, só acionado pela rolagem em vez do ponteiro.
 */
function ExperienceSet({
  image,
  alt,
  title,
  titleLabel,
  text,
}: {
  image?: string;
  alt: string;
  title?: ReactNode;
  /** Nome acessível do título quando `title` não é um texto simples (ex.:
   * quebrado em duas linhas com spans) -- garante que leitores de tela
   * continuem anunciando a frase completa, independente da marcação visual. */
  titleLabel?: string;
  text: string;
}) {
  const { ref, active, isMobileViewport } = useMobileViewportActive<HTMLDivElement>();

  return (
    <motion.div
      ref={ref}
      variants={mobileCardVariants}
      initial={false}
      animate={isMobileViewport ? (active ? 'active' : 'rest') : undefined}
      transition={mobileCardTransition}
    >
      <motion.div
        data-mobile-active={isMobileViewport ? active : undefined}
        className="group relative flex flex-col items-center gap-6 text-center"
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.15, ease: EASE_OUT }}
      >
        <div className="relative mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-none">
          <div
            aria-hidden="true"
            className="absolute inset-0 -translate-x-2 translate-y-2 rounded-[2rem] bg-beige/40"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-3 rounded-[2.5rem] bg-gold/10 opacity-60 blur-2xl transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100 group-data-[mobile-active=true]:opacity-100"
          />
          <PhotoFrame
            src={image}
            alt={alt}
            className="relative w-full transition-shadow duration-300 group-hover:border-gold/70 group-hover:shadow-warm group-active:border-gold/70 group-active:shadow-warm group-data-[mobile-active=true]:border-gold/70 group-data-[mobile-active=true]:shadow-warm"
          />
        </div>

        <div className="flex flex-col items-center gap-3">
          {title && (
            <div className="flex flex-col items-center gap-1.5 transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-data-[mobile-active=true]:-translate-y-0.5">
              <h3
                aria-label={titleLabel}
                className="flex min-h-[3.75rem] flex-col items-center justify-center text-2xl leading-tight text-brown-dark transition-colors duration-300 group-hover:text-gold group-active:text-gold group-data-[mobile-active=true]:text-gold sm:min-h-[4.5rem] sm:text-3xl"
              >
                {title}
              </h3>
              <span
                aria-hidden="true"
                className="h-px w-10 bg-gold/50 transition-all duration-300 group-hover:w-16 group-active:w-16 group-data-[mobile-active=true]:w-16"
              />
            </div>
          )}
          <p className="max-w-sm text-base leading-relaxed text-brown/75 transition-colors duration-300 group-hover:text-brown-dark group-active:text-brown-dark group-data-[mobile-active=true]:text-brown-dark sm:text-lg">
            {text}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Experience() {
  const { experience, brand } = siteContent;
  const [salaBlock, salaSecundariaBlock] = experience.additionalBlocks;

  const additionalPhotos = [
    salaSecundariaBlock && {
      block: salaSecundariaBlock,
      alt: `Sala de atendimento da ${brand.name}`,
    },
    salaBlock && {
      block: salaBlock,
      alt: `Sala de atendimento da ${brand.name}`,
    },
  ].filter((entry): entry is { block: (typeof experience.additionalBlocks)[number]; alt: string } => !!entry);

  return (
    <section id="experiencia" className="relative overflow-hidden bg-cream-light/40 py-24 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(167, 136, 127, 0.08),transparent_60%)]"
      />

      <Container className="relative flex flex-col gap-16">
        <Reveal>
          <SectionHeading eyebrow="Experiência" title={experience.title} />
        </Reveal>

        <RevealGroup
          stagger={0.12}
          className="grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12"
        >
          <RevealItem>
            <ExperienceSet
              alt={`Corredor de espera da ${brand.name}`}
              title={
                <>
                  <span className="block">Ambiente</span>
                  <span className="block">acolhedor</span>
                </>
              }
              titleLabel="Ambiente acolhedor"
              text={experience.text}
            />
          </RevealItem>

          {additionalPhotos.map(({ block, alt }) => (
            <RevealItem key={block.title}>
              <ExperienceSet alt={alt} title={block.title} text={block.text} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
