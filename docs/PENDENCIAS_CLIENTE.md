# Pendências — Estética Mariangela

Este arquivo lista o que ainda depende de confirmação da Mariangela. Nenhum
dos itens abaixo foi preenchido com dado inventado — enquanto pendente, o
site mostra o campo vazio/oculto (nunca um valor de exemplo) em
`src/data/siteContent.ts`.

As informações já aplicadas (nome provisório, WhatsApp, Instagram, endereço
comercial parcial, atuação, história profissional e o depoimento público)
vieram da bio e das legendas do Instagram **@estetica_mariangela**,
verificadas em **06/08/2026** — ver também a observação sobre métricas no
final deste arquivo.

## Identidade

- [ ] Confirmar a grafia do primeiro nome: `Mariangela` ou `Mariângela`
      (com acento). O site usa `Mariangela` (sem acento) provisoriamente.
- [ ] Confirmar o sobrenome: `Schinaider` (mais frequente nas legendas) ou
      `Schneider` (apareceu em duas publicações). Enquanto não confirmado, o
      sobrenome não é exibido publicamente em nenhum lugar do site.
- [ ] Enviar logo oficial (hoje o site usa um monograma provisório em CSS,
      só com a inicial do nome — `src/components/ui/BrandMonogram.tsx`; a
      foto de perfil do Instagram é uma fotografia pessoal, não um logotipo,
      e não deve ser usada como marca).
- [ ] Confirmar paleta oficial (ver seção "Paleta de cores" abaixo).
- [ ] Enviar fontes oficiais, caso existam (o site mantém Cormorant
      Garamond + Jost, herdadas da estrutura técnica de origem).

## Contato e localização

