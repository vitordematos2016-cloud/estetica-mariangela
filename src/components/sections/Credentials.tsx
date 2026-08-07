import { useState } from 'react';
import { motion } from 'motion/react';
import { siteContent } from '../../data/siteContent';
import { Container } from '../ui/Container';
import { Modal } from '../ui/Modal';
import { CredentialsModal } from '../credentials/CredentialsModal';
import { EASE_OUT } from '../motion/variants';

const certificateIcon = (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <circle cx="11" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.3" />
    <path
      d="M7.5 12.8L6 20l5-2.6 5 2.6-1.5-7.2"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  </svg>
);

export function Credentials() {
  const { credentials } = siteContent;
  const [isAuthorityOpen, setIsAuthorityOpen] = useState(false);
  const [isCredentialsOpen, setIsCredentialsOpen] = useState(false);

  // Sem formação/instituição/certificados confirmados ainda -- o botão
  // "Autoridade" fica oculto (nunca mostra cards vazios nem "especialista
  // certificada" sem confirmação). Volta assim que `credentials.items`
  // tiver ao menos um item (ver docs/PENDENCIAS_CLIENTE.md).
  if (credentials.items.length === 0) return null;

  return (
    <section className="py-6 sm:py-8">
      <Container className="flex justify-center">
        <motion.button
          type="button"
          onClick={() => setIsAuthorityOpen(true)}
          whileHover={{ y: -1.5 }}
          whileTap={{ scale: 0.975 }}
          transition={{ duration: 0.2, ease: EASE_OUT }}
          className="flex items-center gap-2 rounded-full border border-gold/40 bg-cream-light/40 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-brown-dark transition-colors hover:bg-gold/10 active:bg-gold/15"
        >
          <span className="flex h-5 w-5 items-center justify-center text-gold">
            <svg width="16" height="16" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <circle cx="11" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.4" />
              <path
                d="M7.5 12.8L6 20l5-2.6 5 2.6-1.5-7.2"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          Autoridade
        </motion.button>
      </Container>

      <Modal isOpen={isAuthorityOpen} onClose={() => setIsAuthorityOpen(false)} title={credentials.title}>
        <div className="flex flex-col gap-6">
          <p className="text-sm leading-relaxed text-brown/80">{credentials.text}</p>

          <div className="flex flex-col items-center gap-3 rounded-[1.5rem] border border-gold/30 bg-cream-light/40 px-6 py-6 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/50 text-gold">
              {certificateIcon}
            </span>
            <h4 className="text-base text-brown-dark">{credentials.moduleTitle}</h4>
            <p className="text-sm leading-relaxed text-brown/70">{credentials.moduleTeaser}</p>
            <motion.button
              type="button"
              onClick={() => setIsCredentialsOpen(true)}
              whileHover={{ y: -1.5 }}
              whileTap={{ scale: 0.975 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
              className="mt-1 rounded-full border border-gold/50 px-5 py-2.5 text-xs font-medium uppercase tracking-wide text-brown-dark transition-colors hover:bg-gold/10 active:bg-gold/15"
            >
              {credentials.moduleCta}
            </motion.button>
          </div>
        </div>
      </Modal>

      <CredentialsModal isOpen={isCredentialsOpen} onClose={() => setIsCredentialsOpen(false)} />
    </section>
  );
}
