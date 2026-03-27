import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Thumbs } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'
import {
  FiMaximize, FiMapPin, FiPhone, FiArrowLeft,
  FiCheckCircle, FiCalendar, FiHome, FiTool, FiFileText,
  FiShare2, FiLink, FiCheck
} from 'react-icons/fi'
import { FaCar, FaBath, FaWhatsapp } from 'react-icons/fa'
import { LuBed } from 'react-icons/lu'
import axios from 'axios'
import SEOHead from '../components/SEOHead'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const PLACEHOLDER = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80'

const TABS = [
  { id: 'visao-geral', label: 'Visão Geral' },
  { id: 'galeria', label: 'Galeria' },
  { id: 'localizacao', label: 'Localização' },
  { id: 'contato', label: 'Contato' },
]

function formatPrice(price, tipo) {
  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(price)
  return tipo === 'aluguel' ? `${formatted}/mês` : formatted
}

function calcParcela(preco) {
  const financiado = preco * 0.8
  const taxa = preco < 264000 ? 0.055 : 0.0816
  const r = taxa / 12
  const n = 360
  const parcela = financiado * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(parcela)
}

export default function ImovelDetalhe() {
  const { id } = useParams()
  const [imovel, setImovel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const [shareOpen, setShareOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('visao-geral')
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    axios.get(`${API_URL}/api/imoveis/${id}`)
      .then(res => setImovel(res.data))
      .catch(() => setImovel(null))
      .finally(() => setLoading(false))
  }, [id])

  // Intersection observer para destacar tab ativa ao rolar
  useEffect(() => {
    const observers = []
    TABS.forEach(tab => {
      const el = document.getElementById(tab.id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveTab(tab.id) },
        { rootMargin: '-40% 0px -55% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [imovel])

  // Fechar lightbox com ESC
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') setLightbox(null)
      if (lightbox !== null) {
        if (e.key === 'ArrowRight') setLightbox(i => (i + 1) % images.length)
        if (e.key === 'ArrowLeft') setLightbox(i => (i - 1 + images.length) % images.length)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setActiveTab(id)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary" />
      </div>
    )
  }

  if (!imovel) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold uppercase">Imóvel não encontrado</h2>
        <Link to="/imoveis" className="btn-primary">Ver todos os imóveis</Link>
      </div>
    )
  }

  const images = imovel.imagens?.length > 0 ? imovel.imagens : [PLACEHOLDER]
  const whatsMsg = encodeURIComponent(`Olá! Tenho interesse no imóvel: ${imovel.titulo} — Código #${imovel.id}`)
  const pageUrl = `https://yuriimoveis.com.br/imoveis/${imovel.id}`
  const shareUrl = `${import.meta.env.VITE_API_URL || 'https://yuriimoveis-backend.onrender.com'}/share/${imovel.id}`
  const imovelDescription = imovel.descricao
    ? imovel.descricao.slice(0, 155).replace(/\n/g, ' ')
    : `${imovel.titulo} em ${imovel.cidade || 'Osasco'}, SP. ${imovel.tipo === 'aluguel' ? 'Aluguel' : 'Venda'}.`

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: imovel.titulo, text: imovelDescription, url: shareUrl })
    } else {
      setShareOpen(prev => !prev)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(true)
      setTimeout(() => { setCopied(false); setShareOpen(false) }, 2000)
    })
  }

  return (
    <div className="min-h-screen bg-[#f4f4f4] pb-20 md:pb-0">
      <SEOHead
        title={imovel.titulo}
        description={imovelDescription}
        image={images[0] !== PLACEHOLDER ? images[0] : undefined}
        url={`/imoveis/${imovel.id}`}
        type="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'RealEstateListing',
          name: imovel.titulo,
          description: imovelDescription,
          image: images,
          url: `https://yuriimoveis.com.br/imoveis/${imovel.id}`,
          datePosted: imovel.created_at ? imovel.created_at.split('T')[0] : undefined,
          price: imovel.preco ? String(imovel.preco) : undefined,
          priceCurrency: 'BRL',
          address: {
            '@type': 'PostalAddress',
            addressLocality: imovel.cidade || 'Osasco',
            addressRegion: imovel.estado || 'SP',
            addressCountry: 'BR',
          },
          numberOfRooms: imovel.quartos || undefined,
          floorSize: imovel.area ? { '@type': 'QuantitativeValue', value: imovel.area, unitCode: 'MTK' } : undefined,
          offers: {
            '@type': 'Offer',
            price: imovel.preco,
            priceCurrency: 'BRL',
            availability: 'https://schema.org/InStock',
            seller: {
              '@type': 'RealEstateAgent',
              name: 'Corretor Yuri Imóveis',
              telephone: '+55-11-96714-7840',
              url: 'https://yuriimoveis.com.br',
            },
          },
        }}
      />

      {/* ── HERO ── */}
      <div className="relative bg-[#1a1a1a]" style={{ height: '70vh', minHeight: 420 }}>
        <Swiper
          modules={[Navigation, Pagination, Thumbs]}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          navigation
          pagination={{ clickable: true, dynamicBullets: true }}
          onSlideChange={swiper => setActiveImg(swiper.activeIndex)}
          speed={600}
          className="hero-swiper w-full h-full"
        >
          {images.map((img, i) => (
            <SwiperSlide key={i}>
              <img
                src={img}
                alt={imovel.titulo}
                className="w-full h-full object-cover opacity-75"
                onError={e => { e.target.src = PLACEHOLDER }}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Gradient vertical + vinhetas laterais */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none z-20" />
        <div className="absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-black/50 to-transparent pointer-events-none z-20" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-black/50 to-transparent pointer-events-none z-20" />

        {/* Badge tipo */}
        <div className="absolute top-8 left-8 z-30">
          <span className={`text-[10px] uppercase tracking-[0.2em] font-bold px-4 py-2 text-white ${
            imovel.tipo === 'venda' ? 'bg-[#af1e23]' : 'bg-[#1a1a1a]'
          }`}>
            {imovel.tipo === 'venda' ? 'Venda' : 'Aluguel'}
          </span>
        </div>

        {/* Botão compartilhar */}
        <div className="absolute top-8 right-8 z-30">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-bold transition-colors"
          >
            <FiShare2 size={13} /> Compartilhar
          </button>
          {shareOpen && (
            <div className="absolute right-0 top-full mt-2 bg-[#1a1a1a] border border-white/10 min-w-[180px] shadow-xl">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${imovel.titulo}\n${shareUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShareOpen(false)}
                className="flex items-center gap-3 px-5 py-3.5 text-[11px] uppercase tracking-widest font-bold text-white hover:bg-white/10 transition-colors border-b border-white/10"
              >
                <FaWhatsapp size={14} className="text-green-400" /> WhatsApp
              </a>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-3 px-5 py-3.5 text-[11px] uppercase tracking-widest font-bold text-white hover:bg-white/10 transition-colors w-full text-left"
              >
                {copied ? <FiCheck size={14} className="text-green-400" /> : <FiLink size={14} />}
                {copied ? 'Copiado!' : 'Copiar link'}
              </button>
            </div>
          )}
        </div>

        {/* Título + local */}
        <div className="absolute bottom-0 left-0 right-0 px-8 pb-10 md:px-14 z-30 pointer-events-none">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              {imovel.status && (
                <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 text-white ${
                  imovel.status === 'planta' ? 'bg-blue-600'
                  : imovel.status === 'construcao' ? 'bg-amber-500'
                  : 'bg-green-600'
                }`}>
                  {imovel.status === 'planta' ? 'Na Planta'
                  : imovel.status === 'construcao' ? 'Em Construção'
                  : 'Pronto para Morar'}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white uppercase leading-tight mb-3">
              {imovel.titulo}
            </h1>
            <p className="flex items-center gap-2 text-gray-300 text-sm">
              <FiMapPin size={13} className="text-[#af1e23]" />
              {imovel.bairro}, {imovel.cidade} — SP
            </p>
          </div>
        </div>
      </div>

      {/* ── THUMBNAILS ── */}
      {images.length > 1 && (
        <div className="bg-[#111] border-t border-white/10 py-4">
          <div className="max-w-6xl mx-auto px-8">
            <Swiper
              modules={[Thumbs]}
              onSwiper={setThumbsSwiper}
              slidesPerView="auto"
              spaceBetween={10}
              watchSlidesProgress
              className="thumbs-swiper"
            >
              {images.map((img, i) => (
                <SwiperSlide key={i} style={{ width: 80, height: 54 }}>
                  <img
                    src={img}
                    alt={`${imovel.titulo} – foto ${i + 1} de ${images.length}`}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.src = PLACEHOLDER }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}

      {/* ── TABS ÂNCORA ── */}
      <div className="bg-[#1a1a1a] sticky top-16 md:top-20 z-30 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-8 flex overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => scrollToSection(tab.id)}
              className={`py-4 px-6 text-[10px] uppercase tracking-[0.2em] font-bold whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-[#af1e23] text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── VISÃO GERAL + SIDEBAR ── */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
        <Link to="/imoveis"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-gray-500 hover:text-[#af1e23] transition-colors mb-8">
          <FiArrowLeft size={13} /> Voltar aos imóveis
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Visão Geral */}
          <div className="lg:col-span-2">
            <section id="visao-geral">
              <span className="section-label">Visão Geral</span>
              <h2 className="section-title mb-2">{imovel.subtitulo || 'Conheça este imóvel'}</h2>
              <p className="text-gray-500 text-sm mb-3">{imovel.cidade} — {imovel.bairro}</p>
              {imovel.status && (
                <div className={`inline-flex items-center gap-2 px-4 py-2 mb-8 font-bold text-xs uppercase tracking-[0.15em] ${
                  imovel.status === 'pronto' ? 'bg-green-50 text-green-700 border border-green-200'
                  : imovel.status === 'construcao' ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {imovel.status === 'pronto'
                    ? <FiHome size={14} />
                    : imovel.status === 'construcao'
                    ? <FiTool size={14} />
                    : <FiFileText size={14} />
                  }
                  {imovel.status === 'pronto' ? 'Pronto para Morar'
                  : imovel.status === 'construcao' ? 'Em Construção'
                  : 'Na Planta'}
                </div>
              )}

              {/* Destaques */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-0 bg-white border border-gray-200 mb-8">
                {imovel.quartos > 0 && (
                  <div className="flex flex-col items-center justify-center py-7 px-4 border-r border-gray-200 text-center">
                    <LuBed className="text-[#af1e23] mb-3" size={26} />
                    <span className="font-black text-[#1a1a1a] text-2xl leading-none">{imovel.quartos}</span>
                    <span className="text-[10px] uppercase tracking-[0.15em] text-gray-400 mt-1.5">{imovel.quartos === 1 ? 'Quarto' : 'Quartos'}</span>
                  </div>
                )}
                {imovel.banheiros > 0 && (
                  <div className="flex flex-col items-center justify-center py-7 px-4 border-r border-gray-200 text-center">
                    <FaBath className="text-[#af1e23] mb-3" size={24} />
                    <span className="font-black text-[#1a1a1a] text-2xl leading-none">{imovel.banheiros}</span>
                    <span className="text-[10px] uppercase tracking-[0.15em] text-gray-400 mt-1.5">{imovel.banheiros === 1 ? 'Banheiro' : 'Banheiros'}</span>
                  </div>
                )}
                {imovel.vagas > 0 && (
                  <div className="flex flex-col items-center justify-center py-7 px-4 border-r border-gray-200 text-center">
                    <FaCar className="text-[#af1e23] mb-3" size={24} />
                    <span className="font-black text-[#1a1a1a] text-2xl leading-none">{imovel.vagas}</span>
                    <span className="text-[10px] uppercase tracking-[0.15em] text-gray-400 mt-1.5">{imovel.vagas === 1 ? 'Vaga' : 'Vagas'}</span>
                  </div>
                )}
                {imovel.area > 0 && (
                  <div className="flex flex-col items-center justify-center py-7 px-4 text-center">
                    <FiMaximize className="text-[#af1e23] mb-3" size={24} />
                    <span className="font-black text-[#1a1a1a] text-2xl leading-none">{imovel.area}</span>
                    <span className="text-[10px] uppercase tracking-[0.15em] text-gray-400 mt-1.5">m²</span>
                  </div>
                )}
              </div>

              {/* Descrição */}
              {imovel.descricao && (
                <div className="bg-white border border-gray-200 p-8 mb-6">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1a1a] mb-4">Descrição</h3>
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{imovel.descricao}</p>
                </div>
              )}

              {/* Diferenciais */}
              {imovel.diferenciais?.length > 0 && (
                <div className="bg-white border border-gray-200 p-8">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1a1a] mb-5">Diferenciais</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {imovel.diferenciais.map(d => (
                      <div key={d} className="flex items-center gap-2.5 text-sm text-gray-600">
                        <FiCheckCircle className="text-[#af1e23] flex-shrink-0" size={15} />
                        {d}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* ── SIDEBAR ── */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 sticky top-36">
              <div className="bg-[#1a1a1a] p-7">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">Código #{imovel.id}</p>
                <p className="text-3xl font-black text-[#af1e23] leading-tight">{formatPrice(imovel.preco, imovel.tipo)}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">
                  {imovel.tipo === 'venda' ? 'Valor de venda' : 'Valor mensal'}
                </p>
                {imovel.tipo === 'venda' && (
                  <p className="text-[11px] text-green-400 mt-3 font-semibold">
                    Parcelas a partir de {imovel.parcela_display || calcParcela(imovel.preco)}/mês
                    {imovel.parcela_display && <span className="text-gray-500 text-[9px] font-normal ml-1">Período Obras</span>}
                  </p>
                )}
              </div>
              <div className="p-7 space-y-3">
                <a href={`https://wa.me/5511967147840?text=${encodeURIComponent(`Olá! Gostaria de fazer uma simulação de financiamento para o imóvel: ${imovel.titulo} — Código #${imovel.id}`)}`}
                  target="_blank" rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-[0.15em] text-[10px] py-4 transition-colors">
                  <FaWhatsapp size={16} /> Faça Sua Simulação
                </a>
                <button onClick={() => scrollToSection('contato')}
                  className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:border-[#af1e23] hover:text-[#af1e23] text-[#1a1a1a] font-bold uppercase tracking-[0.15em] text-[10px] py-4 transition-colors">
                  <FiCalendar size={14} /> Agendar Visita
                </button>
              </div>
              <div className="border-t border-gray-100 px-7 pb-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 py-5">Informações</p>
                <div className="space-y-3">
                  {[
                    { l: 'Tipo', v: imovel.tipo },
                    { l: 'Categoria', v: imovel.categoria },
                    { l: 'Cidade', v: imovel.cidade },
                    { l: 'Bairro', v: imovel.bairro },
                    ...(imovel.area_display || imovel.area > 0 ? [{ l: 'Área', v: imovel.area_display || `${imovel.area} m²` }] : []),
                    ...(imovel.quartos > 0 ? [{ l: 'Quartos', v: imovel.quartos }] : []),
                    ...(imovel.vagas_display ? [{ l: 'Vagas', v: imovel.vagas_display }] : imovel.vagas > 0 ? [{ l: 'Vagas', v: imovel.vagas }] : []),
                  ].map(item => (
                    <div key={item.l} className="flex justify-between text-xs">
                      <span className="text-gray-400 capitalize">{item.l}</span>
                      <span className="font-semibold text-[#1a1a1a] capitalize">{item.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── GALERIA FULL WIDTH ── */}
      <section id="galeria" className="py-14 bg-[#1a1a1a]">
        <div className="max-w-6xl mx-auto px-4 md:px-8 mb-8">
          <span className="section-label">Galeria</span>
          <h2 className="section-title text-white">Fotos do Imóvel</h2>
        </div>

        <Swiper
          modules={[Navigation]}
          navigation
          slidesPerView={1.15}
          spaceBetween={4}
          breakpoints={{
            640: { slidesPerView: 2.1 },
            1024: { slidesPerView: 3, spaceBetween: 4 },
          }}
          className="gallery-swiper px-4 md:px-10"
        >
          {images.map((img, i) => (
            <SwiperSlide key={i}>
              <div className="overflow-hidden cursor-pointer" onClick={() => setLightbox(i)}>
                <img
                  src={img}
                  alt={`${imovel.titulo} em ${imovel.cidade || 'Osasco'} – foto ${i + 1} de ${images.length}`}
                  className="perspectivas-img w-full object-cover block transition-opacity duration-300 hover:opacity-70"
                  style={{ height: '420px' }}
                  onError={e => { e.target.src = PLACEHOLDER }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* ── LOCALIZAÇÃO + CONTATO ── */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-14 space-y-14">

        <section id="localizacao">
          <span className="section-label">Localização</span>
          <h2 className="section-title mb-8">Onde fica</h2>
          <div className="bg-white border border-gray-200 p-6 mb-4">
            <p className="flex items-start gap-2.5 text-sm text-gray-600">
              <FiMapPin size={16} className="text-[#af1e23] flex-shrink-0 mt-0.5" />
              <span>
                <strong>{imovel.bairro}</strong>, {imovel.cidade} — SP
              </span>
            </p>
          </div>
          <div className="bg-[#1a1a1a] flex items-center justify-center" style={{ height: 300 }}>
            <div className="text-center">
              <FiMapPin size={40} className="mx-auto mb-3 text-[#af1e23]" />
              <p className="text-white font-bold uppercase tracking-widest text-sm">{imovel.cidade} — SP</p>
              <p className="text-gray-400 text-xs mt-1 uppercase tracking-wider">{imovel.bairro}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${imovel.bairro}, ${imovel.cidade}, SP`)}`}
                target="_blank" rel="noreferrer"
                className="mt-5 inline-block text-[10px] uppercase tracking-widest font-bold text-[#af1e23] border border-[#af1e23] px-5 py-2 hover:bg-[#af1e23] hover:text-white transition-colors">
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
            <a href={`https://wa.me/5511967147840?text=${whatsMsg}`}
              target="_blank" rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-[0.15em] text-sm py-6 transition-colors">
              <FaWhatsapp size={22} /> WhatsApp
            </a>
            <a href="tel:5511967147840"
              className="flex-1 flex items-center justify-center gap-3 bg-[#1a1a1a] hover:bg-[#af1e23] text-white font-bold uppercase tracking-[0.15em] text-sm py-6 transition-colors">
              <FiPhone size={20} /> (11) 96714-7840
            </a>
          </div>
        </section>

      </div>

      {/* ── BARRA FLUTUANTE MOBILE ── */}
      <div className="fixed bottom-14 left-0 right-0 md:hidden z-40 grid grid-cols-3">
        <a href={`https://wa.me/5511967147840?text=${whatsMsg}`}
          target="_blank" rel="noreferrer"
          className="flex flex-col items-center justify-center gap-1 bg-green-500 text-white py-3">
          <FaWhatsapp size={18} />
          <span className="text-[9px] uppercase tracking-widest font-bold">WhatsApp</span>
        </a>
        <a href="tel:5511967147840"
          className="flex flex-col items-center justify-center gap-1 bg-[#af1e23] text-white py-3">
          <FiPhone size={18} />
          <span className="text-[9px] uppercase tracking-widest font-bold">Ligar</span>
        </a>
        <button onClick={() => scrollToSection('contato')}
          className="flex flex-col items-center justify-center gap-1 bg-[#1a1a1a] text-white py-3">
          <FiCalendar size={18} />
          <span className="text-[9px] uppercase tracking-widest font-bold">Visita</span>
        </button>
      </div>

      {/* ── LIGHTBOX ── */}
      {lightbox !== null && (
        <div className="fixed inset-0 bg-black/95 z-50"
          onTouchStart={e => { e.currentTarget._touchX = e.touches[0].clientX }}
          onTouchEnd={e => {
            const dx = e.changedTouches[0].clientX - e.currentTarget._touchX
            if (Math.abs(dx) > 50) {
              if (dx < 0) setLightbox(i => (i + 1) % images.length)
              else setLightbox(i => (i - 1 + images.length) % images.length)
            }
          }}
        >
          {/* X */}
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-5 z-10 text-white text-4xl font-light w-12 h-12 flex items-center justify-center hover:text-[#af1e23] transition-colors">
            ×
          </button>

          {/* Setas */}
          {images.length > 1 && (
            <>
              <button onClick={() => setLightbox(i => (i - 1 + images.length) % images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center bg-black/60 border border-white/20 text-white text-2xl hover:bg-[#af1e23] transition-colors">
                ‹
              </button>
              <button onClick={() => setLightbox(i => (i + 1) % images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center bg-black/60 border border-white/20 text-white text-2xl hover:bg-[#af1e23] transition-colors">
                ›
              </button>
            </>
          )}

          {/* Imagem */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative border-2 border-white/30 shadow-[0_0_120px_20px_rgba(0,0,0,0.95),0_0_40px_rgba(175,30,35,0.15)]">
              <img
                src={images[lightbox]}
                alt={`${imovel.titulo} em ${imovel.cidade || 'Osasco'} – foto ${lightbox + 1} de ${images.length}`}
                className="max-h-[82vh] max-w-[88vw] object-contain block"
                onError={e => { e.target.src = PLACEHOLDER }}
              />
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#af1e23]" />
              <p className="absolute bottom-3 right-4 text-white/50 text-[10px] uppercase tracking-widest">
                {lightbox + 1} / {images.length}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
