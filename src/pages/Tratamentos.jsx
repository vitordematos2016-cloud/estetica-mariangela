import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Calendar, ShieldCheck, Sparkles } from 'lucide-react';
import useSeo from '../hooks/useSeo.js';
import WhatsAppIcon from '../components/WhatsAppIcon.jsx';
import { buildWaLink } from '../data/business.js';
import { getCatalogByCategory } from '../data/treatments.js';

const FACIAIS = getCatalogByCategory('facial');
const CORPORAIS = getCatalogByCategory('corporal');
const LASER = getCatalogByCategory('depilacao')[0]; // Pega o único tratamento de laser no BD

const LASER_AREAS = [
  'Axilas', 'Braços', 'Pernas', 'Virilha', 
  'Rosto', 'Costas', 'Biquíni', 'Outras áreas'
];

const Tratamentos = () => {
  const [activeTreatment, setActiveTreatment] = useState(null);
  const [searchParams] = useSearchParams();

  useSeo({
    title: 'Tratamentos Estéticos em Guaraniaçu',
    description: 'Catálogo de tratamentos faciais, corporais e depilação a laser com protocolos personalizados.',
    path: '/tratamentos',
  });

  // Scroll to top upon load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Ordenação dinâmica das categorias baseada no parâmetro da URL
  const categories = useMemo(() => {
    const defaultOrder = [
      {
        id: 'facial',
        title: 'FACIAL',
        description: 'Tecnologias e cuidados avançados para uma pele saudável, firme e iluminada.',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200&auto=format&fit=crop',
        treatments: FACIAIS,
      },
      {
        id: 'corporal',
        title: 'CORPORAL',
        description: 'Protocolos que modelam, promovem bem-estar e valorizam o cuidado com o corpo.',
        image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=1200&auto=format&fit=crop',
        treatments: CORPORAIS,
      },
      {
        id: 'laser',
        title: 'DEPILAÇÃO A LASER',
        description: 'Mais conforto, praticidade e pele lisa por muito mais tempo.',
        image: 'https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=1200&auto=format&fit=crop',
        isLaser: true,
      }
    ];

    const catParam = searchParams.get('cat');
    if (!catParam) return defaultOrder;

    const selectedIndex = defaultOrder.findIndex(c => c.id === catParam);
    if (selectedIndex > 0) {
      const selected = defaultOrder.splice(selectedIndex, 1)[0];
      defaultOrder.unshift(selected); // Move para a primeira posição
    }

    return defaultOrder;
  }, [searchParams]);

  // Componente de Card de Categoria Interno
  const CategoryCard = ({ title, description, treatments, image, isLaser = false }) => (
    <div className="card-surface rounded-[28px] md:rounded-[36px] overflow-hidden flex flex-col h-full border border-accent/20 shadow-[0_20px_60px_-20px_rgba(74,51,44,0.1)] group/card hover:-translate-y-2 transition-transform duration-500">
      
      {/* Imagem */}
      <div className="h-[220px] sm:h-[260px] w-full relative overflow-hidden shrink-0">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80 pointer-events-none" />
      </div>
      
      {/* Conteúdo */}
      <div className="p-6 md:p-8 flex flex-col flex-1 relative bg-background/50">
        <h2 className="font-drama text-primary text-[26px] tracking-wide mb-3">{title}</h2>
        <p className="font-sans text-secondary text-[14px] leading-relaxed mb-8 opacity-90">
          {description}
        </p>
        
        {/* Lista de Itens */}
        <div className="flex flex-col gap-4 mb-10 flex-1">
          {!isLaser ? (
            treatments.map((t) => (
              <Link 
                key={t.slug} 
                to={`/tratamentos/${t.slug}`}
                className="group flex items-start justify-between text-left pb-4 border-b border-accent/10 hover:border-accent/30 transition-colors last:border-0"
              >
                <div className="flex gap-3">
                  <t.icon className="w-[18px] h-[18px] text-accent shrink-0 mt-1" />
                  <div>
                    <h4 className="font-sans font-semibold text-primary text-[15px] group-hover:text-accent transition-colors">{t.title}</h4>
                    <p className="font-sans text-secondary text-[12.5px] line-clamp-1 mt-0.5 opacity-80">{t.catalogSummary}</p>
                  </div>
                </div>
                <div className="shrink-0 ml-4 w-[28px] h-[28px] rounded-full border border-accent/20 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))
          ) : (
            <div className="flex flex-col items-center text-center h-full pt-4 pb-2">
              <h4 className="font-drama text-primary text-[20px] md:text-[22px] tracking-wide mb-4">
                {LASER.title}
              </h4>
              <div className="font-sans text-secondary text-[13.5px] leading-relaxed opacity-90 mb-6 flex flex-col gap-3 px-2">
                {LASER.summary.split('\n').map((line, idx) => (
                  line.trim() ? <p key={idx}>{line}</p> : null
                ))}
              </div>
                <a 
                  href={buildWaLink('Olá, Mariangela! Vi as informações sobre depilação a laser no site e gostaria de saber mais sobre as áreas atendidas e os horários disponíveis.')}
                  target="_blank"
                  rel="noreferrer"
                className="mt-auto btn-accent text-[13px] h-[44px] px-6 w-full max-w-[240px]"
              >
                Agendar avaliação
              </a>
            </div>
          )}
        </div>
        
        {/* Footer CTA */}
        <div className="mt-auto pt-6 border-t border-accent/20">
          <a href={buildWaLink('Olá, Mariangela! Vi os tratamentos no site, mas ainda estou em dúvida sobre qual seria o mais adequado para mim. Você pode me orientar?')} target="_blank" rel="noreferrer" className="flex items-center justify-between group">
            <div className="flex items-center gap-3 text-secondary">
              <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-sm">
                <WhatsAppIcon className="w-[18px] h-[18px]" />
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-accent mb-0.5">Não sabe qual escolher?</p>
                <p className="text-[14px] font-semibold text-primary">Fale com a Mariangela</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-accent group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mauve-surface min-h-screen">
      
      {/* TOPO DA PÁGINA */}
      <div className="pt-32 md:pt-40 pb-16 md:pb-20 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <h4 className="text-label text-accent mb-6">TRATAMENTOS</h4>
        <h1 className="font-drama text-primary text-[32px] md:text-[44px] lg:text-[52px] leading-[1.1] mb-6 max-w-4xl mx-auto">
          Cuidados escolhidos para <span className="text-accent italic font-light">cada necessidade.</span>
        </h1>
        <p className="font-sans text-secondary max-w-2xl mx-auto text-[15px] md:text-[17px] leading-relaxed">
          Faciais, corporais e depilação a laser com protocolos personalizados para realçar sua beleza natural e promover bem-estar.
        </p>
      </div>

      {/* ÁREA PRINCIPAL — 3 CATEGORIAS */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          
          {categories.map((cat) => (
            <CategoryCard 
              key={cat.id}
              title={cat.title}
              description={cat.description}
              image={cat.image}
              treatments={cat.treatments}
              isLaser={cat.isLaser}
            />
          ))}

        </div>
      </div>

      {/* FAIXA ABAIXO DOS CARDS */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 pb-32">
        <div className="flex flex-col xl:flex-row gap-6 lg:gap-8">
          
          {/* Benefícios */}
          <div className="card-surface flex-1 rounded-[28px] md:rounded-[36px] p-8 md:p-12 flex flex-col md:flex-row gap-8 md:gap-4 justify-between items-start border border-accent/20">
            <div className="flex-1 flex flex-col gap-3">
              <Calendar className="w-8 h-8 text-accent mb-2" strokeWidth={1.5} />
              <h4 className="font-sans font-bold text-primary text-[17px]">Avaliação personalizada</h4>
              <p className="font-sans text-secondary text-[14px] leading-relaxed opacity-90">Cada protocolo é indicado conforme sua necessidade.</p>
            </div>
            <div className="w-full md:w-px h-px md:h-24 bg-accent/20 shrink-0" />
            
            <div className="flex-1 flex flex-col gap-3 md:pl-4">
              <ShieldCheck className="w-8 h-8 text-accent mb-2" strokeWidth={1.5} />
              <h4 className="font-sans font-bold text-primary text-[17px]">Tecnologia segura</h4>
              <p className="font-sans text-secondary text-[14px] leading-relaxed opacity-90">Equipamentos e protocolos utilizados de forma profissional.</p>
            </div>
            <div className="w-full md:w-px h-px md:h-24 bg-accent/20 shrink-0" />
            
            <div className="flex-1 flex flex-col gap-3 md:pl-4">
              <Sparkles className="w-8 h-8 text-accent mb-2" strokeWidth={1.5} />
              <h4 className="font-sans font-bold text-primary text-[17px]">Cuidado individual</h4>
              <p className="font-sans text-secondary text-[14px] leading-relaxed opacity-90">Atendimento pensado para valorizar beleza, conforto e bem-estar.</p>
            </div>
          </div>

          {/* CTA Escuro/Dourado */}
          <div className="bg-[#4D3A36] xl:w-[400px] rounded-[28px] md:rounded-[36px] p-8 md:p-10 flex flex-col justify-center text-white relative overflow-hidden shrink-0 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            
            <h3 className="font-drama text-[28px] leading-tight mb-4 relative z-10">Pronta para cuidar de você?</h3>
            <p className="font-sans text-white/80 text-[14.5px] leading-relaxed mb-8 relative z-10">
              Agende sua avaliação e descubra o protocolo ideal para você.
            </p>
            <a href={buildWaLink('Olá, Mariangela! Estava conhecendo os tratamentos pelo site e gostaria de agendar uma avaliação para entender qual procedimento é mais indicado para mim.')} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 bg-white text-[#4D3A36] hover:bg-accent hover:text-white transition-colors duration-300 rounded-full py-4 px-6 font-sans font-bold text-[14.5px] group w-fit relative z-10">
              Quero agendar agora
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

        </div>
      </div>


    </div>
  );
};

export default Tratamentos;
