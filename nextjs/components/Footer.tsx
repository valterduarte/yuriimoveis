import Link from 'next/link'
import { FiPhone, FiMapPin } from 'react-icons/fi'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'
import { PHONE_WA, PHONE_TEL, PHONE_DISPLAY, INSTAGRAM_URL, CRECI } from '../lib/config'
import { NAVIGATION_LINKS, FOOTER_TOOL_LINKS } from '../lib/constants'
import { GUIAS } from '../data/guias'
import { LANDING_PAGES } from '../data/landingPages'
import { AJUDA_ARTIGOS, fullH1 } from '../data/ajudaArtigos'
import { BAIRROS } from '../data/bairros'
import { fetchNavigationMatrix } from '../lib/api'
import { listEmpreendimentos } from '../lib/empreendimento'
import { bairroDbNameToSlug, cidadeNameToSlug, cidadeSlugToName, buildHierarchicalUrl } from '../lib/navigation'
import WhatsAppLink from './WhatsAppLink'
import Logo from './Logo'
import type { ReactNode } from 'react'

const FOOTER_LINK_CLASS =
  'text-xs text-gray-400 hover:text-primary transition-colors flex items-center gap-2'
const FOOTER_TITLE_CLASS =
  'text-white text-xs uppercase tracking-widest font-bold mb-4'
const FOOTER_VIEW_ALL_CLASS =
  'text-xs text-primary hover:underline font-semibold inline-flex items-center gap-2 pt-1'
const FOOTER_BULLET = <span aria-hidden="true" className="w-2 h-px bg-gray-600 inline-block flex-shrink-0" />

const TOP_LANDING_PAGES = LANDING_PAGES.slice(0, 3)

/** One titled list — every footer column shares this shape so headings line up. */
function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className={FOOTER_TITLE_CLASS}>{title}</h3>
      <ul className="space-y-3">{children}</ul>
    </div>
  )
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <li>
      <Link href={href} className={FOOTER_LINK_CLASS}>
        {FOOTER_BULLET}
        {children}
      </Link>
    </li>
  )
}

function FooterViewAll({ href, children }: { href: string; children: ReactNode }) {
  return (
    <li>
      <Link href={href} className={FOOTER_VIEW_ALL_CLASS}>
        {children}
      </Link>
    </li>
  )
}

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

async function getCidadesWithApartamento(): Promise<{ slug: string; nome: string; count: number }[]> {
  const matrix = await fetchNavigationMatrix()
  const counts = new Map<string, { nome: string; count: number }>()
  for (const row of matrix) {
    if (row.tipo !== 'venda' || row.categoria !== 'apartamento') continue
    const slug = cidadeNameToSlug(row.cidade)
    const nome = cidadeSlugToName(slug)
    if (!nome) continue
    const entry = counts.get(slug)
    if (entry) entry.count += row.count
    else counts.set(slug, { nome, count: row.count })
  }
  return Array.from(counts.entries())
    .map(([slug, { nome, count }]) => ({ slug, nome, count }))
    .sort((a, b) => b.count - a.count)
}

