import { useState } from 'react';
import { motion } from 'motion/react';
import { siteContent } from '../../data/siteContent';
import { Modal } from '../ui/Modal';
import { PlaceholderMedia } from '../ui/PlaceholderMedia';
import { CertificateLightbox } from './CertificateLightbox';
import { EASE_OUT } from '../motion/variants';

const typeLabels: Record<string, string> = {
  formacao: 'Formação profissional',
  especializacao: 'Especializações',
  curso: 'Cursos de atualização',
  certificado: 'Certificações',
  tecnologia: 'Tecnologia',
  evento: 'Congressos e aperfeiçoamentos',
};

interface CredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CredentialsModal({ isOpen, onClose }: CredentialsModalProps) {
  const { credentials } = siteContent;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={credentials.moduleTitle}>
        {credentials.items.length === 0 ? (
          <p className="text-sm text-brown-dark">{credentials.notice}</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {credentials.items.map((item, index) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-[1.5rem] border border-gold/25 bg-cream-light/30 p-5"
              >
                <PlaceholderMedia
                  label={item.title}
                  description="Certificado em preparação"
                  ratio="landscape"
                />
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-gold-deep">
                    {typeLabels[item.type] ?? item.type}
                  </span>
                  <h4 className="text-base text-brown-dark">{item.title}</h4>
                  {item.institution && <p className="text-sm text-brown/70">{item.institution}</p>}
                  {(item.year || item.hours) && (
                    <p className="text-xs text-brown/50">
                      {[item.year, item.hours].filter(Boolean).join(' · ')}
                    </p>
                  )}
                  {item.description && (
                    <p className="mt-1 text-sm leading-relaxed text-brown/70">{item.description}</p>
                  )}
                </div>
                <motion.button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  whileHover={{ y: -1.5 }}
                  whileTap={{ scale: 0.975 }}
                  transition={{ duration: 0.2, ease: EASE_OUT }}
                  className="mt-1 w-fit rounded-full border border-gold/50 px-4 py-2 text-xs font-medium uppercase tracking-wide text-brown-dark transition-colors hover:bg-gold/10 active:bg-gold/15"
                >
                  Ver certificado
                </motion.button>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <CertificateLightbox
        items={credentials.items}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={setActiveIndex}
      />
    </>
  );
}
