# SEO Audit — corretoryuri.com.br

**Data do audit:** 2026-05-06
**Tipo de negócio detectado:** Local Service / Real Estate Agent (Osasco, Barueri, Carapicuíba — SP)
**Stack:** Next.js (App Router) + Vercel (SSG/ISR) + Cloudinary
**Páginas no sitemap:** 522
**Health Score:** **86 / 100** — Excelente base

---

## Executive Summary

Site com fundação técnica forte e estratégia SEO local bem executada. Schema markup rico (LocalBusiness + RealEstateAgent + FAQPage + BreadcrumbList + CollectionPage + Article + Person + ContactPage), security headers de produção, sem cloaking, todas as imagens com `alt` e `next/image`, hero preload e fonts preload corretos.

Pontos de melhoria concentrados em três frentes: (1) tamanho de página em listings de cidade (959 KB para `/comprar/osasco/apartamento`), (2) ausência de `llms.txt` para GEO/AEO, (3) refinamentos pontuais em metadados e schemas das páginas de bairro.

### Top issues confirmados
1. **Listing de cidade pesado** — `/comprar/osasco/apartamento` serve 959 KB de HTML (44 imóveis renderizados de uma vez). Risco para LCP e TBT em mobile.
2. **Falta `og:type` na home** — apenas a página inicial; demais páginas (sobre, blog, imoveis) já emitem `og:type` corretamente.
3. **Ausência de `llms.txt`** — não há sinal explícito para AI crawlers (ChatGPT, Perplexity, AI Overviews).
4. **Páginas de bairro com description curta (~100c)** — abaixo da janela ideal (120–160c) e sem FAQPage schema (que as páginas de cidade já têm).

### Falsos positivos descartados (revisão)
- **H1 do `/sobre`**: o HTML servido é `Corretor Yuri<br/><span>Imóveis</span>` — mesmo padrão da home (`Imóveis em<br/>Osasco e Região`) que está correto. O "espaço duplo" foi artefato do regex de extração inconsistente do audit; não há bug.
- **`og:type` ausente em "todas as páginas"**: na verdade, apenas a homepage estava sem; as demais já emitem corretamente (`website`/`article`).

### Top 5 Quick Wins
1. Adicionar `<meta property="og:type" content="website" />` no layout root (5 min).
2. Criar `/llms.txt` com resumo do site, áreas atendidas, CRECI e endpoints relevantes (15 min).
3. Trimar/normalizar o H1 da página `/sobre` (2 min).
4. Adicionar paginação ou virtualização no listing de cidade — limitar a ~12 imóveis SSR + lazy load infinito (1–2 h).
5. Expandir descriptions das páginas `/comprar/{cidade}/{tipo}/{bairro}` para 130–160 chars com diferencial (escolas, transporte, faixa de preço) (1 h).

---

## Technical SEO — 95/100

| Item | Status |
|---|---|
| HTTPS + HSTS (max-age 2 anos) | OK |
| HTTP/2 | OK |
| robots.txt válido + Sitemap reference | OK |
| sitemap.xml com lastmod + priority + changefreq | OK |
| Canonical em todas as páginas analisadas | OK |
| Mobile viewport meta | OK |
| SSG/ISR (`x-nextjs-prerender: 1`) | OK |
| CDN cache (`x-vercel-cache: HIT`) | OK |
| CSP + X-Frame-Options DENY + X-Content-Type-Options + Referrer-Policy + Permissions-Policy | OK |
| Sem cloaking (Googlebot vs default UA: HTML idêntico) | OK |
| robots `Disallow: /admin /api` | OK |

**Sem ações críticas.**

---

## Content Quality / E-E-A-T — 88/100

| Item | Status |
|---|---|
| CRECI-SP 235509 documentado (`hasCredential` schema + texto) | OK |
| `Person` schema na página `/sobre` | OK |
| Author no blog (`RealEstateAgent`) com URL e perfil | OK |
| `datePublished` + `dateModified` em artigos | OK |
| Conteúdo factual e específico (preços, ITBI, faixas MCMV 2026) | OK |
| Internal linking (footer com guias de bairro + ajuda) | OK |
| Blog com posts longos e estruturados (H2/H3 hierárquicos) | OK |

