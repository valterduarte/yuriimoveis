import Link from 'next/link'
import Image from 'next/image'
import { FiArrowRight, FiMapPin } from 'react-icons/fi'
import { PLACEHOLDER_IMAGE, PROPERTY_STATUSES } from '../lib/constants'
import { formatPrice } from '../utils/imovelUtils'
import type { EmpreendimentoSummary } from '../lib/empreendimento'
import type { PropertyStatus } from '../types'

interface TabLink {
  href: string
  label: string
  active: boolean
}

interface EmpreendimentoIndexProps {
  empreendimentos: EmpreendimentoSummary[]
  heading: string
  eyebrow: string
  description: string
  breadcrumbCurrent: string
  tabs: TabLink[]
  emptyMessage: string
}

function formatPriceRange(min: number, max: number): string {
  if (min === max) return `a partir de ${formatPrice(min, 'venda')}`
  return `${formatPrice(min, 'venda')} a ${formatPrice(max, 'venda')}`
}

function formatAreaRange(min: number, max: number): string {
  if (min === max) return `${min.toFixed(0)}m²`
  return `${min.toFixed(0)} a ${max.toFixed(0)}m²`
}

function statusLabel(status: PropertyStatus): string {
  return PROPERTY_STATUSES.find(s => s.value === status)?.label ?? status
}

function statusColor(status: PropertyStatus): string {
  return PROPERTY_STATUSES.find(s => s.value === status)?.color ?? 'bg-gray-500'
}

export default function EmpreendimentoIndex({
  empreendimentos,
  heading,
  eyebrow,
  description,
  breadcrumbCurrent,
  tabs,
  emptyMessage,
}: EmpreendimentoIndexProps) {
  return (
    <div className="min-h-screen pb-16 md:pb-0 bg-gray-50">
      <div className="bg-dark text-white py-12">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Início</Link>
            <span aria-hidden="true">/</span>
            <Link href="/empreendimentos" className="hover:text-white transition-colors">Lançamentos</Link>
            {breadcrumbCurrent && (
              <>
                <span aria-hidden="true">/</span>
                <span className="text-white" aria-current="page">{breadcrumbCurrent}</span>
              </>
            )}
          </nav>
          <span className="section-label">{eyebrow}</span>
          <h1 className="text-3xl md:text-4xl font-black uppercase text-white leading-tight">{heading}</h1>
          <p className="text-gray-400 text-sm mt-2 max-w-2xl">{description}</p>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 sticky top-16 md:top-20 z-20">
        <div className="container mx-auto px-6 overflow-x-auto">
          <div className="flex gap-1 py-3">
            {tabs.map(tab => (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={tab.active ? 'page' : undefined}
                className={`px-4 py-2 text-[11px] uppercase tracking-wider font-bold whitespace-nowrap transition-colors ${
                  tab.active
                    ? 'bg-dark text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-6xl">
        {empreendimentos.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-200 px-6">
            <div className="text-5xl mb-4" aria-hidden="true">🏗️</div>
            <h2 className="text-lg font-bold text-dark mb-2 uppercase tracking-wide">{emptyMessage}</h2>
            <p className="text-gray-500 text-sm mb-6">Confira os imóveis disponíveis ou fale com o corretor para opções exclusivas.</p>
            <Link href="/imoveis" className="btn-primary">Ver todos os imóveis</Link>
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {empreendimentos.map(emp => (
              <li key={emp.slug}>
                <Link
                  href={`/empreendimentos/${emp.slug}`}
                  className="group block bg-white border border-gray-200 hover:border-primary transition-colors h-full overflow-hidden"
                >
                  <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                    <Image
                      src={emp.heroImage ?? PLACEHOLDER_IMAGE}
                      alt={emp.nome}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-primary text-white text-[10px] uppercase tracking-wider font-bold px-2.5 py-1">
                      {emp.totalUnidades} plantas
                    </span>
                    <span className={`absolute top-3 right-3 text-white text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 ${statusColor(emp.status)}`}>
                      {statusLabel(emp.status)}
                    </span>
                  </div>
                  <div className="p-5">
                    <h2 className="text-base font-bold text-dark group-hover:text-primary transition-colors leading-snug mb-2">
                      {emp.nome}
                    </h2>
                    <p className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                      <FiMapPin size={12} className="text-primary" />
                      {emp.bairro}, {emp.cidade} — SP
                    </p>
                    <p className="text-sm font-semibold text-dark mb-1">
                      {formatPriceRange(emp.precoMin, emp.precoMax)}
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      Áreas {formatAreaRange(emp.areaMin, emp.areaMax)}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                      Ver empreendimento <FiArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
