export interface NavLink {
  label: string;
  href: string;
}

export interface BrandInfo {
  name: string;
  professional: string;
  role: string;
  focus: string;
  experienceYears: number;
  tagline: string;
}

export interface ContactInfo {
  whatsappNumber: string;
  whatsappDisplay: string;
  email: string;
  instagramHandle: string;
  instagramUrl: string;
}

export interface AddressInfo {
  /** Título da seção de Localização (ex.: "Atendimento em Guaraniaçu"). */
  title: string;
  street: string;
  reference: string;
  googleMapsUrl: string;
  wazeUrl: string;
  latitude: number;
  longitude: number;
}

/** Uma foto do carrossel do Hero. `position` é o `object-position` padrão
 * (desktop); `positionTablet`/`positionMobile` são variantes opcionais só
 * quando o enquadramento da foto pede um ajuste por faixa de tela (ver
 * `.hero-image-media` em src/index.css). */
export interface HeroImage {
  src: string;
  alt: string;
  position: string;
  positionTablet?: string;
  positionMobile?: string;
}

export interface HeroContent {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  images: HeroImage[];
}

export interface BrandLoopContent {
  items: string[];
  ariaLabel: string;
}

export interface ManifestoContent {
  title: string;
  text: string;
}

export interface AboutContent {
  title: string;
  text: string;
  highlights: string[];
}

export interface PurposeContent {
  eyebrow: string;
  heading: string;
  subheading: string;
  purposeTitle: string;
  purposeText: string;
  objectiveTitle: string;
  objectiveText: string;
}

export interface DifferentialContent {
  eyebrow: string;
  title: string;
  text: string;
  closing: string;
}

export interface ValueItem {
  title: string;
  text: string;
}

export interface ExperienceBlock {
  title: string;
  text: string;
}

export interface ExperienceContent {
  title: string;
  text: string;
  additionalBlocks: ExperienceBlock[];
}

export interface FacadeContent {
  title: string;
  years: number;
  yearsLabel: string;
  clients: number;
  clientsLabel: string;
  text: string;
}

export interface TreatmentCategory {
  id: string;
  name: string;
  description: string;
}

/** Uma das 4 grandes categorias de "Encontre o cuidado ideal para você" --
 * `treatmentIds` aponta direto para `treatments[].id` do catálogo oficial
 * (fonte única, sem duplicar nome/dados do tratamento aqui). */
export interface TreatmentCategoryGroup {
  id: string;
  title: string;
  treatmentIds: string[];
}

export interface TreatmentCategoryGroupsContent {
  title: string;
  text: string;
  items: TreatmentCategoryGroup[];
}

export interface TreatmentSpecialOffer {
  active: boolean;
  title?: string;
  description?: string;
  originalPrice?: string;
  promoPrice?: string;
  validUntil?: string;
}

/** Estrutura única para um item de mídia do tratamento (card e modal de
 * detalhes) -- substitui o antigo campo `image` solto. `poster` só se aplica
 * a vídeo (miniatura exibida antes do play e usada como imagem nos cards,
 * que nunca reproduzem vídeo). Enquanto ausente, os componentes mostram um
 * placeholder elegante em vez de imagem quebrada ou espaço vazio. */
export interface TreatmentMedia {
  type: 'image' | 'video';
  src: string;
  poster?: string;
  alt: string;
}

export interface Treatment {
  id: string;
  name: string;
  /** Nome técnico/comercial real, exibido logo abaixo do nome principal
   * quando existir. */
  subtitle?: string;
  categoryId?: string;
  /** Capa oficial exclusiva do card (Tratamentos e catálogo do Agendamento)
   * -- nunca usada dentro do modal de detalhes, galeria de procedimento,
   * antes/depois ou vídeos, que continuam vindo só de `media`/`beforeAfter`.
   * Enquanto ausente, o card mostra um placeholder neutro
   * (`PlaceholderMedia`) no lugar. */
  coverImage?: string;
  /** Resumo breve (120-170 caracteres), nunca exibido -- só usado para
   * encontrar o tratamento pela busca da grade de Tratamentos
   * (`Treatments.tsx`), além do nome. Não é o texto da capa. */
  summary?: string;
  /** Frase curta (1-2 linhas) exibida na própria capa, abaixo do nome --
   * deliberadamente bem mais curta que `summary`, para caber numa área
   * padronizada e igual em todos os cards. */
  shortCoverDescription?: string;
  /** Explicação completa exibida no modal de detalhes. */
  description?: string;
  /** Mídia do conteúdo "Procedimento" no showcase do modal -- imagens e/ou
   * vídeos, navegados em carrossel quando há mais de um item. */
  media?: TreatmentMedia[];
  indication?: string;
  howItWorks?: string;
  benefits?: string[];
  sessions?: string;
  duration?: string;
  careBefore?: string[];
  careAfter?: string[];
  contraindications?: string[];
  price?: string;
  professional?: string;
  whatsappMessage?: string;
  /** Imagens do conteúdo "Antes/Depois" no showcase do modal -- cada item já
   * é uma foto composta (antes e depois na mesma imagem), por isso reaproveita
   * `TreatmentMedia` em vez de um par de campos separados; navegadas em
   * carrossel quando há mais de uma. */
  beforeAfter?: TreatmentMedia[];
  specialOffer?: TreatmentSpecialOffer;
}

