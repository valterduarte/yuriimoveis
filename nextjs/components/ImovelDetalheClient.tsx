'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiPhone, FiArrowLeft, FiCalendar } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import WhatsAppLink from './WhatsAppLink'
import ScheduleVisitModal from './ScheduleVisitModal'
import PropertyHero from './property/PropertyHero'
import PropertyLightbox from './property/PropertyLightbox'
import PropertySidebar from './property/PropertySidebar'
import PropertyOverview from './property/PropertyOverview'
import PropertyGallery from './property/PropertyGallery'
import PropertyLocationSection from './property/PropertyLocationSection'
import { imovelSlug } from '../utils/imovelUtils'
import { PHONE_WA_BASE, PHONE_TEL, PHONE_DISPLAY, SITE_URL } from '../lib/config'
import { PLACEHOLDER_IMAGE } from '../lib/constants'
import { useScrollSpy } from '../hooks/useScrollSpy'
import type { Imovel } from '../types'

const TABS = [
  { id: 'visao-geral', label: 'Visão Geral' },
  { id: 'galeria',     label: 'Galeria'     },
  { id: 'localizacao', label: 'Localização' },
  { id: 'contato',     label: 'Contato'     },
]

interface ImovelDetalheClientProps {
  imovel: Imovel
}

export default function ImovelDetalheClient({ imovel }: ImovelDetalheClientProps) {
  const { activeSection, setActiveSection } = useScrollSpy(TABS, imovel)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [showVisitModal, setShowVisitModal] = useState(false)

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setActiveSection(id)
  }

  const images = imovel.imagens?.length > 0 ? imovel.imagens : [PLACEHOLDER_IMAGE]
  const whatsappMessage = encodeURIComponent(`Olá! Tenho interesse no imóvel: ${imovel.titulo} — Código #${imovel.id}`)
  const shareUrl = `${SITE_URL}/imoveis/${imovelSlug(imovel)}`

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
      <PropertyHero imovel={imovel} images={images} shareUrl={shareUrl} />

      <div className="bg-dark sticky top-16 md:top-20 z-30 border-b border-white/10">
        <div role="tablist" aria-label="Seções do imóvel" className="max-w-6xl mx-auto px-8 flex overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              role="tab"
              onClick={() => scrollToSection(tab.id)}
              aria-selected={activeSection === tab.id}
              aria-controls={tab.id}
              className={`py-4 px-6 text-[10px] uppercase tracking-[0.2em] font-bold whitespace-nowrap transition-all border-b-2 ${
                activeSection === tab.id
                  ? 'border-primary text-white'
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
          href="/imoveis"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-gray-500 hover:text-primary transition-colors mb-8"
        >
          <FiArrowLeft size={13} /> Voltar aos imóveis
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PropertyOverview imovel={imovel} />
          </div>
          <div className="lg:col-span-1">
            <PropertySidebar imovel={imovel} onScheduleVisit={() => setShowVisitModal(true)} />
          </div>
        </div>
      </div>

      <PropertyGallery imovel={imovel} images={images} onImageClick={setLightboxIndex} />

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-14 space-y-14">
        <PropertyLocationSection imovel={imovel} />

        <section id="contato">
          <span className="section-label">Contato</span>
          <h2 className="section-title mb-2">Desejo saber mais</h2>
          <p className="text-gray-500 text-sm mb-8">Fale agora com o corretor e descubra como sair do aluguel ainda este ano.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <WhatsAppLink
              href={`${PHONE_WA_BASE}?text=${whatsappMessage}`}
              source="imovel-contato"
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-[0.15em] text-sm py-6 transition-colors"
            >
              <FaWhatsapp size={22} /> WhatsApp
            </WhatsAppLink>
            <a
              href={PHONE_TEL}
              className="flex-1 flex items-center justify-center gap-3 bg-dark hover:bg-primary text-white font-bold uppercase tracking-[0.15em] text-sm py-6 transition-colors"
            >
              <FiPhone size={20} /> {PHONE_DISPLAY}
            </a>
          </div>
        </section>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 md:hidden z-40 grid grid-cols-3 pb-[env(safe-area-inset-bottom)]" aria-label="Contato rápido">
        <WhatsAppLink
          href={`${PHONE_WA_BASE}?text=${whatsappMessage}`}
          source="imovel-barra-mobile"
          aria-label="Contato via WhatsApp"
          className="flex flex-col items-center justify-center gap-1 bg-green-500 text-white py-3"
        >
          <FaWhatsapp size={18} />
          <span className="text-[9px] uppercase tracking-widest font-bold">WhatsApp</span>
        </WhatsAppLink>
        <a
          href={PHONE_TEL}
          aria-label={`Ligar para ${PHONE_DISPLAY}`}
          className="flex flex-col items-center justify-center gap-1 bg-primary text-white py-3"
        >
          <FiPhone size={18} />
          <span className="text-[9px] uppercase tracking-widest font-bold">Ligar</span>
        </a>
        <button
          onClick={() => setShowVisitModal(true)}
          aria-label="Agendar visita"
          className="flex flex-col items-center justify-center gap-1 bg-dark text-white py-3"
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
          onNext={() => setLightboxIndex(i => ((i ?? 0) + 1) % images.length)}
          onPrev={() => setLightboxIndex(i => ((i ?? 0) - 1 + images.length) % images.length)}
        />
      )}

      {showVisitModal && (
        <ScheduleVisitModal
          imovelTitulo={imovel.titulo}
          imovelId={imovel.id}
          onClose={() => setShowVisitModal(false)}
        />
      )}
    </div>
  )
}
