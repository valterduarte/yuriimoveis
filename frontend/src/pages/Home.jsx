import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiArrowUpRight } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import SearchBar from '../components/SearchBar'
import SEOHead from '../components/SEOHead'
import PropertyCard from '../components/PropertyCard'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'



export default function Home() {
  const [destaques, setDestaques] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API_URL}/api/imoveis?destaque=1&limit=6`)
      .then(res => setDestaques(res.data.imoveis || []))
      .catch(() => setDestaques([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="pb-16 md:pb-0">
      <SEOHead
        title="Corretor Yuri Imóveis — Imóveis em Osasco e Região"
        description="Corretor de imóveis em Osasco com mais de 10 anos de experiência. Casas, apartamentos, terrenos e comerciais para venda e aluguel. Atendimento personalizado."
        url="/"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Corretor Yuri Imóveis',
            url: 'https://yuriimoveis.com.br',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://yuriimoveis.com.br/imoveis?busca={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': ['LocalBusiness', 'RealEstateAgent'],
            name: 'Corretor Yuri Imóveis',
            description: 'Especialistas em imóveis residenciais e comerciais em Osasco e região. Mais de 10 anos de experiência, atendimento personalizado e segurança jurídica.',
            url: 'https://yuriimoveis.com.br',
            telephone: '+55-11-96714-7840',
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
            sameAs: ['https://wa.me/5511967147840'],
          },
        ]}
      />

      {/* HERO */}
      <section
        className="relative min-h-screen flex items-center -mt-16 md:-mt-20"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-dark/75" />
        <div className="relative container mx-auto px-6 pt-32 pb-24">
          <div className="max-w-2xl mb-12">
            <span className="section-label">Corretor Yuri Imóveis</span>
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
          <span className="text-gray-400 text-[10px] uppercase tracking-widest">Rolar</span>
          <div className="w-px h-10 bg-gradient-to-b from-gray-400 to-transparent" />
        </div>
      </section>


      {/* DESTAQUES */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-12 reveal">
            <div>
              <span className="section-label">Selecionados</span>
              <h2 className="section-title">Imóveis em Destaque</h2>
            </div>
            <Link to="/imoveis" className="hidden md:flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-dark hover:text-primary transition-colors">
              Ver todos <FiArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => <div key={i} className="bg-gray-100 h-80 animate-pulse" />)}
            </div>
          ) : destaques.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {destaques.map((imovel, i) => (
                <div key={imovel.id} className="reveal" style={{ transitionDelay: `${(i % 3) * 0.08}s` }}>
                  <PropertyCard imovel={imovel} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-16">Nenhum imóvel em destaque.</p>
          )}
          <div className="text-center mt-10">
            <Link to="/imoveis" className="btn-outline inline-flex items-center gap-2">
              Ver todos os imóveis <FiArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>


{/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-6 text-center reveal">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase leading-tight mb-4">
            Pronto para encontrar<br />seu imóvel?
          </h2>
          <p className="text-white/70 text-sm mb-10 max-w-lg mx-auto">
            Fale com nossa equipe agora mesmo e dê o primeiro passo para realizar o sonho do imóvel perfeito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/5511967147840" target="_blank" rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold uppercase tracking-widest text-xs py-4 px-8 hover:bg-gray-100 transition-colors">
              <FaWhatsapp size={16} /> Falar pelo WhatsApp
            </a>
            <Link to="/imoveis"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-bold uppercase tracking-widest text-xs py-4 px-8 hover:bg-white/10 transition-colors">
              Ver imóveis <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
