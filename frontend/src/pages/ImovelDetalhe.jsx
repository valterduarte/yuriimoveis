import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiMaximize, FiMapPin, FiPhone, FiArrowLeft, FiCheckCircle } from 'react-icons/fi'
import { FaCar, FaBath, FaWhatsapp } from 'react-icons/fa'
import { LuBed } from 'react-icons/lu'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const PLACEHOLDER = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80'

const tabs = ['Visão Geral', 'Galeria', 'Localização']

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
  const [activeTab, setActiveTab] = useState('Visão Geral')

  useEffect(() => {
    axios.get(`${API_URL}/api/imoveis/${id}`)
      .then(res => setImovel(res.data))
      .catch(() => setImovel(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary" />
      </div>
    )
  }

  if (!imovel) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold uppercase text-dark">Imóvel não encontrado</h2>
        <Link to="/imoveis" className="btn-primary">Ver todos os imóveis</Link>
      </div>
    )
  }

  const images = imovel.imagens?.length > 0 ? imovel.imagens : [PLACEHOLDER]
  const whatsMsg = encodeURIComponent(`Olá! Tenho interesse no imóvel: ${imovel.titulo} — Código #${imovel.id}`)

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">

      {/* Hero image */}
      <div className="relative bg-dark" style={{ height: '55vh', minHeight: 320 }}>
        <img
          src={images[activeImg]}
          alt={imovel.titulo}
          className="w-full h-full object-cover opacity-80"
          onError={e => { e.target.src = PLACEHOLDER }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent" />

        {/* Status ribbon */}
        <div className="absolute top-6 left-6">
          <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 text-white ${
            imovel.tipo === 'venda' ? 'bg-primary' : 'bg-dark'
          }`}>
            {imovel.tipo === 'venda' ? 'Venda' : 'Aluguel'}
          </span>
        </div>

        {/* Title on hero */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="container mx-auto">
            <p className="text-primary text-[10px] uppercase tracking-widest font-bold mb-1">{imovel.categoria} · Código #{imovel.id}</p>
            <h1 className="text-2xl md:text-4xl font-black text-white uppercase leading-tight">{imovel.titulo}</h1>
            <p className="flex items-center gap-1.5 text-gray-300 text-sm mt-2">
              <FiMapPin size={13} className="text-primary" />
              {imovel.endereco && `${imovel.endereco}, `}{imovel.bairro}, {imovel.cidade} - RS
            </p>
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="bg-dark border-t border-gray-800">
          <div className="container mx-auto px-6 py-3 flex gap-2 overflow-x-auto">
            {images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)}
                className={`flex-shrink-0 w-16 h-12 overflow-hidden border-2 transition-all ${
                  activeImg === i ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                }`}>
                <img src={img} alt="" className="w-full h-full object-cover"
                  onError={e => { e.target.src = PLACEHOLDER }} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 md:top-20 z-30">
        <div className="container mx-auto px-6 flex gap-0">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`py-4 px-6 text-[10px] uppercase tracking-widest font-bold transition-all border-b-2 ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-dark'
              }`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main content */}
          <div className="lg:col-span-2">
            <Link to="/imoveis"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-gray-500 hover:text-primary transition-colors mb-8">
              <FiArrowLeft size={13} /> Voltar
            </Link>

            {/* VISÃO GERAL */}
            {activeTab === 'Visão Geral' && (
              <div>
                {/* Specs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-gray-200 mb-8">
                  {imovel.quartos > 0 && (
                    <div className="flex flex-col items-center justify-center p-5 border-r border-gray-200 text-center">
                      <LuBed className="text-primary mb-2" size={22} />
                      <span className="font-black text-dark text-xl">{imovel.quartos}</span>
                      <span className="text-[10px] uppercase tracking-wider text-gray-400 mt-0.5">{imovel.quartos === 1 ? 'Quarto' : 'Quartos'}</span>
                    </div>
                  )}
                  {imovel.banheiros > 0 && (
                    <div className="flex flex-col items-center justify-center p-5 border-r border-gray-200 text-center">
                      <FaBath className="text-primary mb-2" size={20} />
                      <span className="font-black text-dark text-xl">{imovel.banheiros}</span>
                      <span className="text-[10px] uppercase tracking-wider text-gray-400 mt-0.5">{imovel.banheiros === 1 ? 'Banheiro' : 'Banheiros'}</span>
                    </div>
                  )}
                  {imovel.vagas > 0 && (
                    <div className="flex flex-col items-center justify-center p-5 border-r border-gray-200 text-center">
                      <FaCar className="text-primary mb-2" size={20} />
                      <span className="font-black text-dark text-xl">{imovel.vagas}</span>
                      <span className="text-[10px] uppercase tracking-wider text-gray-400 mt-0.5">{imovel.vagas === 1 ? 'Vaga' : 'Vagas'}</span>
                    </div>
                  )}
                  {imovel.area > 0 && (
                    <div className="flex flex-col items-center justify-center p-5 text-center">
                      <FiMaximize className="text-primary mb-2" size={20} />
                      <span className="font-black text-dark text-xl">{imovel.area}</span>
                      <span className="text-[10px] uppercase tracking-wider text-gray-400 mt-0.5">m²</span>
                    </div>
                  )}
                </div>

                {/* Descrição */}
                {imovel.descricao && (
                  <div className="bg-white border border-gray-200 p-7 mb-6">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-dark mb-4">Descrição</h2>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{imovel.descricao}</p>
                  </div>
                )}

                {/* Diferenciais */}
                {imovel.diferenciais?.length > 0 && (
                  <div className="bg-white border border-gray-200 p-7">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-dark mb-4">Diferenciais</h2>
                    <div className="grid grid-cols-2 gap-3">
                      {imovel.diferenciais.map(d => (
                        <div key={d} className="flex items-center gap-2 text-sm text-gray-600">
                          <FiCheckCircle className="text-primary flex-shrink-0" size={14} />
                          {d}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* GALERIA */}
            {activeTab === 'Galeria' && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-dark mb-6">Galeria de Fotos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {images.map((img, i) => (
                    <div key={i}
                      className="overflow-hidden cursor-pointer group"
                      style={{ height: 200 }}
                      onClick={() => setActiveImg(i)}>
                      <img src={img} alt="" className="w-full h-full object-cover group-hover:opacity-80 transition-opacity duration-300"
                        onError={e => { e.target.src = PLACEHOLDER }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LOCALIZAÇÃO */}
            {activeTab === 'Localização' && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-dark mb-6">Localização</h2>
                <div className="bg-white border border-gray-200 p-7 mb-4">
                  <p className="flex items-start gap-2 text-sm text-gray-600">
                    <FiMapPin size={15} className="text-primary flex-shrink-0 mt-0.5" />
                    {imovel.endereco && `${imovel.endereco}, `}{imovel.bairro}, {imovel.cidade} - RS
                    {imovel.cep && ` — CEP: ${imovel.cep}`}
                  </p>
                </div>
                <div className="bg-gray-200 flex items-center justify-center" style={{ height: 280 }}>
                  <div className="text-center text-gray-500">
                    <FiMapPin size={36} className="mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">{imovel.cidade} - RS</p>
                    <p className="text-xs mt-1">{imovel.bairro}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar contato */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 p-7 sticky top-36">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Código #{imovel.id}</p>
              <p className="text-3xl font-black text-primary mb-6">
                {formatPrice(imovel.preco, imovel.tipo)}
              </p>

              <div className="space-y-3 mb-6">
                <a href={`https://wa.me/5511967147840?text=${whatsMsg}`}
                  target="_blank" rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-widest text-xs py-3.5 transition-colors">
                  <FaWhatsapp size={16} />
                  WhatsApp
                </a>
                <a href="tel:5511967147840"
                  className="w-full flex items-center justify-center gap-2 bg-dark hover:bg-primary text-white font-bold uppercase tracking-widest text-xs py-3.5 transition-colors">
                  <FiPhone size={14} />
                  (11) 96714-7840
                </a>
                <Link to="/contato"
                  className="w-full flex items-center justify-center border border-gray-200 text-dark hover:border-primary hover:text-primary font-bold uppercase tracking-widest text-xs py-3.5 transition-colors">
                  Agendar Visita
                </Link>
              </div>

              <div className="border-t border-gray-100 pt-5 space-y-2.5 text-xs">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Informações</p>
                {[
                  { l: 'Tipo', v: imovel.tipo },
                  { l: 'Categoria', v: imovel.categoria },
                  { l: 'Cidade', v: imovel.cidade },
                  ...(imovel.area > 0 ? [{ l: 'Área', v: `${imovel.area} m²` }] : []),
                ].map(item => (
                  <div key={item.l} className="flex justify-between">
                    <span className="text-gray-400 capitalize">{item.l}</span>
                    <span className="font-semibold text-dark capitalize">{item.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating bar mobile */}
      <div className="fixed bottom-14 left-0 right-0 md:hidden z-30 grid grid-cols-2">
        <a href={`https://wa.me/5511967147840?text=${whatsMsg}`}
          target="_blank" rel="noreferrer"
          className="flex items-center justify-center gap-2 bg-green-500 text-white font-bold uppercase text-[10px] tracking-widest py-3.5">
          <FaWhatsapp size={16} /> WhatsApp
        </a>
        <a href="tel:5511967147840"
          className="flex items-center justify-center gap-2 bg-primary text-white font-bold uppercase text-[10px] tracking-widest py-3.5">
          <FiPhone size={14} /> Ligar
        </a>
      </div>
    </div>
  )
}
