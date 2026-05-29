import Link from 'next/link'
import { FaWhatsapp } from 'react-icons/fa'
import { FiCheckCircle, FiHome, FiDollarSign, FiMapPin, FiPercent } from 'react-icons/fi'
import { SITE_URL, PHONE_WA_BASE, PHONE_DISPLAY } from '../../lib/config'
import { buildArticleSchema, buildBreadcrumb, buildFaqPageSchema } from '../../lib/jsonLd'
import { MCMV_FAIXAS } from '../../data/financiamento'
import { buildPageMetadata } from '../../lib/seo'
import WhatsAppLink from '../../components/WhatsAppLink'

const PAGE_URL = `${SITE_URL}/mcmv-osasco`
const PUBLISHED_AT = '2026-05-19'
const MODIFIED_AT = '2026-05-19'

const TITLE = 'Minha Casa Minha Vida em Osasco 2026 — Imóveis até R$ 400 mil'
const DESCRIPTION =
  'Comprar pelo MCMV em Osasco, Barueri e Carapicuíba em 2026: faixas atualizadas (renda até R$ 13 mil), tetos até R$ 600 mil na Faixa 4, juros de 4% a 9,9% a.a. e bairros recomendados pelo Corretor Yuri (CRECI-SP 235509).'
const WA_TEXT = encodeURIComponent('Olá! Quero comprar imóvel pelo Minha Casa Minha Vida em Osasco. Pode me ajudar?')
const WA_HREF = `${PHONE_WA_BASE}?text=${WA_TEXT}`

export const metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: PAGE_URL,
  type: 'article',
  publishedTime: PUBLISHED_AT,
  modifiedTime: MODIFIED_AT,
  ogImageAlt: 'Minha Casa Minha Vida em Osasco',
})

const FAIXAS = MCMV_FAIXAS

const BAIRROS_MCMV = [
  { nome: 'Vila Sul Americana', cidade: 'Carapicuíba', slug: 'vila-sul-americana', destaque: 'Acesso à CPTM, preço médio R$ 4,2 mil/m²' },
  { nome: 'Cidade de Deus', cidade: 'Osasco', slug: 'cidade-de-deus', destaque: 'Perto do centro de Osasco, infraestrutura completa' },
  { nome: 'Cipava', cidade: 'Osasco', slug: 'cipava', destaque: 'Bairro residencial com lançamentos MCMV' },
  { nome: 'Padroeira', cidade: 'Osasco', slug: 'padroeira', destaque: 'Imóveis novos na faixa de R$ 250 a 350 mil' },
  { nome: 'Jardim Roberto', cidade: 'Osasco', slug: 'jardim-roberto', destaque: 'Comunidade consolidada com escolas e comércio' },
  { nome: 'Metalúrgicos', cidade: 'Osasco', slug: 'metalurgicos', destaque: 'Próximo ao polo industrial e à Estação Quitaúna' },
]

