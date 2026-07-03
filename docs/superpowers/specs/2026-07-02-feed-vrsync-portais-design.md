# Feed VRSync — Sindicação de imóveis nos portais (ZAP / Viva Real / OLX)

**Data:** 2026-07-02
**Branch:** `feature/portal-feed-vrsync`
**Status:** aprovado para implementação

## Objetivo

Quando o corretor cadastra um imóvel no site, ele deve aparecer automaticamente
nos portais imobiliários (OLX, ZAP, Viva Real) sem trabalho manual de recadastro.

## Contexto e restrição do modelo

Os portais brasileiros **não** expõem uma API que cria um anúncio por vez. O padrão
do mercado é **feed XML**: o site publica um XML com todos os imóveis numa URL
pública, o corretor registra essa URL no painel do portal, e o portal **varre
(crawl) a URL periodicamente** criando/atualizando/removendo anúncios conforme o
feed. A sincronização tem lag (não é instantânea).

ZAP + Viva Real + OLX pertencem ao **mesmo grupo** (Grupo OLX / Canal Pro) e
compartilham o padrão **VRSync**. Por isso **um único XML VRSync cobre os três
portais**. Não existe "uma API para todos", mas existe esse formato dominante.

**Pré-requisito não-técnico (responsabilidade do usuário):** ter conta/contrato
ativo nos portais (a maioria é paga para profissionais) e colar a URL do feed no
Canal Pro. Sem conta não é possível testar a importação real — mas o feed pode
ficar 100% pronto e validado contra o schema.

## Decisões de escopo

- **Formato:** apenas VRSync (Grupo OLX). Fora de escopo: OLX autoupload separado
  e outros formatos.
- **Quais imóveis:** todos os ativos por padrão, com capacidade de excluir
  individualmente (o usuário quer "tirar algum depois").
- **E-mail do anunciante:** `valter.rduarte@gmail.com` (constante em config,
  trocável em um lugar). Canal principal continua o WhatsApp.
- **Fora de escopo:** abrir contas nos portais; qualquer integração além do feed.

## Abordagem escolhida

**Rota XML sob demanda (Route Handler do Next.js).** Os portais varrem uma URL,
então uma rota que gera o XML na hora é o encaixe natural. Alternativas
descartadas: (B) gerar arquivo estático por cron — mais peças móveis e staleness;
(C) integrador pago tipo Jetimob — custo e redundante com site próprio.

## Arquitetura

### 1. Endpoint e entrega
- Rota nova: `GET /api/feed/imoveis.xml` (retorna `Content-Type: application/xml`).
- Cacheada na CDN da Vercel e **invalidada automaticamente** quando um imóvel é
  criado/editado/excluído, reaproveitando o mecanismo de `lib/cacheTags.ts` já
  existente. Evita gerar XML a cada request e mantém o feed fresco.

### 2. Seleção de dados
- Query: `ativo = true AND sindicar_portais = true`.
- Campos sensíveis (`torre`, `numero_apartamento`, `observacoes`) **nunca** entram
  no feed — mesma política que o site público já aplica via `parseImovel`.
- Endereço no feed: rua + bairro + cidade (já público no site). Número de
  unidade/torre fica de fora.

### 3. Controle por imóvel
- Migração nova: `ALTER TABLE imoveis ADD COLUMN sindicar_portais BOOLEAN NOT NULL
  DEFAULT true`. Todos os imóveis ativos atuais passam a entrar automaticamente.
- Checkbox **"Publicar nos portais"** no formulário do admin para desmarcar
  qualquer imóvel individualmente.

### 4. Mapeamento VRSync (imóvel → XML)
Função pura que traduz cada `Imovel` para o nó de listing do VRSync:
- `tipo` (venda/aluguel) → tipo de transação/negócio do portal.
- `categoria` (casa/apartamento/terreno/chale/comercial/chacara) → tipo de imóvel
  e uso (residencial/comercial) do portal.
- Numéricos diretos: `preco`, `area`, `quartos`, `banheiros`, `vagas`.
- Localização: `endereco`, `bairro`, `cidade`, `cep`, `lat`, `lng`.
- `imagens[]` → mídia do listing; `diferenciais[]` → features.
- Contato: nome do corretor, telefone, CRECI-SP, e-mail (de `lib/config.ts`).

> **Nota de implementação:** a spec oficial atual do VRSync/Canal Pro será buscada
> e o XML validado contra ela antes de finalizar — nomes de tag e enums não serão
> chutados de memória.

### 5. Configuração
- Adicionar `BROKER_EMAIL = 'valter.rduarte@gmail.com'` em `lib/config.ts`,
  reutilizando `PHONE_STRUCTURED`, `CRECI`, `BROKER_NAME`, `SITE_URL` já presentes.

## Testes

- O gerador de XML é uma função pura, testável isoladamente (padrão do `lib/`).
- Testes unitários cobrindo: mapeamento de cada enum de `categoria`/`tipo`;
  exclusão garantida dos campos sensíveis; um imóvel completo produzindo XML válido.
- Validar o XML final contra a spec VRSync antes de declarar pronto.

## Critérios de sucesso

1. `GET /api/feed/imoveis.xml` retorna XML VRSync válido com os imóveis ativos e
   sindicáveis.
2. Desmarcar "Publicar nos portais" no admin remove o imóvel do feed.
3. Campos sensíveis nunca aparecem no XML.
4. Editar/criar imóvel reflete no feed sem intervenção manual (cache invalidado).
5. Testes unitários do mapeamento passando; typecheck e build limpos.
