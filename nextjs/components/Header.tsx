'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiMenu, FiX, FiPhone } from 'react-icons/fi'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'
import Logo from './Logo'
import CodeSearch from './CodeSearch'
import WhatsAppLink from './WhatsAppLink'
import { PHONE_WA, PHONE_TEL, PHONE_DISPLAY, INSTAGRAM_URL } from '../lib/config'
import { NAVIGATION_LINKS, SCROLL_THRESHOLD } from '../lib/constants'

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

          <nav className="hidden md:flex items-center gap-8">
            {NAVIGATION_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? 'page' : undefined}
                className={`text-xs uppercase tracking-widest font-semibold transition-colors duration-200 ${
                  pathname === link.href
                    ? 'text-primary'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-5">
            <CodeSearch />
            <div className="flex items-center gap-1 text-gray-400">
              <WhatsAppLink href={PHONE_WA} source="header-icon" target="_blank" rel="noreferrer" aria-label="WhatsApp — ícone"
                className="w-10 h-10 flex items-center justify-center hover:text-green-400 transition-colors">
                <FaWhatsapp size={15} />
              </WhatsAppLink>
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram"
                className="w-10 h-10 flex items-center justify-center hover:text-pink-400 transition-colors">
                <FaInstagram size={15} />
              </a>
            </div>
            <WhatsAppLink
              href={PHONE_WA}
              source="header-cta"
              target="_blank"
              rel="noreferrer"
              className="btn-primary flex items-center gap-2 py-2.5 px-5 text-xs"
            >
              <FaWhatsapp size={13} />
              Fale Conosco
            </WhatsAppLink>
          </div>

          <button
            className="md:hidden text-white p-2"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      <div className={`md:hidden bg-dark border-t border-gray-800 overflow-hidden transition-all duration-200 ${menuOpen ? 'max-h-96' : 'max-h-0'}`}>
        <nav className="flex flex-col py-4 container mx-auto px-6">
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
            <WhatsAppLink href={PHONE_WA} source="header-mobile" target="_blank" rel="noreferrer" aria-label="WhatsApp — ícone"
              className="text-gray-400 hover:text-green-400 transition-colors"><FaWhatsapp size={18} /></WhatsAppLink>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram"
              className="text-gray-400 hover:text-pink-400 transition-colors"><FaInstagram size={18} /></a>
            <a href={PHONE_TEL} aria-label={`Ligar para ${PHONE_DISPLAY}`}
              className="ml-auto text-gray-400 hover:text-white flex items-center gap-1 text-xs">
              <FiPhone size={13} /> {PHONE_DISPLAY}
            </a>
          </div>
        </nav>
      </div>
    </header>
  )
}
