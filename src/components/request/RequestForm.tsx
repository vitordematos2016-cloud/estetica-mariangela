import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { siteContent } from '../../data/siteContent';
import { Button } from '../ui/Button';
import type { RequestPrefill } from '../../context/RequestContext';
import {
  buildEvaluationRequestMessage,
  buildTreatmentRequestMessage,
  buildTreatmentsRequestMessage,
  buildUnsureTreatmentRequestMessage,
  buildWhatsAppUrl,
  isWhatsAppConfigured,
} from '../../utils/whatsapp';

interface RequestFormProps {
  prefill: RequestPrefill;
  /** Chamado depois que o WhatsApp é aberto -- só o modal usa isto, para se
   * fechar sozinho; a versão embutida na seção/página de agendamento não
   * passa nada aqui e permanece visível. */
  onSubmitted?: () => void;
  /** Prefixo dos `id`s dos campos -- evita colisão quando o mesmo formulário
   * existe simultaneamente no modal e na seção de agendamento embutida. */
  idPrefix: string;
}

const EVALUATION_VALUE = 'avaliacao';
const UNSURE_VALUE = 'ainda-nao-sei';

/** Sem vermelho na paleta: o estado de erro se diferencia por borda mais
 * grossa (2px) em marrom escuro + ícone de aviso ao lado da mensagem, nunca
 * só pela cor. */
function fieldClassName(hasError: boolean) {
  return `w-full rounded-xl border bg-cream px-4 py-3 text-sm text-brown-dark shadow-[inset_0_1px_2px_rgba(89, 64, 59, 0.05)] transition-all duration-200 focus:ring-2 ${
    hasError
      ? 'border-2 border-brown-dark focus:border-brown-dark focus:ring-brown-dark/15'
      : 'border-gold/30 focus:border-gold focus:ring-gold/15'
  }`;
}

function WarningIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M8 1.5 14.5 13H1.5L8 1.5Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M8 6v3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="8" cy="11.3" r="0.7" fill="currentColor" />
    </svg>
  );
}

/**
 * Formulário único de "Solicitar atendimento" -- todo o fluxo de
 * agendamento do site se resume a isto: nome + tratamento de interesse,
 * depois WhatsApp. Sem calendário, sem data/horário, sem confirmação
 * simulada -- a profissional combina o dia e o horário pessoalmente. Reaproveitado
 * tanto dentro do `RequestModal` (a maioria dos botões do site) quanto
 * embutido direto na seção/página de agendamento (`Scheduling.tsx`), para
 * que links antigos para `#agendamento` continuem levando ao mesmo
 * formulário.
 */
export function RequestForm({ prefill, onSubmitted, idPrefix }: RequestFormProps) {
  const { treatments } = siteContent;
  const isLocked = prefill.mode === 'treatments';
  const lockedNames = prefill.treatmentNames ?? [];

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [selection, setSelection] = useState<string>(prefill.mode === 'avaliacao' ? EVALUATION_VALUE : '');
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const whatsappReady = isWhatsAppConfigured(siteContent.contact.whatsappNumber);

  const nameRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError('Informe seu nome para continuar.');
      nameRef.current?.focus();
      return;
    }

    if (!isLocked && !selection) {
      setSelectionError('Selecione uma opção para continuar.');
      selectRef.current?.focus();
      return;
    }

    let message: string;

    if (isLocked) {
      message =
        lockedNames.length > 1
          ? buildTreatmentsRequestMessage(trimmedName, lockedNames)
          : buildTreatmentRequestMessage(trimmedName, lockedNames[0]);
    } else if (selection === EVALUATION_VALUE) {
      message = buildEvaluationRequestMessage(trimmedName);
    } else if (selection === UNSURE_VALUE) {
      message = buildUnsureTreatmentRequestMessage(trimmedName);
    } else {
      const treatment = treatments.find((item) => item.id === selection);
      message = buildTreatmentRequestMessage(trimmedName, treatment?.name ?? '');
    }

    const whatsappUrl = buildWhatsAppUrl(siteContent.contact.whatsappNumber, message);
    if (!whatsappUrl) return;
    window.open(whatsappUrl, '_blank', 'noreferrer');
    onSubmitted?.();
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${idPrefix}-name`} className="text-sm font-medium text-brown-dark">
          Nome *
        </label>
        <input
          id={`${idPrefix}-name`}
          ref={nameRef}
          type="text"
          autoComplete="name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (nameError) setNameError(null);
          }}
          placeholder="Seu nome"
          aria-invalid={!!nameError}
          aria-describedby={nameError ? `${idPrefix}-name-error` : undefined}
          className={fieldClassName(!!nameError)}
        />
        {nameError && (
          <p id={`${idPrefix}-name-error`} className="flex items-center gap-1.5 text-xs font-medium text-brown-dark">
            <WarningIcon />
            {nameError}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        {isLocked ? (
          <>
            <span className="text-sm font-medium text-brown-dark">Tratamento de interesse</span>
            <div className="rounded-xl border border-gold/30 bg-cream-light/40 px-4 py-3 text-sm text-brown-dark">
              {lockedNames.length > 1 ? (
                <ul className="flex flex-col gap-1">
                  {lockedNames.map((treatmentName) => (
                    <li key={treatmentName}>• {treatmentName}</li>
                  ))}
                </ul>
              ) : (
                <p>{lockedNames[0]}</p>
              )}
            </div>
          </>
        ) : (
          <>
            <label htmlFor={`${idPrefix}-treatment`} className="text-sm font-medium text-brown-dark">
              Tratamento de interesse *
            </label>
            <select
              id={`${idPrefix}-treatment`}
              ref={selectRef}
              value={selection}
              onChange={(event) => {
                setSelection(event.target.value);
                if (selectionError) setSelectionError(null);
              }}
              aria-invalid={!!selectionError}
              aria-describedby={selectionError ? `${idPrefix}-treatment-error` : undefined}
              className={fieldClassName(!!selectionError)}
            >
              <option value="" disabled>
                Selecione uma opção
              </option>
              <option value={EVALUATION_VALUE}>Quero uma avaliação</option>
              <option value={UNSURE_VALUE}>Ainda não sei qual tratamento escolher</option>
              <optgroup label="Tratamentos">
                {treatments.map((treatment) => (
                  <option key={treatment.id} value={treatment.id}>
                    {treatment.name}
                  </option>
                ))}
              </optgroup>
            </select>
            {selectionError && (
              <p id={`${idPrefix}-treatment-error`} className="flex items-center gap-1.5 text-xs font-medium text-brown-dark">
                <WarningIcon />
                {selectionError}
              </p>
            )}
          </>
        )}
      </div>

      <div className="flex flex-col items-center gap-3 pt-1">
        <Button
          type="submit"
          variant="primary"
          shine={whatsappReady}
          disabled={!whatsappReady}
          className="w-full sm:w-auto sm:min-w-[16rem]"
        >
          Continuar no WhatsApp
        </Button>
        <p className="text-center text-xs text-brown/50">
          {whatsappReady
            ? 'O atendimento será confirmado diretamente pelo WhatsApp.'
            : 'O WhatsApp será configurado em breve.'}
        </p>
      </div>
    </form>
  );
}
