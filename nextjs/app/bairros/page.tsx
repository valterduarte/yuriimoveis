import Link from 'next/link'
import { FiMapPin, FiArrowRight, FiTrendingUp } from 'react-icons/fi'
import { BAIRROS } from '../../data/bairros'
import { fetchNavigationMatrix } from '../../lib/api'
import { bairroSlugToDbName, bairroDbNameToSlug, cidadeNameToSlug, buildHierarchicalUrl, inferCidadeFromBairro } from '../../lib/navigation'
import { SITE_URL } from '../../lib/config'
import { buildBreadcrumb, buildCollectionPage, buildFaqPageSchema } from '../../lib/jsonLd'
import { buildPageMetadata } from '../../lib/seo'
import type { BairroData } from '../../types'

export const revalidate = 300

const PAGE_TITLE = 'Melhores Bairros de Osasco, Barueri e Carapicuíba 2026 — Guia Completo'
const PAGE_DESCRIPTION =
  'Os melhores bairros de Osasco, Barueri e Carapicuíba em 2026: compare preços por m², transporte, infraestrutura, escolas e imóveis disponíveis. Guias completos para morar ou investir na Grande SP Oeste.'

export const metadata = buildPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  url: `${SITE_URL}/bairros`,
})

const CITY_PROFILES = [
  {
    cidade: 'Osasco',
    tagline: 'Maior oferta, melhor acesso à capital',
    preco2q: 'R$ 220 mil a R$ 380 mil',
    precoAluguel: 'R$ 1.500 a R$ 2.800/mês',
    acesso: 'CPTM Linha 8, Castello Branco, Marginal Pinheiros',
    perfil: 'Melhor custo-benefício para quem trabalha em SP. Maior variedade de imóveis e bairros, de kitnets acessíveis no Centro a edifícios de médio-alto padrão no Presidente Altino.',
  },
  {
    cidade: 'Barueri',
    tagline: 'Polo corporativo com opções para todos os padrões',
    preco2q: 'R$ 250 mil a R$ 900 mil+',
    precoAluguel: 'R$ 1.700 a R$ 4.000/mês',
    acesso: 'CPTM Linha 8, Anhanguera, Castello Branco',
    perfil: 'Mercado segmentado: fora de Alphaville os preços competem com Osasco; dentro de Alphaville, o metro quadrado é o mais caro da região. Ideal para quem trabalha no polo corporativo.',
  },
  {
    cidade: 'Carapicuíba',
    tagline: 'Casas maiores pelo menor preço da região',
    preco2q: 'R$ 150 mil a R$ 280 mil',
    precoAluguel: 'R$ 900 a R$ 1.800/mês',
    acesso: 'CPTM Linha 8, Rodovia Castello Branco',
    perfil: 'A opção mais acessível das três. Casas com quintal custam menos do que apartamentos em Osasco. Infraestrutura de comércio e serviços em expansão, especialmente nos bairros próximos à CPTM.',
  },
]

