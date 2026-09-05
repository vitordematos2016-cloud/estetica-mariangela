// mediaParser.js
// Utilitário central para interpretar e organizar nomes de arquivos da galeria.

// Tabela de Aliases
// Associa nomes populares/variáveis aos slugs oficiais dos tratamentos.
const treatmentAliases = {
  // Faciais
  'dermaplaning': ['dermaplaning'],
  'microagulhamento-facial': ['microagulhamento', 'micro-agulhamento', 'microagulhamentofacial'],
  'jato-de-plasma': ['jato-plasma', 'plasma', 'jatodeplasma'],
  'limpeza-de-pele': ['limpeza-pele', 'limpeza', 'limpezadepele'],
  'radiofrequencia-facial': ['radiofrequencia-rosto', 'radio-facial', 'radiofrequenciafacial'],
  'peeling': ['peeling-quimico', 'peeling-facial'],
  'ultrassom-facial': ['ultrassom-rosto', 'ultra-facial', 'ultrassomfacial'],
  
  // Corporais
  'massagem-relaxante': ['relaxante', 'massagem-corporal'],
  'ventosas': ['ventosaterapia', 'ventosaterapia-corporal'],
  'detox-corporal': ['detox', 'manta-termica', 'detox-manta'],
  'drenagem-linfatica': ['drenagem', 'drenagem-corporal', 'linfatica'],
  'drenagem-pos-operatoria': ['drenagem-pos', 'pos-operatorio', 'pos-operatoria'],
  'massagem-modeladora': ['modeladora', 'massagem-redutora'],
  'radiofrequencia-corporal': ['radio-corporal', 'radiofrequenciacorporal'],
  'correntes': ['correntes-esteticas', 'corrente-estetica', 'eletroterapia'],
  'ultrassom-corporal': ['ultra-corporal', 'ultrassomcorporal'],

  // Depilação
  'laser-hakon-4d': ['laser', 'hakon', 'laser-hakon', 'depilacao-laser', 'depilacao'],
};

/**
 * Normaliza e identifica o tratamento a partir de um nome de arquivo.
 */
function identifyTreatment(filenameNorm) {
  for (const [officialSlug, aliases] of Object.entries(treatmentAliases)) {
    // Verifica se o slug oficial exato está no nome
    if (filenameNorm.includes(officialSlug)) return officialSlug;
    
    // Verifica os aliases
    for (const alias of aliases) {
      if (filenameNorm.includes(alias)) return officialSlug;
    }
  }
  return null; // Não identificado
}

/**
 * Identifica o tipo de mídia pela extensão do arquivo.
 */
function identifyMediaType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'webp', 'avif'].includes(ext)) return 'image';
  if (['mp4', 'webm', 'mov'].includes(ext)) return 'video';
  return 'unknown';
}

/**
 * Identifica o momento (stage) usando palavras-chave confiáveis.
 */
function identifyStage(filenameNorm) {
  // Substitui hífens e underlines por espaços para análise de palavras isoladas
  const words = filenameNorm.replace(/[-_]/g, ' ').split(' ');

  const beforeKeywords = ['antes', 'before', 'pre', 'pré'];
  const afterKeywords = ['depois', 'after', 'pos', 'pós', 'resultado'];
  const processKeywords = ['processo', 'procedimento', 'aplicacao', 'aplicação', 'sessao', 'sessão', 'executando', 'realizacao', 'realização', 'durante', 'during'];

  for (const word of words) {
    if (beforeKeywords.includes(word)) return 'before';
    if (afterKeywords.includes(word)) return 'after';
    if (processKeywords.includes(word)) return 'process';
  }

  // Fallback para substring segura caso não esteja isolada (ex: "antes01")
  if (filenameNorm.match(/antes|before|pre|pré/)) return 'before';
  if (filenameNorm.match(/depois|after|pos|pós|resultado/)) return 'after';
  if (filenameNorm.match(/processo|procedimento|aplicacao|aplicação|sessao|sessão|executando|realizacao|realização|durante/)) return 'process';

  return 'unknown';
}

/**
 * Identifica a ordem numérica para ordenamento agrupado.
 */
function identifyOrder(filenameNorm) {
  const match = filenameNorm.match(/\d+/);
  return match ? parseInt(match[0], 10) : 999;
}

/**
 * Parser principal. Recebe um nome de arquivo (ou path) e retorna a configuração parseada.
 */
export function parseTreatmentMediaFilename(fullPath) {
  const filename = fullPath.split('/').pop() || fullPath;
  const filenameNorm = filename.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Normalizado sem acentos
  const fullPathNorm = fullPath.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Caminho completo para fallback

  // Tenta identificar o tratamento pelo nome do arquivo. Se não achar, tenta pelo nome da pasta (caminho completo)
  const treatmentSlug = identifyTreatment(filenameNorm) || identifyTreatment(fullPathNorm);
  const mediaType = identifyMediaType(filename);
  
  let stage = identifyStage(filenameNorm);
  if (stage === 'unknown') stage = identifyStage(fullPathNorm); // Fallback caso a pasta tenha o nome do momento
  
  const order = identifyOrder(filenameNorm);

  if (!treatmentSlug) {
    console.warn(`[Media Parser] Tratamento não identificado no arquivo: ${filename}`);
  }
  if (stage === 'unknown') {
    console.warn(`[Media Parser] Momento não identificado no arquivo: ${filename}`);
  }

  return {
    src: fullPath,
    treatmentSlug,
    mediaType,
    stage,
    order,
    originalFilename: filename
  };
}

// Map stage to Portuguese labels
export const STAGE_LABELS = {
  'before': 'ANTES',
  'process': 'PROCESSO',
  'after': 'DEPOIS',
  'unknown': 'OUTROS REGISTROS'
};

// Map stage to visual sorting weight
export const STAGE_ORDER = {
  'before': 1,
  'process': 2,
  'after': 3,
  'unknown': 4
};
