# ADR 0001 — Data layer organizado por domínio, não por tipo

**Data:** 2026-04-30
**Status:** Aceito

## Contexto

O acesso a dados vivia inteiro em `lib/api.ts` — um arquivo de 524 linhas
misturando consultas de imóveis, blog, navegação, matriz de URLs, site
config e parsing de rows. Cada nova tela adicionava função no fim do
arquivo. Diferentes domínios competiam por espaço de revisão, imports
genéricos `from '../lib/api'` escondiam quais dados a página realmente
precisava, e qualquer consumidor enxergava toda a superfície.

## Decisão

Quebrar o data layer em módulos por domínio:

- `lib/properties.ts` — imóveis (fetch, filtros, map, slugs, parseImovel)
- `lib/blog.ts` — posts (published, by slug, related)
- `lib/navigationMatrix.ts` — matriz de URLs e price/bedroom matrix
- `lib/siteConfig.ts` — chave/valor da tabela `site_config`
- `lib/cacheTags.ts` — constantes de cache compartilhadas

`lib/api.ts` vira um **barrel** que apenas re-exporta tudo, mantendo
compatibilidade com os 23 consumers existentes. Código novo importa do
módulo específico:

```ts
// novo
import { fetchProperties } from '../lib/properties'

// legado (ainda funciona via barrel)
import { fetchProperties } from '../lib/api'
```

## Consequências

**Bom:**
- Cada domínio tem responsabilidade única.
- Imports declaram dependência real (página de blog importa de `lib/blog`,
  não do god module).
- Ler/refatorar um domínio não exige rolar centenas de linhas alheias.

**Trade-off:**
- Mais arquivos pra navegar.
- Existe uma janela onde código novo (módulo direto) e legado (barrel)
  coexistem.

## Convenção daqui pra frente

- Código novo importa direto do módulo de domínio.
- Quando tocar um arquivo legado, migrar o import para o módulo direto.
- O barrel `lib/api.ts` será deletado quando todos os consumers forem
  migrados.