**Recomendações:**
- Trocar `author` em `Article` schema para o tipo `Person` (com link a `/sobre`), mantendo `publisher` como `RealEstateAgent`. Sinal mais forte de E-E-A-T para Google.
- Adicionar `mainEntityOfPage` ao Article schema (apontando ao próprio URL).

---

## On-Page SEO — 85/100

| Página | Title | Description | H1 | Observação |
|---|---|---|---|---|
| `/` | 62c | 137c | "Imóveis em Osasco e Região" | Title borderline (≤60c ideal) |
| `/imoveis` | 87c | 137c | "Imóveis Disponíveis" | OK |
| `/comprar/osasco/apartamento` | 60c | 124c | "Apartamentos à Venda em Osasco" | OK |
| `/comprar/barueri/apartamento/jardim-julio` | 73c | 105c | "Apartamentos à Venda no Jardim Julio, Barueri" | **Description curta** |
| `/sobre` | 67c | 130c | "Corretor Yuri / Imóveis" (com `<br/>`) | OK |
| `/contato` | 51c | 130c | "Contato" | OK |
| `/simulador` | 80c | 158c | "Simulador de Financiamento Imobiliário" | OK |
| `/blog/morar-em-carapicuiba…` | 89c | 159c | (longo, descritivo) | OK |

**Recomendações:**
- Encurtar title da home para ≤60c. Sugestão: `Corretor Yuri — Imóveis em Osasco e Barueri (CRECI 235509)` (60c) ou `Corretor Yuri Imóveis — Osasco, Barueri e Carapicuíba` (52c).
- Expandir descriptions das páginas `/comprar/.../bairro` para ~140c — incluir diferencial (escolas, CPTM, faixa de preço).

---

## Schema / Structured Data — 90/100

Tipos detectados ao longo do site:

```
WebSite, LocalBusiness, RealEstateAgent, FAQPage, BreadcrumbList,
CollectionPage, Article, Person, ContactPage,
EducationalOccupationalCredential, OpeningHoursSpecification,
PostalAddress, GeoCoordinates, AdministrativeArea, City,
ListItem, Organization
```

**Pontos fortes:** schema multi-tipo (`["LocalBusiness","RealEstateAgent"]`), `areaServed`, `knowsAbout`, `priceRange`, `openingHoursSpecification`, `hasCredential`, `sameAs` (Instagram + WhatsApp), `geo` coordenadas.

**Faltando:**
- **Páginas de bairro sem FAQPage** — as páginas de cidade têm FAQ; replicar nas páginas `/comprar/{cidade}/{tipo}/{bairro}` aumentaria rich result coverage.
- **Article sem `mainEntityOfPage`** — adicionar para conformidade Google completa.
- **Páginas de imóvel individual** — não há `Product` ou `RealEstateListing` schema por item dentro de `CollectionPage`. Adicionar `itemListElement` com schema `Product` (ou `RealEstateListing`/`SingleFamilyResidence`) com preço, área, dormitórios.

---

## Performance / CWV — 70/100

| Página | Tamanho HTML | Observação |
|---|---|---|
| `/` | 216 KB | Hero image preload + fonts preload — bom para LCP |
| `/imoveis` | 270 KB | OK |
| `/comprar/osasco/apartamento` | **959 KB** | **44 imóveis renderizados via SSR — pesado** |
| `/comprar/barueri/apartamento/jardim-julio` | 200 KB | OK |
| `/blog/...` | 126 KB | OK |
| `/sobre /contato /simulador` | ~85 KB cada | OK |

**Não foi possível obter dados de campo (CrUX/Lighthouse) — PageSpeed Insights não retornou via WebFetch nesta execução.**

**Recomendações:**
- **Listing de cidade:** paginar SSR a 12 itens + infinite scroll lazy. Reduz HTML inicial para ~250 KB e melhora LCP/TBT.
- Considerar `loading="lazy"` em todos os imóveis abaixo do fold (parece já estar — verificar se só os primeiros 6 estão `eager`).
- Rodar Lighthouse mobile manualmente em `/comprar/osasco/apartamento` para confirmar impacto.

---

## Images — 95/100

