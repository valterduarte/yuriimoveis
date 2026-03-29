import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'
import { FiMapPin, FiPhone, FiArrowLeft, FiCalendar } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import SEOHead from '../components/SEOHead'
import PropertyHero from '../components/property/PropertyHero'
import PropertyLightbox from '../components/property/PropertyLightbox'
import PropertySidebar from '../components/property/PropertySidebar'
import PropertyOverview from '../components/property/PropertyOverview'
import PropertyGallery from '../components/property/PropertyGallery'
import { imovelSlug } from '../utils/imovelUtils'
import { API_URL, PHONE_WA, PHONE_TEL, PHONE_DISPLAY, PHONE_STRUCTURED, SITE_URL } from '../config'
import { PLACEHOLDER_IMAGE } from '../constants'
import { useFetchImovel } from '../hooks/useFetchImovel'
import { useScrollSpy } from '../hooks/useScrollSpy'

const TABS = [
  { id: 'visao-geral', label: 'Visão Geral' },
  { id: 'galeria',     label: 'Galeria'     },
  { id: 'localizacao', label: 'Localização' },
  { id: 'contato',     label: 'Contato'     },
]

export default function ImovelDetalhe() {
  const { slug } = useParams()
  const propertyId = slug.split('-').pop()
  const { imovel, loading, fetchError } = useFetchImovel(propertyId)
  const { activeSection, setActiveSection } = useScrollSpy(TABS, imovel)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const scrollToSection = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setActiveSection(id)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary" />
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 text-center px-6">
        {fetchError === '404' ? (
          <>
            <h2 className="text-2xl font-bold uppercase">Imóvel não encontrado</h2>
            <p className="text-gray-500 text-sm">O imóvel que você procura não existe ou foi removido.</p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold uppercase">Erro ao carregar</h2>
            <p className="text-gray-500 text-sm">Não foi possível conectar ao servidor. Tente novamente em instantes.</p>
          </>
        )}
        <Link to="/imoveis" className="btn-primary">Ver todos os imóveis</Link>
      </div>
    )
  }

  const images = imovel.imagens?.length > 0 ? imovel.imagens : [PLACEHOLDER_IMAGE]
  const whatsappMessage = encodeURIComponent(`Olá! Tenho interesse no imóvel: ${imovel.titulo} — Código #${imovel.id}`)
  const shareUrl = `${API_URL}/share/${imovel.id}`
  const imovelDescription = imovel.descricao
    ? imovel.descricao.slice(0, 155).replace(/\n/g, ' ')
    : `${imovel.titulo} em ${imovel.cidade || 'Osasco'}, SP. ${imovel.tipo === 'aluguel' ? 'Aluguel' : 'Venda'}.`

  return (
    <div className="min-h-screen bg-[#f4f4f4] pb-20 md:pb-0">
      <SEOHead
        title={imovel.titulo}
        description={imovelDescription}
        image={images[0] !== PLACEHOLDER_IMAGE ? images[0] : undefined}
        url={`/imoveis/${imovelSlug(imovel)}`}
        type="article"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Início',  item: `${SITE_URL}/`        },
              { '@type': 'ListItem', position: 2, name: 'Imóveis', item: `${SITE_URL}/imoveis`  },
              { '@type': 'ListItem', position: 3, name: imovel.titulo, item: `${SITE_URL}/imoveis/${imovelSlug(imovel)}` },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: imovel.titulo,
            description: imovelDescription,
            image: images,
            url: `${SITE_URL}/imoveis/${imovelSlug(imovel)}`,
            offers: {
              '@type': 'Offer',
              price: imovel.preco,
              priceCurrency: 'BRL',
              availability: 'https://schema.org/InStock',
              url: `${SITE_URL}/imoveis/${imovelSlug(imovel)}`,
              seller: { '@type': 'RealEstateAgent', name: 'Corretor Yuri Imóveis', telephone: PHONE_STRUCTURED, url: SITE_URL },
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'RealEstateListing',
            name: imovel.titulo,
            description: imovelDescription,
            image: images,
            url: `${SITE_URL}/imoveis/${imovelSlug(imovel)}`,
            datePosted: imovel.created_at ? imovel.created_at.split('T')[0] : undefined,
            price: imovel.preco ? String(imovel.preco) : undefined,
            priceCurrency: 'BRL',
            address: {
              '@type': 'PostalAddress',
              streetAddress: imovel.endereco || undefined,
              addressLocality: imovel.cidade || 'Osasco',
              addressRegion: imovel.estado || 'SP',
              postalCode: imovel.cep || undefined,
              addressCountry: 'BR',
            },
            ...(imovel.lat && imovel.lng
              ? { geo: { '@type': 'GeoCoordinates', latitude: imovel.lat, longitude: imovel.lng } }
              : {}),
            numberOfRooms: imovel.quartos || undefined,
            floorSize: imovel.area
              ? { '@type': 'QuantitativeValue', value: imovel.area, unitCode: 'MTK' }
              : undefined,
            offers: {
              '@type': 'Offer',
              price: imovel.preco,
              priceCurrency: 'BRL',
              availability: 'https://schema.org/InStock',
              seller: { '@type': 'RealEstateAgent', name: 'Corretor Yuri Imóveis', telephone: PHONE_STRUCTURED, url: SITE_URL },
            },
          },
        ]}
      />

      <nav aria-label="Breadcrumb" className="sr-only">
        <Link to="/">Início</Link>
        <Link to="/imoveis">Imóveis</Link>
        <span>{imovel.titulo}</span>
      </nav>

      <PropertyHero imovel={imovel} images={images} shareUrl={shareUrl} />

      <div className="bg-[#1a1a1a] sticky top-16 md:top-20 z-30 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-8 flex overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => scrollToSection(tab.id)}
              aria-selected={activeSection === tab.id}
              aria-controls={tab.id}
              className={`py-4 px-6 text-[10px] uppercase tracking-[0.2em] font-bold whitespace-nowrap transition-all border-b-2 ${
                activeSection === tab.id
                  ? 'border-[#af1e23] text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
        <Link
          to="/imoveis"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-gray-500 hover:text-[#af1e23] transition-colors mb-8"
        >
          <FiArrowLeft size={13} /> Voltar aos imóveis
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PropertyOverview imovel={imovel} />
          </div>
          <div className="lg:col-span-1">
            <PropertySidebar imovel={imovel} onScheduleVisit={() => scrollToSection('contato')} />
          </div>
        </div>
      </div>

      <PropertyGallery imovel={imovel} images={images} onImageClick={setLightboxIndex} />

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-14 space-y-14">
        <section id="localizacao">
          <span className="section-label">Localização</span>
          <h2 className="section-title mb-8">Onde fica</h2>
          <div className="bg-white border border-gray-200 p-6 mb-4">
            <p className="flex items-start gap-2.5 text-sm text-gray-600">
              <FiMapPin size={16} className="text-[#af1e23] flex-shrink-0 mt-0.5" />
              <span><strong>{imovel.bairro}</strong>, {imovel.cidade} — SP</span>
            </p>
          </div>
          <div className="bg-[#1a1a1a] flex items-center justify-center" style={{ height: 300 }}>
            <div className="text-center">
              <FiMapPin size={40} className="mx-auto mb-3 text-[#af1e23]" />
              <p className="text-white font-bold uppercase tracking-widest text-sm">{imovel.cidade} — SP</p>
              <p className="text-gray-400 text-xs mt-1 uppercase tracking-wider">{imovel.bairro}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${imovel.bairro}, ${imovel.cidade}, SP`)}`}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-block text-[10px] uppercase tracking-widest font-bold text-[#af1e23] border border-[#af1e23] px-5 py-2 hover:bg-[#af1e23] hover:text-white transition-colors"
              >
                Ver no Google Maps
              </a>
            </div>
          </div>
        </section>

        <section id="contato">
          <span className="section-label">Contato</span>
          <h2 className="section-title mb-2">Desejo saber mais</h2>
          <p className="text-gray-500 text-sm mb-8">Fale agora com o corretor e descubra como sair do aluguel ainda este ano.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={`${PHONE_WA}?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-[0.15em] text-sm py-6 transition-colors"
            >
              <FaWhatsapp size={22} /> WhatsApp
            </a>
            <a
              href={PHONE_TEL}
              className="flex-1 flex items-center justify-center gap-3 bg-[#1a1a1a] hover:bg-[#af1e23] text-white font-bold uppercase tracking-[0.15em] text-sm py-6 transition-colors"
            >
              <FiPhone size={20} /> {PHONE_DISPLAY}
            </a>
          </div>
        </section>
      </div>

      <nav className="fixed bottom-14 left-0 right-0 md:hidden z-40 grid grid-cols-3" aria-label="Contato rápido">
        <a
          href={`${PHONE_WA}?text=${whatsappMessage}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Contato via WhatsApp"
          className="flex flex-col items-center justify-center gap-1 bg-green-500 text-white py-3"
        >
          <FaWhatsapp size={18} />
          <span className="text-[9px] uppercase tracking-widest font-bold">WhatsApp</span>
        </a>
        <a
          href={PHONE_TEL}
          aria-label={`Ligar para ${PHONE_DISPLAY}`}
          className="flex flex-col items-center justify-center gap-1 bg-[#af1e23] text-white py-3"
        >
          <FiPhone size={18} />
          <span className="text-[9px] uppercase tracking-widest font-bold">Ligar</span>
        </a>
        <button
          onClick={() => scrollToSection('contato')}
          className="flex flex-col items-center justify-center gap-1 bg-[#1a1a1a] text-white py-3"
        >
          <FiCalendar size={18} />
          <span className="text-[9px] uppercase tracking-widest font-bold">Visita</span>
        </button>
      </nav>

      {lightboxIndex !== null && (
        <PropertyLightbox
          images={images}
          activeIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() => setLightboxIndex(i => (i + 1) % images.length)}
          onPrev={() => setLightboxIndex(i => (i - 1 + images.length) % images.length)}
        />
      )}
    </div>
  )
}
