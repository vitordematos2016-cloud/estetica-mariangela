import { useCallback, useEffect, useState } from 'react';
import { SelectionProvider } from './context/SelectionContext';
import { RequestProvider } from './context/RequestContext';
import { TreatmentsFilterProvider, useTreatmentsFilter } from './context/TreatmentsFilterContext';
import { siteContent } from './data/siteContent';
import { parseTreatmentHash } from './utils/treatmentDeepLink';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Splash } from './components/layout/Splash';
import { CompactReloadIntro } from './components/layout/CompactReloadIntro';
import { SelectionWidget } from './components/selection/SelectionWidget';
import { RequestModal } from './components/request/RequestModal';
import { BackToTop } from './components/ui/BackToTop';
import { Hero } from './components/sections/Hero';
import { BrandLoop } from './components/sections/BrandLoop';
import { Manifesto } from './components/sections/Manifesto';
import { About } from './components/sections/About';
import { Purpose } from './components/sections/Purpose';
import { Differentials } from './components/sections/Differentials';
import { TreatmentCategories } from './components/sections/TreatmentCategories';
import { Treatments } from './components/sections/Treatments';
import { LaserDay } from './components/sections/LaserDay';
import { HowItWorks } from './components/sections/HowItWorks';
import { Aftercare } from './components/sections/Aftercare';
import { Experience } from './components/sections/Experience';
import { ThoughtfulDetails } from './components/sections/ThoughtfulDetails';
import { FacadeYears } from './components/sections/FacadeYears';
import { Reviews } from './components/sections/Reviews';
import { Faq } from './components/sections/Faq';
import { InstagramShowcase } from './components/sections/InstagramShowcase';
import { Scheduling } from './components/sections/Scheduling';
import { Location } from './components/sections/Location';
import { FinalCta } from './components/sections/FinalCta';
import { wasSplashAlreadyShown } from './utils/splashSession';

type OpeningType = 'completa' | 'compacta' | 'finalizada';

/**
 * Resolve o `#hash` da URL logo no carregamento inicial, antes de qualquer
 * interação -- roda uma única vez, dentro do `TreatmentsFilterProvider`
 * porque precisa de `requestDeepLinkTreatment`. Cobre três casos:
 *
 * - Reload: sempre limpa o hash e força o topo (comportamento já existente,
 *   nunca restaura a rolagem/estado anterior).
 * - Link direto para um tratamento válido (`#tratamento-{id}`): não abre um
 *   modal quebrado -- registra o id pendente para a seção Tratamentos
 *   localizar e abrir corretamente.
 * - Qualquer outro hash (inválido, de um id que não existe mais no catálogo,
 *   etc.): limpa o hash em vez de deixá-lo inerte ou apontando para nada.
 */
function TreatmentDeepLinkGate() {
  const { requestDeepLinkTreatment } = useTreatmentsFilter();

  useEffect(() => {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined;
    const wasReloaded = navigationEntry?.type === 'reload';

    if (wasReloaded) {
      if (window.location.hash) {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      return;
    }

    const treatmentId = parseTreatmentHash(window.location.hash);
    if (!treatmentId) return;

    if (siteContent.treatments.some((item) => item.id === treatmentId)) {
      requestDeepLinkTreatment(treatmentId);
    } else {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }
  }, [requestDeepLinkTreatment]);

  return null;
}

function App() {
  const [openingType, setOpeningType] = useState<OpeningType>(() =>
    wasSplashAlreadyShown() ? 'compacta' : 'completa',
  );

  // Recarregar a página deve sempre trazer a cliente de volta ao topo, na
  // seção Início — nunca restaurar a rolagem anterior (ex.: parada em
  // "Tratamentos" ou "Instagram"). O navegador restaura scroll sozinho por
  // padrão em reloads; desativamos isso aqui. A limpeza do #hash em reloads e
  // a abertura de um link direto (`#tratamento-{id}`) ficam no
  // `TreatmentDeepLinkGate` abaixo, porque dependem do `TreatmentsFilterContext`.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    return () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []);

  const finishOpening = useCallback(() => {
    setOpeningType('finalizada');

    // Segunda garantia: a splash/abertura compacta cobre a tela inteira
    // enquanto ativa, então isso é invisível para a cliente — só assegura
    // que, no instante em que o site é revelado, ele já está no topo.
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.getElementById('inicio')?.scrollIntoView({ behavior: 'auto', block: 'start' });
    });
  }, []);

  return (
    <SelectionProvider>
      <RequestProvider>
        <TreatmentsFilterProvider>
          <TreatmentDeepLinkGate />
          {openingType === 'completa' && <Splash onFinish={finishOpening} />}
          {openingType === 'compacta' && <CompactReloadIntro onFinish={finishOpening} />}
          <Header />
          <main>
            <Hero splashFinished={openingType === 'finalizada'} />
            <BrandLoop />
            <Manifesto />
            <About />
            <Purpose />
            <Differentials />
            <TreatmentCategories />
            <Treatments />
            <LaserDay />
            <HowItWorks />
            <Aftercare />
            <Experience />
            <ThoughtfulDetails />
            <FacadeYears />
            <Reviews />
            <Faq />
            <InstagramShowcase />
            <Scheduling />
            <Location />
            <FinalCta />
          </main>
          <Footer />
          <SelectionWidget />
          <RequestModal />
          <BackToTop />
        </TreatmentsFilterProvider>
      </RequestProvider>
    </SelectionProvider>
  );
}

export default App;
