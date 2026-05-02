# Corretor Yuri — Next.js app

Aplicação Next.js 15 com App Router. Esta pasta é a raíz npm do projeto;
o repositório git fica um nível acima (`../`).

## Setup local

### 1. Instalar dependências

```bash
cd nextjs
npm install
```

O `prepare` script já configura o git hook (`pre-commit` com Husky +
lint-staged) automaticamente.

### 2. Variáveis de ambiente

Copie o template e preencha:

```bash
cp .env.local.example .env.local
```

| Variável                       | Para quê                                              |
|--------------------------------|--------------------------------------------------------|
| `NEXT_PUBLIC_SITE_URL`         | URL canônica do site (ex: `http://localhost:3000` em dev) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD` | Cloud name do Cloudinary                              |
| `NEXT_PUBLIC_CLOUDINARY_PRESET`| Upload preset do Cloudinary                           |
| `DATABASE_URL`                 | Postgres do Neon (`postgresql://...`)                 |
| `JWT_SECRET`                   | Segredo HMAC pra assinar tokens admin                 |
| `ADMIN_USER`                   | Usuário do `/admin`                                   |
| `ADMIN_PASSWORD`               | Senha do `/admin` (texto puro — single-user)          |

### 3. Rodar

```bash
npm run dev
# http://localhost:3000
```

## Scripts

| Comando             | O que faz                                             |
|---------------------|--------------------------------------------------------|
| `npm run dev`       | Dev server com hot reload                             |
| `npm run build`     | Build de produção                                     |
| `npm start`         | Serve o build (`next start`)                          |
| `npm run lint`      | ESLint em `.ts`, `.tsx`, `.js`, `.jsx`, `.mjs`, `.cjs` |
| `npm run lint:fix`  | ESLint + auto-fix                                     |
| `npm run typecheck` | `tsc --noEmit`                                        |
| `npm test`          | Vitest (run-once)                                     |
| `npm run test:watch`| Vitest watch mode                                     |
| `npm run seed:blog` | Importa posts iniciais pro blog                       |

## Pre-commit hook

Cada `git commit` roda `eslint --fix` apenas nos arquivos staged. Se algum
tiver erro de lint (não warning), o commit é bloqueado. O fix automático
re-staged os arquivos antes de commitar — você não precisa rodar `lint:fix`
manualmente.

Configurado em `.husky/pre-commit` + `lint-staged` no `package.json`.

## Convenção de imports

Cada módulo de domínio em `lib/` declara explicitamente sua superfície:

| Domínio          | Módulo                       |
|------------------|------------------------------|
| Imóveis          | `lib/properties.ts`          |
| Blog             | `lib/blog.ts`                |
| Navegação        | `lib/navigation.ts`          |
| Matriz nav.      | `lib/navigationMatrix.ts`    |
| Site config      | `lib/siteConfig.ts`          |
| Cache tags       | `lib/cacheTags.ts`           |
| JSON-LD builders | `lib/jsonLd.ts`              |
| API client       | `lib/apiClient.ts`           |
| Formatters       | `lib/formatters.ts`          |

`lib/api.ts` existe como barrel de retro-compatibilidade re-exportando
tudo. Código novo importa do módulo específico.

## Rodar testes pontualmente

```bash
# um arquivo
npx vitest run lib/financiamento.test.ts

# por pattern
npx vitest run -t "MCMV"
```

## Banco de dados

Postgres no Neon. As tabelas relevantes:

- `imoveis` — listings
- `blog_posts` — posts publicados
- `contatos` — leads do formulário
- `clicks` — eventos de WhatsApp/CTAs
- `site_config` — configurações key/value (hero image etc.)

Migrations ficam em `migrations/`. Sem framework de migration ainda — são
SQL puro aplicados manualmente.

## Deploy

Vercel deploya automaticamente:

- Push em `main` → produção (https://corretoryuri.com.br)
- Push em qualquer outra branch → preview deploy

CI (GitHub Actions) bloqueia merge se lint, typecheck ou tests falharem.