- Total verificado: 60+ imagens — **0 sem `alt`**
- 100% via `next/image` (otimização automática WebP/AVIF + responsive srcset)
- Hero da home com `fetchPriority=high` + preload + responsive `imageSrcSet` (640w → 3840w)
- Demais imagens com `loading="lazy"` (60/60)
- Cloudinary CDN com `f_auto,q_auto`-style transforms via Next.js loader
- `og:image` com `width`, `height`, `alt`

**Sem ações críticas.**

---

## AI Search Readiness (GEO/AEO) — 75/100

| Item | Status |
|---|---|
| FAQPage schema na home (perguntas com respostas longas) | OK |
| Article schema com author + datas em blog posts | OK |
| Brand mentions consistentes (Corretor Yuri, CRECI 235509) | OK |
| `sameAs` apontando para Instagram + WhatsApp | OK |
| Conteúdo passage-level citável (Q&A, listas, dados concretos) | OK |
| **`/llms.txt`** | **404 — ausente** |
| `/llms-full.txt` | 404 |
| Open Graph para previews em ChatGPT/Perplexity | Parcial (falta `og:type`) |

**Recomendações:**
- Criar `/llms.txt` na raiz seguindo o padrão llmstxt.org com:
  - Identidade: nome, CRECI, áreas atendidas
  - Páginas-chave (links): /imoveis, /simulador, /sobre, /contato, /blog, guias /ajuda
  - Resumo de cada página (1–2 linhas)
- Adicionar `og:type=website` na home e `og:type=article` em blog posts.

---

## Local SEO — Embutido em todas as categorias acima

**NAP (Name, Address, Phone) consistente:**
- Nome: Corretor Yuri Imóveis ✓
- Telefone: +55-11-97256-3420 (consistente em schema + WhatsApp link)
- Localidade: Osasco, SP, BR (com geo coordinates)

**Falta verificar fora do site (manual):**
- Google Business Profile: claim, completude, fotos, posts, reviews
- Citações em portais imobiliários locais (ZAP, VivaReal, OLX, QuintoAndar)
- Consistência NAP em diretórios (Apple Maps, Bing Places)

**Não é possível verificar via crawl** — recomendação: rodar `claude-seo:seo-maps` ou `claude-seo:seo-local` se DataForSEO MCP estiver instalado, ou auditar GBP manualmente.

---

## Crawl & Indexability

- robots.txt: `Allow: /` com `Disallow: /admin /api` — correto
- Sitemap: 522 URLs com `lastmod` recente (2026-05-07) e `priority` graduado
- Canonicals corretos em todas as páginas amostradas
- Sem `noindex` em páginas indexáveis
- Estrutura de URL limpa e semântica: `/comprar/{cidade}/{tipo}/{bairro}`, `/blog/{slug}`, `/ajuda/{slug}`

**Sem problemas detectados.**

---

## Scoring Detalhado

| Categoria | Peso | Score | Contribuição |
|---|---|---|---|
| Technical SEO | 22% | 95 | 20.9 |
| Content Quality (E-E-A-T) | 23% | 88 | 20.2 |
| On-Page SEO | 20% | 85 | 17.0 |
| Schema / Structured Data | 10% | 90 | 9.0 |
| Performance (CWV) | 10% | 70 | 7.0 |
| AI Search Readiness | 10% | 75 | 7.5 |
| Images | 5% | 95 | 4.8 |
| **Total** | **100%** | | **86.4** |

---

## Limitações deste audit

- **Crawl amostral**, não exaustivo: foram inspecionadas ~9 páginas representativas (home + 5 páginas estáticas + 1 blog post + 2 listings programáticas), não todas as 522.
- **Sem dados de campo CWV** (CrUX/PageSpeed Insights): scores de performance são inferidos a partir do tamanho do HTML e configuração de cache; rodar Lighthouse mobile direto para validar.
- **Sem dados de Search Console / GA4** — recomendação: integrar credenciais Google API e re-rodar com a sub-skill `seo-google` para dados de impressões, clicks, indexação real.
- **Sem dados de backlinks** — sub-skill `seo-backlinks` requer credenciais Moz/Bing Webmaster ou Common Crawl integration.

Para detalhes priorizados de ação, ver `ACTION-PLAN.md`.
