import { motion } from 'motion/react';
import { siteContent } from '../../data/siteContent';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { EASE_OUT } from '../motion/variants';
import { buildLaserDayInquiryMessage, buildWhatsAppUrl, isWhatsAppConfigured } from '../../utils/whatsapp';
import { useOnceInView } from '../../hooks/useOnceInView';
import { useRef } from 'react';

function BeamIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 2v3M10 15v3M3 10h3M14 10h3M5.3 5.3l2 2M12.7 12.7l2 2M5.3 14.7l2-2M12.7 7.3l2-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

/**
 * Destaque compacto para a campanha recorrente "Laser Day" -- sem data,
 * preço, desconto ou região confirmados; o único CTA consulta a próxima
 * data diretamente pelo WhatsApp. Posicionado logo após a grade de
 * Tratamentos, antes da seção de solicitação de atendimento.
 */
export function LaserDay() {
  const { laserDay, contact } = siteContent;
  const ref = useRef<HTMLElement>(null);
  const hasBeenSeen = useOnceInView(ref, { amount: 0.4 });
  const whatsappUrl = buildWhatsAppUrl(contact.whatsappNumber, buildLaserDayInquiryMessage());
  const whatsappReady = isWhatsAppConfigured(contact.whatsappNumber);

  return (
    <section ref={ref} className="py-10 sm:py-12">
      <Container className="flex justify-center">
        <motion.div
          initial={{ opacity: 0.9, y: 10 }}
          animate={hasBeenSeen ? { opacity: 1, y: 0 } : { opacity: 0.9, y: 10 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          whileHover={{ y: -2 }}
          className="flex w-full max-w-2xl flex-col items-center gap-3 rounded-[1.75rem_1.75rem_1.75rem_0.75rem] border border-gold/30 bg-brown-dark px-7 py-8 text-center shadow-warm-sm transition-shadow duration-300 hover:shadow-warm sm:flex-row sm:gap-5 sm:text-left"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cream-light/40 text-cream-light">
            <BeamIcon />
          </span>
          <div className="flex flex-1 flex-col gap-1">
            <h2 className="font-heading text-xl text-cream sm:text-2xl">{laserDay.title}</h2>
            <p className="text-sm leading-relaxed text-cream-light/80">{laserDay.text}</p>
          </div>
          {whatsappReady ? (
            <Button
              href={whatsappUrl ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              className="shrink-0 border-cream-light/50 bg-transparent text-cream-light hover:bg-cream-light/10"
            >
              {laserDay.ctaLabel}
            </Button>
          ) : (
            <span className="shrink-0 text-xs text-cream-light/60">O WhatsApp será configurado em breve.</span>
          )}
        </motion.div>
      </Container>
    </section>
  );
}
