import { fetchPublishedBlogPosts } from '../../lib/blog'
import { AJUDA_ARTIGOS, fullH1, type ArticleBlock, type AjudaArtigo } from '../../data/ajudaArtigos'
import { GUIAS, type GuiaData } from '../../data/guias'
import { listEmpreendimentos, EMPREENDIMENTO_RESERVED_SLUGS, type EmpreendimentoSummary } from '../../lib/empreendimento'
import { BAIRROS } from '../../data/bairros'
import { formatPrice } from '../../lib/formatters'
import { SITE_URL, PHONE_DISPLAY, CRECI } from '../../lib/config'
import type { BairroData } from '../../types'

const EMPREENDIMENTO_STATUS_PHRASE: Record<string, string> = {
  pronto: 'pronto para morar',
  construcao: 'em construção',
  planta: 'na planta',
}

export const revalidate = 3600

const HEADER = `# Corretor Yuri Imóveis — Corpus completo para crawlers de IA

> Versão expandida do llms.txt. Reúne o texto integral dos posts do blog, dos guias práticos e dos guias longos do site em um único documento markdown, permitindo que assistentes de IA (Perplexity, Claude Search, Google AI Overviews, ChatGPT) respondam perguntas sem precisar fetch página a página.

Corretor: Yuri Duarte (CRECI-SP ${CRECI}). Atendimento em Osasco, Barueri e Carapicuíba (Grande São Paulo). Contato: WhatsApp ${PHONE_DISPLAY}.

Site canônico: ${SITE_URL}. Sitemap: ${SITE_URL}/sitemap.xml. Resumo curto: ${SITE_URL}/llms.txt.

Licença: conteúdo sob RSL 1.0 (https://rslstandard.org/v1.0). Citações pedem atribuição "Corretor Yuri Imóveis (corretoryuri.com.br, CRECI-SP ${CRECI})".

`

