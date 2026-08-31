import React from 'react';

// Laser: Dispositivo emissor com feixe/brilho
export const IconLaser = ({ className = '', strokeWidth = 1.2 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 6h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-3" />
    <path d="M14 6v13" />
    <path d="M10 9h4" />
    <path d="M10 15h4" />
    <path d="M6 12h4" />
    <path d="M16 10l2-2" />
    <path d="M16 14l2 2" />
    <path d="M20 12h2" />
  </svg>
);

// Facial: Silhueta de rosto delicada
export const IconFacial = ({ className = '', strokeWidth = 1.2 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 3C7 3 5 5 5 8c0 3 2 5 2 7 0 2 1 4 3 5 .5.5 1.5.5 2 0 2-1 3-3 3-5 0-2 2-4 2-7 0-3-2-5-4-5" />
    <path d="M11 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
    <path d="M10 15c.5.5 1.5.5 2 0" />
    <path d="M16 5.5l1.5-1.5" />
    <path d="M18 8h2" />
    <path d="M16 10.5l1.5 1.5" />
  </svg>
);

// Corporal: Contorno da cintura feminina
export const IconCorporal = ({ className = '', strokeWidth = 1.2 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M8 3c0 2 1.5 4.5 1.5 7S8 16 8 21" />
    <path d="M16 3c0 2-1.5 4.5-1.5 7s1.5 6 1.5 11" />
    <path d="M10.5 12h3" />
    <path d="M12 11.5v1" />
  </svg>
);

// Bem-estar: Flor de lótus minimalista
export const IconBemEstar = ({ className = '', strokeWidth = 1.2 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22v-3" />
    <path d="M12 19c-3-2-8-3-8-8 0-4 3-7 8-7 5 0 8 3 8 7 0 5-5 6-8 8z" />
    <path d="M12 19c-2-1-4-2-4-5 0-2 1.5-3.5 4-3.5s4 1.5 4 3.5c0 3-2 4-4 5z" />
    <path d="M12 10.5V7" />
  </svg>
);

// Relaxamento: Pedras de spa / ventosas
export const IconRelaxamento = ({ className = '', strokeWidth = 1.2 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <ellipse cx="12" cy="18" rx="8" ry="4" />
    <ellipse cx="12" cy="14" rx="6" ry="3" />
    <ellipse cx="12" cy="10" rx="4" ry="2" />
    <path d="M6 18c0-3 3-5 6-5s6 2 6 5" />
    <path d="M12 6V3" />
    <path d="M9 7l-2-2" />
    <path d="M15 7l2-2" />
  </svg>
);
