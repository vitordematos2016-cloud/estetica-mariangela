/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Identidade oficial estrita da logo Mariangela Schinaider Estética
        mauve: "#CFBFC0",          // Nude/rosa base
        background: "#F5EEEE",     // Fundo principal mais claro
        card: "#E7DADB",           // Tom intermediário para cards e fundos de blocos
        primary: "#392A27",        // Marrom mais escuro para títulos principais (contraste alto)
        accent: "#4D3A36",         // Marrom oficial (base para botões, destaques e ícones)
        secondary: "#715955",      // Textos secundários, descrições
        "white-warm": "#FFF8F6",   // Texto claro sobre áreas escuras (botões accent)
        "accent-light": "#CFBFC0", // Tom de base para linhas, bordas sutis e divisores
        "brown-soft": "#B79F98",
        "brown-dark": "#594741",
        "coffee-deep": "#4A332C",
        "coffee-light": "#654E46",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Outfit", "sans-serif"],
        drama: ["Cormorant Garamond", "serif"],
      },
      borderRadius: {
        '2rem': '2rem',
        '3rem': '3rem',
        '4rem': '4rem',
      }
    },
  },
  plugins: [],
}
