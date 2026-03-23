import { Link } from 'react-router-dom'
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-dark text-gray-400">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-white font-black text-sm">CY</span>
              </div>
              <div>
                <span className="text-white font-bold uppercase tracking-wider text-sm leading-none block">
                  Corretor Yuri
                </span>
                <span className="text-primary text-[10px] tracking-widest uppercase">Imóveis</span>
              </div>
            </Link>
            <p className="text-xs leading-relaxed text-gray-500 mb-6">
              Sua imobiliária de confiança em Osasco e região. Realizando o sonho da casa própria há mais de 10 anos.
            </p>
            <div className="flex items-center gap-3">
              {[
                { href: 'https://wa.me/5511967147840', icon: FaWhatsapp, hover: 'hover:text-green-400' },
                { href: 'https://www.instagram.com/valterrduarte/', icon: FaInstagram, hover: 'hover:text-pink-400' },
              ].map(({ href, icon: Icon, hover }) => (
                <a key={href} href={href} target="_blank" rel="noreferrer"
                  className={`w-8 h-8 border border-gray-700 flex items-center justify-center ${hover} hover:border-current transition-all`}>
                  <Icon size={13} />
                </a>
              ))}
            </div>
          </div>

          {/* Navegação */}
          <div>
            <h4 className="text-white text-xs uppercase tracking-widest font-bold mb-6">Navegação</h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Início' },
                { href: '/imoveis', label: 'Imóveis' },
                { href: '/imoveis?tipo=venda', label: 'Imóveis à Venda' },
                { href: '/imoveis?tipo=aluguel', label: 'Imóveis para Alugar' },
{ href: '/contato', label: 'Contato' },
              ].map(link => (
                <li key={link.href}>
                  <Link to={link.href}
                    className="text-xs hover:text-primary transition-colors flex items-center gap-2">
                    <span className="w-3 h-px bg-gray-600 inline-block" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tipos */}
          <div>
            <h4 className="text-white text-xs uppercase tracking-widest font-bold mb-6">Tipos de Imóveis</h4>
            <ul className="space-y-3">
              {['Casas', 'Apartamentos', 'Terrenos', 'Chalés', 'Comercial', 'Chácaras'].map(tipo => (
                <li key={tipo}>
                  <Link to={`/imoveis?categoria=${tipo.toLowerCase()}`}
                    className="text-xs hover:text-primary transition-colors flex items-center gap-2">
                    <span className="w-3 h-px bg-gray-600 inline-block" />
                    {tipo}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-white text-xs uppercase tracking-widest font-bold mb-6">Contato</h4>
            <ul className="space-y-4 text-xs">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-primary mt-0.5 flex-shrink-0" size={13} />
                <span className="leading-relaxed">Osasco - SP</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-primary flex-shrink-0" size={13} />
                <a href="tel:5511967147840" className="hover:text-primary transition-colors">(11) 96714-7840</a>
              </li>
              <li className="flex items-center gap-3">
                <FaWhatsapp className="text-primary flex-shrink-0" size={13} />
                <a href="https://wa.me/5511967147840" target="_blank" rel="noreferrer"
                  className="hover:text-primary transition-colors">(11) 96714-7840</a>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-primary flex-shrink-0" size={13} />
                <a href="mailto:contato@corretoryuri.com.br"
                  className="hover:text-primary transition-colors break-all">contato@corretoryuri.com.br</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p>© {year} Corretor Yuri Imóveis — Todos os direitos reservados.</p>
          <p>CRECI-SP: 235509</p>
        </div>
      </div>
    </footer>
  )
}
