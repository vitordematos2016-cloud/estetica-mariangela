/**
 * Checagem genérica usada para decidir se um link externo (Instagram,
 * e-mail, Google Maps, Waze, domínio do site, etc.) tem um valor real
 * configurado. Enquanto vazio, o componente que o usa deve esconder ou
 * desabilitar o botão/link correspondente, em vez de apontar para um
 * endereço de exemplo ou quebrado.
 */
export function hasValue(value: string | undefined | null): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}
