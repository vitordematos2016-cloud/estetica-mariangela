import { siteContent } from '../data/siteContent';
import { Button } from './ui/Button';

/**
 * Pronta para uso quando o site adotar roteamento com múltiplas páginas.
 * O site atual é uma única página de âncoras (sem rotas), então este
 * componente não está montado em nenhum lugar — ver docs/PENDENCIAS_CLIENTE.md.
 */
export function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-cream px-6 text-center">
      <span className="font-heading text-6xl text-gold/70">404</span>
      <h1 className="text-2xl text-brown-dark sm:text-3xl">Página não encontrada</h1>
      <p className="max-w-md text-base leading-relaxed text-brown/70">
        A página que você procura não existe ou foi movida. Volte para o início do site da{' '}
        {siteContent.brand.name}.
      </p>
      <Button href="/" variant="primary">
        Voltar ao início
      </Button>
    </main>
  );
}
