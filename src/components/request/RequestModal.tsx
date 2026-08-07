import { Modal } from '../ui/Modal';
import { useRequest } from '../../context/RequestContext';
import { RequestForm } from './RequestForm';

/**
 * Modal único de "Solicitar atendimento" -- montado uma vez em `App.tsx` e
 * aberto por todos os botões de atendimento/avaliação/tratamento/seleção do
 * site via `useRequest().openRequest(...)`. Usa o mesmo `Modal` genérico já
 * usado por `TreatmentModal`/`LegalPolicyModal` (abre suavemente, fecha no
 * Escape/clique fora/botão "X", trava o scroll de fundo, centralizado no
 * desktop, confortável no mobile) -- sem estilo novo, só a identidade visual
 * já existente do site.
 */
export function RequestModal() {
  const { isOpen, prefill, openId, closeRequest } = useRequest();

  return (
    <Modal isOpen={isOpen} onClose={closeRequest} title="Solicitar atendimento">
      <div className="flex flex-col gap-5">
        <p className="-mt-2 text-sm leading-relaxed text-brown/70">
          Informe seu nome e siga para o WhatsApp. A profissional irá conversar com você e confirmar
          pessoalmente o melhor dia e horário.
        </p>
        <RequestForm key={openId} prefill={prefill} onSubmitted={closeRequest} idPrefix="request-modal" />
      </div>
    </Modal>
  );
}