const FAQS = [
  {
    question: 'Quem se enquadra no Minha Casa Minha Vida em 2026?',
    answer:
      'Famílias com renda bruta mensal de até R$ 13.000 podem se enquadrar nas faixas atualizadas em 2026. As Faixas 1, 2 e 3 cobrem imóveis de até R$ 400 mil; a nova Faixa 4 permite imóveis de até R$ 600 mil para renda entre R$ 9.600 e R$ 13.000. É preciso não ter outro imóvel residencial e não ter financiamento ativo do SFH em outro estado.',
  },
  {
    question: 'Qual a taxa de juros do MCMV em Osasco?',
    answer:
      'As taxas vão de 4% a.a. na Faixa 1 (renda até R$ 3.200) até 7,66% a.a. na Faixa 3 (renda até R$ 9.600). A Faixa 4 usa taxa próxima de 9,9% a.a., ainda abaixo dos 11,49% do SBPE de mercado livre.',
  },
  {
    question: 'Quais bairros de Osasco têm mais imóveis MCMV?',
    answer:
      'Os bairros com maior oferta de imóveis dentro do teto MCMV em Osasco são Cidade de Deus, Cipava, Padroeira, Jardim Roberto e Metalúrgicos. Em Carapicuíba, Vila Sul Americana concentra lançamentos MCMV com acesso à CPTM. Em Barueri há imóveis MCMV em Jardim Audir e Vila Sul Americana.',
  },
  {
    question: 'Posso usar FGTS na entrada do MCMV?',
    answer:
      'Sim. O saldo do FGTS pode compor a entrada do MCMV nas mesmas regras do SFH: o imóvel precisa ser residencial, urbano, dentro do teto do programa e o trabalhador precisa ter no mínimo 3 anos de contribuição ao fundo (não necessariamente consecutivos).',
  },
  {
    question: 'Quanto preciso de entrada para o MCMV em Osasco?',
    answer:
      'A entrada mínima é 20% do valor do imóvel, podendo ser composta com FGTS. Para um imóvel de R$ 300.000 isso significa cerca de R$ 60.000. Além da entrada, reserve aproximadamente 4,5% para ITBI e cartório: o ITBI de Osasco subiu para 3% pela LC 227/2026.',
  },
  {
    question: 'Quanto tempo leva para aprovar um financiamento MCMV?',
    answer:
      'O prazo médio na Caixa Econômica é de 30 a 60 dias entre análise de crédito, avaliação do imóvel e assinatura do contrato. Levar a documentação completa na primeira visita reduz esse prazo. Veja o checklist completo em /blog/documentos-para-financiar-imovel-2026.',
  },
  {
    question: 'Posso comprar imóvel usado pelo MCMV em Osasco?',
    answer:
      'Sim. O MCMV financia imóveis novos e usados dentro do teto do programa. O imóvel precisa estar regularizado (matrícula atualizada, sem ônus), passar pela avaliação bancária e respeitar o teto da faixa correspondente.',
  },
]

const breadcrumbJsonLd = buildBreadcrumb([
  { name: 'Início',          path: '/' },
  { name: 'MCMV em Osasco',  path: '/mcmv-osasco' },
])

const articleJsonLd = buildArticleSchema({
  headline: TITLE,
  description: DESCRIPTION,
  url: PAGE_URL,
  datePublished: PUBLISHED_AT,
  dateModified: MODIFIED_AT,
})

const faqJsonLd = buildFaqPageSchema(FAQS)

