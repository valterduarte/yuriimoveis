# Action Plan — corretoryuri.com.br

**Health Score atual:** 86/100
**Score estimado pós-implementação:** 93/100

Ações ordenadas por impacto/esforço. Cada item indica arquivo provável, esforço e impacto.

---

## CRITICAL — fazer imediatamente

> Nenhum item crítico que bloqueie indexação ou cause penalidade.

---

## HIGH — fazer em até 1 semana

### H1. Reduzir HTML do listing de cidade (`/comprar/{cidade}/{tipo}`)
- **Problema:** `/comprar/osasco/apartamento` serve 959 KB de HTML (44 imóveis SSR).
- **Ação:** paginar SSR a 12 itens. Carregar restantes via client-side fetch ou rota incremental (`?page=2`).
- **Arquivo:** rota App Router em `nextjs/src/app/comprar/[cidade]/[tipo]/page.tsx` (verificar caminho real).
- **Impacto:** redução estimada de 70–75% no HTML inicial → LCP e TBT mobile melhoram. CWV pode subir o score Performance de 70 para 85+.
- **Esforço:** 1–2 h.

### H2. Criar `/llms.txt`
- **Problema:** AI crawlers (ChatGPT, Perplexity, AI Overviews) sem sinal direto.
- **Ação:** criar `nextjs/public/llms.txt` (ou rota `app/llms.txt/route.ts`) seguindo padrão llmstxt.org:
  ```
  # Corretor Yuri Imóveis
  > Corretor de imóveis em Osasco, Barueri e Carapicuíba — SP. CRECI-SP 235509.

  ## Páginas principais
  - [Imóveis disponíveis](https://corretoryuri.com.br/imoveis): catálogo completo
  - [Simulador](https://corretoryuri.com.br/simulador): financiamento Caixa SBPE e MCMV
  - [Sobre](https://corretoryuri.com.br/sobre): credenciais e experiência
  - [Contato](https://corretoryuri.com.br/contato): WhatsApp e telefone

  ## Guias
  - [Documentos para comprar](https://corretoryuri.com.br/ajuda/documentos-para-comprar-imovel)
  - [Custos em Osasco](https://corretoryuri.com.br/ajuda/custos-para-comprar-imovel-em-osasco)
  ...
  ```
- **Impacto:** AI Search Readiness 75 → 88.
- **Esforço:** 15 min.

### H3. Adicionar `og:type` na homepage
- **Problema:** apenas a home estava sem `<meta property="og:type">`. As demais páginas (sobre, blog, imoveis, listings) já emitem corretamente.
- **Ação:** adicionar `type: 'website'` ao `openGraph` em `nextjs/app/page.tsx`.
- **Esforço:** 5 min.

### ~~H4. Trim H1 do `/sobre`~~ — Falso positivo
- **Revisão:** o HTML servido é `Corretor Yuri<br/><span>Imóveis</span>`, mesmo padrão da home (que está correta). O "espaço duplo" foi artefato do regex de extração do audit, não bug real.

---

## MEDIUM — fazer em até 1 mês

### M1. Schema `Product` ou `RealEstateListing` por imóvel dentro do `CollectionPage`
- **Problema:** páginas de listing têm `CollectionPage` mas não declaram schema individual por imóvel. Perde rich results de produto/imóvel.
- **Ação:** adicionar `mainEntity` ou `itemListElement` no JSON-LD do listing com array de `Product` (com `name`, `image`, `offers.price`, `numberOfRooms`, `floorSize`).
- **Arquivo:** componente que gera o JSON-LD de listings (procurar em `nextjs/src/lib/schema/` ou similar).
- **Impacto:** Schema 90 → 96; rich results "Listings" no Google.
- **Esforço:** 2–4 h.

### M2. FAQPage schema nas páginas de bairro
- **Problema:** `/comprar/{cidade}/{tipo}/{bairro}` não têm FAQ — apenas a página de cidade tem.
- **Ação:** gerar FAQ por bairro com 3–5 perguntas (média de preço, transporte, escolas, ITBI, MCMV).
- **Impacto:** rich results em SERP + GEO/AEO + content depth.
- **Esforço:** 1 h.

### M3. Expandir descriptions das páginas de bairro
- **Problema:** description ~100 chars (ex: Jardim Julio) — abaixo do ideal 120–160.
- **Ação:** template para incluir diferencial: faixa de preço, ponto de transporte (CPTM/Metrô), referências (shopping, escolas), ITBI.
- **Exemplo:** `"Apartamentos à venda no Jardim Julio, Barueri SP, de R$ 280 mil a R$ 420 mil. Próximo ao Shopping Tamboré e CPTM. ITBI 2,4%. Atendimento Corretor Yuri (CRECI 235509)."`
- **Esforço:** 30 min (template + redeploy regenera todas).

### M4. Encurtar title da home para ≤60c
- **Atual:** `"Corretor Yuri — Imóveis em Osasco, Barueri e Carapicuíba"` (62c).
- **Sugestões:**
  - `"Corretor Yuri Imóveis — Osasco, Barueri e Carapicuíba"` (52c)
  - `"Imóveis em Osasco e Barueri | Corretor Yuri (CRECI 235509)"` (58c)
- **Esforço:** 2 min.

### M5. Article schema: trocar `author` para `Person` + adicionar `mainEntityOfPage`
- **Problema:** `author` está como `RealEstateAgent` (válido mas mais fraco para E-E-A-T); `mainEntityOfPage` ausente.
- **Ação:** estrutura recomendada:
  ```json
  "author": {
    "@type": "Person",
    "name": "Corretor Yuri",
    "url": "https://corretoryuri.com.br/sobre",
    "jobTitle": "Corretor de Imóveis",
    "hasCredential": "CRECI-SP 235509"
  },
  "publisher": { "@type": "RealEstateAgent", ... },
  "mainEntityOfPage": "https://corretoryuri.com.br/blog/{slug}"
  ```
- **Impacto:** sinal de E-E-A-T mais forte; +autoridade do autor para AI Overviews.
- **Esforço:** 30 min.

---

## LOW — backlog

### L1. Criar `/humans.txt` e `/.well-known/security.txt`
- **Esforço:** 10 min. Não impacta SEO ranking; profissionalismo.

### L2. Sitemap de imagens dedicado
- Útil se quiser ranquear forte em Google Imagens. O sitemap atual já usa namespace `image:` mas não vi `<image:image>` populado.
- **Esforço:** 1 h.

### L3. Verificar Google Business Profile
- Fora do site: claim, fotos, posts, reviews, categoria primária correta (Real Estate Agent).
- **Esforço:** 30 min (manual).

### L4. Audit de backlinks
- Rodar `claude-seo:seo-backlinks` com credenciais Moz/Bing Webmaster ou pelo menos Common Crawl.
- **Esforço:** depende de credenciais.

### L5. Configurar Google Search Console + GA4
- Permite rodar `claude-seo:seo-google` para dados reais de impressões, posições, indexação, CWV de campo.

---

## Roadmap sugerido

**Sprint 1 (esta semana):** H1, H2, H3 → score 86 → 91
**Sprint 2 (próximas 2 semanas):** M1, M2, M3 → score 91 → 95
**Sprint 3 (mês 1):** M4, M5, L1, L2 → score 95 → 96+

Re-rodar audit após Sprint 2 para validar ganhos de CWV e schema coverage.
