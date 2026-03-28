import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import PropertyCard from '../components/PropertyCard'
import SkeletonCard from '../components/SkeletonCard'
import SEOHead from '../components/SEOHead'
import axios from 'axios'
import { API_URL, PHONE_WA, SITE_URL } from '../config'
import { FaWhatsapp } from 'react-icons/fa'
import { FiArrowLeft } from 'react-icons/fi'

function unslugify(slug) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export default function BairroPage() {
  const { slug } = useParams()
  const bairroNome = unslugify(slug)

  const [imoveis, setImoveis] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    axios.get(`${API_URL}/api/imoveis?bairro=${encodeURIComponent(bairroNome)}&limit=50`, { signal: controller.signal })
      .then(res => {
        const list = res.data.imoveis || []
        setImoveis(list)
        setTotal(res.data.total || 0)
        if (list.length === 0) setNotFound(true)
      })
      .catch(err => { if (!axios.isCancel(err)) setNotFound(true) })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [bairroNome])

  const pageUrl = `/imoveis/${slug}`

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={`Imóveis em ${bairroNome}, Osasco SP`}
        description={`Veja todos os imóveis disponíveis no ${bairroNome} em Osasco, SP. Casas, apartamentos e terrenos à venda e para alugar. Atendimento com o Corretor Yuri.`}
        url={pageUrl}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE_URL}/` },
              { '@type': 'ListItem', position: 2, name: 'Imóveis', item: `${SITE_URL}/imoveis` },
              { '@type': 'ListItem', position: 3, name: bairroNome, item: `${SITE_URL}${pageUrl}` },
            ],
          },
          !notFound && {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: `Imóveis em ${bairroNome}, Osasco SP`,
            url: `${SITE_URL}${pageUrl}`,
            numberOfItems: total,
            description: `Imóveis disponíveis no bairro ${bairroNome} em Osasco, SP.`,
            itemListElement: imoveis.map((im, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `${SITE_URL}/imoveis/${im.titulo?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${im.id}`,
              name: im.titulo,
            })),
          },
        ].filter(Boolean)}
      />

      {/* Header */}
      <div className="bg-dark text-white py-12">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Início</Link>
            <span>/</span>
            <Link to="/imoveis" className="hover:text-white transition-colors">Imóveis</Link>
            <span>/</span>
            <span className="text-white">{bairroNome}</span>
          </nav>
          <span className="section-label">Bairro</span>
          <h1 className="text-4xl font-black uppercase text-white">{bairroNome}</h1>
          {!loading && !notFound && (
            <p className="text-gray-400 text-sm mt-2">{total} imóvel{total !== 1 ? 'is' : ''} disponível{total !== 1 ? 'is' : ''} em Osasco, SP</p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="mb-6">
          <Link to="/imoveis" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-gray-500 hover:text-primary transition-colors">
            <FiArrowLeft size={13} /> Ver todos os bairros
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : notFound ? (
          <div className="text-center py-20 bg-white border border-gray-200 px-6">
            <div className="text-5xl mb-4" aria-hidden="true">🏠</div>
            <h2 className="text-lg font-bold text-dark mb-2 uppercase tracking-wide">Nenhum imóvel em {bairroNome}</h2>
            <p className="text-gray-500 text-sm mb-6">Ainda não temos imóveis cadastrados neste bairro. Fale com o corretor para mais opções.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/imoveis" className="btn-primary">Ver todos os imóveis</Link>
              <a href={`${PHONE_WA}?text=${encodeURIComponent(`Olá! Procuro imóveis no ${bairroNome} em Osasco. Pode me ajudar?`)}`}
                target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-widest text-xs py-3 px-6 transition-colors">
                <FaWhatsapp size={14} /> Falar com o Corretor
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {imoveis.map((imovel, i) => (
              <div key={imovel.id} className="reveal" style={{ transitionDelay: `${(i % 3) * 0.08}s` }}>
                <PropertyCard imovel={imovel} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
