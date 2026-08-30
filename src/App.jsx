import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Sobre from './pages/Sobre.jsx';
import Tratamentos from './pages/Tratamentos.jsx';
import TreatmentDetailPage from './pages/TreatmentDetailPage.jsx';
import Faq from './pages/Faq.jsx';
import Contato from './pages/Contato.jsx';
import PoliticaDePrivacidade from './pages/PoliticaDePrivacidade.jsx';
import TermosDeUso from './pages/TermosDeUso.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/tratamentos" element={<Tratamentos />} />
        <Route path="/tratamentos/:slug" element={<TreatmentDetailPage />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/politica-de-privacidade" element={<PoliticaDePrivacidade />} />
        <Route path="/termos-de-uso" element={<TermosDeUso />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