const FAQS = [
  {
    question: 'Qual cidade tem o imóvel mais barato entre Osasco, Barueri e Carapicuíba?',
    answer: 'Carapicuíba tem os preços mais acessíveis das três: apartamentos de 2 quartos partem de R$ 150.000 e casas com quintal chegam a R$ 230.000. Osasco fica no meio-termo, com ampla oferta entre R$ 220.000 e R$ 380.000. Barueri tem o maior espectro de preços — fora de Alphaville os valores são próximos a Osasco, mas dentro de Alphaville o metro quadrado pode ser três vezes maior.',
  },
  {
    question: 'Vale mais a pena morar em Osasco ou Barueri?',
    answer: 'Depende da prioridade. Se o critério for custo-benefício geral, Osasco tem maior oferta de imóveis em bairros bem servidos de transporte público e comércio. Se o critério for padrão de acabamento, segurança e infraestrutura de lazer, Alphaville (Barueri) não tem equivalente na região. Para quem trabalha no polo corporativo de Barueri, morar na própria cidade elimina horas no trânsito.',
  },
  {
    question: 'Quais bairros de Osasco ficam perto da CPTM Linha 8?',
    answer: 'A Linha 8-Diamante atravessa Osasco com estações no Centro (Estação Osasco), Presidente Altino, Jaguaribe e, na divisa com Carapicuíba, a Estação Antônio João. Os bairros com melhor acesso a pé das estações são: Centro, Presidente Altino e Jaguaribe. Bela Vista e Quitaúna ficam a menos de 15 minutos de ônibus da Estação Osasco.',
  },
  {
    question: 'Quais bairros de Carapicuíba têm mais imóveis disponíveis?',
    answer: 'O Centro de Carapicuíba concentra a maior oferta de apartamentos na cidade, com acesso direto à CPTM pela Estação Carapicuíba. O Jardim Planalto e a Vila Dirce têm boa oferta de casas. A Chácara Santa Lúcia e o Jardim das Belezas são opções mais tranquilas para famílias.',
  },
  {
    question: 'Qual o bairro com melhor custo-benefício em Osasco?',
    answer: 'Para quem prioriza acesso à CPTM e preço acessível, o Centro de Osasco oferece a maior oferta de kitnets e apartamentos de 1 quarto. Para famílias que buscam apartamentos de 2 ou 3 quartos com bom nível de serviços, Quitaúna e Jaguaribe oferecem o melhor equilíbrio entre preço, infraestrutura e qualidade de vida.',
  },
  {
    question: 'Comprar ou alugar em Osasco vale mais a pena em 2026?',
    answer: 'Com as taxas de juros atuais, a parcela de um apartamento de 2 quartos financiado em Osasco fica entre R$ 1.400 e R$ 2.200/mês — próxima ao aluguel equivalente (R$ 1.500 a R$ 2.800). Quem se enquadra no Minha Casa Minha Vida tem parcelas menores com juros subsidiados, o que tende a tornar a compra mais vantajosa. Use o simulador para comparar os dois cenários com seu orçamento.',
  },
]

