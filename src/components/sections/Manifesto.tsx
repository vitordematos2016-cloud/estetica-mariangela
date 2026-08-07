import { siteContent } from '../../data/siteContent';
import { Container } from '../ui/Container';
import { Ornament } from '../ui/Ornament';
import { RevealGroup, RevealItem } from '../motion/reveal';

// Sem texto de manifesto confirmado ainda -- seção oculta até que a
// Mariangela confirme um texto oficial (ver docs/PENDENCIAS_CLIENTE.md).
// O componente continua pronto para voltar, sem precisar de novo código.
const MANIFESTO_CONFIRMED = false;

export function Manifesto() {
  const { manifesto } = siteContent;

  if (!MANIFESTO_CONFIRMED) return null;

  return (
    <section className="relative overflow-hidden py-24 sm:py-32 lg:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(167, 136, 127, 0.08),transparent_62%)]"
      />

      <Container className="relative">
        <RevealGroup stagger={0.14} className="mx-auto flex max-w-2xl flex-col items-center gap-8 text-center">
          <RevealItem>
            <Ornament size="xs" />
          </RevealItem>

          <RevealItem className="flex flex-col items-center gap-3">
            <h2 className="text-3xl leading-[1.3] text-brown-dark sm:text-4xl md:text-[2.6rem]">
              {manifesto.title}
            </h2>
            <span
              aria-hidden="true"
              className="h-px w-14 bg-gradient-to-r from-transparent via-gold/60 to-transparent"
            />
          </RevealItem>

          <RevealItem>
            <p className="mx-auto max-w-xl text-base italic leading-relaxed text-brown/70 sm:text-lg">
              {manifesto.text}
            </p>
          </RevealItem>
        </RevealGroup>
      </Container>
    </section>
  );
}
