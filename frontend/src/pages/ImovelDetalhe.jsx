import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  FiMaximize, FiMapPin, FiPhone, FiArrowLeft,
  FiCheckCircle, FiMail, FiCalendar, FiChevronLeft, FiChevronRight
} from 'react-icons/fi'
import { FaCar, FaBath, FaWhatsapp } from 'react-icons/fa'
import { LuBed } from 'react-icons/lu'
import axios from 'axios'

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

export default function ImovelDetalhe() {
  const { id } = useParams()
  const [imovel, setImovel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [activeTab, setActiveTab] = useState('visao-geral')
  const [lightbox, setLightbox] = useState(null) // index or null
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', mensagem: '' })
  const [formStatus, setFormStatus] = useState(null) // 'ok' | 'erro'
  const [sending, setSending] = useState(false)

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

  const handleFormChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleFormSubmit = async e => {
    e.preventDefault()
    setSending(true)
    try {
      await axios.post(`${API_URL}/api/contatos`, { ...form, imovel_id: id })
      setFormStatus('ok')
      setForm({ nome: '', email: '', telefone: '', mensagem: '' })
    } catch {
      setFormStatus('erro')
    } finally {
      setSending(false)
    }
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

  return (
    <div className="min-h-screen bg-[#f4f4f4] pb-20 md:pb-0">

      {/* ── HERO ── */}
      <div className="relative bg-[#1a1a1a]" style={{ height: '70vh', minHeight: 420 }}>
        <img
          src={images[activeImg]}
          alt={imovel.titulo}
          className="w-full h-full object-cover opacity-75 transition-all duration-500"
          onError={e => { e.target.src = PLACEHOLDER }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        {/* Badge tipo */}
        <div className="absolute top-8 left-8">
          <span className={`text-[10px] uppercase tracking-[0.2em] font-bold px-4 py-2 text-white ${
            imovel.tipo === 'venda' ? 'bg-[#af1e23]' : 'bg-[#1a1a1a]'
          }`}>
            {imovel.tipo === 'venda' ? 'Venda' : 'Aluguel'}
          </span>
        </div>

        {/* Título + local */}
        <div className="absolute bottom-0 left-0 right-0 px-8 pb-10 md:px-14">
          <div className="max-w-6xl mx-auto">
            <p className="text-[#af1e23] text-[10px] uppercase tracking-[0.25em] font-bold mb-2">
              {imovel.categoria} · Código #{imovel.id}
            </p>
            <h1 className="text-3xl md:text-5xl font-black text-white uppercase leading-tight mb-3">
              {imovel.titulo}
            </h1>
            <p className="flex items-center gap-2 text-gray-300 text-sm">
              <FiMapPin size={13} className="text-[#af1e23]" />
              {imovel.endereco && `${imovel.endereco}, `}{imovel.bairro}, {imovel.cidade} — SP
            </p>
          </div>
        </div>

        {/* Navegação de thumbnails (setas) */}
        {images.length > 1 && (
          <>
            <button onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#af1e23] text-white p-2 transition-colors">
              <FiChevronLeft size={22} />
            </button>
            <button onClick={() => setActiveImg(i => (i + 1) % images.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#af1e23] text-white p-2 transition-colors">
              <FiChevronRight size={22} />
            </button>
          </>
        )}
      </div>

      {/* ── THUMBNAILS ── */}
      {images.length > 1 && (
        <div className="bg-[#1a1a1a] border-t border-white/10">
          <div className="max-w-6xl mx-auto px-8 py-3 flex gap-2 overflow-x-auto">
            {images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)}
                className={`flex-shrink-0 w-16 h-11 overflow-hidden border-2 transition-all ${
                  activeImg === i ? 'border-[#af1e23]' : 'border-transparent opacity-50 hover:opacity-100'
                }`}>
                <img src={img} alt="" className="w-full h-full object-cover"
                  onError={e => { e.target.src = PLACEHOLDER }} />
              </button>
            ))}
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
              <p className="text-gray-500 text-sm mb-8">{imovel.cidade} — {imovel.bairro}</p>

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
              </div>
              <div className="p-7 space-y-3">
                <a href={`https://wa.me/5511967147840?text=${whatsMsg}`}
                  target="_blank" rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-[0.15em] text-[10px] py-4 transition-colors">
                  <FaWhatsapp size={16} /> Falar pelo WhatsApp
                </a>
                <a href="tel:5511967147840"
                  className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#af1e23] text-white font-bold uppercase tracking-[0.15em] text-[10px] py-4 transition-colors">
                  <FiPhone size={14} /> (11) 96714-7840
                </a>
                <button onClick={() => scrollToSection('contato')}
                  className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:border-[#af1e23] hover:text-[#af1e23] text-[#1a1a1a] font-bold uppercase tracking-[0.15em] text-[10px] py-4 transition-colors">
                  <FiCalendar size={14} /> Agendar Visita
                </button>
                <button onClick={() => scrollToSection('contato')}
                  className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:border-[#af1e23] hover:text-[#af1e23] text-[#1a1a1a] font-bold uppercase tracking-[0.15em] text-[10px] py-4 transition-colors">
                  <FiMail size={14} /> Enviar Mensagem
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
                    ...(imovel.area > 0 ? [{ l: 'Área', v: `${imovel.area} m²` }] : []),
                    ...(imovel.quartos > 0 ? [{ l: 'Quartos', v: imovel.quartos }] : []),
                    ...(imovel.vagas > 0 ? [{ l: 'Vagas', v: imovel.vagas }] : []),
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

        <div className="relative px-10 md:px-16">
          {/* Seta esquerda */}
          <button
            onClick={() => setLightbox(i => i !== null ? (i - 1 + images.length) % images.length : 0)}
            className="absolute top-1/2 -translate-y-1/2 z-10 w-[45px] h-[45px] flex items-center justify-center border border-[#af1e23] bg-transparent hover:opacity-70 transition-opacity duration-[400ms]"
            style={{ left: '6px' }}
          >
            <FiChevronLeft size={20} className="text-[#af1e23]" />
          </button>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: '1%' }}>
            {images.map((img, i) => (
              <div key={i} className="overflow-hidden cursor-pointer" onClick={() => setLightbox(i)}>
                <img
                  src={img} alt=""
                  className="perspectivas-img w-full object-cover block"
                  style={{ height: '420px', transition: 'opacity 0.4s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.7' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                  onError={e => { e.target.src = PLACEHOLDER }}
                />
              </div>
            ))}
          </div>

          {/* Seta direita */}
          <button
            onClick={() => setLightbox(i => i !== null ? (i + 1) % images.length : 0)}
            className="absolute top-1/2 -translate-y-1/2 z-10 w-[45px] h-[45px] flex items-center justify-center border border-[#af1e23] bg-transparent hover:opacity-70 transition-opacity duration-[400ms]"
            style={{ right: '6px' }}
          >
            <FiChevronRight size={20} className="text-[#af1e23]" />
          </button>
        </div>
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
                {imovel.endereco && `${imovel.endereco}, `}
                <strong>{imovel.bairro}</strong>, {imovel.cidade} — SP
                {imovel.cep && ` · CEP: ${imovel.cep}`}
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
          <p className="text-gray-500 text-sm mb-8">Preencha o formulário e entraremos em contato em breve.</p>

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
        <div className="fixed inset-0 bg-black/92 z-50 flex items-center justify-center"
          onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)}
            className="absolute top-5 right-6 text-white text-3xl font-light hover:text-[#af1e23] transition-colors">
            ×
          </button>
          {images.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); setLightbox(i => (i - 1 + images.length) % images.length) }}
                className="absolute left-4 text-white bg-black/50 hover:bg-[#af1e23] p-2 transition-colors">
                <FiChevronLeft size={28} />
              </button>
              <button
                onClick={e => { e.stopPropagation(); setLightbox(i => (i + 1) % images.length) }}
                className="absolute right-4 text-white bg-black/50 hover:bg-[#af1e23] p-2 transition-colors">
                <FiChevronRight size={28} />
              </button>
            </>
          )}
          <img
            src={images[lightbox]}
            alt=""
            className="max-h-[85vh] max-w-[90vw] object-contain"
            onClick={e => e.stopPropagation()}
            onError={e => { e.target.src = PLACEHOLDER }}
          />
          <p className="absolute bottom-5 text-gray-400 text-xs uppercase tracking-widest">
            {lightbox + 1} / {images.length}
          </p>
        </div>
      )}

    </div>
  )
}
