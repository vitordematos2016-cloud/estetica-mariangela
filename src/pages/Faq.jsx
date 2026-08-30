import { useState } from 'react';
import { Plus } from 'lucide-react';
import useSeo from '../hooks/useSeo.js';
import SectionHero from '../components/SectionHero.jsx';
import WhatsAppIcon from '../components/WhatsAppIcon.jsx';
import { buildWaLink } from '../data/business.js';
import { FAQS } from '../data/faqs.js';

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(0);

  useSeo({
    title: 'Perguntas Frequentes',
    description: 'Tire suas dúvidas sobre agendamento, sessões, formas de pagamento e localização da Mariangela Schinaider Estética.',
    path: '/faq',
  });

  return (
    <div>
      <SectionHero
        label="FAQ"
        titleNormal="Perguntas"
        titleItalic="frequentes."
        subtitle="Reunimos aqui as dúvidas mais comuns sobre agendamento, atendimento e formas de pagamento."
      />

      <div className="max-w-3xl mx-auto px-6 md:px-12 pb-20">
        <div className="flex flex-col gap-3">
          {FAQS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={item.q}
                className={`card-surface rounded-[20px] ${isOpen ? 'card-surface-open' : ''}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-drama text-[17px] sm:text-[18px] text-primary">{item.q}</span>
                  <span className={`w-8 h-8 rounded-full border border-accent/30 flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45 bg-accent border-accent' : ''}`}>
                    <Plus className={`w-4 h-4 ${isOpen ? 'text-white' : 'text-accent'}`} />
                  </span>
                </button>
                <div className="grid transition-all duration-300" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
                  <div className="overflow-hidden">
                    <p className="font-sans text-[14.5px] text-secondary leading-relaxed px-6 pb-6 max-w-xl">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 md:px-12 pb-24 lg:pb-32 text-center flex flex-col items-center">
        <p className="font-drama italic text-primary text-[20px] sm:text-[24px] mb-7">
          Ainda tem alguma dúvida?
        </p>
        <a
          href={buildWaLink('Olá, Mariangela! Li as informações do site, mas ainda fiquei com uma dúvida. Você pode me ajudar?')}
          target="_blank"
          rel="noreferrer"
          className="btn-accent h-[54px] px-8"
        >
          <WhatsAppIcon className="w-[16px] h-[16px]" />
          Falar pelo WhatsApp
        </a>
      </div>
    </div>
  );
};

export default Faq;
