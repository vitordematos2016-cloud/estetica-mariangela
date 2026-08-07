import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { siteContent } from '../../data/siteContent';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Ornament } from '../ui/Ornament';
import { Reveal, RevealGroup, RevealItem } from '../motion/reveal';
import { EASE_OUT } from '../motion/variants';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export function Faq() {
  const { faq } = siteContent;
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="py-24 sm:py-28">
      <Container className="flex flex-col gap-12">
        <Reveal>
          <SectionHeading eyebrow="Dúvidas" title="Perguntas frequentes" />
        </Reveal>

        <RevealGroup stagger={0.06} className="mx-auto flex w-full max-w-2xl flex-col gap-4">
          {faq.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;

            return (
              <RevealItem
                key={item.question}
                className={`overflow-hidden rounded-[1.75rem_1.75rem_1.75rem_0.75rem] border transition-all duration-300 hover:-translate-y-0.5 active:-translate-y-0.5 ${
                  isOpen
                    ? 'border-gold/45 bg-cream shadow-warm'
                    : 'border-gold/20 bg-cream-light/40 shadow-warm-sm hover:border-gold/40 hover:shadow-warm active:border-gold/40 active:shadow-warm'
                }`}
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex min-h-11 w-full items-center gap-4 px-5 py-4 text-left sm:px-7 sm:py-5"
                  >
                    <Ornament size="xs" className="shrink-0">
                      <span className="font-heading text-xs text-gold-deep sm:text-sm">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </Ornament>
                    <span className="flex-1 text-base font-medium leading-snug text-brown-dark sm:text-lg">
                      {item.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                        isOpen ? 'rotate-180 border-gold bg-gold/15 text-brown-dark' : 'border-gold/30 text-brown/50'
                      }`}
                    >
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path
                          d="M2 5l6 6 6-6"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key={panelId}
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0, y: prefersReducedMotion ? 0 : -4 }}
                      animate={{ height: 'auto', opacity: 1, y: 0 }}
                      exit={{ height: 0, opacity: 0, y: prefersReducedMotion ? 0 : -4 }}
                      transition={{ duration: prefersReducedMotion ? 0.01 : 0.32, ease: EASE_OUT }}
                      className="overflow-hidden"
                    >
                      <div className="flex gap-4 px-5 pb-5 sm:px-7 sm:pb-6">
                        <span aria-hidden="true" className="w-10 shrink-0" />
                        <p className="text-sm leading-relaxed text-brown/70 sm:text-base">{item.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Container>
    </section>
  );
}
