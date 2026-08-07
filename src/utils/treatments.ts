import { siteContent } from '../data/siteContent';

/** Mesmo emoji usado para desenhar cada ícone de `TreatmentCategories`
 * (ver comentário em `CATEGORY_ICONS` naquele componente) -- ali eles só
 * inspiraram o traço SVG, aqui são exibidos como texto mesmo, prefixando o
 * nome da categoria em qualquer lugar que precise do rótulo completo
 * "emoji + nome" (ex.: modal "Ver mais detalhes"). Chave = id do grupo em
 * `treatmentCategoryGroups.items`. */
const TREATMENT_CATEGORY_GROUP_EMOJI: Record<string, string> = {
  'limpeza-glow': '✨',
  'peelings-renovacao': '🌿',
  'alta-tecnologia': '💎',
  'remocao-especializada': '🎯',
};

/**
 * Rótulo de categoria de um tratamento a partir da estrutura NOVA
 * (`treatmentCategoryGroups`, as mesmas 4 categorias da seção "Encontre o
 * cuidado ideal para você" e dos cards de filtro), não da lista antiga de 7
 * categorias (`treatmentCategories` -- essa continua existindo só para o
 * filtro por chips da grade de Tratamentos, um recurso à parte). Localiza o
 * grupo pelo `treatmentIds` que contém o id do tratamento -- nunca por
 * `categoryId`, que aponta para a estrutura antiga. Retorna
 * "{emoji} {título}", igual ao nome usado nos cards de categoria.
 */
export function getTreatmentCategoryGroupLabel(treatmentId: string | undefined): string | undefined {
  if (!treatmentId) return undefined;
  const group = siteContent.treatmentCategoryGroups.items.find((item) =>
    item.treatmentIds.includes(treatmentId),
  );
  if (!group) return undefined;
  const emoji = TREATMENT_CATEGORY_GROUP_EMOJI[group.id];
  return emoji ? `${emoji} ${group.title}` : group.title;
}
