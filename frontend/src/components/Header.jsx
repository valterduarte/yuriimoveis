import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiMenu, FiX, FiPhone } from 'react-icons/fi'
import { FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa'

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/imoveis', label: 'Imóveis' },
{ href: '/contato', label: 'Contato' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-dark shadow-2xl' : 'bg-dark/95 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black text-sm">CY</span>
            </div>
            <div>
              <span className="text-white font-bold text-base tracking-wider uppercase leading-none block">
                Corretor Yuri
              </span>
              <span className="text-primary text-[10px] tracking-widest uppercase">Imóveis</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
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

          {/* Right */}
          <div className="hidden md:flex items-center gap-5">
            <div className="flex items-center gap-3 text-gray-400">
              <a href="https://wa.me/5511967147840" target="_blank" rel="noreferrer"
                className="hover:text-green-400 transition-colors"><FaWhatsapp size={15} /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer"
                className="hover:text-pink-400 transition-colors"><FaInstagram size={15} /></a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer"
                className="hover:text-blue-400 transition-colors"><FaFacebook size={15} /></a>
            </div>
            <a
              href="https://wa.me/5511967147840"
              target="_blank"
              rel="noreferrer"
              className="btn-primary flex items-center gap-2 py-2.5 px-5 text-[10px]"
            >
              <FaWhatsapp size={13} />
              Fale Conosco
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-dark border-t border-gray-800">
          <nav className="flex flex-col py-4 container mx-auto px-6">
            {navLinks.map(link => (
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
              <a href="https://wa.me/5511967147840" target="_blank" rel="noreferrer"
                className="text-gray-400 hover:text-green-400 transition-colors"><FaWhatsapp size={18} /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer"
                className="text-gray-400 hover:text-pink-400 transition-colors"><FaInstagram size={18} /></a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"><FaFacebook size={18} /></a>
              <a href="tel:5511967147840"
                className="ml-auto text-gray-400 hover:text-white flex items-center gap-1 text-xs">
                <FiPhone size={13} /> (11) 96714-7840
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
