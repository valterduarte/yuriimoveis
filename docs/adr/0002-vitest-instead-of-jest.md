# ADR 0002 — Vitest como test runner

**Data:** 2026-05-01
**Status:** Aceito

## Contexto

Projeto cresceu para ~14 mil linhas sem testes automatizados. TypeScript
strict pega tipos, mas não comportamento. Bugs latentes (`SUPPORTED_CIDADE_SLUGS`
desatualizado, non-null assertions em filter pages, type casts inseguros)
eram silenciados até produção. A escolha era entre Jest, Vitest, e o test
runner nativo do Node.

## Decisão

Adotar **Vitest**.

Razões:

- **Mesmo bundler que Vite/Next** — sem duplicar config TypeScript/JSX.
- **Sintaxe compatível com Jest** — `describe/it/expect`, sem reaprendizado.
- **Watch mode rápido** — re-roda só os arquivos afetados em milissegundos.
- **TypeScript first-class** — consome `tsconfig.json` direto.
- **Sem ts-jest, sem babel.config.js** — config em uma única `vitest.config.ts`.

Convenção:

- Arquivo de teste vive ao lado do código: `lib/foo.ts` → `lib/foo.test.ts`.
- Ambiente padrão: `node` (sem DOM). React component tests, quando entrarem,
  vão precisar de `@testing-library/react` + `happy-dom`.
- `tsconfig` da app tem `jsx: preserve` (Next exige). `vitest.config.ts`
  sobrescreve com `esbuild.jsx = 'automatic'` para que TSX importado
  transitivamente seja parseado.

## Consequências

**Bom:**
- 87 testes cobrindo pure modules em < 2s.
- Mesmo runner local e em CI.

**Trade-off:**
- Não testamos componentes React ainda (próximo passo, se valer).
- Database/integration tests ficam fora do escopo do Vitest (precisariam
  de Postgres em CI ou um runner dedicado).

## Quando NÃO escrever teste com Vitest

- Funções triviais cujo nome já é o teste (`function add(a,b){return a+b}`).
- Wrappers do framework (Server Components, route handlers que só passam
  parâmetros adiante). Para esses, smoke test em produção via curl /
  Vercel preview.

## O que está coberto hoje

- `lib/formatters.ts` — BRL/decimal/parsing
- `utils/imovelUtils.ts` — slugify, gender helpers, capitalize, pluralize, Cloudinary URLs
- `lib/navigation.ts` — slug ↔ db, hierarchical URL builder, inferCidadeFromBairro
- `lib/financiamento.ts` — SAC math, MCMV faixas, Associativo/SBPE
- `lib/jsonLd.ts` — schema builders
