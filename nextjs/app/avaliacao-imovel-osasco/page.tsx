import Link from 'next/link'
import { FaWhatsapp } from 'react-icons/fa'
import { FiCheckCircle, FiTrendingUp, FiMapPin, FiFileText, FiDollarSign, FiClock } from 'react-icons/fi'
import { SITE_URL, OG_DEFAULT_IMAGE, PHONE_WA_BASE, PHONE_DISPLAY } from '../../lib/config'
import { buildArticleSchema, buildBreadcrumb, buildFaqPageSchema } from '../../lib/jsonLd'
import WhatsAppLink from '../../components/WhatsAppLink'
import type { Metadata } from 'next'

const PAGE_URL = `${SITE_URL}/avaliacao-imovel-osasco`
const PUBLISHED_AT = '2026-05-19'
const MODIFIED_AT = '2026-05-19'

const PAGE_TITLE = 'Avaliação de Imóvel em Osasco — Quanto Vale o Seu?'
const SOCIAL_TITLE = `${PAGE_TITLE} — Corretor Yuri`
const DESCRIPTION =
  'Avaliação gratuita de imóvel em Osasco, Barueri e Carapicuíba pelo Corretor Yuri (CRECI-SP 235509). Análise comparativa de mercado, sem compromisso, com base em vendas reais da região. Resposta em 24-48h.'
const WA_TEXT = encodeURIComponent('Olá! Quero saber quanto vale meu imóvel em Osasco. Pode fazer uma avaliação?')
const WA_HREF = `${PHONE_WA_BASE}?text=${WA_TEXT}`

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: SOCIAL_TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: 'Corretor Yuri Imóveis',
    locale: 'pt_BR',
    type: 'article',
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    images: [{ url: OG_DEFAULT_IMAGE, width: 1200, height: 630, alt: 'Avaliação de imóvel em Osasco' }],
  },
  twitter: { card: 'summary_large_image', title: SOCIAL_TITLE, description: DESCRIPTION, images: [OG_DEFAULT_IMAGE] },
}

const METODOS = [
  {
    icon: FiTrendingUp,
    titulo: 'Comparativo de mercado',
    descricao: 'Cruzo os dados do seu imóvel com vendas reais dos últimos 6-12 meses em raio de até 1 km. Ajusto por área útil, número de dormitórios, vagas, andar, estado de conservação e diferenças do condomínio.',
  },
  {
    icon: FiFileText,
    titulo: 'Custo de reposição',
    descricao: 'Para imóveis únicos ou em bairros com poucos comparáveis, calculo o que custaria reconstruir o imóvel hoje (terreno + obra + depreciação por idade e estado).',
  },
  {
    icon: FiDollarSign,
    titulo: 'Renda capitalizada (investidor)',
    descricao: 'Quando o uso é locação, parto do aluguel praticado na região e do cap rate típico de Osasco/Barueri (atualmente 0,4-0,6% ao mês) para chegar ao valor justo de venda do imóvel para investimento.',
  },
]

const QUE_INFORMACOES = [
  'Endereço completo (rua, número, bairro, cidade)',
  'Área útil em m² (ou total do terreno, se for casa)',
  'Número de dormitórios, banheiros e vagas',
  'Andar e posição (frente/fundos) — para apartamento',
  'Estado de conservação (recém-reformado, conservado, precisa reforma)',
  'Valor do condomínio mensal — se houver',
  'Diferenciais (suíte, varanda gourmet, lazer completo, vista, etc.)',
  'IPTU mensal e situação da matrícula (livre de ônus, em financiamento, em inventário)',
]

const QUANDO_AVALIAR = [
  { motivo: 'Vender agora', exemplo: 'Definir o preço de venda alinhado com o mercado — preço errado é a #1 causa de imóvel encalhar.' },
  { motivo: 'Trocar de imóvel', exemplo: 'Saber se o que você tem hoje cobre a entrada + ITBI + reforma do imóvel novo.' },
  { motivo: 'Inventário ou divórcio', exemplo: 'Documento de avaliação para partilha ou processo, com fundamentação técnica.' },
  { motivo: 'Renegociar IPTU ou ITBI', exemplo: 'Quando o valor venal está muito acima do valor de mercado real.' },
  { motivo: 'Garantia de crédito', exemplo: 'Para apresentar como garantia em empréstimo ou refinanciamento.' },
  { motivo: 'Decisão de investimento', exemplo: 'Comparar com outros imóveis da região antes de decidir manter, vender ou alugar.' },
]