- [ ] Confirmar número do imóvel e CEP do endereço na Av. Abilon de Souza
      Naves (o site mostra hoje só a referência: "sala acima do Banco
      Sicoob, em frente ao Hotel Dallas").
- [ ] Enviar link do Google Maps (o botão correspondente fica oculto
      enquanto ausente — `src/utils/links.ts`, `hasValue`).
- [ ] Enviar link do Waze (mesmo comportamento).
- [ ] Confirmar e-mail comercial (nenhum link de e-mail é exibido enquanto
      ausente).
- [ ] Confirmar domínio oficial do site (`siteConfig.siteUrl`, canonical do
      `index.html`, `public/robots.txt` e `public/sitemap.xml` ficam vazios
      até a confirmação).

⚠️ O endereço comercial divulgado no Instagram (Av. Abilon de Souza Naves)
é diferente do endereço fiscal encontrado no CNPJ (Av. Manoel Ribas) — o
site usa somente o endereço comercial divulgado publicamente; o endereço
fiscal não foi e não deve ser usado no site.

## Formação

- [ ] Nome exato do curso de Estética.
- [ ] Instituição/faculdade.
- [ ] Ano de conclusão.
- [ ] Especializações e cursos complementares.
- [ ] Certificados autorizados para publicação (com foto do documento).
- [ ] Título profissional correto a ser usado no site.

Confirmado até o momento: Mariangela trabalhou como professora de Artes
antes de migrar para a Estética, e fez faculdade de Estética nessa
transição — é só isso que a seção "Sobre" afirma; nenhum outro dado de
formação foi inventado.

## Experiência

- [ ] Ano de início na Estética.
- [ ] Anos de experiência (a seção de contadores, `FacadeYears.tsx`, fica
      oculta enquanto `facade.years`/`facade.clients` forem `0`).
- [ ] Número aproximado de clientes atendidos.
- [ ] Diferenciais e valores oficiais da marca (a seção "Diferenciais",
      `Differentials.tsx`, fica oculta enquanto isso não for confirmado —
      não é apropriado inventar missão/valores em nome da profissional).

## Tratamentos

⚠️ **A lista completa e exata dos ~20 tratamentos faciais/corporais
mencionada como já "extraída de uma análise anterior" não está disponível
nesta sessão** — não há, neste histórico de conversa, nenhum catálogo de
nomes de tratamentos do Instagram para reaproveitar. Para não inventar
nomes, categorias ou descrições, o catálogo do site permanece com os 13
cards genéricos (`Tratamento 01`–`Tratamento 13`) já existentes na base
técnica, preservando grade, filtros, modal, seleção e agendamento
funcionando. **Envie novamente a lista oficial** (nomes exatos publicados,
por categoria — facial, corporal, depilação a laser) para que os cards
sejam substituídos pelos nomes reais.

Para cada tratamento, quando o nome for confirmado, ainda faltará:

- [ ] Descrição curta e texto completo (ou usar os textos-padrão neutros já
      definidos: "Conheça este tratamento e consulte mais informações
      diretamente com a profissional." / "As informações completas sobre
      indicação, etapas, cuidados e quantidade de sessões serão adicionadas
      após a confirmação profissional.")
- [ ] Benefícios, indicações, contraindicações.
- [ ] Duração e quantidade de sessões.
- [ ] Cuidados antes/depois.
- [ ] Equipamentos associados (nenhum equipamento foi associado sem
      confirmação).
- [ ] Fotos e vídeos de cada tratamento.

## Laser Day

- [ ] Próxima data.
- [ ] Periodicidade (mensal, bimestral, etc.).
- [ ] Regiões do corpo atendidas na ação.
- [ ] Tecnologia/equipamento utilizado.
- [ ] Regras e orientações (pré/pós, forma de inscrição, etc.).

O destaque "Laser Day" (`src/components/sections/LaserDay.tsx`) já está no
site, mas só com o convite para consultar a próxima data pelo WhatsApp —
nenhum dado acima foi preenchido.

## Atendimento

- [ ] Horários de funcionamento (dias e faixas de horário).
- [ ] Formas de pagamento aceitas.
- [ ] Política de cancelamento/reagendamento (prazo mínimo, multa, sinal).
- [ ] Política de atrasos.

O CTA de agendamento continua direcionando apenas para o WhatsApp, sem
calendário nem horários — nenhuma regra foi inventada.

## Conteúdo visual

- [ ] Fotos da Mariangela (Hero, Sobre).
- [ ] Fotos do ambiente/fachada (Localização, Experience).
- [ ] Fotos dos equipamentos.
- [ ] Resultados/antes-depois autorizados para publicação.
- [ ] Conteúdo dos 5 destaques do Instagram (Resultados, Cursos, Destaques,
      Feedbacks, Jato de Plasma) — não foi possível acessar o conteúdo sem
      login; nada foi presumido a partir dos nomes dos destaques (nenhuma
      avaliação foi criada a partir de "Feedbacks", nenhum certificado a
      partir de "Cursos", nenhum resultado a partir de "Resultados", e
      nenhuma informação técnica sobre "Jato de Plasma" foi adicionada sem
      acesso ao conteúdo real).

Todos os espaços de imagem/vídeo do site já mostram um placeholder neutro
("Imagem será adicionada") enquanto o material real não chega — nenhum
espaço fica vazio ou quebrado.

## Avaliações

- [x] Único depoimento público real aproveitado: comentário de
      `@dekka_magalhaes` no Instagram ("O tratamento acabou com minhas
      manchas no rosto."), exibido com o aviso "Relato individual. Os
      resultados podem variar de pessoa para pessoa." — sem nota/estrelas
      (não confirmadas) e sem menção ao Google (não há confirmação de que
      seja uma avaliação do Google).
- [ ] Avaliações adicionais autorizadas para publicação.

## Técnico (não depende da cliente)

- [ ] `src/components/NotFoundPage.tsx` está pronto mas não está montado —
      só faz sentido ativá-lo se o site ganhar páginas internas no futuro.

## Observação sobre métricas do Instagram

Na análise realizada em **06/08/2026** foram observados **1.534
seguidores** e **129 publicações** no perfil @estetica_mariangela. Esses
números mudam com frequência e **não foram usados em nenhum lugar do
site** (não aparecem no Hero, não são tratados como contador) — registrados
aqui apenas como referência da data da coleta.
