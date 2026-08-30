import useSeo from '../hooks/useSeo.js';
import SectionHero from '../components/SectionHero.jsx';
import { EMAIL } from '../data/business.js';

const PoliticaDePrivacidade = () => {
  useSeo({
    title: 'Política de Privacidade',
    description: 'Como a Mariangela Schinaider Estética trata os dados enviados por visitantes do site.',
    path: '/politica-de-privacidade',
  });

  return (
    <div>
      <SectionHero label="Legal" titleNormal="Política de" titleItalic="privacidade." />
      <div className="max-w-2xl mx-auto px-6 md:px-12 pb-24 lg:pb-32 font-sans text-[15px] text-secondary leading-[1.8] flex flex-col gap-6">
        <p>
          Esta página explica, de forma simples, como os dados eventualmente enviados por você através deste site são utilizados pela Mariangela Schinaider Estética.
        </p>

        <h2 className="font-drama text-primary text-[20px] mt-4">Quais dados podem ser coletados</h2>
        <p>
          Consideramos apenas os dados que você eventualmente nos envia diretamente, como nome, telefone, e-mail e o conteúdo de mensagens enviadas por formulário ou WhatsApp.
        </p>

        <h2 className="font-drama text-primary text-[20px] mt-4">Para que esses dados são usados</h2>
        <p>Os dados enviados podem ser utilizados para:</p>
        <ul className="list-disc list-outside pl-5 flex flex-col gap-2">
          <li>Responder aos seus contatos;</li>
          <li>Realizar agendamentos de atendimento;</li>
          <li>Comunicação relacionada ao seu atendimento.</li>
        </ul>

        <h2 className="font-drama text-primary text-[20px] mt-4">Compartilhamento</h2>
        <p>
          Não compartilhamos seus dados com terceiros para fins publicitários. Não realizamos integrações automatizadas que capturem dados além dos que você mesmo nos envia.
        </p>

        <h2 className="font-drama text-primary text-[20px] mt-4">Contato</h2>
        <p>
          Em caso de dúvidas sobre esta política, entre em contato pelo e-mail <a href={`mailto:${EMAIL}`} className="text-accent hover:underline">{EMAIL}</a>.
        </p>

        <p className="text-secondary text-[13px] mt-6">Última atualização: 2026.</p>
      </div>
    </div>
  );
};

export default PoliticaDePrivacidade;
