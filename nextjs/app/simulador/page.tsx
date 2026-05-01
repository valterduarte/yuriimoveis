import { SITE_URL, OG_DEFAULT_IMAGE } from '../../lib/config'
import SimuladorClient from '../../components/simulador/SimuladorClient'
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

export default async function SimuladorPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams
  const initialValue = params.valor ? Number(params.valor) : undefined
  return (
    <div className="min-h-screen pb-16 md:pb-0 bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

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
