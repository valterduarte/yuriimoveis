import { SITE_URL, OG_DEFAULT_IMAGE } from '../../lib/config'
import SimuladorClient from '../../components/simulador/SimuladorClient'
import { buildFaqPageSchema } from '../../lib/jsonLd'
import type { Metadata } from 'next'

const TITLE = 'Simulador de Financiamento Imobiliário — Corretor Yuri'
const DESCRIPTION =
  'Simule o financiamento do seu imóvel pelo sistema SAC: parcelas, juros, ITBI e custos de cartório. Veja se você se enquadra no Minha Casa Minha Vida.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/simulador` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/simulador`,
    siteName: 'Corretor Yuri Imóveis',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: OG_DEFAULT_IMAGE, width: 1200, height: 630, alt: 'Simulador de Financiamento' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_DEFAULT_IMAGE],
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Simulador de Financiamento', item: `${SITE_URL}/simulador` },
  ],
}

const RATE_TABLE_FAQ = buildFaqPageSchema([
  {
    question: 'Qual a taxa de juros do financiamento imobiliário em 2026?',
    answer: 'A taxa varia conforme o programa. Caixa SBPE com relacionamento parte de 9,9% ao ano para imóveis elegíveis ao MCMV. Mercado livre (SBPE tradicional) gira em 11,49% ao ano. Crédito Associativo cooperativo fica em torno de 8,5%. Minha Casa Minha Vida vai de 4% (Faixa 1) até 7,66% (Faixa 3).',
  },
  {
    question: 'Quem se enquadra no Minha Casa Minha Vida em 2026?',
    answer: 'Famílias com renda bruta de até R$ 8.000/mês comprando imóvel residencial de até R$ 350.000. Faixa 1: renda até R$ 2.640 (juros 4% a.a.). Faixa 2: R$ 2.640 a R$ 4.400 (juros 5,5% a.a.). Faixa 3: R$ 4.400 a R$ 8.000 (juros 7,66% a.a.).',
  },
  {
    question: 'Qual a entrada mínima para financiar um imóvel?',
    answer: 'Bancos como Caixa, Itaú, Bradesco e Santander costumam exigir entrada de pelo menos 20% do valor do imóvel. O saldo do FGTS pode compor essa entrada para imóveis residenciais dentro das regras do SFH.',
  },
  {
    question: 'Quanto reservar para ITBI e cartório?',
    answer: 'Em média 4,5% sobre o valor do imóvel: ITBI municipal em torno de 2% (Osasco passou a 3% pela LC 227/2026) e registro em cartório em torno de 2,5%. Esses custos não entram no financiamento e precisam ser pagos do bolso.',
  },
])

const RATE_ROWS: { programa: string; taxa: string; perfil: string }[] = [
  { programa: 'MCMV — Faixa 1', taxa: '4,00% a.a.', perfil: 'Renda até R$ 2.640. Imóvel até R$ 350 mil.' },
  { programa: 'MCMV — Faixa 2', taxa: '5,50% a.a.', perfil: 'Renda R$ 2.640 a R$ 4.400. Imóvel até R$ 350 mil.' },
  { programa: 'MCMV — Faixa 3', taxa: '7,66% a.a.', perfil: 'Renda R$ 4.400 a R$ 8.000. Imóvel até R$ 350 mil.' },
  { programa: 'Crédito Associativo', taxa: '8,50% a.a.', perfil: 'Cooperativas e programas habitacionais. Renda até R$ 12 mil.' },
  { programa: 'Caixa SBPE — imóvel elegível MCMV', taxa: '9,90% a.a.', perfil: 'SBPE com relacionamento, imóvel dentro do teto MCMV.' },
  { programa: 'SBPE — mercado livre', taxa: '11,49% a.a.', perfil: 'Financiamento tradicional dos bancos, fora do MCMV.' },
]

