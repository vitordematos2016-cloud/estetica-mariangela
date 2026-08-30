import { useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { buildWaLink } from '../data/business.js';
import WhatsAppIcon from './WhatsAppIcon.jsx';

const TreatmentModal = ({ isOpen, onClose, treatment }) => {
  // Bloquear scroll do body quando a modal estiver aberta
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !treatment) return null;

  const Icon = treatment.icon;
  const msg = `Olá, gostaria de saber mais sobre ${treatment.title} e verificar horários disponíveis.`;
  const link = buildWaLink(msg);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay Escuro com Desfoque */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Card da Modal */}
      <div 
        className="card-surface relative z-10 w-full max-w-xl rounded-[32px] overflow-hidden flex flex-col shadow-2xl animate-[fadeInUp_0.4s_ease-out_forwards]"
        role="dialog"
        aria-modal="true"
      >
        {/* Botão Fechar */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-background/50 text-secondary hover:bg-background hover:text-primary transition-colors duration-200"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Imagem de Topo */}
        {treatment.img && (
          <div className="h-48 sm:h-56 w-full relative">
            <img 
              src={treatment.img} 
              alt={treatment.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
            
            {Icon && (
              <div className="absolute bottom-5 left-6 md:left-10 w-14 h-14 rounded-full bg-white/95 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex items-center justify-center text-primary transform translate-y-1/4 ring-4 ring-white/20">
                <Icon className="w-7 h-7" strokeWidth={1.5} />
              </div>
            )}
          </div>
        )}

        {/* Conteúdo */}
        <div className="p-6 md:p-10 pt-8">
          <h3 className="font-drama text-primary text-[26px] md:text-[32px] leading-tight mb-3">
            {treatment.title}
          </h3>
          <div className="h-[2px] w-12 bg-accent/30 mb-8 rounded-full" />
          
          <div className="mb-10 bg-[#FAF6F3] rounded-[24px] p-6 md:p-8 border border-[#E8DFD8]/60 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
            <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-accent mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Sobre o procedimento
            </p>
            <div className="font-sans text-secondary text-[14.5px] leading-[1.8] flex flex-col gap-4">
              {treatment.summary.split('\n').map((line, idx) => (
                line.trim() ? <p key={idx}>{line}</p> : null
              ))}
            </div>
          </div>
          
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="btn-accent w-full group shadow-[0_10px_20px_-10px_rgba(185,120,84,0.4)] h-[56px]"
          >
            <WhatsAppIcon className="w-[18px] h-[18px]" />
            Quero agendar este tratamento
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TreatmentModal;