const FAQS = [
  {
    question: 'A avaliação de imóvel em Osasco é gratuita?',
    answer:
      'A avaliação informal de mercado (estimativa de valor para venda) é gratuita e feita pelo WhatsApp em 24-48h úteis. Já o laudo técnico formal de avaliação (PTAM — Parecer Técnico de Avaliação Mercadológica), que tem fé pública para inventário, processo judicial ou empréstimo, é cobrado por orçamento — em média R$ 800 a R$ 2.500 dependendo do tipo de imóvel.',
  },
  {
    question: 'Quanto tempo leva uma avaliação de imóvel?',
    answer:
      'A avaliação informal de mercado (estimativa) sai em 24-48h úteis após receber os dados do imóvel. O laudo técnico formal (PTAM) com vistoria presencial leva de 5 a 10 dias úteis dependendo da complexidade do imóvel e do prazo do cartório para emitir as certidões necessárias.',
  },
  {
    question: 'O que faz um imóvel valer mais em Osasco?',
    answer:
      'Os fatores que mais valorizam imóvel em Osasco são proximidade da CPTM (até 800m a pé), estado de conservação, área útil acima da média do bairro, vaga coberta, suíte, lazer completo no condomínio e localização em rua sem trânsito intenso. Bairros como Vila Yara, Bela Vista, Centro e Aldeia da Serra/Tamboré (lado Barueri) costumam ter os m² mais valorizados.',
  },
  {
    question: 'Posso avaliar imóvel à distância sem visita?',
    answer:
      'Para estimativa de mercado, sim — com fotos atualizadas, área útil correta e endereço exato consigo dar um valor de referência confiável. Para laudo técnico formal, a vistoria presencial é obrigatória porque o avaliador precisa verificar pessoalmente o estado real do imóvel, conferir medidas e fotografar os ambientes.',
  },
  {
    question: 'Qual a diferença entre valor venal e valor de mercado?',
    answer:
      'O valor venal é o que a prefeitura usa para calcular IPTU e ITBI — é uma estimativa conservadora atualizada anualmente. O valor de mercado é o que um comprador está disposto a pagar hoje. Em Osasco, o valor de mercado costuma ser 20-40% maior que o valor venal, mas em alguns bairros valorizados como Vila Yara essa diferença pode chegar a 60%.',
  },
  {
    question: 'O Corretor Yuri faz laudo de avaliação para inventário?',
    answer:
      'Faço o Parecer Técnico de Avaliação Mercadológica (PTAM) com base na NBR 14.653 — aceito em inventário extrajudicial, partilha de bens e renegociação tributária. Para perícia judicial específica, posso indicar engenheiro avaliador credenciado conforme o caso.',
  },
  {
    question: 'Como receber a avaliação do meu imóvel?',
    answer:
      'Me chama no WhatsApp (11) 97256-3420 com endereço, área útil, número de dormitórios, vagas e estado de conservação. Em 24-48h úteis te envio uma estimativa de mercado por escrito, com 3-5 imóveis comparáveis usados como referência e a faixa de preço sugerida para venda.',
  },
]

const breadcrumbJsonLd = buildBreadcrumb([
  { name: 'Início',           path: '/' },
  { name: 'Avaliação Osasco', path: '/avaliacao-imovel-osasco' },
])

const articleJsonLd = buildArticleSchema({
  headline: PAGE_TITLE,
  description: DESCRIPTION,
  url: PAGE_URL,
  datePublished: PUBLISHED_AT,
  dateModified: MODIFIED_AT,
})

const faqJsonLd = buildFaqPageSchema(FAQS)

