import useSeo from '../hooks/useSeo.js';
import SectionHero from '../components/SectionHero.jsx';

const TermosDeUso = () => {
  useSeo({
    title: 'Termos de Uso',
    description: 'Termos de uso do site institucional da Mariangela Schinaider Estética.',
    path: '/termos-de-uso',
  });

  return (
    <div>
      <SectionHero label="Legal" titleNormal="Termos de" titleItalic="uso." />
      <div className="max-w-2xl mx-auto px-6 md:px-12 pb-24 lg:pb-32 font-sans text-[15px] text-secondary leading-[1.8] flex flex-col gap-6">
        <p>
          Este site tem finalidade institucional e tem como objetivo apresentar a Mariangela Schinaider Estética, seus tratamentos e formas de contato.
        </p>

        <h2 className="font-drama text-primary text-[20px] mt-4">Conteúdo informativo</h2>
        <p>
          As informações sobre tratamentos apresentadas neste site têm caráter informativo e não substituem uma avaliação individual. Resultados, protocolos e número de sessões podem variar de pessoa para pessoa.
        </p>

        <h2 className="font-drama text-primary text-[20px] mt-4">Preços e valores</h2>
        <p>
          Este site não apresenta preços fixos. Os valores dos procedimentos e pacotes devem ser consultados diretamente pelo WhatsApp.
        </p>

        <h2 className="font-drama text-primary text-[20px] mt-4">Atualizações</h2>
        <p>
          As informações deste site podem ser atualizadas periodicamente, sem aviso prévio, para refletir mudanças reais nos serviços oferecidos.
        </p>

        <p className="text-secondary text-[13px] mt-6">Última atualização: 2026.</p>
      </div>
    </div>
  );
};

export default TermosDeUso;
