import Link from 'next/link'
import { FiPhone, FiMapPin } from 'react-icons/fi'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'
import Logo from './Logo'
import WhatsAppLink from './WhatsAppLink'
import { PHONE_WA, PHONE_TEL, PHONE_DISPLAY, INSTAGRAM_URL, CRECI, SITE_URL, PHONE_STRUCTURED } from '../lib/config'
import { NAVIGATION_LINKS, PROPERTY_CATEGORIES } from '../lib/constants'

function FooterSchema() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Corretor Yuri Imóveis',
    url: SITE_URL,
    telephone: PHONE_STRUCTURED,
    areaServed: {
      '@type': 'City',
      name: 'Osasco',
      containedInPlace: { '@type': 'State', name: 'São Paulo' },
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Osasco',
      addressRegion: 'SP',
      addressCountry: 'BR',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-dark text-gray-400">
      <FooterSchema />

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          <div>
            <Link href="/" className="mb-5 inline-block" aria-label="Página inicial — Corretor Yuri Imóveis">
              <Logo className="h-9 w-auto" />
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 mb-6">
              Do primeiro imóvel
              <br />
              ao imóvel dos sonhos.
            </p>
            <div className="flex items-center gap-3">
              <WhatsAppLink href={PHONE_WA} source="footer-social" target="_blank" rel="noopener noreferrer" aria-label="Fale pelo WhatsApp"
                className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:text-green-400 hover:border-current transition-all">
                <FaWhatsapp size={18} />
              </WhatsAppLink>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Siga no Instagram"
                className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:text-pink-400 hover:border-current transition-all">
                <FaInstagram size={18} />
              </a>
            </div>
          </div>

          <nav aria-label="Navegação do rodapé">
            <h3 className="text-white text-xs uppercase tracking-widest font-bold mb-6">Navegação</h3>
            <ul className="space-y-3">
              {[
                ...NAVIGATION_LINKS,
                { href: '/imoveis?tipo=venda',   label: 'Imóveis à Venda'     },
                { href: '/imoveis?tipo=aluguel', label: 'Imóveis para Alugar' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-xs hover:text-primary transition-colors flex items-center gap-2">
                    <span className="w-3 h-px bg-gray-600 inline-block" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Tipos de imóveis">
            <h3 className="text-white text-xs uppercase tracking-widest font-bold mb-6">Tipos de Imóveis</h3>
            <ul className="space-y-3">
              {PROPERTY_CATEGORIES.map(({ label, value }) => (
                <li key={value}>
                  <Link href={`/imoveis?categoria=${value}`}
                    className="text-xs hover:text-primary transition-colors flex items-center gap-2">
                    <span className="w-3 h-px bg-gray-600 inline-block" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-white text-xs uppercase tracking-widest font-bold mb-6">Contato</h3>
            <ul className="space-y-4 text-xs">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-primary mt-0.5 flex-shrink-0" size={14} />
                <span className="leading-relaxed">Osasco - SP</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-primary flex-shrink-0" size={14} />
                <a href={PHONE_TEL} className="hover:text-primary transition-colors">{PHONE_DISPLAY}</a>
              </li>
              <li className="flex items-center gap-3">
                <FaWhatsapp className="text-primary flex-shrink-0" size={14} />
                <WhatsAppLink href={PHONE_WA} source="footer-contato" target="_blank" rel="noopener noreferrer"
                  className="hover:text-primary transition-colors">Fale pelo WhatsApp</WhatsAppLink>
              </li>
            </ul>

            <WhatsAppLink href={PHONE_WA} source="footer-cta" target="_blank" rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 bg-primary text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:brightness-110 transition-all">
              <FaWhatsapp size={16} />
              Encontre seu imóvel
            </WhatsAppLink>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <p>&copy; {year} Corretor Yuri Imóveis — Todos os direitos reservados.</p>
          <p>CRECI-SP: {CRECI}</p>
        </div>
      </div>
    </footer>
  )
}
