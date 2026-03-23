import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiArrowUpRight } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import SearchBar from '../components/SearchBar'
import PropertyCard from '../components/PropertyCard'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const categorias = [
  { label: 'Casas', slug: 'casa', count: '120+' },
  { label: 'Apartamentos', slug: 'apartamento', count: '80+' },
  { label: 'Terrenos', slug: 'terreno', count: '60+' },
  { label: 'Chalés', slug: 'chale', count: '40+' },
  { label: 'Comercial', slug: 'comercial', count: '30+' },
  { label: 'Chácaras', slug: 'chacara', count: '25+' },
]

const diferenciais = [
  { num: '01', title: 'Atendimento Personalizado', desc: 'Cada cliente recebe atenção exclusiva e dedicada às suas necessidades específicas.' },
  { num: '02', title: 'Segurança Jurídica', desc: 'Todos os processos conduzidos com total transparência e segurança jurídica.' },
  { num: '03', title: 'Experiência Regional', desc: 'Mais de 10 anos no mercado de Osasco e região com profundo conhecimento local.' },
  { num: '04', title: 'Portfólio Exclusivo', desc: 'Acesso a imóveis exclusivos e oportunidades únicas na região.' },
]

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
          <div className="flex flex-wrap gap-10 mt-12">
            {[
              { value: '10+', label: 'Anos de mercado' },
              { value: '500+', label: 'Imóveis vendidos' },
              { value: '1000+', label: 'Famílias atendidas' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-4xl font-black text-white leading-none">{s.value}</p>
                <p className="text-gray-400 text-xs uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2">
          <span className="text-gray-400 text-[10px] uppercase tracking-widest">Rolar</span>
          <div className="w-px h-10 bg-gradient-to-b from-gray-400 to-transparent" />
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="section-label">Explore</span>
              <h2 className="section-title">Tipos de Imóveis</h2>
            </div>
            <Link to="/imoveis" className="hidden md:flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-dark hover:text-primary transition-colors">
              Ver todos <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border border-gray-300">
            {categorias.map((cat) => (
              <Link
                key={cat.slug}
                to={`/imoveis?categoria=${cat.slug}`}
                className="group flex flex-col items-center justify-center p-8 border-r border-b border-gray-300 last:border-r-0 hover:bg-primary transition-all duration-300"
              >
                <p className="text-2xl font-black text-primary group-hover:text-white transition-colors">{cat.count}</p>
                <p className="text-xs uppercase tracking-widest font-semibold text-dark group-hover:text-white transition-colors mt-1">{cat.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* DESTAQUES */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
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
              {destaques.map(imovel => <PropertyCard key={imovel.id} imovel={imovel} />)}
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

      {/* DIFERENCIAIS */}
      <section className="py-20 bg-dark text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="section-label">Por que nos escolher</span>
              <h2 className="text-4xl font-black text-white uppercase leading-tight mb-6">
                Nossos<br />Diferenciais
              </h2>
              <p className="text-gray-400 leading-relaxed mb-8 text-sm">
                Somos referência no mercado imobiliário de Osasco e região com atendimento personalizado, transparência e segurança em cada negócio.
              </p>
              <Link to="/quem-somos" className="btn-primary inline-flex items-center gap-2">
                Conheça nossa equipe <FiArrowRight size={14} />
              </Link>
            </div>
            <div className="border border-gray-700">
              {diferenciais.map((d, i) => (
                <div key={d.num}
                  className={`p-6 flex gap-5 items-start hover:bg-gray-800 transition-colors ${i < diferenciais.length - 1 ? 'border-b border-gray-700' : ''}`}>
                  <span className="text-primary font-black text-2xl flex-shrink-0 w-10">{d.num}</span>
                  <div>
                    <h3 className="font-bold text-white text-sm uppercase tracking-wide mb-1">{d.title}</h3>
                    <p className="text-gray-400 text-xs leading-relaxed">{d.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

{/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-6 text-center">
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
