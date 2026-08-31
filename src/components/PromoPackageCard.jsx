import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { buildWaLink } from '../data/business.js';
import useCardTilt from '../hooks/useCardTilt.js';
import { IconLaser, IconFacial, IconCorporal, IconBemEstar, IconRelaxamento } from './icons/PromoIcons.jsx';

export const PROMO_PACKAGES = [
  {
    id: 'laser-premium',
    category: 'PACOTE EXCLUSIVO',
    title: 'Depilação de Laser Premium',
    icon: IconLaser,
    isPremium: true,
    num: '01',
    features: [
      '10 sessões — Axilas',
      '10 sessões — Virilha completa',
      '10 sessões — Meia perna'
    ],
    oldPrice: '2.700',
    newPrice: '1.900',
    installments: '10x de R$ 190,00',
    shortText: 'Uma oferta de alto valor percebido para o seu conforto.',
    waMessage: 'Olá! 💕 Vi no site o pacote Depilação de Laser Premium e gostaria de saber mais sobre ele.'
  },
  {
    id: 'pele-renovada',
    category: 'CUIDADO FACIAL',
    title: 'Projeto Pele Renovada',
    icon: IconFacial,
    isPremium: false,
    num: '02',
    features: [
      '1 Limpeza de Pele Profunda',
      '2 sessões de Peeling',
      '2 sessões de Ultrassom Facial',
      '2 sessões de Radiofrequência Facial'
    ],
    oldPrice: '1.800',
    newPrice: '1.300',
    installments: '10x de R$ 130,00',
    shortText: 'Uma combinação de cuidados faciais voltada para viço, textura e renovação da aparência da pele.',
    waMessage: 'Olá! 💕 Vi no site o pacote Projeto Pele Renovada e gostaria de saber mais sobre ele.'
  },
  {
    id: 'projeto-contorno',
    category: 'CORPO EM FOCO',
    title: 'Projeto Contorno',
    icon: IconCorporal,
    isPremium: false,
    num: '03',
    features: [
      '4 sessões de Massagem Modeladora',
      '2 sessões de Ultrassom Corporal',
      '2 sessões de Radiofrequência Corporal',
      '2 sessões de Correntes'
    ],
    oldPrice: '1.400',
    newPrice: '1.000',
    installments: '10x de R$ 100,00',
    shortText: 'Combinação de procedimentos corporais definida para protocolos de cuidado e contorno corporal, conforme avaliação individual.',
    waMessage: 'Olá! 💕 Vi no site o pacote Projeto Contorno e gostaria de saber mais sobre ele.'
  },
  {
    id: 'detox-leveza',
    category: 'BEM-ESTAR',
    title: 'Detox & Leveza',
    icon: IconBemEstar,
    isPremium: false,
    num: '04',
    features: [
      '4 Drenagens Linfáticas',
      '2 sessões de Detox Corporal com Manta Térmica',
      '2 Massagens Relaxantes'
    ],
    oldPrice: '900',
    newPrice: '700',
    installments: '10x de R$ 70,00',
    shortText: 'Uma combinação voltada ao conforto, relaxamento, bem-estar e sensação de leveza.',
    waMessage: 'Olá! 💕 Vi no site o pacote Detox & Leveza e gostaria de saber mais sobre ele.'
  },
  {
    id: 'alivio-relaxamento',
    category: 'RELAXAMENTO',
    title: 'Alívio & Relaxamento',
    icon: IconRelaxamento,
    isPremium: false,
    num: '05',
    features: [
      '4 Massagens Relaxantes',
      '4 sessões de Ventosas'
    ],
    oldPrice: '400',
    newPrice: '200',
    installments: 'até 10x de R$ 20,00',
    shortText: 'Uma combinação pensada para momentos de relaxamento, autocuidado e bem-estar.',
    waMessage: 'Olá! 💕 Vi no site o pacote Alívio & Relaxamento e gostaria de saber mais sobre ele.'
  }
];