export default function McmvOsascoPage() {
  return (
    <div className="min-h-screen pb-16 md:pb-0 bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section className="bg-dark text-white py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Início</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">MCMV em Osasco</span>
          </nav>
          <span className="uppercase tracking-widest text-xs font-bold text-primary mb-3 block">Programa habitacional 2026</span>
          <h1 className="text-4xl md:text-5xl font-black uppercase leading-tight mb-4">
            Minha Casa Minha Vida<br />em Osasco
          </h1>
          <p className="text-white/80 max-w-2xl text-base leading-relaxed mb-8">
            Comprar pelo MCMV em Osasco, Barueri e Carapicuíba com as regras atualizadas em 2026: faixas de renda
            até R$ 13.000/mês, juros a partir de 4% a.a. e tetos de até R$ 600 mil na nova Faixa 4. Atendimento
            com o Corretor Yuri Duarte (CRECI-SP 235509).
          </p>
          <div className="flex flex-wrap gap-3">
            <WhatsAppLink
              href={WA_HREF}
              source="mcmv-osasco-hero"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 font-bold uppercase tracking-wider text-sm hover:bg-primary/90 transition-colors"
            >
              <FaWhatsapp size={18} /> Falar no WhatsApp
            </WhatsAppLink>
            <Link
              href="/simulador"
              className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 font-bold uppercase tracking-wider text-sm hover:bg-white/20 transition-colors"
            >
              <FiPercent size={16} /> Simular parcela
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-4xl">
          <span className="section-label">Faixas vigentes em 2026</span>
          <h2 className="section-title mb-6">Quem se enquadra e qual a taxa</h2>
          <p className="text-sm text-gray-600 mb-8 leading-relaxed">
            As portarias de 2026 ampliaram o MCMV: o teto de renda subiu de R$ 8.000 para R$ 13.000 e foi criada a
            Faixa 4 para imóveis de até R$ 600 mil. Os juros permanecem subsidiados nas Faixas 1 e 2.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200">
              <caption className="sr-only">Faixas de renda, taxa de juros e teto do imóvel do Minha Casa Minha Vida em 2026.</caption>
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-600">
                <tr>
                  <th scope="col" className="px-4 py-3 font-bold">Faixa</th>
                  <th scope="col" className="px-4 py-3 font-bold">Renda familiar</th>
                  <th scope="col" className="px-4 py-3 font-bold">Taxa anual</th>
                  <th scope="col" className="px-4 py-3 font-bold">Teto do imóvel</th>
                  <th scope="col" className="px-4 py-3 font-bold">Observação</th>
                </tr>
              </thead>
              <tbody>
                {FAIXAS.map(f => (
                  <tr key={f.nome} className="border-t border-gray-200">
                    <td className="px-4 py-3 font-semibold text-dark whitespace-nowrap">{f.nome}</td>
                    <td className="px-4 py-3 text-dark whitespace-nowrap">{f.incomeRangeFormatted}</td>
                    <td className="px-4 py-3 text-dark whitespace-nowrap">{f.rateFormatted}</td>
                    <td className="px-4 py-3 text-dark whitespace-nowrap">{f.propertyLimitFormatted}</td>
                    <td className="px-4 py-3 text-gray-700">{f.audience}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-4 leading-relaxed">
            Fonte: portarias do Ministério das Cidades e tabela da Caixa Econômica Federal vigente em 2026.
            Valores podem mudar a qualquer momento por revisão do programa.
          </p>
        </div>
      </section>

      <section className="py-12 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-4xl">
          <span className="section-label">Mapa de oferta</span>
          <h2 className="section-title mb-6">Bairros com mais imóveis MCMV em Osasco e região</h2>
          <p className="text-sm text-gray-600 mb-8 leading-relaxed">
            Lista atualizada pelos lançamentos e revendas dentro do teto MCMV. Cada link leva ao guia completo do
            bairro com preço médio por m², perfil demográfico, acesso a transporte e dicas para visita.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BAIRROS_MCMV.map(b => (
              <Link
                key={b.slug}
                href={`/bairros/${b.slug}`}
                className="bg-white border border-gray-200 p-5 hover:border-primary hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FiMapPin size={16} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-dark group-hover:text-primary transition-colors">
                      {b.nome} <span className="text-xs text-gray-500 font-normal">· {b.cidade}</span>
                    </h3>
                    <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{b.destaque}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-3xl">
          <span className="section-label">Como funciona na prática</span>
          <h2 className="section-title mb-6">Passo a passo para comprar pelo MCMV em Osasco</h2>
          <ol className="space-y-5 text-sm text-gray-700 leading-relaxed">
            <li className="flex gap-4">
              <span className="w-7 h-7 bg-primary text-white text-xs font-black flex items-center justify-center flex-shrink-0">1</span>
              <div>
                <h3 className="font-bold text-dark mb-1">Confirme a faixa de renda</h3>
                <p>Some a renda bruta de todos os participantes do financiamento. O resultado define a faixa, a taxa e o subsídio disponível. O <Link href="/simulador" className="text-primary font-bold hover:underline">simulador</Link> detecta automaticamente a faixa.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="w-7 h-7 bg-primary text-white text-xs font-black flex items-center justify-center flex-shrink-0">2</span>
              <div>
                <h3 className="font-bold text-dark mb-1">Reúna a documentação</h3>
                <p>RG, CPF, comprovante de renda, extrato do FGTS e certidões. Veja o checklist completo no <Link href="/blog/documentos-para-financiar-imovel-2026" className="text-primary font-bold hover:underline">guia de documentos para financiar</Link>.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="w-7 h-7 bg-primary text-white text-xs font-black flex items-center justify-center flex-shrink-0">3</span>
              <div>
                <h3 className="font-bold text-dark mb-1">Pré-aprovação na Caixa</h3>
                <p>Com a pré-aprovação na mão, você sabe exatamente quanto pode financiar. Isso agiliza a negociação e dá mais poder de barganha.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="w-7 h-7 bg-primary text-white text-xs font-black flex items-center justify-center flex-shrink-0">4</span>
              <div>
                <h3 className="font-bold text-dark mb-1">Escolha do imóvel</h3>
                <p>Filtre imóveis dentro do teto da sua faixa em <Link href="/comprar/osasco" className="text-primary font-bold hover:underline">Osasco</Link>, <Link href="/comprar/barueri" className="text-primary font-bold hover:underline">Barueri</Link> ou <Link href="/comprar/carapicuiba" className="text-primary font-bold hover:underline">Carapicuíba</Link>. Confira matrícula atualizada e situação no condomínio antes da proposta.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="w-7 h-7 bg-primary text-white text-xs font-black flex items-center justify-center flex-shrink-0">5</span>
              <div>
                <h3 className="font-bold text-dark mb-1">Avaliação e contrato</h3>
                <p>A Caixa faz a avaliação do imóvel e libera o contrato. Custos paralelos: ITBI (3% em Osasco pela LC 227/2026) e registro em cartório (~1%). Veja <Link href="/ajuda/custos-para-comprar-imovel-em-osasco" className="text-primary font-bold hover:underline">custos completos da compra</Link>.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section className="py-12 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-3xl">
          <span className="section-label">Dúvidas frequentes</span>
          <h2 className="section-title mb-8">Perguntas frequentes sobre o MCMV em Osasco</h2>
          <div className="space-y-5">
            {FAQS.map(faq => (
              <div key={faq.question} className="bg-white border border-gray-200 p-5">
                <h3 className="text-sm font-bold text-dark mb-2">{faq.question}</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-dark text-white">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <FiHome size={36} className="text-primary mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-black uppercase mb-4">Pronto para comprar pelo MCMV?</h2>
          <p className="text-white/80 leading-relaxed mb-8">
            Me chama no WhatsApp com o valor do imóvel desejado e a renda familiar. Em até 2 horas úteis eu retorno
            com a faixa aplicável, a parcela estimada, a entrada necessária e uma lista de imóveis disponíveis
            dentro do teto.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <WhatsAppLink
              href={WA_HREF}
              source="mcmv-osasco-cta"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 font-bold uppercase tracking-wider text-sm hover:bg-primary/90 transition-colors"
            >
              <FaWhatsapp size={18} /> {PHONE_DISPLAY}
            </WhatsAppLink>
            <Link
              href="/simulador"
              className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-4 font-bold uppercase tracking-wider text-sm hover:bg-white/20 transition-colors"
            >
              <FiDollarSign size={16} /> Abrir simulador
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-6 max-w-3xl">
          <span className="section-label">Continue lendo</span>
          <h2 className="section-title mb-6">Guias relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/guia/financiamento-imobiliario-osasco" className="bg-gray-50 border border-gray-200 p-5 hover:border-primary transition-all">
              <FiCheckCircle size={16} className="text-primary mb-2" />
              <h3 className="text-sm font-bold text-dark">Financiamento imobiliário em Osasco</h3>
              <p className="text-xs text-gray-600 mt-1.5">Hub completo: MCMV, SBPE, Crédito Associativo e FGTS</p>
            </Link>
            <Link href="/blog/minha-casa-minha-vida-2026-faixas-subsidio" className="bg-gray-50 border border-gray-200 p-5 hover:border-primary transition-all">
              <FiCheckCircle size={16} className="text-primary mb-2" />
              <h3 className="text-sm font-bold text-dark">MCMV 2026: faixas e subsídios</h3>
              <p className="text-xs text-gray-600 mt-1.5">Regras atualizadas, subsídio direto e enquadramento</p>
            </Link>
            <Link href="/blog/itbi-osasco-barueri-carapicuiba-sao-paulo-2026" className="bg-gray-50 border border-gray-200 p-5 hover:border-primary transition-all">
              <FiCheckCircle size={16} className="text-primary mb-2" />
              <h3 className="text-sm font-bold text-dark">ITBI em Osasco e região</h3>
              <p className="text-xs text-gray-600 mt-1.5">Alíquotas atualizadas pela LC 227/2026</p>
            </Link>
            <Link href="/blog/documentos-para-financiar-imovel-2026" className="bg-gray-50 border border-gray-200 p-5 hover:border-primary transition-all">
              <FiCheckCircle size={16} className="text-primary mb-2" />
              <h3 className="text-sm font-bold text-dark">Documentos para financiar imóvel</h3>
              <p className="text-xs text-gray-600 mt-1.5">Checklist Caixa para CLT, autônomo, MEI e aposentado</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
