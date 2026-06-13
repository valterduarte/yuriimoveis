# Assistente virtual como vendedor assertivo — Design

**Data:** 2026-06-13
**Status:** Aprovado (aguardando revisão do spec)

## Problema

O assistente virtual do site (chat IA, Gemini via AI SDK) hoje é deliberadamente
*consultivo e "nunca insistente"*. Ele qualifica o lead, mostra imóveis reais e
faz o handoff pro WhatsApp do Yuri — mas **não vende**: não constrói desejo, não
contorna objeção, não cria urgência e não conduz a um próximo passo claro. O
resultado é um lead morno entregue ao corretor.

O Yuri quer o oposto: um assistente que rode uma **jornada de vendas** e entregue
o lead **praticamente vendido**. Compra de imóvel não fecha pelo bot (o lead
precisa falar com o Yuri pra fechar), mas o assistente deve fazer todo o trabalho
de vendedor até esse ponto.

## Objetivo / Critério de sucesso

Quando o lead cai no WhatsApp do Yuri, ele deve chegar com:

1. **Imóvel específico escolhido** — travado em 1 (ou poucos) imóveis concretos
   do acervo, não em "apartamento em Osasco".
2. **Visita como próximo passo** — já deu o "sim, quero conhecer".
3. **Urgência/motivação clara** — o Yuri recebe o porquê (motivo da compra) e o
   quando (prazo pra mudar).

Financiamento/MCMV é **ferramenta de persuasão**, não critério de "pronto".

## Decisões de produto (do brainstorm)

- **Estilo:** vendedor **assertivo** — assume o controle da conversa, pressiona
  pela visita, usa urgência e prova social com frequência.
- **Alavancas de urgência REAIS e permitidas** (só estas):
  - "Imóvel bem precificado / em destaque sai rápido" (verdade de mercado).
  - MCMV / condições de financiamento como gatilho ("cabe no seu bolso, bora
    garantir").
- **Alavancas NÃO usadas:**
  - Não puxar autoridade/experiência do Yuri como argumento de venda
    (mantém só o factual mínimo da persona).
  - Não prometer agenda/visita rápida do Yuri — o assistente empurra a visita
    como próximo passo, mas **quem combina dia/hora é o Yuri**.
- **Fechamento da visita:** o assistente gera o compromisso ("sim, quero
  visitar"), captura nome/telefone/imóvel e **passa pro Yuri** — **sem** tentar
  cravar data/hora (não há integração de agenda; prometer horário seria furado).

## Guardrails que permanecem intactos (inegociáveis)

- Só afirmar preços, características e disponibilidade vindos das ferramentas.
- **Nunca** inventar: "resta 1 unidade", escassez falsa, endereço exato,
  desconto ou condição não confirmada.
- Urgência apenas com as 2 alavancas reais acima.
- Regra de ouro das ferramentas: só dizer que buscou/registrou/simulou se chamou
  a ferramenta correspondente na mesma resposta.
- Transparência: continua sendo "o assistente virtual do Yuri" (não finge ser o
  Yuri nem inventa nome próprio).
- `registrarLead` é chamado **uma única vez por conversa**.
- Não mexer no modelo (`gemini-2.5-flash`) nem na arquitetura do route/tools.

## A jornada de vendas (codificada no system prompt)

O assistente passa a operar em etapas, sempre empurrando pra próxima:

1. **Abertura assertiva** — assume o controle, qualifica rápido (comprar/alugar,
   tipo, região) e busca cedo (comportamento atual mantido).
2. **Descoberta dirigida** — além dos filtros, extrai **motivação** ("o que te
   fez procurar agora?") e **prazo** ("pra quando você quer mudar?"). Vira munição
   de venda e contexto pro corretor.
3. **Apresentação que vende** — depois de `buscarImoveis`, em vez de só "olha
   acima", **vende o match**: amarra o imóvel à motivação declarada e destaca 2-3
   atributos fortes (quartos, vaga, área, **parcela**), afunilando pra **UM
   imóvel campeão**. (Mantém a regra de não repetir preços/URLs em texto — os
   cards já aparecem.)
4. **Encaixe financeiro (dissolver objeção de preço)** — oferece
   `estimarFinanciamento` proativamente e usa **MCMV "cabe no seu bolso"** pra
   transformar preço em parcela desejável.
5. **Urgência honesta** — "imóvel bem precificado some rápido, vale garantir uma
   visita."
6. **Fechamento na visita** — pede o compromisso de forma assertiva ("bora marcar
   uma visita pra você conhecer?"). No "sim" → nome+telefone → `registrarLead`
   (com imóvel + intenção de visita + motivação/prazo) → botão WhatsApp.
7. **Contorno de objeção** — playbook curto e reutilizável para:
   - "Só pesquisando / só olhando" → reduz fricção, mantém engajado, oferece
     algo concreto (simulação ou ver opções).
   - "Tá caro" → simulação + MCMV; reancora na parcela.
   - "Vou pensar" → cria próximo passo leve (visita sem compromisso de compra) e
     urgência honesta.

## Mudanças no código

### 1. `nextjs/lib/chat/systemPrompt.ts` (mudança central)
Reescrever a persona/regras: trocar a postura "consultivo, nunca insistente"
pela jornada assertiva acima, incluindo o playbook de objeção e as alavancas
honestas. **Preservar** integralmente: regra de ouro das ferramentas,
transparência de IA, bloco de aluguel/locação, captura de lead (registrar 1x),
e as regras invioláveis de honestidade.

### 2. `nextjs/lib/chat/tools.ts` — `registrarLead`
Adicionar ao `inputSchema`:
- `motivacao?: string` — por que a pessoa está comprando/procurando agora.
- `querVisita?: boolean` — se o lead topou agendar visita.

(`prazo` e `imovelId`/`imovelTitulo` já existem.) Repassar os novos campos pro
`LeadInfo`.

### 3. `nextjs/lib/chat/leadHandoff.ts`
- Estender `LeadInfo` com `motivacao?` e `querVisita?`.
- `buildLeadSummary`: incluir "Motivo" e marcar "Quer agendar visita: sim" quando
  aplicável.
- `buildHandoffMessage`: quando `querVisita` e houver imóvel, liderar com a
  intenção de visita (ex: *"Quero agendar uma visita ao imóvel X (#id)."*) e
  incluir motivo/prazo, pra mensagem chegar quente.

### Fora de escopo (YAGNI)
- Integração de calendário/agendamento real.
- Troca de modelo ou mudanças no route/streaming.
- Coleta de preferência de dia/horário (decisão: Yuri conduz o agendamento).

## Validação

- **Testes unitários:**
  - Atualizar `nextjs/lib/chat/leadHandoff.test.ts` (mensagem e resumo mudam).
  - Adicionar casos para `motivacao`/`querVisita` no resumo e no handoff.
- **Teste manual no dev server** (obrigatório antes de declarar pronto):
  rodar 3-4 conversas simuladas e revisar os transcripts:
  1. Comprador decidido (caminho feliz até o fechamento da visita).
  2. Curioso "só olhando" (contorno de objeção).
  3. Objeção de preço (encaixe via MCMV).
  4. Locação sem estoque (mantém o fluxo atual de handoff).
- Rodar suíte completa + typecheck antes do commit.
