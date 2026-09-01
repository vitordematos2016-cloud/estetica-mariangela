import { Video, Camera, Play } from 'lucide-react';
import { STAGE_LABELS } from '../../utils/mediaParser.js';

export default function MediaCard({ media, onClick }) {
  const isVideo = media.mediaType === 'video';
  const stageLabel = STAGE_LABELS[media.stage];

  return (
    <div 
      className="group relative rounded-[20px] overflow-hidden cursor-pointer bg-mauve/20 border border-mauve-dark/10 shadow-[0_8px_24px_-12px_rgba(74,51,44,0.15)] hover:shadow-[0_16px_32px_-12px_rgba(74,51,44,0.25)] transition-all duration-300 hover:-translate-y-1"
      onClick={onClick}
    >
      {/* Badge Flutuante */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
          {isVideo ? <Video className="w-3.5 h-3.5 text-primary" /> : <Camera className="w-3.5 h-3.5 text-primary" />}
          <span className="text-[10px] font-bold tracking-widest uppercase text-primary">
            {isVideo ? 'Vídeo' : 'Foto'}
          </span>
        </div>
        
        <div className="bg-primary/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm inline-flex self-start">
          <span className="text-[10px] font-bold tracking-widest uppercase text-white">
            {stageLabel}
          </span>
        </div>
      </div>

      {/* Ícone Play Overlay (para vídeos) */}
      {isVideo && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors shadow-lg border border-white/30">
            <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
          </div>
        </div>
      )}

      {/* Media Thumb */}
      <div className="aspect-[4/5] sm:aspect-square md:aspect-[3/4] overflow-hidden bg-black/5 relative">
        {isVideo ? (
          <video 
            src={media.src} 
            preload="metadata"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            muted
            playsInline
          />
        ) : (
          <img 
            src={media.src} 
            alt={`Registro de ${media.treatmentSlug}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        )}
      </div>
    </div>
  );
}
