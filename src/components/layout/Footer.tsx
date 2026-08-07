import { useState } from 'react';
import type { LegalPolicyContent } from '../../types/siteContent';
import { siteContent } from '../../data/siteContent';
import { Container } from '../ui/Container';
import { LegalPolicyModal } from '../ui/LegalPolicyModal';
import { Ornament } from '../ui/Ornament';
import { Reveal } from '../motion/reveal';
import { buildWhatsAppUrl } from '../../utils/whatsapp';
import { hasValue } from '../../utils/links';

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M8 2.5a5.5 5.5 0 0 0-4.8 8.2L2.5 13.5l2.9-.7A5.5 5.5 0 1 0 8 2.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
    </svg>
  );
}

/**
 * Rodapé enxuto: nome da marca, cidade, WhatsApp e Instagram -- sem e-mail,
 * CNPJ, endereço completo, domínio ou horários (nenhum confirmado ainda).
 * Links permitidos: WhatsApp, Instagram e navegação interna.
 */
export function Footer() {
  const { brand, contact, address, nav, footer, legal } = siteContent;
  const whatsappUrl = buildWhatsAppUrl(contact.whatsappNumber, siteContent.whatsappDefaultMessage);
  const developerWhatsappUrl = buildWhatsAppUrl(footer.developerWhatsappNumber, footer.developerWhatsappMessage);
  const hasInstagram = hasValue(contact.instagramUrl);
  const [openPolicy, setOpenPolicy] = useState<LegalPolicyContent | null>(null);

  const mobileLinkClassName =
    'inline-flex min-h-11 items-center gap-2 text-sm text-cream-light/80 transition-colors duration-300 hover:text-gold active:text-gold';

  return (
    <footer className="bg-brown-dark text-cream-light">
      <Reveal>
        <div>
          {/* Celular (<640px): composição única, compacta e centralizada. */}
          <div className="flex flex-col items-center gap-7 px-5 py-12 text-center sm:hidden">
            <div className="flex flex-col items-center gap-1.5">
              <Ornament size="xs" className="mb-1" />
              <p className="font-heading text-2xl text-cream">{brand.name}</p>
              <p className="text-sm text-cream-light/70">{address.reference}</p>
            </div>

            <span aria-hidden="true" className="h-px w-16 bg-gold/25" />

            <div className="flex w-full flex-col items-center gap-3">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-gold">
                Links rápidos
              </p>
              <nav
                aria-label="Links rápidos do rodapé"
                className="grid w-full max-w-xs grid-cols-2 gap-x-2 gap-y-1"
              >
                {nav.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="flex min-h-11 items-center justify-center rounded-lg px-2 text-sm text-cream-light/80 transition-colors duration-300 hover:text-gold active:text-gold"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            <span aria-hidden="true" className="h-px w-16 bg-gold/25" />

            <div className="flex w-full flex-col items-center gap-2.5">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-gold">Contato</p>
              {whatsappUrl ? (
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className={mobileLinkClassName}>
                  <PhoneIcon />
                  WhatsApp: {contact.whatsappDisplay}
                </a>
              ) : (
                <span className={`${mobileLinkClassName} opacity-60`}>
                  <PhoneIcon />
                  {contact.whatsappDisplay}
                </span>
              )}
              {hasInstagram ? (
                <a href={contact.instagramUrl} target="_blank" rel="noreferrer" className={mobileLinkClassName}>
                  <InstagramIcon />
                  Instagram: {contact.instagramHandle}
                </a>
              ) : (
                <span className={`${mobileLinkClassName} opacity-60`}>
                  <InstagramIcon />
                  {contact.instagramHandle}
                </span>
              )}
            </div>
          </div>

          {/* Tablet/desktop (>=640px): grade original preservada, com 3
              colunas (marca, links rápidos, contato) -- sem coluna de
              endereço no rodapé. */}
          <Container className="hidden gap-10 py-16 sm:grid sm:grid-cols-3 lg:gap-8">
            <div className="flex flex-col gap-3">
              <p className="font-heading text-2xl text-cream">{brand.name}</p>
              <p className="text-sm text-cream-light/70">{address.reference}</p>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-gold">
                Links rápidos
              </p>
              <nav aria-label="Links rápidos do rodapé" className="flex flex-col gap-2">
                {nav.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm text-cream-light/80 transition-colors hover:text-gold active:text-gold"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-gold">Contato</p>
              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-cream-light/80 transition-colors hover:text-gold active:text-gold"
                >
                  <PhoneIcon />
                  WhatsApp: {contact.whatsappDisplay}
                </a>
              ) : (
                <span className="flex items-center gap-2 text-sm text-cream-light/80 opacity-60">
                  <PhoneIcon />
                  {contact.whatsappDisplay}
                </span>
              )}
              {hasInstagram ? (
                <a
                  href={contact.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-cream-light/80 transition-colors hover:text-gold active:text-gold"
                >
                  <InstagramIcon />
                  Instagram: {contact.instagramHandle}
                </a>
              ) : (
                <span className="flex items-center gap-2 text-sm text-cream-light/80 opacity-60">
                  <InstagramIcon />
                  {contact.instagramHandle}
                </span>
              )}
            </div>
          </Container>
        </div>
      </Reveal>

      <div className="border-t border-cream-light/10 py-5">
        <Container className="flex flex-col items-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            <button
              type="button"
              onClick={() => setOpenPolicy(legal.privacyPolicy)}
              className="text-[0.7rem] text-cream-light/50 underline decoration-cream-light/20 underline-offset-2 transition-colors hover:text-gold active:text-gold"
            >
              {legal.privacyPolicy.title}
            </button>
            <button
              type="button"
              onClick={() => setOpenPolicy(legal.cancellationPolicy)}
              className="text-[0.7rem] text-cream-light/50 underline decoration-cream-light/20 underline-offset-2 transition-colors hover:text-gold active:text-gold"
            >
              {legal.cancellationPolicy.title}
            </button>
          </div>
          <p className="text-center text-[0.7rem] text-cream-light/40">{footer.copyright}</p>
          {developerWhatsappUrl && (
            <p className="text-center text-[0.7rem] text-cream-light/40">
              {footer.developedByPrefix}
              <a
                href={developerWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Conversar com a ${footer.developerName} pelo WhatsApp`}
                className="text-gold/90 underline decoration-gold/40 underline-offset-2 transition-colors hover:text-gold hover:decoration-gold active:text-gold active:decoration-gold"
              >
                {footer.developerName}
              </a>
            </p>
          )}
        </Container>
      </div>

      <LegalPolicyModal policy={openPolicy} onClose={() => setOpenPolicy(null)} />
    </footer>
  );
}
