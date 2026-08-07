import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { EASE_OUT } from '../motion/variants';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsVisible(window.scrollY > 640);
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Voltar ao topo"
      whileHover={{ y: -2, scale: 1.06 }}
      whileTap={{ scale: 0.92 }}
      transition={{ duration: 0.2, ease: EASE_OUT }}
      className="fixed bottom-6 left-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-cream text-brown-dark shadow-warm-sm transition-all hover:border-gold hover:bg-gold/10 active:border-gold active:bg-gold/15"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M3 9l5-5 5 5M8 4v9"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.button>
  );
}