export type CredentialType =
  | 'formacao'
  | 'especializacao'
  | 'curso'
  | 'certificado'
  | 'tecnologia'
  | 'evento';

export interface CredentialItem {
  id: string;
  type: CredentialType;
  title: string;
  institution?: string;
  year?: string;
  hours?: string;
  description?: string;
  image?: string;
}

export interface CredentialsContent {
  title: string;
  text: string;
  moduleTitle: string;
  moduleTeaser: string;
  moduleCta: string;
  notice: string;
  items: CredentialItem[];
}

export interface FinalCtaContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  text: string;
  primaryCta: { label: string; href: string };
  secondaryCtaLabel: string;
}

export interface AftercareContent {
  title: string;
  text: string;
  cta: { label: string; href: string };
}

export interface ThoughtfulDetailsContent {
  title: string;
  text: string;
}

export interface TechnologyItem {
  id: string;
  name: string;
  purpose: string;
  benefit?: string;
}

export interface TechnologiesContent {
  title: string;
  text: string;
  notice: string;
  items: TechnologyItem[];
}

export interface InstagramContent {
  title: string;
  text: string;
  ctaLabel: string;
}

export interface LegalPolicySection {
  heading: string;
  text: string;
}

export interface LegalPolicyContent {
  title: string;
  reviewNotice?: string;
  sections: LegalPolicySection[];
}

export interface LegalContent {
  privacyPolicy: LegalPolicyContent;
  cancellationPolicy: LegalPolicyContent;
}

export interface SchedulingConsentContent {
  label: string;
  error: string;
}

export interface Review {
  id: string;
  author: string;
  text: string;
  rating: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SeoContent {
  title: string;
  description: string;
  ogImage?: string;
}

export interface FooterContent {
  developedByPrefix: string;
  developerName: string;
  developerWhatsappNumber: string;
  developerWhatsappMessage: string;
  copyright: string;
}

/** Destaque da campanha recorrente "Laser Day" -- sem data, preço ou
 * detalhes técnicos ainda confirmados; o CTA só consulta pelo WhatsApp. */
export interface LaserDayContent {
  title: string;
  text: string;
  ctaLabel: string;
}

export interface SiteContent {
  brand: BrandInfo;
  contact: ContactInfo;
  address: AddressInfo;
  nav: NavLink[];
  headerCta: { label: string; href: string };
  hero: HeroContent;
  brandLoop: BrandLoopContent;
  manifesto: ManifestoContent;
  about: AboutContent;
  purpose: PurposeContent;
  differential: DifferentialContent;
  values: ValueItem[];
  howItWorks: { title: string; text: string; steps: { title: string; text: string }[] };
  experience: ExperienceContent;
  facade: FacadeContent;
  credentials: CredentialsContent;
  treatmentCategoryGroups: TreatmentCategoryGroupsContent;
  treatmentCategories: TreatmentCategory[];
  treatments: Treatment[];
  laserDay: LaserDayContent;
  aftercare: AftercareContent;
  thoughtfulDetails: ThoughtfulDetailsContent;
  technologies: TechnologiesContent;
  instagramShowcase: InstagramContent;
  finalCta: FinalCtaContent;
  reviews: Review[];
  reviewsNotice: string;
  faq: FaqItem[];
  seo: SeoContent;
  footer: FooterContent;
  legal: LegalContent;
  schedulingConsent: SchedulingConsentContent;
  whatsappDefaultMessage: string;
}
