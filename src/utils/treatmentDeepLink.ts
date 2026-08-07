const TREATMENT_HASH_PREFIX = 'tratamento-';

/** Constrói o hash usado na URL enquanto o modal de um tratamento está aberto. */
export function buildTreatmentHash(treatmentId: string): string {
  return `${TREATMENT_HASH_PREFIX}${treatmentId}`;
}

/**
 * Extrai o id de tratamento de um hash como `#tratamento-tratamento-01`.
 * Retorna `null` para qualquer outro formato de hash (inclusive vazio) --
 * quem chama ainda precisa confirmar que o id existe no catálogo antes de
 * usá-lo, isto só reconhece o formato.
 */
export function parseTreatmentHash(hash: string): string | null {
  const prefix = `#${TREATMENT_HASH_PREFIX}`;
  if (!hash.startsWith(prefix)) return null;
  const id = hash.slice(prefix.length);
  if (!id) return null;
  try {
    return decodeURIComponent(id);
  } catch {
    return null;
  }
}
