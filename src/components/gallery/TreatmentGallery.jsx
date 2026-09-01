import { useState } from 'react';
import { STAGE_LABELS, STAGE_ORDER } from '../../utils/mediaParser.js';
import MediaCard from './MediaCard.jsx';
import MediaLightbox from './MediaLightbox.jsx';

export default function TreatmentGallery({ allMedia }) {
  const [filter, setFilter] = useState('all'); // 'all', 'image', 'video'
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [lightboxItems, setLightboxItems] = useState([]);

  if (!allMedia || allMedia.length === 0) {
    return null;
  }

  const hasImages = allMedia.some(m => m.mediaType === 'image');
  const hasVideos = allMedia.some(m => m.mediaType === 'video');
  const showFilters = hasImages && hasVideos;

  const filteredMedia = allMedia.filter(m => {
    if (filter === 'all') return true;
    return m.mediaType === filter;
  });

  // Agrupa e ordena
  const groupedMedia = filteredMedia.reduce((acc, media) => {
    const stage = media.stage;
    if (!acc[stage]) acc[stage] = [];
    acc[stage].push(media);
    return acc;
  }, {});

  // Ordena os grupos
  const sortedStages = Object.keys(groupedMedia).sort((a, b) => STAGE_ORDER[a] - STAGE_ORDER[b]);
  
  // Ordena os itens dentro de cada grupo
  sortedStages.forEach(stage => {
    groupedMedia[stage].sort((a, b) => a.order - b.order);
  });

  const handleCardClick = (media) => {
    // Flatten the currently visible groups into a flat array for the lightbox navigation
    const flatItems = [];
    sortedStages.forEach(stage => {
      flatItems.push(...groupedMedia[stage]);
    });
    const index = flatItems.findIndex(m => m.src === media.src);
    setLightboxItems(flatItems);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(-1);
  };

  const navigateLightbox = (direction) => {
    setLightboxIndex(prev => {
      if (direction === 'prev') {
        return prev > 0 ? prev - 1 : lightboxItems.length - 1;
      }
      return prev < lightboxItems.length - 1 ? prev + 1 : 0;
    });
  };

  return (
    <div className="w-full">

        {showFilters && (
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-white/40 p-1.5 rounded-full border border-mauve-dark/10">
              <button 
                onClick={() => setFilter('all')}
                className={`px-6 py-2 rounded-full font-sans text-sm font-medium transition-all duration-300 ${filter === 'all' ? 'bg-primary text-white shadow-md' : 'text-secondary hover:text-primary hover:bg-white/50'}`}
              >
                Todos
              </button>
              <button 
                onClick={() => setFilter('image')}
                className={`px-6 py-2 rounded-full font-sans text-sm font-medium transition-all duration-300 ${filter === 'image' ? 'bg-primary text-white shadow-md' : 'text-secondary hover:text-primary hover:bg-white/50'}`}
              >
                Imagens
              </button>
              <button 
                onClick={() => setFilter('video')}
                className={`px-6 py-2 rounded-full font-sans text-sm font-medium transition-all duration-300 ${filter === 'video' ? 'bg-primary text-white shadow-md' : 'text-secondary hover:text-primary hover:bg-white/50'}`}
              >
                Vídeos
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-12 lg:gap-16">
          {sortedStages.map(stage => {
            const items = groupedMedia[stage];
            return (
              <div key={stage} className="flex flex-col gap-5">
                <h3 className="font-sans font-medium text-lg tracking-wide text-primary/80 uppercase border-b border-mauve-dark/10 pb-2">
                  {STAGE_LABELS[stage]}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map(media => (
                    <MediaCard 
                      key={media.src} 
                      media={media} 
                      onClick={() => handleCardClick(media)} 
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      <MediaLightbox 
        items={lightboxItems}
        currentIndex={lightboxIndex}
        onClose={closeLightbox}
        onNavigate={navigateLightbox}
      />
    </div>
  );
}
