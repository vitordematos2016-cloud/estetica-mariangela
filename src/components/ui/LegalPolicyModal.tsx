import type { LegalPolicyContent } from '../../types/siteContent';
import { Modal } from './Modal';
import { useHeldValue } from '../../hooks/useHeldValue';

interface LegalPolicyModalProps {
  policy: LegalPolicyContent | null;
  onClose: () => void;
}

export function LegalPolicyModal({ policy, onClose }: LegalPolicyModalProps) {
  // Mantém o conteúdo da última política durante a animação de saída do
  // Modal — `policy` já volta a `null` no instante do fechamento.
  const displayPolicy = useHeldValue(policy);
  if (!displayPolicy) return null;

  return (
    <Modal isOpen={!!policy} onClose={onClose} title={displayPolicy.title}>
      <div className="flex flex-col gap-5">
        {displayPolicy.reviewNotice && (
          <p className="rounded-xl border border-dashed border-gold/40 bg-cream-light/40 px-4 py-3 text-xs text-brown/60">
            {displayPolicy.reviewNotice}
          </p>
        )}

        {displayPolicy.sections.map((section) => (
          <div key={section.heading}>
            <h4 className="mb-1.5 text-sm font-medium text-brown-dark">{section.heading}</h4>
            <p className="text-sm leading-relaxed text-brown/75">{section.text}</p>
          </div>
        ))}
      </div>
    </Modal>
  );
}