export default async function SimuladorPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams
  const initialValue = params.valor ? Number(params.valor) : undefined
  return (
    <div className="min-h-screen pb-16 md:pb-0 bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(RATE_TABLE_FAQ) }} />

      <section className="bg-dark text-white py-16">
        <div className="container mx-auto px-6">
          <span className="uppercase tracking-widest text-xs font-bold text-primary mb-3 block">
            Simulador
          </span>
          <h1 className="text-4xl md:text-5xl font-black uppercase leading-tight mb-4">
            Simulador de<br />Financiamento Imobiliário
          </h1>
          <p className="text-white/80 max-w-2xl text-sm md:text-base leading-relaxed">
            Calcule parcelas, juros e custos totais antes de fechar negócio. Sistema SAC, com ITBI, cartório e
            checagem de elegibilidade ao Minha Casa Minha Vida.
          </p>
        </div>
      </section>

      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-4xl">
          <span className="section-label">Taxas de referência</span>
          <h2 className="section-title mb-6">Taxas de juros e tetos vigentes em 2026</h2>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Valores praticados na região metropolitana de São Paulo. O simulador abaixo usa essa mesma tabela
            para calcular parcelas. Os juros do MCMV são fixos e subsidiados; SBPE varia conforme análise de
            crédito e relacionamento bancário.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200">
              <caption className="sr-only">Tabela de taxas de juros, faixas de renda e tetos do Minha Casa Minha Vida e SBPE em 2026.</caption>
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-600">
                <tr>
                  <th scope="col" className="px-4 py-3 font-bold">Programa</th>
                  <th scope="col" className="px-4 py-3 font-bold">Taxa anual</th>
                  <th scope="col" className="px-4 py-3 font-bold">Perfil e teto</th>
                </tr>
              </thead>
              <tbody>
                {RATE_ROWS.map(row => (
                  <tr key={row.programa} className="border-t border-gray-200">
                    <td className="px-4 py-3 font-semibold text-dark">{row.programa}</td>
                    <td className="px-4 py-3 text-dark whitespace-nowrap">{row.taxa}</td>
                    <td className="px-4 py-3 text-gray-700">{row.perfil}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-6 space-y-1.5 text-xs text-gray-600 leading-relaxed">
            <li><strong>Renda considerada:</strong> bruta familiar (soma dos rendimentos de todos os participantes do financiamento).</li>
            <li><strong>Entrada mínima:</strong> 20% do valor do imóvel para SBPE, podendo ser composta com FGTS.</li>
            <li><strong>Prazo máximo:</strong> 420 meses (35 anos) nos principais bancos.</li>
            <li><strong>Capacidade de pagamento:</strong> parcela limitada a 30% da renda bruta familiar.</li>
          </ul>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6">
          <SimuladorClient initialValue={initialValue} />
        </div>
      </section>

      <section className="py-16 bg-white border-t border-gray-200">
        <div className="container mx-auto px-6 max-w-3xl">
          <span className="section-label">Como funciona</span>
          <h2 className="section-title mb-8">Entenda os números do seu financiamento</h2>

          <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
            <div>
              <h3 className="font-bold text-dark mb-2">Sistema SAC (Amortização Constante)</h3>
              <p>
                A maioria dos financiamentos imobiliários no Brasil usa o SAC. As parcelas começam mais altas e
                vão diminuindo ao longo do tempo, porque você sempre amortiza o mesmo valor de principal a cada mês
                — só os juros, que incidem sobre o saldo devedor, vão ficando menores.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-dark mb-2">Entrada mínima de 20%</h3>
              <p>
                Bancos como Caixa, Itaú, Bradesco e Santander costumam exigir entrada de pelo menos 20% do valor do
                imóvel. Você pode usar saldo do FGTS para compor essa entrada se o imóvel for residencial e dentro
                das regras do SFH.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-dark mb-2">ITBI e registro em cartório</h3>
              <p>
                Além da entrada, reserve cerca de 4,5% do valor do imóvel para o ITBI (imposto municipal sobre a
                transmissão, ≈ 2%) e o registro no cartório de imóveis (≈ 2,5%). Esses custos não entram no
                financiamento e precisam ser pagos do próprio bolso.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-dark mb-2">Capacidade de pagamento</h3>
              <p>
                Os bancos limitam a parcela a 30% da renda familiar bruta. Se a primeira parcela ultrapassar esse
                teto, o crédito provavelmente não será aprovado — vale aumentar a entrada, ampliar o prazo ou
                buscar um imóvel de menor valor.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-dark mb-2">Minha Casa Minha Vida</h3>
              <p>
                Famílias com renda mensal de até R$ 8.000 que estejam comprando imóvel de até R$ 350.000 podem se
                enquadrar no programa Minha Casa Minha Vida, com juros bem menores que o mercado e, em alguns
                casos, subsídio direto na entrada. As faixas vão de 4% a.a. (Faixa 1) até 7,66% a.a. (Faixa 3).
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
