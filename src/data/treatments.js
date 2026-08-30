import { Sparkles, Zap, Sun, Flame, Droplets, Wand2, Layers, Radio, HandHeart, Waves, Wind, Activity } from 'lucide-react';

// Catálogo completo de serviços reais, conforme informado pela cliente.
// category: 'facial' | 'corporal' | 'depilacao'
// featured: aparece na seção "Tratamentos em Destaque" (Home) — NÃO alterar os 5 já aprovados.
// hasDetailPage: possui página própria em /tratamentos/:slug

export const TREATMENTS_CATALOG = [
  // ---- Destaques (já aprovados — conteúdo preservado) ----
  {
    slug: 'microagulhamento-facial',
    num: '01',
    title: 'Microagulhamento Facial',
    category: 'facial',
    summary: 'O microagulhamento facial é um procedimento que utiliza microperfurações controladas para estimular a produção natural de colágeno e elastina, promovendo a renovação da pele e potencializando protocolos de tratamento facial.\n\nÉ uma excelente opção para melhorar a textura, o viço, a aparência de poros, linhas finas e marcas de acne, além de favorecer a permeação de ativos cosméticos específicos quando indicados. Cada sessão é planejada de maneira individualizada, priorizando segurança e as necessidades da pele.',
    // catalogSummary: texto curto usado somente nos cards de /tratamentos — não afeta a página de detalhe (que usa "summary").
    catalogSummary: 'Procedimento com microperfurações que estimula colágeno, melhorando textura, viço e marcas de acne.',
    // Campos usados somente pela seção "Tratamentos em Destaque" (Home) — não afetam catálogo, menu ou página de detalhe.
    featuredSubheadline: 'Renovação e cuidado para a pele.',
    featuredDescription: 'Procedimento que utiliza microperfurações para estimular a produção de colágeno, promovendo a renovação da pele, melhora da textura, poros e linhas finas.',
    icon: Sparkles,
    img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200&auto=format&fit=crop',
    featured: true,
    main: true,
    hasDetailPage: true,
  },
  {
    slug: 'jato-de-plasma',
    num: '02',
    title: 'Jato de Plasma',
    category: 'facial',
    summary: 'O jato de plasma é um procedimento estético realizado com um equipamento que gera um arco de plasma de forma controlada sobre a pele, estimulando um processo de renovação cutânea. É indicado para protocolos de rejuvenescimento, melhora da aparência de linhas finas, flacidez superficial e textura da pele, clareamento de manchas senil e remoção de verrugas, mediante avaliação profissional. O tratamento é personalizado conforme as necessidades de cada cliente, respeitando as características da pele e os cuidados necessários para uma recuperação adequada. Os resultados acontecem de forma progressiva, acompanhando o processo natural de regeneração da pele.',
    catalogSummary: 'Procedimento que gera um arco de plasma controlado para renovação cutânea, rejuvenescimento e clareamento.',
    featuredSubheadline: 'Tecnologia aplicada à renovação cutânea.',
    featuredDescription: 'Procedimento estético que gera um arco de plasma de forma controlada sobre a pele, estimulando a renovação cutânea. Indicado para rejuvenescimento e melhora da textura.',
    icon: Zap,
    img: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=800&auto=format&fit=crop',
    featured: true,
    hasDetailPage: true,
  },
  {
    slug: 'laser-hakon-4d',
    num: '03',
    title: 'Depilação com Laser Hakon 4D',
    category: 'depilacao',
    summary: 'A depilação com Laser Hakon 4D é uma tecnologia desenvolvida para proporcionar redução progressiva dos pelos com conforto e eficiência. O equipamento atua direcionando energia luminosa ao folículo piloso, contribuindo para diminuir o crescimento dos pelos ao longo das sessões.\n\nO tratamento pode ser realizado em diversas regiões do corpo e é indicado após uma avaliação para definir o protocolo ideal de acordo com o tipo de pele, espessura e coloração dos pelos. O número de sessões varia de pessoa para pessoa, pois cada organismo responde de maneira individual ao tratamento.',
    catalogSummary: 'Tecnologia desenvolvida para proporcionar redução progressiva dos pelos com conforto e eficiência.',
    // Título mais curto usado somente no card da Home; título completo (acima) segue intacto no menu, catálogo e página de detalhe.
    featuredTitle: 'Laser Hakon 4D',
    featuredSubheadline: 'Redução progressiva dos pelos com conforto.',
    featuredDescription: 'Tecnologia que direciona energia luminosa ao folículo piloso, diminuindo o crescimento dos pelos ao longo das sessões.',
    icon: Sun,
    img: 'https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=800&auto=format&fit=crop',
    featured: true,
    hasDetailPage: true,
  },
  {
    slug: 'detox-corporal',
    num: '04',
    title: 'Detox Corporal com Manta Térmica',
    category: 'corporal',
    summary: 'O detox corporal com manta térmica é um protocolo estético que utiliza aquecimento controlado para promover uma sensação de relaxamento e bem-estar, além de favorecer a sudorese durante a sessão. Geralmente é associado a cosméticos e técnicas manuais dentro de um atendimento personalizado.\n\nÉ importante destacar que o procedimento não promove eliminação de toxinas ou emagrecimento por si só. Seu principal objetivo é proporcionar conforto, relaxamento e complementar protocolos estéticos corporais conforme a avaliação profissional.',
    catalogSummary: 'Protocolo com aquecimento controlado para promover relaxamento, bem-estar e sudorese.',
    featuredSubheadline: 'Relaxamento e conforto para o corpo.',
    featuredDescription: 'Protocolo estético que utiliza aquecimento controlado para promover uma sensação de relaxamento e bem-estar, associado a cosméticos e técnicas manuais.',
    icon: Flame,
    img: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=800&auto=format&fit=crop',
    featured: true,
    hasDetailPage: true,
  },
  {
    slug: 'drenagem-pos-operatoria',
    num: '05',
    title: 'Drenagem Pós-Operatória',
    category: 'corporal',
    summary: 'A drenagem pós-operatória é uma técnica manual realizada de forma delicada e específica para auxiliar na recuperação após procedimentos cirúrgicos, sempre respeitando a liberação e orientação do cirurgião responsável.\n\nSeu objetivo é contribuir para o conforto do paciente, auxiliar na redução do inchaço característico do período pós-operatório e favorecer o processo de recuperação por meio de manobras adequadas e individualizadas. O protocolo é definido conforme o tipo de cirurgia e as necessidades de cada pessoa, priorizando segurança e acompanhamento profissional.',
    catalogSummary: 'Técnica manual delicada para auxiliar na recuperação e redução de inchaço após procedimentos cirúrgicos.',
    featuredSubheadline: 'Cuidado delicado durante a recuperação.',
    featuredDescription: 'Técnica manual delicada e específica para auxiliar na recuperação e na redução do inchaço após cirurgias, sempre respeitando a orientação do cirurgião.',
    icon: Droplets,
    img: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=800&auto=format&fit=crop',
    featured: true,
    hasDetailPage: true,
  },

  // ---- Demais Faciais ----
  {
    slug: 'limpeza-de-pele',
    title: 'Limpeza de Pele',
    category: 'facial',
    summary: 'Cuidado facial voltado à higienização e manutenção da pele, realizado conforme suas necessidades.',
    icon: Sparkles,
    img: 'https://images.unsplash.com/photo-1761718209708-9ab9ba1c7252?q=80&w=800&auto=format&fit=crop',
    hasDetailPage: true,
  },
  {
    slug: 'radiofrequencia-facial',
    title: 'Radiofrequência Facial',
    category: 'facial',
    summary: 'Tecnologia utilizada em protocolos estéticos definidos após avaliação individual.',
    icon: Radio,
    img: 'https://images.unsplash.com/photo-1713085085470-fba013d67e65?q=80&w=800&auto=format&fit=crop',
    hasDetailPage: true,
  },
  {
    slug: 'peeling',
    title: 'Peeling',
    category: 'facial',
    summary: 'Procedimento estético voltado à renovação da pele, com protocolo definido após avaliação.',
    icon: Layers,
    img: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=800&auto=format&fit=crop',
    hasDetailPage: true,
  },
  {
    slug: 'ultrassom-facial',
    title: 'Ultrassom Facial',
    category: 'facial',
    summary: 'Tecnologia aplicada em protocolos estéticos conforme objetivos e avaliação individual.',
    icon: Waves,
    img: 'https://images.unsplash.com/photo-1706795033728-9232ef548a16?q=80&w=800&auto=format&fit=crop',
    hasDetailPage: true,
  },

  // ---- Demais Corporais ----
  {
    slug: 'massagem-relaxante',
    title: 'Massagem Relaxante',
    category: 'corporal',
    summary: 'Técnica manual voltada ao relaxamento, conforto e sensação de bem-estar.',
    icon: HandHeart,
    img: 'https://images.unsplash.com/photo-1639162906614-0603b0ae95fd?q=80&w=800&auto=format&fit=crop',
    hasDetailPage: true,
  },
  {
    slug: 'ventosas',
    title: 'Ventosas',
    category: 'corporal',
    summary: 'Técnica complementar aplicada conforme avaliação e necessidades individuais.',
    icon: Wind,
    img: 'https://images.unsplash.com/photo-1598555748505-ccca0d9b9f7b?q=80&w=800&auto=format&fit=crop',
    hasDetailPage: true,
  },
  {
    slug: 'drenagem-linfatica',
    title: 'Drenagem Linfática',
    category: 'corporal',
    summary: 'Técnica manual voltada ao conforto e à sensação de leveza.',
    icon: Droplets,
    img: 'https://images.unsplash.com/photo-1712638932314-e2b185ca0930?q=80&w=800&auto=format&fit=crop',
    hasDetailPage: true,
  },
  {
    slug: 'massagem-modeladora',
    title: 'Massagem Modeladora',
    category: 'corporal',
    summary: 'Técnica manual aplicada conforme objetivos e necessidades individuais.',
    icon: Activity,
    img: 'https://images.unsplash.com/photo-1741522509438-a120c0bb5e88?q=80&w=800&auto=format&fit=crop',
    hasDetailPage: true,
  },
  {
    slug: 'radiofrequencia-corporal',
    title: 'Radiofrequência Corporal',
    category: 'corporal',
    summary: 'Tecnologia utilizada em protocolos estéticos definidos após avaliação individual.',
    icon: Radio,
    img: 'https://images.unsplash.com/photo-1761819922058-d15028ed9817?q=80&w=800&auto=format&fit=crop',
    hasDetailPage: true,
  },
  {
    slug: 'correntes',
    title: 'Correntes',
    category: 'corporal',
    summary: 'Recurso utilizado em protocolos corporais conforme avaliação profissional.',
    icon: Zap,
    img: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?q=80&w=800&auto=format&fit=crop',
    hasDetailPage: true,
  },
  {
    slug: 'ultrassom-corporal',
    title: 'Ultrassom Corporal',
    category: 'corporal',
    summary: 'Tecnologia aplicada em protocolos estéticos conforme objetivos e avaliação individual.',
    icon: Waves,
    img: 'https://images.unsplash.com/photo-1598300195998-364bf445842c?q=80&w=800&auto=format&fit=crop',
    hasDetailPage: true,
  },
];

