import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import useSeo from '../hooks/useSeo.js';
import BrandMark from '../components/BrandMark.jsx';

const NotFound = () => {
  useSeo({ title: 'Página não encontrada', path: '/404' });

  return (
    <div className="min-h-[70svh] flex flex-col items-center justify-center text-center px-6 pt-[86px] md:pt-[104px]">
      <BrandMark className="w-12 h-12 text-accent-light mb-8" />
      <span className="font-drama italic text-accent text-6xl mb-4">404</span>
      <h1 className="font-drama text-primary text-[26px] sm:text-[30px] mb-4">Página não encontrada.</h1>
      <p className="font-sans text-secondary text-[15px] max-w-sm mb-10">
        O endereço acessado não existe ou foi movido. Que tal voltar para o início?
      </p>
      <Link
        to="/"
        className="group inline-flex items-center gap-2 bg-accent text-white hover:bg-primary h-[52px] px-7 rounded-full font-sans font-semibold text-[14.5px] hover:-translate-y-0.5 transition-all duration-300"
      >
        Voltar para a Home
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
};

export default NotFound;