export default async function BairrosIndexPage() {
  const matrix = await fetchNavigationMatrix()
  const countsByBairro = new Map<string, number>()
  // Quantos apartamentos à venda existem por bairro e por cidade, para só linkar
  // para a página transacional /comprar/[cidade]/apartamento/[bairro] quando ela tiver imóveis.
  const aptoVendaByBairroSlug = new Map<string, number>()
  const aptoVendaByCidadeSlug = new Map<string, number>()
  for (const row of matrix) {
    countsByBairro.set(row.bairro, (countsByBairro.get(row.bairro) ?? 0) + row.count)
    if (row.tipo === 'venda' && row.categoria === 'apartamento') {
      const bairroSlug = bairroDbNameToSlug(row.bairro)
      const cidadeSlug = cidadeNameToSlug(row.cidade)
      aptoVendaByBairroSlug.set(bairroSlug, (aptoVendaByBairroSlug.get(bairroSlug) ?? 0) + row.count)
      aptoVendaByCidadeSlug.set(cidadeSlug, (aptoVendaByCidadeSlug.get(cidadeSlug) ?? 0) + row.count)
    }
  }

  const guidesByCidade = new Map<string, Array<{ bairro: BairroData; count: number }>>()
  for (const bairro of Object.values(BAIRROS)) {
    const dbName = bairroSlugToDbName(bairro.slug) ?? bairro.nome
    const count = countsByBairro.get(dbName) ?? 0
    if (count === 0) continue
    const cidade = inferCidadeFromBairro(bairro)
    const list = guidesByCidade.get(cidade) ?? []
    list.push({ bairro, count })
    guidesByCidade.set(cidade, list)
  }
  for (const list of guidesByCidade.values()) {
    list.sort((a, b) => b.count - a.count)
  }

  const totalGuides = Array.from(guidesByCidade.values()).reduce((acc, l) => acc + l.length, 0)
  const canonicalUrl = `${SITE_URL}/bairros`

  const jsonLd = [
    buildBreadcrumb([
      { name: 'Início',          path: '/' },
      { name: 'Guias de bairro', path: '/bairros' },
    ]),
    buildCollectionPage({
      name: PAGE_TITLE,
      url: canonicalUrl,
      description: PAGE_DESCRIPTION,
      numberOfItems: totalGuides,
    }),
    buildFaqPageSchema(FAQS),
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <div className="bg-dark text-white py-12">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Início</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">Guias de bairro</span>
          </nav>
          <span className="section-label">Conheça a região</span>
          <h1 className="text-3xl md:text-4xl font-black uppercase text-white leading-tight">
            Melhores Bairros de Osasco, Barueri e Carapicuíba
          </h1>
          <p className="text-gray-400 text-sm mt-3 max-w-3xl leading-relaxed">
            {totalGuides} guias comparativos com preços por m², transporte, infraestrutura, escolas e imóveis disponíveis em cada bairro da Grande SP Oeste.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-5xl">

        <section className="bg-white border border-gray-200 p-6 md:p-10 mb-12">
          <h2 className="text-xl font-bold text-dark mb-3 uppercase tracking-wide flex items-center gap-2">
            <FiTrendingUp size={16} className="text-primary" /> Como escolher entre Osasco, Barueri e Carapicuíba
          </h2>
          <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-4">
            As três cidades formam o eixo oeste da Grande São Paulo e compartilham o mesmo eixo de transporte — a CPTM Linha 8-Diamante e as rodovias Castello Branco e Anhanguera. Mas cada uma tem um perfil de mercado distinto que atende prioridades diferentes.
          </p>
          <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-6">
            <strong>Osasco</strong> tem a maior oferta de imóveis e o melhor equilíbrio entre custo, infraestrutura e acesso à capital. É a escolha mais frequente de quem trabalha em São Paulo e quer reduzir o custo do imóvel sem abrir mão de transporte público de qualidade. Os bairros variam do Centro acessível — com kitnets e 1 quarto próximos à estação — ao Presidente Altino, onde edifícios mais recentes atendem famílias de médio-alto padrão.
          </p>
          <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-6">
            <strong>Barueri</strong> é um mercado segmentado. Fora de Alphaville, os preços são próximos a Osasco e os bairros têm boa infraestrutura de serviços e comércio. Dentro de Alphaville, o metro quadrado é o mais alto da região — mas o padrão de segurança, lazer e acabamento dos condomínios justifica o preço para um perfil específico de comprador. Para quem trabalha nas sedes corporativas de Barueri (Alphaville e Tamboré concentram empresas multinacionais), morar na própria cidade pode eliminar horas diárias de deslocamento.
          </p>
          <p className="text-gray-700 text-sm md:text-base leading-relaxed">
            <strong>Carapicuíba</strong> é a opção mais acessível das três. Casas com quintal custam menos do que apartamentos equivalentes em Osasco, e o Centro tem boa conexão com a CPTM. A infraestrutura de saúde e educação é mais limitada do que nas outras cidades, mas está em expansão. É a melhor escolha para famílias que precisam de mais área por menos dinheiro e aceitam depender do carro ou do trem para acessar serviços mais completos.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-lg font-bold text-dark mb-5 uppercase tracking-wide">Comparativo rápido das três cidades</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CITY_PROFILES.map(city => {
              const cidadeSlug = cidadeNameToSlug(city.cidade)
              const aptoCount = aptoVendaByCidadeSlug.get(cidadeSlug) ?? 0
              return (
              <div key={city.cidade} className="bg-white border border-gray-200 p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1">{city.tagline}</p>
                <h3 className="text-base font-bold text-dark mb-3">{city.cidade}</h3>
                <dl className="space-y-2 text-xs text-gray-700 mb-4">
                  <div>
                    <dt className="uppercase tracking-wider text-gray-500 text-[10px] mb-0.5">Apto 2 quartos</dt>
                    <dd className="font-semibold">{city.preco2q}</dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-wider text-gray-500 text-[10px] mb-0.5">Aluguel 2 quartos</dt>
                    <dd className="font-semibold">{city.precoAluguel}</dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-wider text-gray-500 text-[10px] mb-0.5">Acesso SP</dt>
                    <dd>{city.acesso}</dd>
                  </div>
                </dl>
                <p className="text-xs text-gray-600 leading-relaxed">{city.perfil}</p>
                {aptoCount > 0 && (
                  <Link
                    href={buildHierarchicalUrl({ acao: 'comprar', cidade: cidadeSlug, categoria: 'apartamento' })}
                    className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary hover:underline"
                  >
                    Ver apartamentos à venda em {city.cidade}
                    <FiArrowRight size={13} />
                  </Link>
                )}
              </div>
              )
            })}
          </div>
          <p className="text-[11px] text-gray-500 mt-3">Faixas de referência para imóveis usados e novos em 2026. Variação de ±15% conforme andar, conservação e localização dentro do bairro.</p>
        </section>

        {Array.from(guidesByCidade.entries()).map(([cidade, guides]) => (
          <section key={cidade} className="mb-12">
            <h2 className="text-lg font-bold text-dark mb-4 uppercase tracking-wide flex items-center gap-2">
              <FiMapPin size={16} className="text-primary" /> {cidade}, SP
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {guides.map(({ bairro, count }) => {
                const aptoVenda = aptoVendaByBairroSlug.get(bairro.slug) ?? 0
                const cidadeSlug = cidadeNameToSlug(cidade)
                return (
                <li key={bairro.slug} className="bg-white border border-gray-200 hover:border-primary transition-colors">
                  <Link
                    href={`/bairros/${bairro.slug}`}
                    className="block hover:bg-primary/5 transition-colors p-5 group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-bold text-dark group-hover:text-primary">Morar no {bairro.nome}</h3>
                      <FiArrowRight size={16} className="text-gray-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{count} imóve{count !== 1 ? 'is' : 'l'} disponíve{count !== 1 ? 'is' : 'l'}</p>
                    <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{bairro.conteudo.sobre}</p>
                  </Link>
                  {aptoVenda > 0 && (
                    <Link
                      href={buildHierarchicalUrl({ acao: 'comprar', cidade: cidadeSlug, categoria: 'apartamento', bairro: bairro.slug })}
                      className="flex items-center justify-between gap-2 border-t border-gray-100 px-5 py-3 text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary/5 transition-colors"
                    >
                      Ver apartamentos à venda no {bairro.nome}
                      <FiArrowRight size={13} />
                    </Link>
                  )}
                </li>
                )
              })}
            </ul>
          </section>
        ))}

        <section className="mb-12 bg-white border border-gray-200 p-6 md:p-8">
          <h2 className="text-lg font-bold text-dark mb-5 uppercase tracking-wide">Recursos relacionados</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { href: '/guia/comprar-imovel-osasco',          label: 'Guia: como comprar imóvel em Osasco',                desc: 'Passo a passo da compra, bairros, financiamento e custos' },
              { href: '/guia/alugar-imovel-osasco-barueri',   label: 'Guia: como alugar em Osasco e Barueri',              desc: 'Preços por bairro, garantias e direitos do inquilino' },
              { href: '/blog/alphaville-ou-barueri-qual-vale-mais-a-pena-2026', label: 'Alphaville ou Barueri? Comparativo 2026', desc: 'Análise detalhada de custo-benefício entre as duas áreas' },
              { href: '/blog/morar-em-carapicuiba-bairros-precos-2026', label: 'Morar em Carapicuíba: bairros e preços',    desc: 'Análise do mercado de Carapicuíba para compra e locação' },
              { href: '/simulador',                           label: 'Simular financiamento imobiliário',                   desc: 'Calcule parcelas, ITBI e custos de cartório para qualquer imóvel' },
              { href: '/ajuda/custos-para-comprar-imovel-em-osasco', label: 'Custos de compra na Grande SP Oeste',         desc: 'ITBI, escritura, registro e comissão do corretor' },
            ].map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-start gap-3 p-3.5 border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors group"
                >
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold text-dark group-hover:text-primary leading-snug">{link.label}</span>
                    <span className="block text-xs text-gray-500 mt-0.5">{link.desc}</span>
                  </span>
                  <FiArrowRight size={14} className="shrink-0 mt-1 text-gray-400 group-hover:text-primary transition-colors" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-dark mb-4 uppercase tracking-wide">Perguntas frequentes sobre bairros na Grande SP Oeste</h2>
          <div className="space-y-3">
            {FAQS.map(faq => (
              <details key={faq.question} className="group bg-white border border-gray-200 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-dark list-none flex items-center justify-between">
                  {faq.question}
                  <span className="text-primary text-xs group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-gray-700 text-sm leading-relaxed mt-3">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
