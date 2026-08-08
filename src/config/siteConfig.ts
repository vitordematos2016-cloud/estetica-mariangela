export const siteConfig = {
  locale: 'pt-BR',
  timezone: 'America/Sao_Paulo',
  siteUrl: 'https://estetica-mariangela.matossolucoes.com',
  // Paleta neutra (branco/cinza/grafite), sem identidade visual definida --
  // ver também as variáveis de tema em `src/index.css` (`@theme`), fonte
  // única usada pelos componentes via classes Tailwind (`bg-cream`,
  // `text-brown-dark`, `border-gold`, etc.). Os nomes das chaves foram
  // mantidos por compatibilidade com o restante do código.
  colors: {
    creamLight: '#f3e5e1',
    beigeMedium: '#f3e5e1',
    gold: '#ead3cd',
    brown: '#694e47',
    brownDark: '#2a1b18',
    white: '#f3e5e1',
  },
  fonts: {
    heading: "'Cormorant Garamond', serif",
    body: "'Jost', sans-serif",
  },
  scheduling: {
    openingHour: 8,
    closingHour: 19,
    slotIntervalMinutes: 30,
  },
} as const;

export type SiteConfig = typeof siteConfig;