function htmlToMarkdown(html: string): string {
  return html
    .replace(/<h2[^>]*>/gi, '\n\n## ')
    .replace(/<\/h2>/gi, '\n\n')
    .replace(/<h3[^>]*>/gi, '\n\n### ')
    .replace(/<\/h3>/gi, '\n\n')
    .replace(/<h4[^>]*>/gi, '\n\n#### ')
    .replace(/<\/h4>/gi, '\n\n')
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    .replace(/<a[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    .replace(/<li[^>]*>/gi, '\n- ')
    .replace(/<\/li>/gi, '')
    .replace(/<\/?(ul|ol|p|div|section|article)[^>]*>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function renderBlock(block: ArticleBlock): string {
  switch (block.type) {
    case 'h2':         return `\n\n## ${block.text}\n`
    case 'h3':         return `\n\n### ${block.text}\n`
    case 'p':          return `\n${block.text}\n`
    case 'ul':         return `\n${block.items.map(i => `- ${i}`).join('\n')}\n`
    case 'ol':         return `\n${block.items.map((i, n) => `${n + 1}. ${i}`).join('\n')}\n`
    case 'callout':    return block.link
      ? `\n> ${block.text} [${block.link.label}](${SITE_URL}${block.link.href})\n`
      : `\n> ${block.text}\n`
    case 'disclaimer': return `\n_${block.text}_\n`
    case 'calculator': return '' // interactive widget — no prose for the text corpus
  }
}

function renderAjudaArtigo(artigo: AjudaArtigo): string {
  const heading = `# ${fullH1(artigo)}\n\nFonte: ${SITE_URL}/ajuda/${artigo.slug} · Atualizado em ${artigo.atualizadoEm}\n\n${artigo.resumo}\n`
  const body = artigo.blocks.map(renderBlock).join('')
  const cartorios = artigo.cartorios?.length
    ? `\n\n## Cartórios listados\n${artigo.cartorios.map(c => `- **${c.nome}** (${c.tipo}) — ${c.endereco}, ${c.cidade}/${c.uf} · ${c.telefone}`).join('\n')}\n`
    : ''
  const faq = artigo.faq?.length
    ? `\n\n## Perguntas frequentes\n${artigo.faq.map(q => `**${q.pergunta}**\n\n${q.resposta}\n`).join('\n')}\n`
    : ''
  return heading + body + cartorios + faq
}

function renderGuia(guia: GuiaData): string {
  const heading = `# ${guia.titulo}\n\nFonte: ${SITE_URL}/guia/${guia.slug} · Publicado em ${guia.publishedAt} · Atualizado em ${guia.updatedAt}\n\n${guia.intro}\n`
  const sections = guia.sections
    .map(s => {
      const links = s.links?.length
        ? `\n\nLinks relacionados: ${s.links.map(l => `[${l.label}](${SITE_URL}${l.href})`).join(' · ')}`
        : ''
      return `\n## ${s.heading}\n\n${s.paragraphs.join('\n\n')}${links}`
    })
    .join('\n')
  const faqs = guia.faqs.length
    ? `\n\n## Perguntas frequentes\n${guia.faqs.map(f => `**${f.question}**\n\n${f.answer}\n`).join('\n')}`
    : ''
  return heading + sections + faqs
}

function renderEmpreendimento(e: EmpreendimentoSummary): string {
  const status = EMPREENDIMENTO_STATUS_PHRASE[e.status] ?? 'disponível'
  const preco = e.precoMin === e.precoMax
    ? `a partir de ${formatPrice(e.precoMin, 'venda')}`
    : `de ${formatPrice(e.precoMin, 'venda')} a ${formatPrice(e.precoMax, 'venda')}`
  const area = e.areaMin === e.areaMax
    ? `${e.areaMin} m²`
    : `${e.areaMin} a ${e.areaMax} m²`
  return [
    `## ${e.nome}`,
    ``,
    `Fonte: ${SITE_URL}/empreendimentos/${e.slug}`,
    ``,
    `- Status: ${status}`,
    `- Localização: ${e.endereco}, ${e.bairro}, ${e.cidade} (SP)`,
    `- Plantas: ${e.totalUnidades} (${area})`,
    `- Valores: ${preco}`,
    ``,
  ].join('\n')
}

function renderBairro(b: BairroData): string {
  const c = b.conteudo
  return [
    `## ${b.nome}, ${b.cidade}`,
    ``,
    `Fonte: ${SITE_URL}/bairros/${b.slug}`,
    ``,
    c.sobre,
    ``,
    `**Infraestrutura:** ${c.infraestrutura}`,
    ``,
    `**Transporte e acesso:** ${c.transporte}`,
    ``,
    `**Por que morar:** ${c.porqueMorar}`,
    ``,
  ].join('\n')
}

export async function GET(): Promise<Response> {
  const posts = await fetchPublishedBlogPosts()
  const empreendimentos = (await listEmpreendimentos()).filter(e => !EMPREENDIMENTO_RESERVED_SLUGS.has(e.slug))

  const blogSection = posts.length
    ? `# Blog — posts completos\n\n${posts
        .map(p => {
          const intro = p.resumo ? `${p.resumo}\n\n` : ''
          return `## ${p.titulo}\n\nFonte: ${SITE_URL}/blog/${p.slug} · Publicado em ${p.created_at} · Atualizado em ${p.updated_at}\n\n${intro}${htmlToMarkdown(p.conteudo)}\n`
        })
        .join('\n---\n\n')}\n`
    : ''

  const ajudaSection = AJUDA_ARTIGOS.length
    ? `# Guias práticos (/ajuda) — texto completo\n\n${AJUDA_ARTIGOS.map(renderAjudaArtigo).join('\n---\n\n')}\n`
    : ''

  const guiaSection = Object.keys(GUIAS).length
    ? `# Guias longos (/guia) — texto completo\n\n${Object.values(GUIAS).map(renderGuia).join('\n---\n\n')}\n`
    : ''

  const empreendimentosSection = empreendimentos.length
    ? `# Empreendimentos e lançamentos — dados estruturados\n\nLista dos empreendimentos com unidades disponíveis pelo Corretor Yuri, com bairro, status, plantas e faixa de preço.\n\n${empreendimentos.map(renderEmpreendimento).join('\n')}\n`
    : ''

  const bairrosSection = Object.keys(BAIRROS).length
    ? `# Guias de bairro — texto completo\n\n${Object.values(BAIRROS).map(renderBairro).join('\n---\n\n')}\n`
    : ''

  const body = [HEADER, blogSection, ajudaSection, guiaSection, empreendimentosSection, bairrosSection]
    .filter(Boolean)
    .join('\n---\n\n')

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'Vercel-CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