export default function AvaliacaoImovelOsascoPage() {
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
            <span className="text-white" aria-current="page">Avaliação de imóvel</span>
          </nav>
          <span className="uppercase tracking-widest text-xs font-bold text-primary mb-3 block">Avaliação gratuita · 24-48h</span>
          <h1 className="text-4xl md:text-5xl font-black uppercase leading-tight mb-4">
            Quanto Vale Seu<br />Imóvel em Osasco?
          </h1>
          <p className="text-white/80 max-w-2xl text-base leading-relaxed mb-8">
            Avaliação de mercado para imóveis em Osasco, Barueri e Carapicuíba pelo Corretor Yuri Duarte (CRECI-SP
            235509). Análise comparativa com vendas reais da sua região, fundamentação técnica e nenhum compromisso
            de venda. Resposta por escrito em 24 a 48 horas úteis.
          </p>
          <div className="flex flex-wrap gap-3">
            <WhatsAppLink
              href={WA_HREF}
              source="avaliacao-osasco-hero"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 font-bold uppercase tracking-wider text-sm hover:bg-primary/90 transition-colors"
            >
              <FaWhatsapp size={18} /> Quero avaliar meu imóvel
            </WhatsAppLink>
            <Link
              href="/comparar"
              className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 font-bold uppercase tracking-wider text-sm hover:bg-white/20 transition-colors"
            >
              <FiTrendingUp size={16} /> Comparar imóveis
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-4xl">
          <span className="section-label">Métodos utilizados</span>
          <h2 className="section-title mb-8">Como faço a avaliação do seu imóvel</h2>
          <p className="text-sm text-gray-600 mb-8 leading-relaxed">
            Cada imóvel tem um método ideal. Vou explicar qual aplico no seu caso na hora de te entregar o valor
            sugerido, com os comparáveis usados como base. Sem chute, sem &quot;tabela mágica&quot;.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {METODOS.map(m => (
              <div key={m.titulo} className="bg-gray-50 border border-gray-200 p-6">
                <div className="w-11 h-11 bg-primary/10 flex items-center justify-center mb-4">
                  <m.icon size={20} className="text-primary" />
                </div>
                <h3 className="text-sm font-bold text-dark mb-2">{m.titulo}</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{m.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-3xl">
          <span className="section-label">Quando faz sentido avaliar</span>
          <h2 className="section-title mb-8">6 situações em que uma avaliação muda a decisão</h2>
          <div className="space-y-4">
            {QUANDO_AVALIAR.map((q, i) => (
              <div key={q.motivo} className="bg-white border border-gray-200 p-5">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 bg-primary text-white text-xs font-black flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  <div>
                    <h3 className="text-sm font-bold text-dark mb-1">{q.motivo}</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{q.exemplo}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-3xl">
          <span className="section-label">O que preciso para avaliar</span>
          <h2 className="section-title mb-6">Dados que aceleram a sua avaliação</h2>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Quanto mais completos os dados, mais precisa a avaliação. Se você não souber tudo, manda o que tem
            — eu volto perguntando o resto.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {QUE_INFORMACOES.map(info => (
              <div key={info} className="flex items-start gap-2.5 bg-gray-50 border border-gray-200 px-4 py-3">
                <FiCheckCircle size={14} className="text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{info}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-amber-50 border border-amber-200 p-5">
            <div className="flex items-start gap-3">
              <FiClock size={18} className="text-amber-700 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-amber-900 mb-1">Prazo de resposta</h3>
                <p className="text-sm text-amber-900 leading-relaxed">
                  Estimativa informal de mercado: 24 a 48h úteis por escrito no WhatsApp. Laudo técnico formal
                  (PTAM com vistoria presencial): 5 a 10 dias úteis após a visita.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-3xl">
          <span className="section-label">Próximo passo</span>
          <h2 className="section-title mb-6">E se eu já souber o valor — o que faço com isso?</h2>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Avaliação na mão é o ponto de partida — não o fim. Dependendo do seu objetivo, o próximo passo muda:
          </p>
          <div className="space-y-4">
            <Link href="/comprar/osasco" className="block bg-white border border-gray-200 p-5 hover:border-primary transition-all">
              <div className="flex items-start gap-3">
                <FiMapPin size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-dark">Quero trocar de imóvel — onde compro o próximo?</h3>
                  <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                    Veja imóveis à venda em Osasco, Barueri ou Carapicuíba dentro do valor que a avaliação liberou.
                  </p>
                </div>
              </div>
            </Link>
            <Link href="/simulador" className="block bg-white border border-gray-200 p-5 hover:border-primary transition-all">
              <div className="flex items-start gap-3">
                <FiDollarSign size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-dark">Vou financiar a diferença — quanto cabe no bolso?</h3>
                  <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                    Use o simulador para calcular parcela, prazo, ITBI e custo de cartório com o valor da avaliação como entrada.
                  </p>
                </div>
              </div>
            </Link>
            <Link href="/ajuda/custos-para-comprar-imovel-em-osasco" className="block bg-white border border-gray-200 p-5 hover:border-primary transition-all">
              <div className="flex items-start gap-3">
                <FiFileText size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-dark">Vou vender — qual o custo real da venda?</h3>
                  <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                    Ganho de capital, comissão, certidões e custos de regularização que saem do valor recebido.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-3xl">
          <span className="section-label">Dúvidas frequentes</span>
          <h2 className="section-title mb-8">Perguntas frequentes sobre avaliação de imóvel</h2>
          <div className="space-y-5">
            {FAQS.map(faq => (
              <div key={faq.question} className="bg-gray-50 border border-gray-200 p-5">
                <h3 className="text-sm font-bold text-dark mb-2">{faq.question}</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-dark text-white">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <FiTrendingUp size={36} className="text-primary mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-black uppercase mb-4">Avaliação gratuita em 48h</h2>
          <p className="text-white/80 leading-relaxed mb-8">
            Me chama no WhatsApp com endereço, área útil, quartos e vagas. Em até 48 horas úteis você recebe a
            estimativa de mercado por escrito, com 3-5 imóveis comparáveis e a faixa sugerida para anunciar. Sem
            taxa, sem compromisso de venda.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <WhatsAppLink
              href={WA_HREF}
              source="avaliacao-osasco-cta"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 font-bold uppercase tracking-wider text-sm hover:bg-primary/90 transition-colors"
            >
              <FaWhatsapp size={18} /> {PHONE_DISPLAY}
            </WhatsAppLink>
          </div>
        </div>
      </section>
    </div>
  )
}
