// Dados oficiais do negócio — fonte única de verdade.
// Não inventar/alterar sem confirmação: são as informações reais fornecidas pela cliente.

export const BUSINESS_NAME = 'Mariangela Schinaider Estética';
export const BUSINESS_RESPONSIBLE = 'Mariangela Schinaider de Magalhães';

export const PHONE_DISPLAY = '+55 45 99849-8847';
export const WA_NUMBER = '5545998498847';
export const EMAIL = 'mariangela_mag321@hotmail.com';

export const ADDRESS_LINE = 'Avenida Abilon de Souza Naves, 785';
export const CITY_LINE = 'Guaraniaçu - Paraná';
export const FULL_ADDRESS = `${ADDRESS_LINE}, ${CITY_LINE}`;

export const HOURS = ['Segunda a sábado', 'Somente com horário marcado'];
export const PARKING_NOTE = 'Não possui estacionamento próprio.';

export const SOCIAL = {
  instagram: { handle: '@estetica_mariangela', url: 'https://instagram.com/estetica_mariangela' },
  facebook: { handle: 'Estética Mariangela', url: null },
  tiktok: { handle: 'Estética Mariangela', url: null },
};

// Mapa — construído a partir do endereço real, sem coordenadas inventadas.
const ENCODED_ADDRESS = encodeURIComponent(FULL_ADDRESS);
export const MAPS_EMBED_URL = `https://www.google.com/maps?q=${ENCODED_ADDRESS}&output=embed`;
export const MAPS_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${ENCODED_ADDRESS}`;

// WhatsApp — mensagem oficial de abertura, codificada corretamente.
const WA_MESSAGE = `Olá! Que bom ter você por aqui!

Será um prazer cuidar de você.

Para agendarmos seu atendimento, me informe, por favor, qual procedimento você deseja realizar e qual o melhor dia e horário para você.

Vou verificar a disponibilidade e retornar para confirmarmos seu horário.

Seu momento de autocuidado começa aqui!`;

// Removendo o WA_LINK exportado para forçar o uso da função dinâmica.
// export const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;

// Constrói um link de WhatsApp com uma mensagem específica (ex.: já mencionando um tratamento).
export function buildWaLink(customMessage) {
  const message = customMessage || WA_MESSAGE;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}
