import type { SiteContent } from '../types/siteContent';

/**
 * Fonte única de conteúdo do site. Nenhum texto deve ser escrito diretamente
 * nos componentes — tudo vem daqui.
 *
 * Estética Mariangela -- conteúdo atualizado com as informações reais e
 * confirmadas (bio/legendas do Instagram @estetica_mariangela, verificado em
 * 2026-08-06). Tudo que ainda não foi confirmado permanece vazio/oculto
 * (ver `docs/PENDENCIAS_CLIENTE.md`) -- nenhum dado foi inventado.
 */
export const siteContent: SiteContent = {
  brand: {
    name: 'Estética Mariangela',
    // Só o primeiro nome é usado publicamente: a grafia do sobrenome
    // (Schinaider/Schneider) e o uso do acento (Mariangela/Mariângela) ainda
    // não foram confirmados -- ver docs/PENDENCIAS_CLIENTE.md.
    professional: 'Mariangela',
    role: 'Profissional de estética',
    focus: 'Estética facial e corporal',
    experienceYears: 0, // Não confirmado -- ver docs/PENDENCIAS_CLIENTE.md (FacadeYears fica oculto enquanto 0)
    tagline: 'Especialista em transformar e cuidar',
  },

  contact: {
    // Número confirmado pelo link da bio do Instagram @estetica_mariangela.
    whatsappNumber: '5545998498847',
    whatsappDisplay: '(45) 99849-8847',
    // E-mail ainda não confirmado -- nenhum link de e-mail é exibido.
    email: '',
    instagramHandle: '@estetica_mariangela',
    instagramUrl: 'https://www.instagram.com/estetica_mariangela/',
  },

  address: {
    title: 'Atendimento em Guaraniaçu',
    // Endereço comercial divulgado no Instagram -- diferente do endereço
    // fiscal do CNPJ, que não deve ser usado aqui. Sem número do imóvel,
    // CEP, coordenadas ou link de mapa ainda confirmados: os botões de
    // Google Maps/Waze permanecem ocultos (ver src/utils/links.ts).
    street: 'Avenida Abilon de Souza Naves — sala acima do Banco Sicoob, em frente ao Hotel Dallas',
    reference: 'Guaraniaçu – PR',
    googleMapsUrl: '',
    wazeUrl: '',
    latitude: 0,
    longitude: 0,
  },

  nav: [
    { label: 'Início', href: '#inicio' },
    { label: 'Sobre', href: '#sobre' },
    { label: 'Tratamentos', href: '#tratamentos' },
    { label: 'Experiência', href: '#experiencia' },
    { label: 'Avaliações', href: '#avaliacoes' },
    { label: 'Localização', href: '#localizacao' },
  ],

  headerCta: { label: 'Solicitar atendimento', href: '#agendamento' },

  hero: {
    eyebrow: 'Estética facial e corporal em Guaraniaçu',
    title: 'Especialista em transformar e cuidar',
    description:
      'Tratamentos faciais, corporais e depilação a laser em Guaraniaçu, com atendimento solicitado diretamente pelo WhatsApp.',
    primaryCta: { label: 'Conhecer tratamentos', href: '#tratamentos' },
    secondaryCta: { label: 'Solicitar atendimento', href: '#agendamento' },
    // Duas fotos profissionais reais, alternadas em crossfade -- ver
    // HeroImageCarousel.tsx. `position*` calibra o enquadramento (rosto
    // sempre visível, equipamento da 2ª foto não escondido); revisar
    // visualmente e ajustar se necessário.
    images: [
      {
        src: '/images/hero/mariangela-hero-01.webp',
        alt: 'Mariangela em seu espaço de atendimento estético',
        position: '50% 25%',
        positionTablet: '50% 22%',
        positionMobile: '50% 20%',
      },
      {
        src: '/images/hero/mariangela-hero-02.webp',
        alt: 'Mariangela apresentando equipamento utilizado em atendimentos estéticos',
        position: '48% 25%',
        positionTablet: '47% 22%',
        positionMobile: '48% 20%',
      },
    ],
  },

  brandLoop: {
    items: ['ESTÉTICA MARIANGELA', 'ESTÉTICA FACIAL', 'ESTÉTICA CORPORAL', 'DEPILAÇÃO A LASER', 'GUARANIAÇU – PR'],
    ariaLabel: 'Estética Mariangela — estética facial, corporal e depilação a laser em Guaraniaçu',
  },

  manifesto: {
    title: 'Título da seção',
    text: 'Descrição será adicionada.',
  },

  about: {
    title: 'Uma nova história construída por meio do cuidado',
    text:
      'Antes de ingressar na área da Estética, Mariangela trabalhou como professora de Artes. Em uma nova etapa da sua trajetória, decidiu fazer faculdade de Estética e iniciou uma reinvenção profissional. Hoje, seu trabalho reúne tratamentos faciais, corporais e depilação a laser, seguindo o propósito que apresenta em sua própria marca: transformar e cuidar.',
    highlights: [
      'Mariangela',
      'Professora de Artes em sua trajetória anterior',
      'Formação superior em Estética',
      'Atuação em estética facial e corporal',
      'Depilação a laser',
      'Atendimento em Guaraniaçu – PR',
    ],
  },

  purpose: {
    eyebrow: 'Nossa essência',
    heading: 'Transformar e cuidar',
    subheading:
      'A trajetória de Mariangela na Estética representa uma nova etapa profissional dedicada ao cuidado. O espaço reúne tratamentos faciais, corporais e depilação a laser para pessoas que desejam conhecer possibilidades de cuidado estético em Guaraniaçu.',
    purposeTitle: 'Propósito',
    purposeText: 'Transformar e cuidar por meio da Estética.',
    objectiveTitle: 'Atuação',
    objectiveText: 'Oferecer tratamentos faciais, corporais e depilação a laser em Guaraniaçu.',
  },

  differential: {
    eyebrow: 'Nosso diferencial',
    title: 'Título da seção',
    text: 'Descrição será adicionada.',
    closing: 'Descrição será adicionada.',
  },

  values: [
    { title: 'Título da seção', text: 'Descrição será adicionada.' },
    { title: 'Título da seção', text: 'Descrição será adicionada.' },
    { title: 'Título da seção', text: 'Descrição será adicionada.' },
  ],

  howItWorks: {
    title: 'A jornada do seu tratamento',
    text: 'Descrição será adicionada.',
    steps: [
      { title: 'Avaliação', text: 'Descrição será adicionada.' },
      { title: 'Planejamento', text: 'Descrição será adicionada.' },
      { title: 'Procedimento', text: 'Descrição será adicionada.' },
      { title: 'Orientações', text: 'Descrição será adicionada.' },
      { title: 'Acompanhamento', text: 'Descrição será adicionada.' },
    ],
  },

  experience: {
    title: 'Título da seção',
    text: 'Descrição será adicionada.',
    additionalBlocks: [
      { title: 'Título da seção', text: 'Descrição será adicionada.' },
      { title: 'Título da seção', text: 'Descrição será adicionada.' },
    ],
  },

  facade: {
    title: 'Estética Mariangela',
    years: 0,
    yearsLabel: 'anos de experiência', // TODO: confirmar
    clients: 0,
    clientsLabel: 'clientes atendidos', // TODO: confirmar
    text: 'Descrição será adicionada.',
  },

  credentials: {
    title: 'Título da seção',
    text: 'Descrição será adicionada.',
    moduleTitle: 'Formações e Certificações',
    moduleTeaser: 'Descrição será adicionada.',
    moduleCta: 'Ver formações e certificações',
    notice: 'As formações e certificações profissionais serão adicionadas em breve.',
    items: [],
  },

  // 4 categorias neutras -- `treatmentIds` aponta para `treatments[].id`
  // abaixo. IDs de grupo preservados (usados para mapear o ícone de cada
  // categoria em TreatmentCategories.tsx); só os títulos exibidos viraram
  // placeholders neutros.
  treatmentCategoryGroups: {
    title: 'Encontre o cuidado ideal para você',
    text: 'Descrição será adicionada.',
    items: [
      { id: 'limpeza-glow', title: 'Categoria 01', treatmentIds: ['tratamento-02', 'tratamento-01', 'tratamento-03'] },
      { id: 'peelings-renovacao', title: 'Categoria 02', treatmentIds: ['tratamento-04', 'tratamento-05', 'tratamento-06'] },
      {
        id: 'alta-tecnologia',
        title: 'Categoria 03',
        treatmentIds: ['tratamento-08', 'tratamento-07', 'tratamento-09', 'tratamento-10'],
      },
      { id: 'remocao-especializada', title: 'Categoria 04', treatmentIds: ['tratamento-11', 'tratamento-12', 'tratamento-13'] },
    ],
  },

  treatmentCategories: [
    { id: 'limpeza-renovacao', name: 'Categoria 01', description: 'Descrição será adicionada.' },
    { id: 'estetica-regenerativa', name: 'Categoria 02', description: 'Descrição será adicionada.' },
    { id: 'rejuvenescimento', name: 'Categoria 03', description: 'Descrição será adicionada.' },
    { id: 'manchas-uniformizacao', name: 'Categoria 04', description: 'Descrição será adicionada.' },
    { id: 'acne-oleosidade', name: 'Categoria 05', description: 'Descrição será adicionada.' },
    { id: 'protocolos-personalizados', name: 'Categoria 06', description: 'Descrição será adicionada.' },
    { id: 'depilacao-tecnologias', name: 'Categoria 07', description: 'Descrição será adicionada.' },
  ],

  // Catálogo neutro com 13 tratamentos-placeholder -- preserva a mesma
  // quantidade e distribuição por categoria do catálogo original, para que
  // filtros, grade, modais, seleção e agendamento continuem funcionando
  // exatamente como antes. Nenhum campo de mídia (`coverImage`/`media`/
  // `beforeAfter`) é preenchido: os componentes já mostram um placeholder
  // neutro ("Imagem será adicionada") enquanto ausente.
  // TODO: substituir por nomes, descrições, categorias e mídia reais dos
  // tratamentos da Mariangela.
  treatments: [
    { id: 'tratamento-01', name: 'Tratamento 01', categoryId: 'limpeza-renovacao', shortCoverDescription: 'Descrição será adicionada.', summary: 'Descrição será adicionada.', description: 'Descrição será adicionada.' },
    { id: 'tratamento-02', name: 'Tratamento 02', categoryId: 'limpeza-renovacao', shortCoverDescription: 'Descrição será adicionada.', summary: 'Descrição será adicionada.', description: 'Descrição será adicionada.' },
    { id: 'tratamento-03', name: 'Tratamento 03', categoryId: 'limpeza-renovacao', shortCoverDescription: 'Descrição será adicionada.', summary: 'Descrição será adicionada.', description: 'Descrição será adicionada.' },
    { id: 'tratamento-04', name: 'Tratamento 04', categoryId: 'limpeza-renovacao', shortCoverDescription: 'Descrição será adicionada.', summary: 'Descrição será adicionada.', description: 'Descrição será adicionada.' },
    { id: 'tratamento-05', name: 'Tratamento 05', categoryId: 'limpeza-renovacao', shortCoverDescription: 'Descrição será adicionada.', summary: 'Descrição será adicionada.', description: 'Descrição será adicionada.' },
    { id: 'tratamento-06', name: 'Tratamento 06', categoryId: 'limpeza-renovacao', shortCoverDescription: 'Descrição será adicionada.', summary: 'Descrição será adicionada.', description: 'Descrição será adicionada.' },
    { id: 'tratamento-07', name: 'Tratamento 07', categoryId: 'estetica-regenerativa', shortCoverDescription: 'Descrição será adicionada.', summary: 'Descrição será adicionada.', description: 'Descrição será adicionada.' },
    { id: 'tratamento-08', name: 'Tratamento 08', categoryId: 'rejuvenescimento', shortCoverDescription: 'Descrição será adicionada.', summary: 'Descrição será adicionada.', description: 'Descrição será adicionada.' },
    { id: 'tratamento-09', name: 'Tratamento 09', categoryId: 'rejuvenescimento', shortCoverDescription: 'Descrição será adicionada.', summary: 'Descrição será adicionada.', description: 'Descrição será adicionada.' },
    { id: 'tratamento-10', name: 'Tratamento 10', categoryId: 'rejuvenescimento', shortCoverDescription: 'Descrição será adicionada.', summary: 'Descrição será adicionada.', description: 'Descrição será adicionada.' },
    { id: 'tratamento-11', name: 'Tratamento 11', categoryId: 'rejuvenescimento', shortCoverDescription: 'Descrição será adicionada.', summary: 'Descrição será adicionada.', description: 'Descrição será adicionada.' },
    { id: 'tratamento-12', name: 'Tratamento 12', categoryId: 'depilacao-tecnologias', shortCoverDescription: 'Descrição será adicionada.', summary: 'Descrição será adicionada.', description: 'Descrição será adicionada.' },
    { id: 'tratamento-13', name: 'Tratamento 13', categoryId: 'depilacao-tecnologias', shortCoverDescription: 'Descrição será adicionada.', summary: 'Descrição será adicionada.', description: 'Descrição será adicionada.' },
  ],

  // Campanha recorrente confirmada no Instagram -- sem data, preço,
  // desconto, nº de sessões, equipamento ou região atendida confirmados
  // ainda; o CTA só consulta pelo WhatsApp.
  laserDay: {
    title: 'Laser Day',
    text: 'Uma ação dedicada aos atendimentos de depilação a laser. Consulte pelo WhatsApp a próxima data disponível e as regiões atendidas.',
    ctaLabel: 'Consultar próxima data',
  },

  aftercare: {
    title: 'Dúvidas após o atendimento',
    text: 'Em caso de dúvidas após o atendimento, entre em contato diretamente pelo WhatsApp.',
    cta: { label: 'Solicitar atendimento', href: '#agendamento' },
  },

  // Sem conteúdo confirmado ainda -- seção oculta (ver ThoughtfulDetails.tsx).
  thoughtfulDetails: {
    title: 'Título da seção',
    text: 'Descrição será adicionada.',
  },

  technologies: {
    title: 'Tecnologias e produtos utilizados',
    text: 'Descrição será adicionada.',
    notice: 'Informações sobre tecnologias e produtos em atualização.',
    items: [],
  },

  instagramShowcase: {
    title: 'Acompanhe a Estética Mariangela',
    text: 'Veja conteúdos, novidades, tratamentos e informações divulgadas no perfil oficial.',
    ctaLabel: 'Acessar Instagram',
  },

  // Único depoimento público real e aproveitável encontrado (comentário no
  // Instagram) -- nenhuma outra avaliação foi criada. Sem nota/estrelas,
  // sem menção ao Google (não há confirmação de que seja do Google).
  reviews: [
    {
      id: 'dekka-magalhaes',
      author: '@dekka_magalhaes',
      text: 'O tratamento acabou com minhas manchas no rosto.',
      rating: 0,
    },
  ],
  reviewsNotice: 'As avaliações de clientes serão publicadas em breve.',

  // Só perguntas respondíveis com dados já confirmados -- ver
  // docs/PENDENCIAS_CLIENTE.md para as demais (preços, horários,
  // contraindicações, formas de pagamento, etc., ainda não confirmadas).
  faq: [
    {
      question: 'Onde fica a Estética Mariangela?',
      answer:
        'Na Avenida Abilon de Souza Naves, em uma sala acima do Banco Sicoob, em frente ao Hotel Dallas, em Guaraniaçu – PR.',
    },
    {
      question: 'Como solicitar informações?',
      answer: 'O contato pode ser realizado pelo WhatsApp (45) 99849-8847.',
    },
    {
      question: 'Quais categorias de atendimento são divulgadas?',
      answer: 'Tratamentos faciais, tratamentos corporais e depilação a laser.',
    },
    {
      question: 'Como consultar a próxima data do Laser Day?',
      answer: 'Entre em contato pelo WhatsApp para consultar a próxima data divulgada.',
    },
  ],

  finalCta: {
    eyebrow: 'Agende seu atendimento',
    title: 'Conheça os tratamentos da Estética Mariangela',
    titleHighlight: 'Estética Mariangela',
    text: 'Tratamentos faciais, corporais e depilação a laser em Guaraniaçu. Entre em contato para saber mais e consultar a disponibilidade de atendimento.',
    primaryCta: { label: 'Solicitar atendimento', href: '#agendamento' },
    secondaryCtaLabel: 'Falar com a especialista',
  },

  seo: {
    title: 'Estética Mariangela | Estética Facial e Corporal em Guaraniaçu',
    description:
      'Conheça os tratamentos faciais, corporais e a depilação a laser da Estética Mariangela, em Guaraniaçu – PR.',
  },

  footer: {
    developedByPrefix: 'Desenvolvido por ',
    developerName: 'Matos Soluções',
    developerWhatsappNumber: '5545933005119',
    developerWhatsappMessage:
      'Olá! Acessei o site da Estética Mariangela e vi que ele foi desenvolvido pela Matos Soluções. Gostaria de conversar sobre a criação ou modernização de um site para o meu negócio. Poderia me explicar como funciona?',
    copyright: '© Estética Mariangela. Todos os direitos reservados.',
  },

  legal: {
    privacyPolicy: {
      title: 'Política de Privacidade',
      sections: [
        {
          heading: 'Quais dados são coletados',
          text: 'Ao preencher o formulário de solicitação de atendimento ou entrar em contato pelo site, coletamos apenas os dados informados voluntariamente: nome e tratamento de interesse.',
        },
        {
          heading: 'Como esses dados são usados',
          text: 'As informações são usadas exclusivamente para responder à sua solicitação de contato ou agendamento pelo WhatsApp, e não são utilizadas para nenhuma outra finalidade.',
        },
        {
          heading: 'Compartilhamento',
          text: 'Os dados informados não são vendidos, compartilhados ou repassados a terceiros.',
        },
      ],
    },
    // Sem prazo mínimo, multa ou regra de sinal confirmados ainda -- só a
    // orientação de canal (WhatsApp), que já é verdadeira independente de
    // qualquer confirmação futura (ver docs/PENDENCIAS_CLIENTE.md).
    cancellationPolicy: {
      title: 'Política de Cancelamento e Reagendamento',
      sections: [
        {
          heading: 'Como cancelar ou reagendar',
          text: 'Cancelamentos e reagendamentos devem ser solicitados diretamente pelo WhatsApp.',
        },
      ],
    },
  },

  schedulingConsent: {
    label: 'Autorizo o contato via WhatsApp para tratar desta solicitação.',
    error: 'É necessário autorizar o contato via WhatsApp para continuar.',
  },

  whatsappDefaultMessage:
    'Olá, Mariangela! Vim pelo site da Estética Mariangela e gostaria de solicitar informações sobre um atendimento.',
};
