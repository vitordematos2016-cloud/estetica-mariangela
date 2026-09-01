import { useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Video, Camera } from 'lucide-react';
import { STAGE_LABELS } from '../../utils/mediaParser.js';

export default function MediaLightbox({ items, currentIndex, onClose, onNavigate }) {
  const videoRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate('prev');
      if (e.key === 'ArrowRight') onNavigate('next');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNavigate]);

  // Pause video when navigating away
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [currentIndex]);

  // Lock body scroll
  useEffect(() => {
    if (currentIndex < 0) return;
    
    // Save original overflow
    const originalStyle = window.getComputedStyle(document.body).overflow;  
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [currentIndex]);

  if (!items || items.length === 0 || currentIndex < 0 || currentIndex >= items.length) return null;

  const currentMedia = items[currentIndex];
  const isVideo = currentMedia.mediaType === 'video';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
      
      {/* Background click area to close */}
      <div className="absolute inset-0 cursor-zoom-out" onClick={onClose} />

      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-none z-10">
        <div className="bg-black/40 backdrop-blur px-4 py-2 rounded-full flex flex-col gap-1 pointer-events-auto">
          <div className="flex items-center gap-2 text-white/90 text-[11px] font-medium tracking-widest uppercase">
            {isVideo ? <Video className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
            {STAGE_LABELS[currentMedia.stage]}
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors pointer-events-auto flex-shrink-0"
          aria-label="Fechar galeria"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-0 max-w-[90vw] max-h-[85vh] w-full h-full flex items-center justify-center pointer-events-none">
        {isVideo ? (
          <video
            ref={videoRef}
            src={currentMedia.src}
            controls
            playsInline
            preload="metadata"
            className="max-w-full max-h-full rounded-lg shadow-2xl pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <img
            src={currentMedia.src}
            alt={`Registro do processo - ${STAGE_LABELS[currentMedia.stage]}`}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl pointer-events-auto select-none"
            onClick={(e) => e.stopPropagation()}
            loading="lazy"
          />
        )}
      </div>

      {/* Navigation Controls */}
      {items.length > 1 && (
        <>
          <button
            onClick={() => onNavigate('prev')}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <button
            onClick={() => onNavigate('next')}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
            aria-label="Próxima"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium tracking-wide z-10 pointer-events-none bg-black/40 backdrop-blur px-4 py-1.5 rounded-full">
            {currentIndex + 1} / {items.length}
          </div>
        </>
      )}
    </div>
  );
}
