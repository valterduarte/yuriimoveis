# Corretor Yuri Imóveis

Site institucional e portal de imóveis do Corretor Yuri (CRECI-SP 235509),
atendendo Osasco, Barueri e Carapicuíba.

## Stack

- **Next.js 15** (App Router, React 19, TypeScript strict)
- **PostgreSQL** via [Neon](https://neon.tech) serverless driver
- **Tailwind CSS 3** + componentes próprios
- **Cloudinary** para imagens
- **Leaflet + OpenStreetMap (CARTO Dark Matter)** para mapas
- **Vitest** para testes unitários
- **ESLint flat config** + **Husky + lint-staged** pre-commit
- **GitHub Actions** CI (lint, typecheck, test)
- Deploy: **Vercel**

## Estrutura

```
CorretorYuri/
├── .github/workflows/   # CI (lint, typecheck, test)
├── docs/adr/            # decisões arquiteturais
├── nextjs/              # aplicação Next.js
│   ├── app/             # rotas (App Router)
│   ├── components/      # componentes React
│   ├── lib/             # data layer e domínio (api, properties, blog, navigation, jsonLd, …)
│   ├── data/            # dados estáticos (bairros, categorias, FAQs, landings)
│   ├── hooks/           # hooks customizados
│   ├── utils/           # utilitários (slugify, gender helpers, formatters)
│   ├── types/           # tipos compartilhados
│   ├── scripts/         # scripts de migração/seed
│   ├── public/          # assets estáticos
│   └── .husky/          # git hooks
└── README.md
```

Para detalhes de desenvolvimento (rodar local, scripts, env vars), veja
[`nextjs/README.md`](./nextjs/README.md). Decisões arquiteturais ficam em
[`docs/adr/`](./docs/adr/).
