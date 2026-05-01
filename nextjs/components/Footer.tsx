import Link from 'next/link'
import { FiPhone, FiMapPin } from 'react-icons/fi'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'
import { PHONE_WA, PHONE_TEL, PHONE_DISPLAY, INSTAGRAM_URL, CRECI } from '../lib/config'
import { NAVIGATION_LINKS, FOOTER_TOOL_LINKS } from '../lib/constants'
import { LANDING_PAGES } from '../data/landingPages'
import { AJUDA_ARTIGOS, fullH1 } from '../data/ajudaArtigos'
import { BAIRROS } from '../data/bairros'
import { fetchNavigationMatrix } from '../lib/api'
import { bairroDbNameToSlug } from '../lib/navigation'
import WhatsAppLink from './WhatsAppLink'
import Logo from './Logo'

const FOOTER_LINK_CLASS =
  'text-xs text-gray-400 hover:text-primary transition-colors flex items-center gap-2'
const FOOTER_TITLE_CLASS =
  'text-white text-xs uppercase tracking-widest font-bold mb-5'
const FOOTER_BULLET = <span className="w-2 h-px bg-gray-600 inline-block flex-shrink-0" />

const TOP_LANDING_PAGES = LANDING_PAGES.slice(0, 3)

async function getTopBairrosWithGuide(): Promise<{ slug: string; nome: string }[]> {
  const matrix = await fetchNavigationMatrix()
  const counts = new Map<string, number>()
  for (const row of matrix) {
    if (!row.bairro) continue
    counts.set(row.bairro, (counts.get(row.bairro) || 0) + row.count)
  }
  return Array.from(counts.entries())
    .map(([dbName, count]) => ({ dbName, count, slug: bairroDbNameToSlug(dbName) }))
    .filter(b => b.slug && BAIRROS[b.slug])
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map(b => ({ slug: b.slug, nome: BAIRROS[b.slug].nome }))
}

export default async function Footer() {
  const year = new Date().getFullYear()
  const topBairros = await getTopBairrosWithGuide()

  return (
    <footer className="bg-dark text-gray-400">
      <div className="container mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          <div>
            <Link href="/" className="mb-5 inline-block" aria-label="Página inicial — Corretor Yuri Imóveis">
              <Logo className="h-9 w-auto" />
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 mb-6 max-w-xs">
              Do primeiro imóvel<br />ao imóvel dos sonhos.
            </p>
            <div className="flex items-center gap-3">
              <WhatsAppLink href={PHONE_WA} source="footer-social" target="_blank" rel="noopener noreferrer" aria-label="Fale pelo WhatsApp"
                className="w-9 h-9 border border-gray-700 flex items-center justify-center hover:text-green-400 hover:border-current transition-all">
                <FaWhatsapp size={16} />
              </WhatsAppLink>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Siga no Instagram"
                className="w-9 h-9 border border-gray-700 flex items-center justify-center hover:text-pink-400 hover:border-current transition-all">
                <FaInstagram size={16} />
              </a>
            </div>
          </div>

          <nav aria-label="Navegação do rodapé">
            <h3 className={FOOTER_TITLE_CLASS}>Navegação</h3>
            <ul className="space-y-3">
              {NAVIGATION_LINKS.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className={FOOTER_LINK_CLASS}>
                    {FOOTER_BULLET}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className={`${FOOTER_TITLE_CLASS} mt-8`}>Ferramentas</h3>
            <ul className="space-y-3">
              {FOOTER_TOOL_LINKS.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className={FOOTER_LINK_CLASS}>
                    {FOOTER_BULLET}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Encontre seu imóvel">
            <h3 className={FOOTER_TITLE_CLASS}>Encontre seu imóvel</h3>
            <ul className="space-y-3">
              {TOP_LANDING_PAGES.map(lp => (
                <li key={lp.slug}>
                  <Link href={`/imoveis/${lp.slug}`} className={FOOTER_LINK_CLASS}>
                    {FOOTER_BULLET}
                    {lp.h1}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/imoveis" className="text-xs text-primary hover:underline font-semibold flex items-center gap-2 pt-1">
                  Ver todos os imóveis →
                </Link>
              </li>
            </ul>

            {topBairros.length > 0 && (
              <>
                <h3 className={`${FOOTER_TITLE_CLASS} mt-8`}>Guias de bairro</h3>
                <ul className="space-y-3">
                  {topBairros.map(b => (
                    <li key={b.slug}>
                      <Link href={`/bairros/${b.slug}`} className={FOOTER_LINK_CLASS}>
                        {FOOTER_BULLET}
                        Morar no {b.nome}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/bairros" className="text-xs text-primary hover:underline font-semibold flex items-center gap-2 pt-1">
                      Todos os bairros →
                    </Link>
                  </li>
                </ul>
              </>
            )}
          </nav>

          <nav aria-label="Ajuda e contato">
            <h3 className={FOOTER_TITLE_CLASS}>Ajuda</h3>
            <ul className="space-y-3 mb-8">
              {AJUDA_ARTIGOS.map(a => (
                <li key={a.slug}>
                  <Link href={`/ajuda/${a.slug}`} className={FOOTER_LINK_CLASS}>
                    {FOOTER_BULLET}
                    <span className="line-clamp-1">{fullH1(a)}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className={FOOTER_TITLE_CLASS}>Contato</h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-2">
                <FiMapPin className="text-primary flex-shrink-0" size={13} />
                <span>Osasco — SP</span>
              </li>
              <li className="flex items-center gap-2">
                <FiPhone className="text-primary flex-shrink-0" size={13} />
                <a href={PHONE_TEL} className="hover:text-primary transition-colors">{PHONE_DISPLAY}</a>
              </li>
            </ul>

            <WhatsAppLink href={PHONE_WA} source="footer-cta" target="_blank" rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 bg-primary text-white text-xs font-bold uppercase tracking-widest px-5 py-3 hover:brightness-110 transition-all">
              <FaWhatsapp size={14} />
              Falar pelo WhatsApp
            </WhatsAppLink>
          </nav>

        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container mx-auto px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-[11px] text-gray-500">
          <p>&copy; {year} Corretor Yuri Imóveis — Todos os direitos reservados.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>CRECI-SP {CRECI}</span>
            <span aria-hidden="true" className="hidden md:inline">•</span>
            <Link href="/sobre" className="hover:text-primary transition-colors">Sobre</Link>
            <span aria-hidden="true" className="hidden md:inline">•</span>
            <Link href="/contato" className="hover:text-primary transition-colors">Contato</Link>
            <span aria-hidden="true" className="hidden md:inline">•</span>
            <Link href="/ajuda" className="hover:text-primary transition-colors">Ajuda</Link>
            <span aria-hidden="true" className="hidden md:inline">•</span>
            <Link href="/bairros" className="hover:text-primary transition-colors">Bairros</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
