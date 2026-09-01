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
    img: '/capas-tratamentos-facial/microagulhamento-facial.webp',
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
    img: '/capas-tratamentos-facial/jato-de-plasma.webp',
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
    img: '/capa-laser-hakon-4d.png',
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
    img: '/capas-tratamentos-corporal/detox-corporal.jpg',
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
    img: '/capas-tratamentos-corporal/drenagem-pos-operatoria.jpg',
    featured: true,
    hasDetailPage: true,
  },

  // ---- Demais Faciais ----
  {
    slug: 'limpeza-de-pele',
    title: 'Limpeza de Pele',
    category: 'facial',
    summary: 'A Limpeza de Pele é um cuidado estético voltado à higienização mais completa da pele, auxiliando na remoção de resíduos, excesso de oleosidade, células superficiais acumuladas e comedões quando a extração for indicada.\n\nO protocolo pode envolver etapas como higienização, esfoliação, preparo da pele, extração cuidadosa e aplicação de produtos adequados às características de cada pessoa.\n\nO atendimento deve ser adaptado ao tipo e às condições da pele, buscando proporcionar uma aparência mais limpa, uniforme e bem cuidada.',
    icon: Sparkles,
    img: '/capas-tratamentos-facial/limpeza-de-pele.webp',
    hasDetailPage: true,
  },
  {
    slug: 'radiofrequencia-facial',
    title: 'Radiofrequência Facial',
    category: 'facial',
    summary: 'A Radiofrequência Facial é um procedimento não invasivo que utiliza energia de radiofrequência para produzir aquecimento controlado nos tecidos.\n\nEsse aquecimento é utilizado em protocolos estéticos relacionados à remodelação do colágeno e pode contribuir progressivamente para a aparência de firmeza, textura e qualidade da pele.\n\nO tratamento deve ser realizado com parâmetros adequados ao equipamento utilizado e às características individuais da pele, sempre após avaliação profissional.',
    icon: Radio,
    img: '/capas-tratamentos-facial/radiofrequencia-facial.webp',
    hasDetailPage: true,
  },
  {
    slug: 'peeling',
    title: 'Peeling',
    category: 'facial',
    summary: 'O Peeling é um procedimento de renovação da superfície da pele realizado de forma controlada, utilizando produtos e protocolos selecionados de acordo com as características e necessidades de cada pessoa.\n\nDependendo do tipo de peeling utilizado, ele pode contribuir para uma pele com aparência mais uniforme, luminosa e suave, além de integrar protocolos voltados à textura, tonalidade irregular e sinais superficiais de fotoenvelhecimento.\n\nA intensidade e o tipo do procedimento devem ser definidos individualmente, pois diferentes peelings possuem diferentes níveis de ação e cuidados posteriores.',
    icon: Layers,
    img: '/capas-tratamentos-facial/peeling.webp',
    hasDetailPage: true,
  },
  {
    slug: 'ultrassom-facial',
    title: 'Ultrassom Facial',
    category: 'facial',
    summary: 'O Ultrassom Facial é um recurso tecnológico que utiliza ondas acústicas de alta frequência em protocolos estéticos.\n\nSeus efeitos dependem do tipo de equipamento, frequência, intensidade e parâmetros utilizados. Conforme o protocolo escolhido, pode ser utilizado como recurso complementar para promover efeitos térmicos controlados nos tecidos ou auxiliar a permeação de produtos tópicos compatíveis.\n\nCada aplicação deve ser planejada de acordo com a finalidade do atendimento, as características da pele e as especificações do equipamento utilizado.',
    icon: Waves,
    img: '/capas-tratamentos-facial/ultrassom-facial.webp',
    hasDetailPage: true,
  },

  // ---- Demais Corporais ----
  {
    slug: 'massagem-relaxante',
    title: 'Massagem Relaxante',
    category: 'corporal',
    summary: 'A Massagem Relaxante utiliza manobras manuais realizadas sobre os tecidos moles do corpo, com movimentos e pressões ajustados ao conforto e às necessidades de cada pessoa.\n\nO objetivo principal é proporcionar uma experiência de relaxamento, conforto e bem-estar, podendo também contribuir para a redução da sensação de tensão muscular.\n\nO atendimento é realizado de forma personalizada, criando um momento dedicado ao descanso e ao autocuidado.',
    icon: HandHeart,
    img: '/capas-tratamentos-corporal/massagem-relaxante.jpg',
    hasDetailPage: true,
  },
  {
    slug: 'ventosas',
    title: 'Ventosas',
    category: 'corporal',
    summary: 'A Ventosaterapia utiliza copos específicos que produzem pressão negativa controlada sobre determinadas regiões da pele.\n\nNa estética e em práticas de bem-estar, pode ser utilizada como uma técnica complementar dentro de protocolos corporais, especialmente quando o objetivo é proporcionar uma experiência de cuidado, relaxamento e trabalho manual dos tecidos.\n\nA resposta varia de pessoa para pessoa e é comum que a aplicação deixe marcas temporárias na pele, que tendem a desaparecer naturalmente.',
    icon: Wind,
    img: '/capas-tratamentos-corporal/ventosas.jpg',
    hasDetailPage: true,
  },
  {
    slug: 'drenagem-linfatica',
    title: 'Drenagem Linfática',
    category: 'corporal',
    summary: 'A Drenagem Linfática é uma técnica manual caracterizada por movimentos suaves, rítmicos e direcionados, realizados com o objetivo de favorecer o deslocamento do líquido linfático.\n\nQuando adequadamente indicada, pode contribuir para o conforto, sensação de leveza e manejo do acúmulo de líquidos nos tecidos.\n\nA técnica deve respeitar as características e necessidades individuais de cada pessoa e não deve ser apresentada como método de emagrecimento.',
    icon: Droplets,
    img: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?q=80&w=800&auto=format&fit=crop',
    hasDetailPage: true,
  },
  {
    slug: 'massagem-modeladora',
    title: 'Massagem Modeladora',
    category: 'corporal',
    summary: 'A Massagem Modeladora é uma técnica manual corporal realizada com movimentos mais firmes, ritmados e direcionados do que aqueles normalmente utilizados em uma massagem de relaxamento.\n\nEla é utilizada em protocolos estéticos voltados ao cuidado corporal e ao trabalho manual dos tecidos, sempre com intensidade adaptada ao conforto e às características individuais.\n\nPode integrar protocolos voltados à aparência corporal, mas não deve ser apresentada como um procedimento capaz de eliminar gordura ou provocar emagrecimento.',
    icon: Activity,
    img: '/capas-tratamentos-corporal/massagem-modeladora.jpg',
    hasDetailPage: true,
  },
  {
    slug: 'radiofrequencia-corporal',
    title: 'Radiofrequência Corporal',
    category: 'corporal',
    summary: 'A Radiofrequência Corporal utiliza energia eletromagnética para promover aquecimento controlado dos tecidos durante o procedimento.\n\nEsse recurso é utilizado em protocolos estéticos relacionados à remodelação do colágeno e pode contribuir para a aparência de firmeza da pele e, dependendo do equipamento e da indicação, integrar cuidados voltados à aparência da celulite.\n\nOs efeitos dependem da tecnologia utilizada, dos parâmetros aplicados e das características individuais de cada pessoa.',
    icon: Radio,
    img: '/capas-tratamentos-corporal/radiofrequencia-corporal.jpg',
    hasDetailPage: true,
  },
  {
    slug: 'correntes',
    title: 'Correntes Estéticas',
    category: 'corporal',
    summary: 'As Correntes Estéticas fazem parte dos recursos de eletroterapia e utilizam estímulos elétricos controlados, com intensidade e parâmetros definidos conforme o tipo de corrente, objetivo do protocolo e avaliação individual.\n\nDependendo da modalidade utilizada, podem atuar como recurso complementar em protocolos estéticos e de estimulação muscular.\n\nA aplicação deve sempre respeitar as indicações, contraindicações e especificações do equipamento utilizado.',
    icon: Zap,
    img: '/capas-tratamentos-corporal/correntes.jpg',
    hasDetailPage: true,
  },
  {
    slug: 'ultrassom-corporal',
    title: 'Ultrassom Corporal',
    category: 'corporal',
    summary: 'O Ultrassom Corporal utiliza ondas acústicas de alta frequência como recurso em diferentes protocolos estéticos.\n\nOs efeitos variam de acordo com a tecnologia, frequência, intensidade e finalidade do equipamento utilizado. Em determinados protocolos, o ultrassom pode produzir efeitos térmicos e mecânicos controlados nos tecidos e ser utilizado como complemento de cuidados corporais.\n\nPor existirem diferentes tipos de ultrassom estético, o protocolo deve ser definido após avaliação e de acordo com as especificações do equipamento disponível na clínica.',
    icon: Waves,
    img: '/capas-tratamentos-corporal/ultrassom-corporal.jpg',
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
