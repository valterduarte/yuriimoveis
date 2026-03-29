import Link from 'next/link'
import Image from 'next/image'
import { FiArrowRight, FiArrowUpRight } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import SearchBar from '../components/SearchBar'
import PropertyCard from '../components/PropertyCard'
import SkeletonCard from '../components/SkeletonCard'
import { fetchFeaturedProperties } from '../lib/api'
import { PHONE_WA, PHONE_STRUCTURED, SITE_URL } from '../lib/config'

export const metadata = {
  title: 'Corretor Yuri Imóveis — Imóveis em Osasco e Região',
  description:
    'Corretor de imóveis em Osasco com mais de 10 anos de experiência. Casas, apartamentos, terrenos e comerciais para venda e aluguel. Atendimento personalizado.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Corretor Yuri Imóveis — Imóveis em Osasco e Região',
    description:
      'Corretor de imóveis em Osasco com mais de 10 anos de experiência. Casas, apartamentos, terrenos e comerciais para venda e aluguel.',
    url: '/',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=630&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'Corretor Yuri Imóveis — Osasco SP',
      },
    ],
  },
}

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Corretor Yuri Imóveis',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/imoveis?busca={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Quais tipos de imóveis o Corretor Yuri oferece em Osasco?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Casas, apartamentos, terrenos, chalés, chácaras e imóveis comerciais para venda e aluguel em Osasco e Grande São Paulo.',
        },
      },
      {
        '@type': 'Question',
        name: 'Como funciona o financiamento imobiliário em Osasco?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Financiamento de até 80% do valor em até 360 meses via Caixa ou bancos privados. Imóveis até R$ 264.000 podem se enquadrar no Minha Casa Minha Vida com taxas a partir de 5,5% ao ano.',
        },
      },
      {
        '@type': 'Question',
        name: 'Quais são os melhores bairros para morar em Osasco?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Jardim Roberto, Km 18, Presidente Altino e Vila Yolanda se destacam pela infraestrutura, transporte e acesso à Grande São Paulo.',
        },
      },
      {
        '@type': 'Question',
        name: 'Como entrar em contato com o Corretor Yuri?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'WhatsApp (11) 97256-3420 ou Instagram @valterrduarte. Atendimento de segunda a sexta das 9h às 18h.',
        },
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'RealEstateAgent'],
    name: 'Corretor Yuri Imóveis',
    description:
      'Especialistas em imóveis residenciais e comerciais em Osasco e região. Mais de 10 anos de experiência, atendimento personalizado e segurança jurídica.',
    url: SITE_URL,
    telephone: PHONE_STRUCTURED,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Osasco',
      addressRegion: 'SP',
      addressCountry: 'BR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -23.5329,
      longitude: -46.7917,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    areaServed: [
      { '@type': 'City', name: 'Osasco' },
      { '@type': 'AdministrativeArea', name: 'Grande São Paulo' },
    ],
    sameAs: [PHONE_WA],
  },
]

export default async function Home() {
  const featuredProperties = await fetchFeaturedProperties()

  return (
    <div className="pb-16 md:pb-0">
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <section className="relative min-h-screen flex items-center -mt-16 md:-mt-20 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&h=1080&fit=crop&q=60&fm=webp"
          alt="Imóvel residencial em Osasco"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          quality={60}
        />
        <div className="absolute inset-0 bg-dark/75" />
        <div className="relative container mx-auto px-6 pt-32 pb-24">
          <div className="max-w-2xl mb-12">
            <span className="section-label !text-gray-300">Corretor Yuri Imóveis</span>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-6 uppercase tracking-tight">
              Encontre o<br />Imóvel <span className="text-primary">Ideal</span>
            </h1>
            <p className="text-gray-300 text-base leading-relaxed max-w-lg">
              Especialistas em imóveis residenciais e comerciais em Osasco e região. Realizamos o sonho da casa própria há mais de 10 anos.
            </p>
          </div>
          <div className="max-w-2xl">
            <SearchBar />
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2">
          <span className="text-gray-300 text-xs uppercase tracking-widest">Rolar</span>
          <div className="w-px h-10 bg-gradient-to-b from-gray-300 to-transparent" />
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-12 reveal">
            <div>
              <span className="section-label">Selecionados</span>
              <h2 className="section-title">Imóveis em Destaque</h2>
            </div>
            <Link href="/imoveis" className="hidden md:flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-dark hover:text-primary transition-colors">
              Ver todos <FiArrowRight size={14} />
            </Link>
          </div>
          {featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredProperties.map((property, i) => (
                <div key={property.id} className="reveal" style={{ transitionDelay: `${(i % 3) * 0.08}s` }}>
                  <PropertyCard imovel={property} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-16">Nenhum imóvel em destaque.</p>
          )}
          <div className="text-center mt-10">
            <Link href="/imoveis" className="btn-outline inline-flex items-center gap-2">
              Ver todos os imóveis <FiArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary">
        <div className="container mx-auto px-6 text-center reveal">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase leading-tight mb-4">
            Pronto para encontrar<br />seu imóvel?
          </h2>
          <p className="text-white/90 text-sm mb-10 max-w-lg mx-auto">
            Fale com nossa equipe agora mesmo e dê o primeiro passo para realizar o sonho do imóvel perfeito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={PHONE_WA} target="_blank" rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold uppercase tracking-widest text-xs py-4 px-8 hover:bg-gray-100 transition-colors">
              <FaWhatsapp size={16} /> Falar pelo WhatsApp
            </a>
            <Link href="/imoveis"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-bold uppercase tracking-widest text-xs py-4 px-8 hover:bg-white/10 transition-colors">
              Ver imóveis <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
