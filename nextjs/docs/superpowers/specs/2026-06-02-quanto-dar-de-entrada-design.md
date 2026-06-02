# Guia de decisão: "Quanto dar de entrada num apartamento em Osasco?"

**Data:** 2026-06-02
**Tipo:** Conteúdo (guia longo `/guia`)
**Origem:** Motor de leads orgânicos / GEO — fechar gap real de conteúdo de compra ([[project_leads_engine]]).

## Problema

Análise de gap do conteúdo de compra existente mostrou que o tema "quanto dar de
entrada" aparece espalhado (68 menções a "entrada" em `data/guias.ts`) mas **não tem
guia próprio**. É busca de altíssima intenção de compra ("entrada mínima apartamento",
"quanto dar de entrada financiamento", "entrada parcelada na planta") e hoje o
comprador não tem uma página única que responda. Consolidar fecha o gap sem duplicar
(FGTS já tem seção no guia de financiamento; ITBI/custos têm guia e artigo próprios —
este guia **linka** para eles, não os repete).

## Escopo

Adicionar **uma** entrada `GuiaData` ao objeto `GUIAS` em `data/guias.ts`. Toda a
infra é auto-registrada:

- `GUIA_SLUGS = Object.keys(GUIAS)` → roteamento `/guia/[slug]` + sitemap (`app/sitemap.ts:262`)
- `Object.values(GUIAS)` → corpus de IA (`app/llms-full.txt/route.ts:158`)
- Schema FAQPage emitido pela rota existente (mesmo caminho do guia `quanto-ganhar`, já no ar)

Nenhuma mudança de tipo, rota, componente ou script é necessária.

## Conteúdo

### Metadados
- **slug:** `quanto-dar-de-entrada-imovel-osasco`
- **titulo:** Quanto Dar de Entrada num Apartamento em Osasco?
- **subtitulo:** A entrada mínima de 20%, como usar o FGTS, entrada parcelada na planta e quanto reservar além dela
- **descricaoMeta:** ~155 caracteres cobrindo entrada mínima (20%), FGTS, MCMV, entrada parcelada na planta e custos paralelos (ITBI 3% + cartório).
- **ctaLabel:** Simular entrada e parcela
- **ctaHref:** `/simulador`
- **publishedAt / updatedAt:** 2026-06-02

### Intro
Abre com a dúvida central do comprador ("quanto preciso juntar para começar"),
estabelece que a entrada não é só os 20% — e que existem três alavancas (FGTS, MCMV,
entrada parcelada na planta) que mudam quanto sai do bolso. Encaminha ao simulador
para o número exato.

### Seções (6)
1. **Quanto é a entrada mínima** — 20% no SBPE (banco financia até 80%, ancorado em
   `MIN_DOWN_PAYMENT_RATE = 0.20`); por que existe; exemplo em R$ numa faixa típica de
   Osasco (apto R$ 250k → R$ 50k de entrada). Link: `/simulador` (tool).
2. **FGTS reduz (ou zera) o que sai do bolso** — pode compor a entrada; requisitos
   básicos (sem imóvel na cidade onde mora/trabalha, intervalo de 3 anos entre usos);
   quem esquece subestima o poder de compra. Link: `/guia/financiamento-imobiliario-osasco`.
3. **Entrada no MCMV: o subsídio entra como parte da entrada** — nas faixas de menor
   renda o subsídio abate a entrada efetiva; combinado com FGTS, a entrada do bolso
   pode ficar baixa. Link: `/mcmv-osasco` (listing).
4. **Entrada parcelada na planta** — comprando na planta, a entrada é diluída em
   parcelas até a entrega, direto com a construtora, sem juros de financiamento; o
   saldo é financiado só na entrega das chaves. Link:
   `/guia/comprar-apartamento-na-planta-osasco`.
5. **Quanto reservar ALÉM da entrada** — ITBI 3% (Osasco) + escritura/registro +
   avaliação do banco; reservar ~4-5% do valor do imóvel além da entrada. Links:
   `/guia/custos-compra-imovel` e `/ajuda/itbi-osasco`. (Não reafirmar números de ITBI
   além dos 3% canônicos; o detalhamento fica nas páginas de custos.)
6. **Entrada maior vale a pena?** — trade-off: mais entrada reduz juros e parcela, mas
   não vale esvaziar a reserva de emergência; o simulador mostra o efeito de cada R$ a
   mais de entrada. Link: `/simulador` (tool).

### FAQs (4)
1. Qual a entrada mínima para financiar um apartamento em Osasco? → 20% (SBPE),
   composível com FGTS.
2. Posso usar o FGTS na entrada? → Sim, com requisitos do SFH.
3. Dá pra comprar sem entrada / entrada zero? → No SBPE geralmente não; MCMV reduz via
   subsídio e na planta a entrada é parcelada.
4. Quanto preciso reservar além da entrada? → ITBI 3% + cartório/registro; reserve
   ~4-5% extra.

### Linkagem interna (evitar página órfã)
Adicionar um `GuiaLink` apontando PARA o novo guia em três guias existentes:
- `financiamento-imobiliario-osasco` (seção de entrada/FGTS)
- `quanto-ganhar-para-financiar-imovel-osasco` (fator "entrada")
- `comprar-apartamento-na-planta-osasco` (entrada parcelada)

## Fatos ancorados (não inventar números)
- Entrada mínima SBPE: **20%** (`lib/financiamento.ts:29`, `MIN_DOWN_PAYMENT_RATE = 0.20`).
- FGTS compõe a entrada (já afirmado em `app/simulador/page.tsx` e guia de financiamento).
- ITBI Osasco: **3%** (guia `comprar-imovel-osasco`, artigo `itbi-osasco`). Reserva
  total além da entrada ~4-5% (ITBI + cartório), conforme `/simulador`.
- Faixas de preço de Osasco: usar as do guia `comprar-imovel-osasco` (apto 2q a partir
  de R$ 230k) para exemplos coerentes.

## Fora de escopo
- Não criar guia de FGTS dedicado (já coberto).
- Não reescrever guias de custos/ITBI.
- Não tocar em rota, tipo, sitemap ou llms-full (auto-registram).

## Verificação
- `npm run typecheck` e `npm run build` passam.
- `/guia/quanto-dar-de-entrada-imovel-osasco` renderiza no dev server (seções, FAQ,
  CTA, links internos resolvem 200).
- Slug aparece em `/sitemap.xml` e o texto integral em `/llms-full.txt`.
