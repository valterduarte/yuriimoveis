import Link from 'next/link'
import { FiPhone, FiMapPin, FiClock } from 'react-icons/fi'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'
import { PHONE_WA, PHONE_WA_BASE, PHONE_TEL, PHONE_DISPLAY, INSTAGRAM_URL, PHONE_STRUCTURED, SITE_URL, OG_DEFAULT_IMAGE } from '../../lib/config'
import WhatsAppLink from '../../components/WhatsAppLink'

export const metadata = {
  title: 'Contato — Imóveis em Osasco SP',
  description:
    'Entre em contato com o Corretor Yuri Imóveis. Atendimento via WhatsApp, telefone e e-mail para imóveis em Osasco e região.',
  alternates: { canonical: `${SITE_URL}/contato` },
  openGraph: {
    title: 'Contato — Corretor Yuri Imóveis',
    description: 'Fale com o Corretor Yuri via WhatsApp, telefone ou e-mail. Atendimento personalizado para imóveis em Osasco e região.',
    url: `${SITE_URL}/contato`,
    siteName: 'Corretor Yuri Imóveis',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: OG_DEFAULT_IMAGE, width: 1200, height: 630, alt: 'Contato — Corretor Yuri Imóveis' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contato — Corretor Yuri Imóveis',
    description: 'Fale com o Corretor Yuri via WhatsApp, telefone ou e-mail. Atendimento personalizado para imóveis em Osasco e região.',
    images: [OG_DEFAULT_IMAGE],
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Contato', item: `${SITE_URL}/contato` },
  ],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contato — Corretor Yuri Imóveis',
  url: `${SITE_URL}/contato`,
  mainEntity: {
    '@type': 'RealEstateAgent',
    name: 'Corretor Yuri Imóveis',
    telephone: PHONE_STRUCTURED,
    url: SITE_URL,
    sameAs: [PHONE_WA, INSTAGRAM_URL],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Osasco',
      addressRegion: 'SP',
      addressCountry: 'BR',
    },
  },
}

export default function Contato() {
  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="py-24 bg-dark text-white">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Início</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">Contato</span>
          </nav>
          <span className="section-label">Fale Conosco</span>
          <h1 className="text-5xl md:text-6xl font-black text-white uppercase leading-none">Contato</h1>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            <div className="space-y-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-dark mb-6">Informações</h2>

              {[
                { icon: FiMapPin, title: 'Endereço', content: 'Osasco - SP' },
                { icon: FiPhone,  title: 'Telefone', content: PHONE_DISPLAY },
                { icon: FiClock,  title: 'Horário',  content: 'Seg - Sex: 09h às 18h\nSábado: 09h às 12h' },
              ].map(info => (
                <div key={info.title} className="flex gap-4 p-5 border border-gray-200">
                  <div className="w-8 h-8 bg-primary flex items-center justify-center flex-shrink-0">
                    <info.icon className="text-white" size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-1">{info.title}</p>
                    <p className="text-sm text-dark whitespace-pre-line leading-relaxed">{info.content}</p>
                  </div>
                </div>
              ))}

              <div className="flex gap-2 pt-2">
                <WhatsAppLink href={PHONE_WA} source="contato-info" target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-[10px] uppercase tracking-wider font-bold px-3 py-2.5 transition-colors">
                  <FaWhatsapp size={14} /> WhatsApp
                </WhatsAppLink>
                <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer"
                  className="w-9 h-9 border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                  <FaInstagram size={14} />
                </a>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 p-8">
                <h2 className="text-xs font-bold uppercase tracking-widest text-dark mb-3">Fale Agora</h2>
                <p className="text-sm text-gray-500 mb-8">Entre em contato diretamente pelo WhatsApp ou telefone. Atendemos de seg a sáb.</p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <WhatsAppLink href={`${PHONE_WA_BASE}?text=${encodeURIComponent('Olá! Gostaria de mais informações sobre imóveis.')}`}
                    source="contato-cta" target="_blank" rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-[0.15em] text-sm py-6 transition-colors">
                    <FaWhatsapp size={22} /> WhatsApp
                  </WhatsAppLink>
                  <a href={PHONE_TEL}
                    className="flex-1 flex items-center justify-center gap-3 bg-dark hover:bg-primary text-white font-bold uppercase tracking-[0.15em] text-sm py-6 transition-colors">
                    <FiPhone size={20} /> {PHONE_DISPLAY}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
