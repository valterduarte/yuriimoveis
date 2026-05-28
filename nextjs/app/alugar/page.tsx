import Link from 'next/link'
import { FaWhatsapp } from 'react-icons/fa'
import { FiCheckCircle } from 'react-icons/fi'
import { SITE_URL, OG_DEFAULT_IMAGE, PHONE_WA_BASE, PHONE_TEL, PHONE_DISPLAY, CRECI } from '../../lib/config'
import { buildBreadcrumb } from '../../lib/jsonLd'
import WhatsAppLink from '../../components/WhatsAppLink'
import type { Metadata } from 'next'

const TITLE = 'Aluguel de Imóveis em Osasco, Barueri e Carapicuíba — Corretor Yuri'
const DESCRIPTION = `Busco aluguéis sob medida em Osasco, Barueri e Carapicuíba conforme seu orçamento e bairro. Atendimento direto com o Corretor Yuri, CRECI-SP ${CRECI}, sem taxa de pesquisa.`

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/alugar` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/alugar`,
    siteName: 'Corretor Yuri Imóveis',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: OG_DEFAULT_IMAGE, width: 1200, height: 630, alt: 'Aluguel de imóveis com o Corretor Yuri' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [OG_DEFAULT_IMAGE] },
}

const WA_TEXT = encodeURIComponent(
  'Olá Yuri! Estou procurando imóvel para alugar. Pode me ajudar?'
)

const VANTAGENS = [
  'Pesquisa personalizada por bairro, faixa de preço e perfil do imóvel.',
  'Análise de contrato, vistoria e suporte na negociação de reajuste.',
  'Orientação sobre seguro-fiança, fiador e caução.',
  'Sem custo de pesquisa: você só paga taxa imobiliária quando fecha o contrato.',
]

export default function AlugarLanding() {
  const breadcrumb = buildBreadcrumb([
    { name: 'Início', path: '/' },
    { name: 'Aluguel', path: '/alugar' },
  ])

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <section className="py-20 bg-dark text-white">
        <div className="container mx-auto px-6">
          <nav className="crumb-row" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Início</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">Aluguel</span>
          </nav>
          <span className="section-label">Aluguel</span>
          <h1 className="text-4xl md:text-5xl font-black uppercase leading-tight mb-4">
            Aluguel de Imóveis em<br />Osasco, Barueri e Carapicuíba
          </h1>
          <p className="text-white/80 max-w-2xl text-sm md:text-base leading-relaxed">
            Hoje o catálogo público do site mostra apenas imóveis à venda, mas atendo pesquisas de aluguel
            sob demanda na região oeste da Grande São Paulo. Conte qual bairro, faixa de preço e perfil
            de imóvel você precisa — eu busco entre parcerias locais e proprietários da minha base.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <span className="section-label">Como funciona</span>
          <h2 className="section-title mb-8">Pesquisa de aluguel sob demanda</h2>

          <ol className="space-y-5">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-primary text-white text-sm font-bold flex items-center justify-center">1</span>
              <div>
                <h3 className="font-bold text-dark text-sm mb-1">Você manda o briefing</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Cidade, bairros de preferência, número de quartos, faixa de aluguel e prazo de mudança.
                  Pelo WhatsApp em 2 minutos.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-primary text-white text-sm font-bold flex items-center justify-center">2</span>
              <div>
                <h3 className="font-bold text-dark text-sm mb-1">Eu busco e filtro</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Trabalho com parcerias entre corretores e proprietários diretos. Te mando 3 a 5 opções
                  reais que batem com o briefing, com fotos atualizadas e valor confirmado.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-primary text-white text-sm font-bold flex items-center justify-center">3</span>
              <div>
                <h3 className="font-bold text-dark text-sm mb-1">Visita, contrato e mudança</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Agendamos as visitas em sequência, confiro contrato e vistoria com você, oriento sobre
                  garantia (seguro-fiança, fiador ou caução) e acompanho até a entrega das chaves.
                </p>
              </div>
            </li>
          </ol>

          <div className="mt-10 bg-gray-50 border border-gray-200 p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-dark mb-4">O que está incluso</h3>
            <ul className="space-y-2.5">
              {VANTAGENS.map(v => (
                <li key={v} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                  <FiCheckCircle className="text-primary flex-shrink-0 mt-0.5" size={16} />
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 bg-dark text-white">
        <div className="container mx-auto px-6 text-center">
          <span className="section-label !text-gray-400">Próximo passo</span>
          <h2 className="text-3xl md:text-4xl font-black uppercase mb-4">Solicite sua pesquisa de aluguel</h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto mb-8">
            Resposta em até 24 horas úteis. Atendimento por WhatsApp ou telefone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <WhatsAppLink
              href={`${PHONE_WA_BASE}?text=${WA_TEXT}`}
              source="alugar-cta"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-[0.15em] text-sm py-4 px-8 transition-colors"
            >
              <FaWhatsapp size={20} /> WhatsApp
            </WhatsAppLink>
            <a
              href={PHONE_TEL}
              className="flex items-center justify-center gap-3 border border-white/30 hover:border-primary hover:text-primary text-white font-bold uppercase tracking-[0.15em] text-sm py-4 px-8 transition-colors"
            >
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-xs font-bold uppercase tracking-widest text-dark mb-4">Veja também</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/imoveis" className="text-primary hover:underline">Catálogo de imóveis à venda →</Link>
            </li>
            <li>
              <Link href="/bairros" className="text-primary hover:underline">Guias de bairros em Osasco, Barueri e Carapicuíba →</Link>
            </li>
            <li>
              <Link href="/simulador" className="text-primary hover:underline">Simulador de financiamento (se quiser comparar comprar × alugar) →</Link>
            </li>
          </ul>
        </div>
      </section>
    </div>
  )
}
