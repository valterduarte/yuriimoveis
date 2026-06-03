# Associação explícita de imóvel a empreendimento

**Data:** 2026-06-03
**Tipo:** Arquitetura de dados + admin + agrupamento
**Origem:** Yuri vai cadastrar muitas plantas (Play e outros) e não consegue manter o título no padrão exato exigido pelo agrupamento atual.

## Problema

O agrupamento de imóveis em empreendimentos (`buildEmpreendimentosFromRows`) usa a chave
`endereço | bairro | cidade | nome`, com o **nome extraído do título** por regex. Três fragilidades reais (já observadas):

1. Nome vem do título → sensível a caixa/acento/separador ("PLAY CONDOMINIO CLUBE" ≠ "Play Condomínio Clube").
2. Endereço exato na chave → um typo ("Belline" vs "Beline") separa o grupo.
3. Slugs colidentes são **descartados em silêncio** (`seenSlugs`) → a planta mal-formatada some, nem vira página.

Além disso, `listEmpreendimentos` exige `endereco != ''` e `buildEmpreendimentosFromRows`
faz `continue` sem endereço → planta sem endereço nunca agrupa.

## Solução (campo explícito + heurística tolerante como fallback)

### Dado
- Migration `003_add_empreendimento_to_imoveis.sql`: `ALTER TABLE imoveis ADD COLUMN IF NOT EXISTS empreendimento TEXT;`
- Backfill: preenche `empreendimento` dos imóveis existentes com `extractEmpreendimentoFromTitulo(titulo)` (onde der), pra os grupos atuais nascerem estáveis.

### Agrupamento (`lib/empreendimento.ts`)
- `EmpreendimentoSourceRow` ganha `empreendimento: string | null`.
- Nome do prédio = `empreendimento` (se preenchido) **ou** `extractEmpreendimentoFromTitulo(titulo)` (fallback). Sem nenhum → pula.
- Chave de grupo normalizada: `normalizeForMatch(nome) | normalizeForMatch(cidade)` — **sem endereço** (resolve typo) e **sem sensibilidade a caixa/acento** (resolve caps).
- Nome de exibição do grupo: prefere o valor explícito; senão o parseado.
- Relaxar requisito de endereço: `continue` só se faltar **bairro ou cidade** (endereço deixa de ser obrigatório; a página já não mostra rua).
- `listEmpreendimentos` SELECT inclui `empreendimento` e não exige mais `endereco != ''`.

### Admin (cadastro)
- `FormState` + `EMPTY_FORM` + `propertyToForm` ganham `empreendimento`.
- Campo "Empreendimento" em `BasicInfoSection` — input com `<datalist>` de autocomplete dos já existentes.
- `GET /api/admin/empreendimentos` (auth) retorna nomes distintos pra alimentar o datalist.
- Schema zod (`imovelCreateSchema`/`imovelUpdateSchema`) ganha `empreendimento` (string, opcional, max 200).
- `POST`/`PUT /api/imoveis` incluem a coluna no INSERT/UPDATE.

## Fatos ancorados / invariантes
- Migração **aditiva** (coluna nullable) — não quebra dados existentes.
- Backfill só preenche onde está NULL e o parse funciona; não sobrescreve.
- Linha sem `empreendimento` continua agrupando pela heurística (compatibilidade).

## Fora de escopo
- Não criar tabela `empreendimentos` separada (continua derivado dos imóveis, agora com chave confiável).
- Não mexer no enrichment editorial (`data/empreendimentoEnrichment.ts`).

## Verificação
- Testes de `buildEmpreendimentosFromRows`: campo explícito agrupa independente de título/endereço; caps/acento normalizam; explícito vence o parse; fallback sem o campo segue funcionando.
- `npm run typecheck`, `npm run build`, suíte de testes.
- Dev: cadastrar/editar com o campo, ver agrupamento; backfill mantém Ocean/Play corretos.