export default async function Footer() {
  const year = new Date().getFullYear()
  const [topBairros, empreendimentos, cidadesApartamento] = await Promise.all([
    getTopBairrosWithGuide(),
    listEmpreendimentos(),
    getCidadesWithApartamento(),
  ])
  const topEmpreendimentos = empreendimentos.slice(0, 5)
  const empreendimentosConstrucao = empreendimentos.filter(e => e.status === 'construcao').slice(0, 5)
  const empreendimentosProntos = empreendimentos.filter(e => e.status === 'pronto').slice(0, 5)

  return (
    <footer className="bg-dark text-gray-400">
      <div className="container mx-auto px-6 pt-16 pb-12">

        {/* Brand band — logo, tagline and direct contact, kept apart from the link grid */}
        <div className="flex flex-col gap-8 pb-10 mb-12 border-b border-gray-800/60 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xs">
            <Link href="/" className="mb-5 inline-block" aria-label="Página inicial — Corretor Yuri Imóveis">
              <Logo className="h-9 w-auto" />
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 mb-6">
              Do primeiro imóvel ao imóvel dos sonhos.
            </p>
            <div className="flex items-center gap-3">
              <WhatsAppLink href={PHONE_WA} source="footer-social" target="_blank" rel="noopener noreferrer" aria-label="Fale pelo WhatsApp (abre em nova aba)"
                className="w-9 h-9 border border-gray-700 flex items-center justify-center hover:text-green-400 hover:border-current transition-all">
                <FaWhatsapp size={16} aria-hidden="true" />
              </WhatsAppLink>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Siga no Instagram (abre em nova aba)"
                className="w-9 h-9 border border-gray-700 flex items-center justify-center hover:text-pink-400 hover:border-current transition-all">
                <FaInstagram size={16} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="lg:text-right">
            <h3 className={FOOTER_TITLE_CLASS}>Contato</h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-2 lg:justify-end">
                <FiMapPin className="text-primary flex-shrink-0" size={13} aria-hidden="true" />
                <span>Osasco — SP</span>
              </li>
              <li className="flex items-center gap-2 lg:justify-end">
                <FiPhone className="text-primary flex-shrink-0" size={13} aria-hidden="true" />
                <a href={PHONE_TEL} className="hover:text-primary transition-colors">{PHONE_DISPLAY}</a>
              </li>
            </ul>
            <WhatsAppLink href={PHONE_WA} source="footer-cta" target="_blank" rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 bg-primary text-white text-xs font-bold uppercase tracking-widest px-5 py-3 hover:brightness-110 transition-all">
              <FaWhatsapp size={14} aria-hidden="true" />
              Falar pelo WhatsApp
            </WhatsAppLink>
          </div>
        </div>

        {/* Link grid — every list is an equal cell so all headings align per row */}
        <nav aria-label="Links do rodapé"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-10">

          <FooterColumn title="Navegação">
            {NAVIGATION_LINKS.map(link => (
              <FooterLink key={link.href} href={link.href}>{link.label}</FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Encontre seu imóvel">
            {TOP_LANDING_PAGES.map(lp => (
              <FooterLink key={lp.slug} href={`/imoveis/${lp.slug}`}>{lp.h1}</FooterLink>
            ))}
            <FooterViewAll href="/imoveis">Ver todos os imóveis →</FooterViewAll>
          </FooterColumn>

          {cidadesApartamento.length > 0 && (
            <FooterColumn title="Apartamentos por cidade">
              {cidadesApartamento.map(c => (
                <FooterLink
                  key={c.slug}
                  href={buildHierarchicalUrl({ acao: 'comprar', cidade: c.slug, categoria: 'apartamento' })}
                >
                  Apartamentos em {c.nome}
                </FooterLink>
              ))}
            </FooterColumn>
          )}

          {topBairros.length > 0 && (
            <FooterColumn title="Guias de bairro">
              {topBairros.map(b => (
                <FooterLink key={b.slug} href={`/bairros/${b.slug}`}>Morar no {b.nome}</FooterLink>
              ))}
              <FooterViewAll href="/bairros">Todos os bairros →</FooterViewAll>
            </FooterColumn>
          )}

          {topEmpreendimentos.length > 0 && (
            <FooterColumn title="Lançamentos">
              {topEmpreendimentos.map(e => (
                <FooterLink key={e.slug} href={`/empreendimentos/${e.slug}`}>{e.nome}</FooterLink>
              ))}
              <FooterViewAll href="/empreendimentos">Todos os lançamentos →</FooterViewAll>
            </FooterColumn>
          )}

          {empreendimentosConstrucao.length > 0 && (
            <FooterColumn title="Em construção">
              {empreendimentosConstrucao.map(e => (
                <FooterLink key={e.slug} href={`/empreendimentos/${e.slug}`}>{e.nome}</FooterLink>
              ))}
              <FooterViewAll href="/empreendimentos/em-construcao">Todos em construção →</FooterViewAll>
            </FooterColumn>
          )}

          {empreendimentosProntos.length > 0 && (
            <FooterColumn title="Pronto para morar">
              {empreendimentosProntos.map(e => (
                <FooterLink key={e.slug} href={`/empreendimentos/${e.slug}`}>{e.nome}</FooterLink>
              ))}
              <FooterViewAll href="/empreendimentos/pronto-para-morar">Todos prontos para morar →</FooterViewAll>
            </FooterColumn>
          )}

          <FooterColumn title="Guias">
            {Object.values(GUIAS).map(guia => (
              <FooterLink key={guia.slug} href={`/guia/${guia.slug}`}>
                <span className="line-clamp-1">{guia.titulo}</span>
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Ferramentas">
            {FOOTER_TOOL_LINKS.map(link => (
              <FooterLink key={link.href} href={link.href}>{link.label}</FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Ajuda">
            {AJUDA_ARTIGOS.map(a => (
              <FooterLink key={a.slug} href={`/ajuda/${a.slug}`}>
                <span className="line-clamp-1">{fullH1(a)}</span>
              </FooterLink>
            ))}
          </FooterColumn>

        </nav>
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
            <span aria-hidden="true" className="hidden md:inline">•</span>
            <Link href="/guia" className="hover:text-primary transition-colors">Guias</Link>
            <span aria-hidden="true" className="hidden md:inline">•</span>
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
