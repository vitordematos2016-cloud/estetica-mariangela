import { useState, useMemo } from 'react';
import { Plus, Minus, Play } from 'lucide-react';
import { parseTreatmentMediaFilename } from '../../utils/mediaParser.js';
import TreatmentGallery from './TreatmentGallery.jsx';

// Importa apenas os caminhos das imagens da pasta public/gallery (vídeos ocultos temporariamente)
const mediaPaths = import.meta.glob('/public/gallery/**/*.{jpg,jpeg,png,webp,avif}');

export default function TreatmentMediaAccordion({ treatmentSlug }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Processa as mídias apenas uma vez
  const allMedia = useMemo(() => {
    const parsed = Object.keys(mediaPaths).map((path) => {
      // Como os arquivos estão na pasta public, a URL final de acesso (dev e prod) é a mesma do caminho sem "/public"
      const url = path.replace('/public', '');
      const parsedData = parseTreatmentMediaFilename(path);
      return { ...parsedData, src: url };
    });
    return parsed.filter(m => 
      m.treatmentSlug === treatmentSlug && 
      !m.src.toLowerCase().includes('capa')
    );
  }, [treatmentSlug]);

  if (allMedia.length === 0) return null;

  const photoCount = allMedia.filter(m => m.mediaType === 'image').length;
  const videoCount = allMedia.filter(m => m.mediaType === 'video').length;

  const stats = [];
  if (photoCount > 0) stats.push(`${photoCount} ${photoCount === 1 ? 'foto' : 'fotos'}`);
  if (videoCount > 0) stats.push(`${videoCount} ${videoCount === 1 ? 'vídeo' : 'vídeos'}`);
  const statsString = stats.join(' • ');

  const handleToggle = () => setIsOpen(prev => !prev);

  return (
    <section className="w-full flex justify-center mt-12 md:mt-16 lg:mt-20 px-6 md:px-12 mb-4">
      <div className="w-full max-w-[1100px] flex flex-col gap-4">
        
        {/* Accordion Trigger */}
        <button
          onClick={handleToggle}
          aria-expanded={isOpen}
          aria-controls="gallery-accordion-content"
          className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:px-8 sm:py-6 text-left transition-all duration-400 ease-out cursor-pointer overflow-hidden"
          style={{
            backgroundColor: 'var(--card-brown, #F4F1EE)',
            border: '1px solid rgba(89,71,65,0.55)',
            borderRadius: '22px',
            boxShadow: isOpen ? '0 10px 30px rgba(74,51,44,0.08)' : '0 18px 40px rgba(74,51,44,0.12)',
            transform: isOpen ? 'translateY(0)' : 'translateY(0)',
          }}
          onMouseEnter={(e) => {
            if (!isOpen) e.currentTarget.style.transform = 'translateY(-4px)';
            if (!isOpen) e.currentTarget.style.boxShadow = '0 26px 55px rgba(74,51,44,0.18)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = isOpen ? '0 10px 30px rgba(74,51,44,0.08)' : '0 18px 40px rgba(74,51,44,0.12)';
          }}
        >
          <div className="flex flex-col gap-1.5 z-10">
            <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-accent/90">
              Galeria
            </span>
            <h3 className="font-drama text-[20px] sm:text-[24px] text-primary leading-tight">
              {isOpen ? 'Ocultar resultados e registros' : 'Resultados e registros do tratamento'}
            </h3>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <p className="font-sans text-[14.5px] text-secondary/80">
                {isOpen ? 'Feche esta área para voltar a navegar pela página.' : 'Veja imagens e vídeos de diferentes momentos do atendimento.'}
              </p>
              {statsString && (
                <span className="inline-flex items-center bg-primary/5 px-2.5 py-1 rounded-full text-[12px] font-medium text-primary border border-primary/10">
                  {statsString}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 z-10 shrink-0">
             {/* Mini Previews */}
             {!isOpen && (
               <div className="hidden lg:flex items-center -space-x-3 opacity-80 group-hover:opacity-100 transition-opacity">
                  {allMedia.slice(0,3).map((m, i) => (
                    <div key={i} className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#F4F1EE] shadow-sm bg-mauve-dark/10" style={{ transform: `rotate(${i % 2 === 0 ? '4deg' : '-4deg'})` }}>
                      {m.mediaType === 'image' ? (
                        <img src={m.src} alt="preview" className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full relative flex items-center justify-center">
                          <Play className="w-4 h-4 text-white absolute z-10 drop-shadow-md" fill="currentColor" />
                          <video src={m.src} className="w-full h-full object-cover opacity-50" preload="metadata" />
                        </div>
                      )}
                    </div>
                  ))}
               </div>
             )}

            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-primary shadow-sm border border-primary/10 transition-transform duration-300">
              {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
          </div>
        </button>

        {/* Accordion Content */}
        <div 
          id="gallery-accordion-content"
          className="grid transition-[grid-template-rows] duration-500 ease-in-out"
          style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
        >
          <div className="overflow-hidden min-h-0">
            <div className="pt-6 pb-2">
              <TreatmentGallery allMedia={allMedia} />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
