import { useEffect, useRef, useState } from 'react';

/**
 * Lógica compartilhada do padrão "seção expansível com controle superior e
 * inferior" (aprovado em Diferenciais e Instagram): fechada por padrão,
 * nunca mostra os dois botões ao mesmo tempo, e o botão inferior só aparece
 * quando o marcador do final do conteúdo entra ~40% na tela.
 */
export function useExpandableSection<
  TSection extends HTMLElement = HTMLElement,
  TMarker extends HTMLElement = HTMLDivElement,
>() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const sectionRef = useRef<TSection>(null);
  const bottomMarkerRef = useRef<TMarker>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsAtBottom(false);
      return;
    }

    const node = bottomMarkerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => setIsAtBottom(entry.isIntersecting), {
      threshold: 0.4,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [isOpen]);

  const topButtonVisible = !(isOpen && isAtBottom);
  const bottomButtonVisible = isOpen && isAtBottom;

  function toggle() {
    setIsOpen((current) => !current);
  }

  function closeFromBottom() {
    setIsOpen(false);
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return {
    isOpen,
    sectionRef,
    bottomMarkerRef,
    topButtonVisible,
    bottomButtonVisible,
    toggle,
    closeFromBottom,
  };
}
