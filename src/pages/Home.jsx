import useSeo from '../hooks/useSeo.js';
import Hero from '../sections/Hero.jsx';
import Features from '../sections/Features.jsx';
import AboutTeaser from '../sections/AboutTeaser.jsx';
import Protocol from '../sections/Protocol.jsx';
import Journey from '../sections/Journey.jsx';
import Payments from '../sections/Payments.jsx';
import FaqPreview from '../sections/FaqPreview.jsx';
import Location from '../sections/Location.jsx';
import SocialGrid from '../sections/SocialGrid.jsx';

const Home = () => {
  useSeo({
    title: 'Estética em Guaraniaçu',
    description: 'Tratamentos estéticos faciais e corporais personalizados em Guaraniaçu, Paraná. Agendamento pelo WhatsApp.',
    path: '/',
  });

  // Ordem física = ordem do menu: início → tratamentos → sobre → diferenciais → (conteúdo
  // complementar, sem id próprio, cai no scrollspy da seção anterior) → faq → contato → (idem).
  return (
    <>
      <Hero />
      <Protocol />
      <AboutTeaser />
      <Features />
      <Journey />
      <Payments />
      <FaqPreview />
      <Location />
      <SocialGrid />
    </>
  );
};

export default Home;
