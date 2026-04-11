import Link from 'next/link'
import { FiCheckCircle, FiHome, FiUsers, FiShield } from 'react-icons/fi'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'
import {
  SITE_URL,
  OG_DEFAULT_IMAGE,
  PHONE_WA_BASE,
  PHONE_DISPLAY,
  PHONE_TEL,
  PHONE_STRUCTURED,
  CRECI,
  INSTAGRAM_URL,
} from '../../lib/config'
import WhatsAppLink from '../../components/WhatsAppLink'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre o Corretor Yuri — Imóveis em Osasco SP',
  description:
    'Conheça o Corretor Yuri Duarte, CRECI-SP 235509. Mais de 10 anos de experiência em imóveis residenciais e comerciais em Osasco e Grande São Paulo.',
  alternates: { canonical: `${SITE_URL}/sobre` },
  openGraph: {
    title: 'Sobre o Corretor Yuri — Imóveis em Osasco SP',
    description:
      'Conheça o Corretor Yuri Duarte, CRECI-SP 235509. Mais de 10 anos de experiência em imóveis residenciais e comerciais em Osasco e Grande São Paulo.',
    url: `${SITE_URL}/sobre`,
    siteName: 'Corretor Yuri Imóveis',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: OG_DEFAULT_IMAGE, width: 1200, height: 630, alt: 'Corretor Yuri Imóveis' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sobre o Corretor Yuri — Imóveis em Osasco SP',
    description:
      'Conheça o Corretor Yuri Duarte, CRECI-SP 235509. Mais de 10 anos de experiência em imóveis residenciais e comerciais em Osasco e Grande São Paulo.',
    images: [OG_DEFAULT_IMAGE],
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Sobre', item: `${SITE_URL}/sobre` },
  ],
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Yuri Duarte',
  jobTitle: 'Corretor de Imóveis',
  description:
    'Corretor de imóveis com mais de 10 anos de experiência em Osasco e Grande São Paulo. Especialista em imóveis residenciais e comerciais.',
  url: SITE_URL,
  telephone: PHONE_STRUCTURED,
  sameAs: [INSTAGRAM_URL],
  worksFor: {
    '@type': 'RealEstateAgent',
    name: 'Corretor Yuri Imóveis',
    url: SITE_URL,
  },
  knowsAbout: [
    'Mercado imobiliário de Osasco',
    'Financiamento imobiliário',
    'Minha Casa Minha Vida',
    'Imóveis residenciais e comerciais',
  ],
  hasCredential: {
    '@type': 'EducationalOccupationalCredential',
    credentialCategory: 'Professional License',
    name: `CRECI-SP ${CRECI}`,
    recognizedBy: {
      '@type': 'Organization',
      name: 'CRECI-SP — Conselho Regional de Corretores de Imóveis de São Paulo',
    },
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Osasco',
    addressRegion: 'SP',
    addressCountry: 'BR',
  },
}

const DIFERENCIAIS = [
  {
    icon: FiHome,
    titulo: 'Especialista Local',
    descricao:
      'Mais de 10 anos atuando exclusivamente em Osasco e região. Conheço cada bairro, cada rua e cada oportunidade do mercado local.',
  },
  {
    icon: FiShield,
    titulo: 'Segurança Jurídica',
    descricao:
      'Registro ativo no CRECI-SP (235509). Toda negociação é conduzida com documentação completa e transparência total.',
  },
  {
    icon: FiUsers,
    titulo: 'Atendimento Personalizado',
    descricao:
      'Cada cliente tem necessidades únicas. Faço um trabalho de busca personalizado para encontrar o imóvel que se encaixa no seu perfil e orçamento.',
  },
  {
    icon: FiCheckCircle,
    titulo: 'Assessoria Completa',
    descricao:
      'Acompanho desde a primeira visita até a entrega das chaves. Auxílio com financiamento, documentação e negociação.',
  },
]

export default function SobrePage() {
  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />

      <section className="py-24 bg-dark text-white">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Início</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">Sobre</span>
          </nav>
          <span className="section-label">Quem Somos</span>
          <h1 className="text-5xl md:text-6xl font-black text-white uppercase leading-none">
            Corretor Yuri<br />
            <span className="text-primary">Duarte</span>
          </h1>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h2 className="text-xs font-bold uppercase tracking-widest text-dark mb-6">Sobre o Corretor</h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              Sou Yuri Duarte, corretor de imóveis registrado no <strong>CRECI-SP {CRECI}</strong>, atuando há mais de 10 anos no mercado imobiliário de Osasco e Grande São Paulo.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              Minha trajetória começou pela paixão em ajudar pessoas a realizarem o sonho da casa própria. Ao longo dos anos, me especializei no mercado local de Osasco, acompanhando a evolução dos bairros, os lançamentos imobiliários e as melhores oportunidades de investimento na região.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              Trabalho com todos os tipos de imóveis — casas, apartamentos, terrenos, chalés, chácaras e comerciais — tanto para venda quanto para aluguel. Meu diferencial é o atendimento personalizado: entendo as necessidades de cada cliente e busco as melhores opções dentro do perfil e orçamento desejados.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              Ofereço assessoria completa em todas as etapas da negociação: análise de documentação, simulação de financiamento (incluindo Minha Casa Minha Vida), acompanhamento na visita aos imóveis e suporte até a entrega das chaves.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <span className="section-label">Diferenciais</span>
          <h2 className="section-title mb-10">Por que escolher o Corretor Yuri?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
            {DIFERENCIAIS.map(item => (
              <div key={item.titulo} className="bg-white border border-gray-200 p-6">
                <div className="w-10 h-10 bg-primary flex items-center justify-center mb-4">
                  <item.icon className="text-white" size={18} />
                </div>
                <h3 className="text-sm font-bold text-dark uppercase tracking-wide mb-2">{item.titulo}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h2 className="text-xs font-bold uppercase tracking-widest text-dark mb-6">Áreas de Atuação</h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              Atendo principalmente em <strong>Osasco</strong> e cidades da <strong>Grande São Paulo</strong>, incluindo os bairros mais procurados como Presidente Altino, Bela Vista, Km 18, Jaguaribe, Centro, Cipava, Conceição, Santa Maria e Vila Isabel.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              Conheço profundamente as características de cada bairro — infraestrutura, transporte, valorização e perfil dos moradores — o que me permite indicar as melhores opções para cada perfil de comprador ou locatário.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-dark text-white">
        <div className="container mx-auto px-6 text-center">
          <span className="section-label !text-gray-400">Vamos Conversar?</span>
          <h2 className="text-3xl md:text-4xl font-black uppercase mb-4">
            Fale com o Corretor Yuri
          </h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto mb-8">
            Atendimento de segunda a sexta das 9h às 18h e sábado das 9h às 12h.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <WhatsAppLink
              href={`${PHONE_WA_BASE}?text=${encodeURIComponent('Olá Yuri! Vi seu site e gostaria de conversar sobre imóveis.')}`}
              source="sobre-cta"
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
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-3 border border-white/30 hover:border-primary hover:text-primary text-white font-bold uppercase tracking-[0.15em] text-sm py-4 px-8 transition-colors"
            >
              <FaInstagram size={20} /> Instagram
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
