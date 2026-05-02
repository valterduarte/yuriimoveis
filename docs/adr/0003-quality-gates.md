# ADR 0003 — Três camadas de quality gate

**Data:** 2026-05-02
**Status:** Aceito

## Contexto

Sem ESLint configurado, padrões de código drift naturalmente. Sem CI, lint
e tests só rodam quando alguém lembra. Sem pre-commit hook, mesmo com CI o
ciclo de feedback é "abre PR → espera 2 min → corrige → push de novo".

Decisão de cobrir as três camadas, cada uma pegando defeitos no momento
mais barato de corrigir.

## Decisão

Três gates configurados, do mais imediato ao mais caro:

### Camada 1 — Editor (opcional, manual)

VS Code extensão "ESLint" da Microsoft. Sublinha errors enquanto o
desenvolvedor digita. Não obrigatório — agentes de IA não têm IDE.

### Camada 2 — Pre-commit (Husky + lint-staged)

Roda `eslint --fix` apenas nos arquivos staged. Errors bloqueiam o commit;
warnings passam (informativos). Auto-fix re-stages os arquivos.

Configurado em:
- `nextjs/.husky/pre-commit` — script shell que `cd nextjs && npx lint-staged`
- `nextjs/package.json` → `lint-staged` — pattern + comando
- `nextjs/package.json` → `prepare` — registra `core.hooksPath` no clone

O git root fica um nível acima de `nextjs/`, então o `prepare` script faz
`cd .. && git config core.hooksPath nextjs/.husky` na instalação do npm.

### Camada 3 — CI (GitHub Actions)

`.github/workflows/ci.yml` roda em cada PR e push em `main`:
- `npm run lint`
- `npm run typecheck`
- `npm test`

Build NÃO está no CI — Vercel já constrói e deploya. Duplicar seria
desperdício e o CI não tem env vars do Postgres.

Branch protection no `main` requer o check "Lint, typecheck and test"
verde antes de mergear (configuração via GitHub UI, não no repo).

## Consequências

**Bom:**
- Defeitos pegos no editor (camada 1) custam segundos.
- No commit (camada 2) custam minutos.
- No PR (camada 3) custam o tempo do reviewer.
- O mesmo `npm run lint/test/typecheck` roda nos três lugares — um único
  source of truth.

**Trade-off:**
- Pre-commit pode ser pulado com `git commit --no-verify`. CI pega.
- Se o desenvolvedor não habilita branch protection, o CI roda mas merge
  passa mesmo se quebrar.

## Quando ignorar uma camada

- `--no-verify` no commit é aceitável **só** durante reset/rebase manual
  ou quando o pre-commit está em loop por bug de config.
- Force-push em branch própria (não-main, não-shared): tudo bem.
- Force-push em `main` ou branch com PR aberto: nunca.
