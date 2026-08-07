import { useRef } from 'react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { RequestForm } from '../request/RequestForm';
import { Reveal } from '../motion/reveal';
import { useOnceInView } from '../../hooks/useOnceInView';

/**
 * Seção/"página" de agendamento -- id `agendamento` preservado para que
 * links antigos (`/#agendamento`) continuem funcionando. O fluxo antigo
 * (calendário, data, período do dia, telefone, observações, consentimento)
 * foi removido por completo: o site não simula mais um agendamento
 * confirmado, só abre uma solicitação simples (nome + tratamento de
 * interesse) que segue para o WhatsApp, onde a profissional combina pessoalmente o
 * dia e o horário. Mesmo formulário (`RequestForm`) usado pelo modal
 * disparado pelos outros botões do site -- aqui ele fica embutido direto na
 * seção, sem prefill, porque a visitante pode chegar aqui sem ter escolhido
 * um tratamento antes.
 */
export function Scheduling() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useOnceInView(sectionRef, { amount: 0.2 });

  return (
    <section id="agendamento" ref={sectionRef} className="relative overflow-hidden py-24 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(167, 136, 127, 0.06),transparent_55%)]"
      />

      <Container className="relative flex flex-col gap-10 lg:items-center lg:gap-12">
        <Reveal active={isInView} direction="up" delay={0} className="w-full lg:max-w-2xl">
          <SectionHeading
            eyebrow="Agendamento"
            title="Solicite seu atendimento"
            text="Escolha o tratamento que deseja ou solicite uma avaliação. A confirmação do melhor dia e horário será feita pessoalmente pelo WhatsApp."
          />
        </Reveal>

        <Reveal
          active={isInView}
          direction="up"
          delay={0.1}
          className="w-full rounded-[2rem_2rem_2rem_0.75rem] border border-gold/25 bg-cream-light/30 p-7 shadow-warm-sm sm:p-9 lg:max-w-lg"
        >
          <RequestForm prefill={{ mode: 'open' }} idPrefix="agendamento-page" />
        </Reveal>
      </Container>
    </section>
  );
}
