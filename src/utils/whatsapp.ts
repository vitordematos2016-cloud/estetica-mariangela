/**
 * Retorna `true` só quando existe um número de WhatsApp real configurado em
 * `siteContent.contact.whatsappNumber`. Todo botão que dependeria dele deve
 * checar esta função antes de montar o link ou abrir o WhatsApp.
 */
export function isWhatsAppConfigured(phoneNumber: string | undefined | null): boolean {
  return typeof phoneNumber === 'string' && phoneNumber.trim().length > 0;
}

export function buildWhatsAppUrl(phoneNumber: string, message: string): string | null {
  if (!isWhatsAppConfigured(phoneNumber)) return null;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encoded}`;
}

/** Sem tratamento e sem nome informado (link genérico, ex.: Footer). */
export function buildTreatmentInquiryMessage(treatmentName: string): string {
  return `Olá, Mariangela! Vim pelo site da Estética Mariangela e gostaria de saber mais sobre: ${treatmentName}.`;
}

/**
 * Mensagem do botão "Falar com a especialista" (seção "Agende sua
 * avaliação") -- vai direto para o WhatsApp, sem passar pelo formulário de
 * solicitação, então nunca leva nome nem tratamento (é uma conversa geral,
 * não específica de um procedimento).
 */
export function buildSpecialistInquiryMessage(): string {
  return 'Olá, Mariangela! Vim pelo site da Estética Mariangela e gostaria de mais informações sobre os tratamentos.';
}

/**
 * Mensagens do formulário único de "Solicitar atendimento" (nome +
 * tratamento de interesse) -- o site não simula um agendamento confirmado,
 * só abre o WhatsApp com a solicitação já organizada para a Mariangela
 * combinar pessoalmente o dia e o horário.
 */
export function buildTreatmentRequestMessage(name: string, treatmentName: string): string {
  return `Olá, Mariangela! Meu nome é ${name}. Vim pelo site da Estética Mariangela e gostaria de saber mais sobre: ${treatmentName}.`;
}

export function buildTreatmentsRequestMessage(name: string, treatmentNames: string[]): string {
  const list = treatmentNames.map((treatmentName) => `- ${treatmentName}`).join('\n');
  return `Olá, Mariangela! Meu nome é ${name}. Vim pelo site da Estética Mariangela e tenho interesse nos seguintes tratamentos:\n${list}`;
}

export function buildEvaluationRequestMessage(name: string): string {
  return `Olá, Mariangela! Meu nome é ${name}. Vim pelo site da Estética Mariangela e gostaria de solicitar uma avaliação para entender qual tratamento é mais indicado para mim.`;
}

export function buildUnsureTreatmentRequestMessage(name: string): string {
  return `Olá, Mariangela! Meu nome é ${name}. Vim pelo site da Estética Mariangela e ainda não sei qual tratamento escolher — gostaria de receber uma orientação.`;
}

/** Mensagem do destaque "Laser Day" -- nunca leva data, preço ou região: só
 * pergunta a próxima data, que a Mariangela confirma pessoalmente. */
export function buildLaserDayInquiryMessage(): string {
  return 'Olá, Mariangela! Vim pelo site e gostaria de saber qual será a próxima data do Laser Day.';
}
