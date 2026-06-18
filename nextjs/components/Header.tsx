'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiMenu, FiX, FiPhone } from 'react-icons/fi'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'
import { PHONE_WA, PHONE_TEL, PHONE_DISPLAY, INSTAGRAM_URL } from '../lib/config'
import { NAVIGATION_LINKS, SCROLL_THRESHOLD } from '../lib/constants'
import Logo from './Logo'
import SiteSearch from './SiteSearch'
import WhatsAppLink from './WhatsAppLink'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-dark shadow-2xl' : 'bg-dark/95 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">

          <Link href="/" aria-label="Página inicial — Corretor Yuri Imóveis">
            <Logo className="h-9 w-auto" />
          </Link>

          <nav aria-label="Navegação principal" className="hidden lg:flex items-center gap-6">
            {NAVIGATION_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? 'page' : undefined}
                className={`py-3 text-xs uppercase tracking-widest font-semibold transition-colors duration-200 ${
                  pathname === link.href
                    ? 'text-primary'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-5">
            <SiteSearch />
            <div className="flex items-center gap-1 text-gray-400">
              <WhatsAppLink href={PHONE_WA} source="header-icon" target="_blank" rel="noreferrer" aria-label="Fale pelo WhatsApp (abre em nova aba)"
                className="w-10 h-10 flex items-center justify-center hover:text-green-400 transition-colors">
                <FaWhatsapp size={15} aria-hidden="true" />
              </WhatsAppLink>
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Siga no Instagram (abre em nova aba)"
                className="w-10 h-10 flex items-center justify-center hover:text-pink-400 transition-colors">
                <FaInstagram size={15} aria-hidden="true" />
              </a>
            </div>
            <WhatsAppLink
              href={PHONE_WA}
              source="header-cta"
              target="_blank"
              rel="noreferrer"
              aria-label="Fale conosco pelo WhatsApp (abre em nova aba)"
              className="btn-primary flex items-center gap-2 py-2.5 px-5 text-xs"
            >
              <FaWhatsapp size={13} aria-hidden="true" />
              Fale Conosco
            </WhatsAppLink>
          </div>

          <button
            type="button"
            className="lg:hidden text-white p-3"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX size={22} aria-hidden="true" /> : <FiMenu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={`lg:hidden bg-dark border-t border-gray-800 overflow-hidden transition-all duration-200 ${menuOpen ? 'max-h-96' : 'max-h-0'}`}>
        <nav aria-label="Navegação mobile" className="flex flex-col py-4 container mx-auto px-6">
          {NAVIGATION_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? 'page' : undefined}
              className={`py-3 text-xs uppercase tracking-widest font-semibold border-b border-gray-800 transition-colors ${
                pathname === link.href ? 'text-primary' : 'text-gray-300'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-5 flex items-center gap-4">
            <WhatsAppLink href={PHONE_WA} source="header-mobile" target="_blank" rel="noreferrer" aria-label="Fale pelo WhatsApp (abre em nova aba)"
              className="text-gray-400 hover:text-green-400 transition-colors p-2 -m-2"><FaWhatsapp size={18} aria-hidden="true" /></WhatsAppLink>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Siga no Instagram (abre em nova aba)"
              className="text-gray-400 hover:text-pink-400 transition-colors p-2 -m-2"><FaInstagram size={18} aria-hidden="true" /></a>
            <a href={PHONE_TEL} aria-label={`Ligar para ${PHONE_DISPLAY}`}
              className="ml-auto text-gray-400 hover:text-white flex items-center gap-1 text-xs py-2">
              <FiPhone size={13} aria-hidden="true" /> {PHONE_DISPLAY}
            </a>
          </div>
        </nav>
      </div>
    </header>
  )
}
