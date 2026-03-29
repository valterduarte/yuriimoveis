import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiMenu, FiX, FiPhone } from 'react-icons/fi'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'
import Logo from './Logo'
import { PHONE_WA, PHONE_TEL, PHONE_DISPLAY, INSTAGRAM_URL } from '../config'
import { NAVIGATION_LINKS, SCROLL_THRESHOLD } from '../constants'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMenuOpen(false) }, [location])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-dark shadow-2xl' : 'bg-dark/95 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">

          <Link to="/" aria-label="Página inicial — Corretor Yuri Imóveis">
            <Logo className="h-9 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAVIGATION_LINKS.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-xs uppercase tracking-widest font-semibold transition-colors duration-200 ${
                  location.pathname === link.href
                    ? 'text-primary'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-5">
            <div className="flex items-center gap-3 text-gray-400">
              <a href={PHONE_WA} target="_blank" rel="noreferrer" aria-label="WhatsApp — ícone"
                className="hover:text-green-400 transition-colors"><FaWhatsapp size={15} /></a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram"
                className="hover:text-pink-400 transition-colors"><FaInstagram size={15} /></a>
            </div>
            <a
              href={PHONE_WA}
              target="_blank"
              rel="noreferrer"
              className="btn-primary flex items-center gap-2 py-2.5 px-5 text-[10px]"
            >
              <FaWhatsapp size={13} />
              Fale Conosco
            </a>
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
              to={link.href}
              className={`py-3 text-xs uppercase tracking-widest font-semibold border-b border-gray-800 transition-colors ${
                location.pathname === link.href ? 'text-primary' : 'text-gray-300'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-5 flex items-center gap-4">
            <a href={PHONE_WA} target="_blank" rel="noreferrer" aria-label="WhatsApp — ícone"
              className="text-gray-400 hover:text-green-400 transition-colors"><FaWhatsapp size={18} /></a>
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