export const FEATURED_TREATMENTS = TREATMENTS_CATALOG.filter((t) => t.featured);

export const CATEGORY_LABELS = {
  facial: 'Faciais',
  corporal: 'Corporais',
  depilacao: 'Depilação',
};

// Ordem canônica de exibição por categoria na página /tratamentos (catálogo completo).
// Independente da ordem de armazenamento acima (que preserva a sequência já aprovada
// da seção "Tratamentos em Destaque" da Home). Usada para numerar os cards (01, 02...).
export const CATALOG_ORDER = {
  facial: [
    'limpeza-de-pele',
    'jato-de-plasma',
    'radiofrequencia-facial',
    'peeling',
    'microagulhamento-facial',
    'ultrassom-facial',
  ],
  corporal: [
    'massagem-relaxante',
    'ventosas',
    'detox-corporal',
    'drenagem-linfatica',
    'drenagem-pos-operatoria',
    'massagem-modeladora',
    'radiofrequencia-corporal',
    'correntes',
    'ultrassom-corporal',
  ],
  depilacao: ['laser-hakon-4d'],
};

// Retorna os tratamentos de uma categoria já ordenados e numerados conforme CATALOG_ORDER.
export function getCatalogByCategory(category) {
  return CATALOG_ORDER[category]
    .map((slug, i) => {
      const t = getTreatmentBySlug(slug);
      return t ? { ...t, catalogNum: String(i + 1).padStart(2, '0') } : null;
    })
    .filter(Boolean);
}

export function getTreatmentBySlug(slug) {
  return TREATMENTS_CATALOG.find((t) => t.slug === slug);
}

// Ícone usado no selo/badge do Hero e em pequenos acentos — mantido aqui para reuso.
export { Wand2 as PlasmaIcon };