const PromoPackageCard = ({ pkg, className = '', animClass = '' }) => {
  const tilt = useCardTilt(1.5);
  const Icon = pkg.icon;

  const baseClasses = `promo-card group relative bg-[#F4E6DF] border transition-all duration-[400ms] ease-out rounded-[28px] overflow-hidden flex flex-col`;
  const premiumClasses = pkg.isPremium
    ? `border-[#594741]/40 shadow-[0_20px_40px_rgba(74,51,44,.15)]`
    : `border-[#594741]/20 shadow-[0_18px_42px_rgba(74,51,44,.12),0_6px_14px_rgba(74,51,44,.06)]`;

  // Em hover desktop: transform: translateY(-8px) scale(1.01); box-shadow: 0 32px 70px rgba(74,51,44,.20); border-color: rgba(89,71,65,.90)
  const hoverClasses = `@media (hover: hover) and (pointer: fine) { hover:border-[rgba(89,71,65,.90)] hover:-translate-y-2 hover:scale-[1.01] hover:shadow-[0_32px_70px_rgba(74,51,44,.20)] }`;

  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className={`${baseClasses} ${premiumClasses} ${animClass} ${className} 
        [@media(hover:hover)_and_(pointer:fine)]:hover:border-[rgba(89,71,65,.90)] 
        [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-2 
        [@media(hover:hover)_and_(pointer:fine)]:hover:scale-[1.01] 
        [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_32px_70px_rgba(74,51,44,.20)]
      `}
      style={{
        // Gradient muito sutil no fundo dos cards normais, ou um glow interno
        background: pkg.isPremium ? 'linear-gradient(145deg, #F9F1ED 0%, #F1E0D7 100%)' : '#F7ECE6',
      }}
    >
      {/* Reflexo sutil acompanhando o mouse (opcional, gerenciado pelo hook ou via CSS se preferir) */}
      
      <div className="p-7 sm:p-8 flex flex-col h-full relative z-10">
        
        {/* Top: Category & Number */}
        <div className="flex items-center justify-between mb-6">
          <span className={`font-sans text-[10px] tracking-[0.2em] uppercase font-bold ${pkg.isPremium ? 'bg-[#4A332C] text-[#FFF8F6] px-3 py-1.5 rounded-full' : 'text-[#654E46]'}`}>
            {pkg.category}
          </span>
          <span className="font-drama italic text-[#4A332C] text-[22px] opacity-40">
            {pkg.num}
          </span>
        </div>

        {/* Icon & Title */}
        <div className="flex items-center gap-4 mb-6 group-hover:translate-x-1 transition-transform duration-300">
          <div className="w-[52px] h-[52px] rounded-full bg-[#EBD8D2] flex items-center justify-center shrink-0 border border-[#4A332C]/10">
            <Icon className="w-[24px] h-[24px] text-[#4A332C]" />
          </div>
          <h3 className="font-drama text-[24px] sm:text-[28px] text-[#392A27] leading-[1.1]">
            {pkg.title}
          </h3>
        </div>

        {/* Features List */}
        <ul className="flex flex-col gap-2.5 mb-8">
          {pkg.features.map((feat, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <Check className="w-[16px] h-[16px] text-[#654E46] shrink-0 mt-[2px]" strokeWidth={2} />
              <span className="font-sans text-[13.5px] text-[#654E46] leading-[1.5]">{feat}</span>
            </li>
          ))}
        </ul>

        {/* Pricing Area */}
        <div className="bg-[#EBD8D2]/40 rounded-[20px] p-5 mb-6 border border-[#594741]/10 flex flex-col items-center text-center">
          <span className="font-sans text-[13px] text-[#654E46] line-through decoration-[#4A332C]/40 mb-1">
            De R$ {pkg.oldPrice}
          </span>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="font-sans text-[16px] text-[#4A332C] font-semibold">R$</span>
            <span className="font-drama text-[38px] sm:text-[42px] text-[#4A332C] leading-none">{pkg.newPrice}</span>
          </div>
          <span className="font-sans text-[13.5px] text-[#4A332C] font-semibold bg-[#CFBFC0]/30 px-3 py-1 rounded-full mt-2">
            {pkg.installments}
          </span>
        </div>

        {/* Description */}
        <p className="font-sans text-[13.5px] text-[#654E46] leading-[1.6] mb-8 line-clamp-3">
          {pkg.shortText}
        </p>

        {/* CTA */}
        <div className="mt-auto pt-2">
          <a
            href={buildWaLink(pkg.waMessage)}
            target="_blank"
            rel="noreferrer"
            className={`flex items-center justify-center gap-2 w-full h-[52px] rounded-full font-sans text-[14px] font-semibold transition-all duration-300 ${
              pkg.isPremium 
                ? 'bg-[#4A332C] text-[#FFF8F6] hover:bg-[#392A27] hover:shadow-lg hover:-translate-y-1' 
                : 'bg-transparent border border-[#4A332C] text-[#4A332C] hover:bg-[#4A332C] hover:text-[#FFF8F6]'
            }`}
          >
            Quero este pacote
            <ArrowRight className="w-[16px] h-[16px] transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

      </div>
    </div>
  );
};

export default PromoPackageCard;
